using MediatR;
using Microsoft.EntityFrameworkCore;
using PatoDraw.Api.ValidationHelpers;
using PatoDraw.Infrastructure;

namespace PatoDraw.Api.Features.Files.CreateDirectory;

public class CreateFileHandler : IRequestHandler<CreateFileRequest, ApiResult<Guid?>>
{
    private readonly PatoDrawDbContext _dbContext;

    public CreateFileHandler(PatoDrawDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ApiResult<Guid?>> Handle(CreateFileRequest request, CancellationToken cancellationToken)
    {
        var id = Guid.NewGuid();

        if (request.OwnerId.Equals(Guid.Empty))
        {
            return new ApiResult<Guid?> { Status = StatusCodes.Status400BadRequest, Error = "Missing owner" };
        }

        if (request.FilePayload.ParentFolderId != null)
        {
            var parentFolder = await _dbContext
                .Folders
                .AsNoTracking()
                .Where(f => f.Id == request.FilePayload.ParentFolderId)
                .FirstOrDefaultAsync(cancellationToken);

            if (parentFolder == null)
            {
                return ApiResult<Guid?>.Failure(
                    StatusCodes.Status404NotFound,
                    "Parent folder not found"
                );
            }

            if (parentFolder.OwnerId != request.OwnerId)
            {
                return ApiResult<Guid?>.Failure( 
                    StatusCodes.Status403Forbidden,
                    "You don't not have permissions to create a file in this directory"
                );
            }

            if (parentFolder.DeletedAt.HasValue)
            {
                return ApiResult<Guid?>.Failure( 
                    StatusCodes.Status400BadRequest,
                    "Target folder has been deleted"
                );
            }
        }

        var isNameValid = NameValidationHelper.IsValid(request.FilePayload.Name);
        if (!isNameValid.IsValid)
        {
            return ApiResult<Guid?>.Failure(
                StatusCodes.Status400BadRequest,
                isNameValid.Reason
            );
        }

        var createdFile = new Infrastructure.Entities.File()
        {
            Id = id,
            Color = request.FilePayload.Color,
            CreatedAt = DateTime.UtcNow,
            ModifiedAt = DateTime.UtcNow,
            Name = request.FilePayload.Name,
            OwnerId = request.OwnerId,
            ParentFolderId = request.FilePayload.ParentFolderId,
            Type = request.FilePayload.Type,
        };

        _dbContext.Add(createdFile);

        await _dbContext.SaveChangesAsync(cancellationToken);

        return ApiResult<Guid?>.Success(id, StatusCodes.Status201Created);
    }
}
