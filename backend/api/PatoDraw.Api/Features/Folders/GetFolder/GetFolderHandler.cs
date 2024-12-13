using MediatR;
using Microsoft.EntityFrameworkCore;
using PatoDraw.Infrastructure;

namespace PatoDraw.Api.Features.Folders.GetFolder;

public class GetFolderHandler : IRequestHandler<GetFolderRequest, ApiResult<FolderResult?>>
{
    private readonly PatoDrawDbContext _dbContext;

    public GetFolderHandler(PatoDrawDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ApiResult<FolderResult?>> Handle(GetFolderRequest request, CancellationToken cancellationToken)
    {
        FolderMetadata? metadata = null;

        if (request.FolderId != null)
        {
            var folder = await _dbContext
                .Folders
                .Include(f => f.ParentFolder)
                .Where(f => f.Id == request.FolderId)
                .FirstOrDefaultAsync(cancellationToken);

            if (folder == null)
                return new ApiResult<FolderResult?>() { Status = StatusCodes.Status404NotFound };

            if (folder.OwnerId != request.OwnerId)
                return new ApiResult<FolderResult?>() { Status = StatusCodes.Status403Forbidden };

            metadata = new()
            {
                Color = folder.Color,
                CreatedAt = folder.CreatedAt,
                ModifiedAt = folder.ModifiedAt,
                Name = folder.Name,
                Id = folder.Id,
                ParentFolder = folder.ParentFolder != null ? 
                    new FolderChildResult() { 
                        Color = folder.ParentFolder.Color,
                        CreatedAt = folder.ParentFolder.CreatedAt,
                        ModifiedAt = folder.ParentFolder.CreatedAt,
                        Name = folder.ParentFolder.Name,
                        Id = folder.ParentFolder.Id,
                    } 
                : null
            };
        }

        var fileChilds = await _dbContext
            .Files
            .Where(f => f.ParentFolderId.Equals(request.FolderId) && f.OwnerId.Equals(request.OwnerId))
            .Select(f => new FileChildResult()
            {
                Color = f.Color,
                CreatedAt = f.CreatedAt,
                Id = f.Id,
                ModifiedAt = f.ModifiedAt,
                Name = f.Name,
                Type = f.Type
            })
            .ToListAsync(cancellationToken);

        var folderChilds = await _dbContext
            .Folders
            .Where(f => f.ParentFolderId == request.FolderId && f.OwnerId.Equals(request.OwnerId))
            .Select(f => new FolderChildResult()
            {
                Color = f.Color,
                CreatedAt = f.CreatedAt,
                Id = f.Id,
                ModifiedAt = f.ModifiedAt,
                Name = f.Name,
            })
            .ToListAsync(cancellationToken);

        var folderResult = new FolderResult() {
            Folders = folderChilds,
            Files = fileChilds,
            Metadata = metadata
        };

        return new ApiResult<FolderResult?> { Payload = folderResult, Status = StatusCodes.Status200OK };
    }
}
