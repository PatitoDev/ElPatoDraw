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
            .ToListAsync(cancellationToken);

        var hasPermission = folders.All(f => f.OwnerId.Equals(request.OwnerId));
        if (!hasPermission)
        {
            return new ApiResult<bool>()
            {
                Status = StatusCodes.Status403Forbidden,
            };
        }

        foreach (var folder in folders)
        {
            // we mark as deleted the folder and later, in a clean up schedule we fully delete the folder and its children
            folder.DeletedAt = DateTime.Now;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new ApiResult<bool>() { Status = StatusCodes.Status200OK };
    }
}
