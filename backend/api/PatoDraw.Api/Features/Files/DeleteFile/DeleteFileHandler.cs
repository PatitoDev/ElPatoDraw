using MediatR;
using Microsoft.EntityFrameworkCore;
using PatoDraw.Infrastructure;

namespace PatoDraw.Api.Features.Files.DeleteFile;

public class DeleteFileHandler : IRequestHandler<DeleteFileRequest, ApiResult<bool>>
{
    private readonly PatoDrawDbContext _dbContext;

    public DeleteFileHandler(PatoDrawDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ApiResult<bool>> Handle(DeleteFileRequest request, CancellationToken cancellationToken)
    {
        var files = await _dbContext.Files
            .Where(f => request.FileIds.Contains(f.Id))
            .ToListAsync(cancellationToken);

        var notFoundIds = request.FileIds
            .Where(id => !files.Any(f => f.Id == id))
            .ToList();

        if (notFoundIds.Count != 0)
            return ApiResult<bool>
                .Failure(StatusCodes.Status404NotFound, "Files not found");

        var filesWithNoDeletePermission = files
            .Where(f => !f.OwnerId.Equals(request.OwnerId))
            .ToList();

        if (filesWithNoDeletePermission.Count != 0)
            return ApiResult<bool>
                .Failure(StatusCodes.Status403Forbidden, "No delete perimssion");

        foreach (var file in files)
        {
            file.DeletedAt = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        return ApiResult<bool>.Success(true);
    }
}
