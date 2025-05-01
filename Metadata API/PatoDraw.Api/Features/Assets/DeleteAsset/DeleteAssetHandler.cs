using MediatR;
using Microsoft.EntityFrameworkCore;
using PatoDraw.Infrastructure;
using PatoDraw.Worker.V2;

namespace PatoDraw.Api.Features.Assets.DeleteAsset;

public class DeleteAssetHandler : IRequestHandler<DeleteAssetRequest, ApiResult<bool>>
{
    private readonly PatoDrawDbContext _dbContext;
    private readonly IFileContentApiClient _fileContentApiClient;

    public DeleteAssetHandler(PatoDrawDbContext dbContext, IFileContentApiClient fileContentApiClient)
    {
        _dbContext = dbContext;
        _fileContentApiClient = fileContentApiClient;
    }

    public async Task<ApiResult<bool>> Handle(DeleteAssetRequest request, CancellationToken cancellationToken)
    {
        var assetMetadata = await _dbContext.Assets
            .Include(a => a.ParentFile)
            .SingleOrDefaultAsync(a => a.Id.Equals(request.AssetId), 
            cancellationToken 
        );

        if (assetMetadata == null)
            return ApiResult<bool>.Success(true, StatusCodes.Status200OK);

        if (!assetMetadata.ParentFile.OwnerId.Equals(request.UserId))
            return ApiResult<bool>.Failure(StatusCodes.Status401Unauthorized);

        await _fileContentApiClient.DeleteFile(assetMetadata.Id, cancellationToken);

        _dbContext.Remove(assetMetadata);
        await _dbContext.SaveChangesAsync(CancellationToken.None);

        return ApiResult<bool>.Success(true);
    }
}
