using MediatR;
using Microsoft.EntityFrameworkCore;
using PatoDraw.Infrastructure;
using PatoDraw.Infrastructure.Entities;

namespace PatoDraw.Api.Features.Folders.CreateFolder;

public class CreateFolderHandler : IRequestHandler<CreateFolderRequest, ApiResult<Guid?>>
{
    private readonly PatoDrawDbContext _dbContext;

    private const int DEPTH_LIMIT = 1000;

    public CreateFolderHandler(PatoDrawDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ApiResult<Guid?>> Handle(CreateFolderRequest request, CancellationToken cancellationToken)
    {
        var depth = 0;

        if (request.Payload.ParentFolderId.HasValue)
        {
            // check we have permission to add to parent
            var parentFolder = await _dbContext
                .Folders
                .FirstOrDefaultAsync(f => f.Id == request.Payload.ParentFolderId.Value, cancellationToken);

            if (parentFolder == null)
            {
                return ApiResult<Guid?>.Failure(StatusCodes.Status404NotFound, "Parent folder not found");
            }

            if (!parentFolder.OwnerId.Equals(request.OwnerId))
            {
                return ApiResult<Guid?>.Failure(StatusCodes.Status403Forbidden, "User does not have edit permission");
            }

            depth = parentFolder.Depth + 1;
        }

        if (depth >= DEPTH_LIMIT)
        {
            return ApiResult<Guid?>.Failure(
                StatusCodes.Status400BadRequest,
                "Depth limit reached, think about what you are doing with your life..."
            );
        }

        var nameValidationResult = ValidationHelpers.NameValidationHelper.IsValid(request.Payload.Name);
        if (!nameValidationResult.IsValid)
        {
            return ApiResult<Guid?>.Failure(
                StatusCodes.Status400BadRequest,
                "Folder name " + nameValidationResult.Reason
            );
        }

        var createdFolder = new Folder()
        {
            Id = Guid.NewGuid(),
            Color = request.Payload.Color,
            CreatedAt = DateTime.Now,
            OwnerId = request.OwnerId,
            Name = request.Payload.Name,
            ParentFolderId = request.Payload.ParentFolderId,
            ModifiedAt = DateTime.Now,
            Depth = depth,
        };

        _dbContext.Add(createdFolder);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new ApiResult<Guid?>() { Payload = createdFolder.Id, Status = StatusCodes.Status201Created };
    }
}
