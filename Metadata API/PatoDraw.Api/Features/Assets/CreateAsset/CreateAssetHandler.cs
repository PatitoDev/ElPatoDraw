using MediatR;
using Microsoft.EntityFrameworkCore;
using PatoDraw.Infrastructure;
using PatoDraw.Infrastructure.Entities;
using PatoDraw.Worker.V2;

namespace PatoDraw.Api.Features.Assets.CreateAsset;

public class CreateAssetHandler : IRequestHandler<CreateAssetRequest, ApiResult<Guid>>
{
    private readonly PatoDrawDbContext _dbContext;
    private readonly IFileContentApiClient _fileContentApiClient;

    public CreateAssetHandler(PatoDrawDbContext dbContext, IFileContentApiClient fileContentApiClient)
    {
        _dbContext = dbContext;
        _fileContentApiClient = fileContentApiClient;
    }

    public async Task<ApiResult<Guid>> Handle(CreateAssetRequest request, CancellationToken cancellationToken)
    {
        var parentFile = await _dbContext.Files
            .SingleOrDefaultAsync(a => a.Id.Equals(request.ParentFileId), 
            cancellationToken 
        );

        if (parentFile == null)
            return ApiResult<Guid>.Failure(StatusCodes.Status404NotFound);

        if (!parentFile.OwnerId.Equals(request.UserId))
            return ApiResult<Guid>.Failure(StatusCodes.Status401Unauthorized);

        var stream = request.File.OpenReadStream();
        var assetId = await _fileContentApiClient.CreateFile(stream, cancellationToken);

        var asset = new Asset() { 
            Id = assetId,
            CreatedAt = DateTime.UtcNow,
            Name = request.File.FileName,
            ContentType = request.File.ContentType,
            SizeInBytes = request.File.Length,
            ParentFileId = parentFile.Id,
            ParentFile = parentFile
        };

        _dbContext.Add(asset);
        await _dbContext.SaveChangesAsync(CancellationToken.None);

        return ApiResult<Guid>.Success(asset.Id);
    }
}
