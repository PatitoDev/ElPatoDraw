using MediatR;
using Microsoft.EntityFrameworkCore;
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
            return new ApiResult<Guid?> { Status = StatusCodes.Status400BadRequest };
        }

        // TODO - validate color

        // check if user has permission to parent folder
        if (request.FilePayload.ParentFolderId != null)
        {
            var parentFolderOwnerId = await _dbContext
                .Folders
                .AsNoTracking()
                .Where(f => f.Id == request.FilePayload.ParentFolderId)
                .Select(f => f.OwnerId)
                .Cast<Guid?>()
                .FirstOrDefaultAsync(cancellationToken);

            if (parentFolderOwnerId == null)
            {
                return new ApiResult<Guid?> { Status = StatusCodes.Status404NotFound };
            }

            if (parentFolderOwnerId != request.OwnerId)
            {
                return new ApiResult<Guid?> { Status = StatusCodes.Status403Forbidden };
            }
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

        return new ApiResult<Guid?>()
        {
            Payload = id,
            Status = StatusCodes.Status201Created
        };
    }
}
