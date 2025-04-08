using MediatR;
using Microsoft.EntityFrameworkCore;
using PatoDraw.Infrastructure;

namespace PatoDraw.Api.Features.Files.GetFile;

public class GetFileHandler : IRequestHandler<GetFileRequest, ApiResult<FileResult>>
{
    private PatoDrawDbContext _dbContext;

    public GetFileHandler(PatoDrawDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ApiResult<FileResult>> Handle(GetFileRequest request, CancellationToken cancellationToken)
    {
        var file = await _dbContext
            .Files
            .Include(f => f.ParentFolder)
            .FirstOrDefaultAsync(f => f.Id.Equals(request.FileId), cancellationToken);

        if (file == null)
            return ApiResult<FileResult>.Failure(
                StatusCodes.Status404NotFound,
                $"Could not find file with id {request.FileId}"
            );

        if (!file.OwnerId.Equals(request.OwnerId))
            return ApiResult<FileResult>.Failure(
                StatusCodes.Status403Forbidden,
                "No permission to view file"
            );

        var fileResult = new FileResult
        {
            Id = file.Id,
            CreatedAt = file.CreatedAt,
            ModifiedAt = file.ModifiedAt,
            DeletedAt = file.DeletedAt,
            Name = file.Name,
            Type = file.Type,
        };

        // only add folder metadata if user can view the folder
        if (file.ParentFolder != null && file.ParentFolder.OwnerId.Equals(request.OwnerId))
        {
            fileResult.ParentFolder = new ParentFolder
            {
                Id = file.ParentFolder.Id,
                Name = file.ParentFolder.Name,
                Color = file.ParentFolder.Color,
                CreatedAt = file.ParentFolder.CreatedAt,
                ModifiedAt = file.ParentFolder.ModifiedAt,
                DeletedAt = file.ParentFolder.DeletedAt
            };
        }

        return ApiResult<FileResult>.Success( fileResult );
    }
}
