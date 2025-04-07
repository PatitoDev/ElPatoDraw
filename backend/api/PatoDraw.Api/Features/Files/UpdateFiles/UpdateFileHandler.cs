using MediatR;
using Microsoft.EntityFrameworkCore;
using PatoDraw.Infrastructure;

namespace PatoDraw.Api.Features.Files.UpdateFiles;

public class UpdateFileHandler : IRequestHandler<UpdateFileRequest, ApiResult<bool>>
{
    private readonly PatoDrawDbContext _dbContext;

    public UpdateFileHandler(PatoDrawDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ApiResult<bool>> Handle(UpdateFileRequest request, CancellationToken cancellationToken)
    {
        var fileIds = request.FilesToUpdate.Select(f => f.Id).ToList();

        var files = await _dbContext
            .Files
            .Where(f => fileIds.Contains(f.Id))
            .ToListAsync(cancellationToken);

        var filesNotFound = fileIds.Where(id => !files.Any(f => f.Id.Equals(id))).ToList();
        if (filesNotFound.Count != 0)
            return ApiResult<bool>.Failure(
                StatusCodes.Status404NotFound,
                "Files with ids " + String.Join(", ",  filesNotFound) + " not found"
            );

        var filesWithIncorrectPermission = files.Where(f => !f.OwnerId.Equals(request.OwnerId)).ToList();
        if (filesWithIncorrectPermission.Count != 0)
            return ApiResult<bool>.Failure(
                StatusCodes.Status403Forbidden,
                "No editable permision for files " + String.Join(", ",  filesNotFound)
            );

        foreach (var file in files)
        {
            var newFileDetails = request.FilesToUpdate.First(f => f.Id.Equals(file.Id));
            file.Name = newFileDetails.Name;

            if (
                newFileDetails.ParentFolderId != null && 
                newFileDetails.ParentFolderId != file.ParentFolderId
            )
            {
                var parentFolder = await _dbContext.Folders
                    .Where(f => f.Id == newFileDetails.ParentFolderId)
                    .FirstOrDefaultAsync(cancellationToken);

                if (parentFolder == null)
                    return ApiResult<bool>.Failure(
                        StatusCodes.Status404NotFound,
                        "Unable to find folder " + newFileDetails.ParentFolderId
                    );

                if (!parentFolder.OwnerId.Equals(request.OwnerId))
                    return ApiResult<bool>.Failure(
                        StatusCodes.Status404NotFound,
                        "No permission to move file to folder " + newFileDetails.ParentFolderId
                    );

            }
            file.ParentFolderId = newFileDetails.ParentFolderId;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        return ApiResult<bool>.Success(true);
    }

}
