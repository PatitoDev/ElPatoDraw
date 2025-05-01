using MediatR;
using Microsoft.EntityFrameworkCore;
using PatoDraw.Infrastructure;
using PatoDraw.Worker.V2;

namespace PatoDraw.Api.Features.Assets.GetAsset;

public class GetAssetHandler : IRequestHandler<GetAssetRequest, ApiResult<AssetFileResult>>
{
    private readonly PatoDrawDbContext _dbContext;
    private readonly IFileContentApiClient _fileContentApiClient;

    public GetAssetHandler(PatoDrawDbContext dbContext, IFileContentApiClient fileContentApiClient)
    {
        _dbContext = dbContext;
        _fileContentApiClient = fileContentApiClient;
    }

    public async Task<ApiResult<AssetFileResult>> Handle(GetAssetRequest request, CancellationToken cancellationToken)
    {
        var assetMetadata = await _dbContext.Assets
            .Include(a => a.ParentFile)
            .SingleOrDefaultAsync(a => a.Id.Equals(request.AssetId), 
            cancellationToken 
        );

        if (assetMetadata == null)
            return ApiResult<AssetFileResult>.Failure(StatusCodes.Status404NotFound);

        if (!assetMetadata.ParentFile.OwnerId.Equals(request.UserId))
            return ApiResult<AssetFileResult>.Failure(StatusCodes.Status401Unauthorized);

        var assetStream = await _fileContentApiClient.GetFile(assetMetadata.Id, cancellationToken);

        return ApiResult<AssetFileResult>.Success(new AssetFileResult() { 
            ContentType = assetMetadata.ContentType,
            FileName = assetMetadata.Name,
            Stream = assetStream
        });
    }
}
