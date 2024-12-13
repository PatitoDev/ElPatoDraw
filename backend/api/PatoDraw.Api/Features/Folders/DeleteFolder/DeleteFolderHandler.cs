using MediatR;
using Microsoft.EntityFrameworkCore;
using PatoDraw.Infrastructure;
using PatoDraw.Infrastructure.Entities;

namespace PatoDraw.Api.Features.Folders.DeleteFolder;

public class DeleteFolderHandler : IRequestHandler<DeleteFolderRequest, ApiResult<bool>>
{
    private readonly PatoDrawDbContext _dbContext;

    public DeleteFolderHandler(PatoDrawDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ApiResult<bool>> Handle(DeleteFolderRequest request, CancellationToken cancellationToken)
    {

        var folders = await _dbContext
            .Folders
            .Where(f => request.FolderIds.Contains(f.Id))
            .ToListAsync();

        var hasPermission = folders.Any(f => !f.OwnerId.Equals(request.OwnerId));
        if (!hasPermission)
        {
            return new ApiResult<bool>()
            {
                Status = StatusCodes.Status403Forbidden,
            };
        }

        // this might explode someday... consider a depth limit
        foreach (var folder in folders)
        {
            await DeleteParent(folder, request.OwnerId, cancellationToken);
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new ApiResult<bool>() { Status = StatusCodes.Status200OK };
    }

    public async Task DeleteParent(Folder folder, Guid ownerId, CancellationToken cancellationToken)
    {

        if (!ownerId.Equals(folder.OwnerId))
            throw new NoDeletePermissionException();

        folder.DeletedAt = DateTime.Now;

        var childFolders = await _dbContext
            .Folders
            .Where(f => f.ParentFolderId == folder.Id)
            .ToListAsync(cancellationToken);

        foreach (var child in childFolders)
        {
            await DeleteParent(child, ownerId, cancellationToken);
        }
    }
}

public class DepthLimit()
{

}

public class NoDeletePermissionException: Exception { }
