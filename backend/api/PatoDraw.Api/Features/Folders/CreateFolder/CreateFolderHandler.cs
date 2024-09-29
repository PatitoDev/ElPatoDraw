using MediatR;
using Microsoft.EntityFrameworkCore;
using PatoDraw.Infrastructure;
using PatoDraw.Infrastructure.Entities;

namespace PatoDraw.Api.Features.Folders.CreateFolder;

public class CreateFolderHandler : IRequestHandler<CreateFolderRequest, ApiResult<Guid?>>
{
    private readonly PatoDrawDbContext _dbContext;

    public CreateFolderHandler(PatoDrawDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ApiResult<Guid?>> Handle(CreateFolderRequest request, CancellationToken cancellationToken)
    {
        if (request.Payload.ParentFolderId.HasValue)
        {
            // check we have permission to add to parent
            var parentFolder = await _dbContext
                .Folders
                .FirstOrDefaultAsync(f => f.Id == request.Payload.ParentFolderId.Value, cancellationToken);

            if (parentFolder == null)
            {
                return new ApiResult<Guid?>() { Status = StatusCodes.Status404NotFound };
            }

            if (!parentFolder.OwnerId.Equals(request.OwnerId))
            {
                return new ApiResult<Guid?>() { Status = StatusCodes.Status403Forbidden };
            }
        }

        // check name is valid
        var createdFolder = new Folder()
        {
            Id = Guid.NewGuid(),
            Color = request.Payload.Color,
            CreatedAt = DateTime.Now,
            OwnerId = request.OwnerId,
            Name = request.Payload.Name,
            ParentFolderId = request.Payload.ParentFolderId,
            ModifiedAt = DateTime.Now,
        };

        _dbContext.Add(createdFolder);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new ApiResult<Guid?>() { Payload = createdFolder.Id, Status = StatusCodes.Status201Created };
    }
}
