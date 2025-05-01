using MediatR;

namespace PatoDraw.Api.Features.Assets.DeleteAsset;

public record DeleteAssetRequest : IRequest<ApiResult<bool>>
{
    public required Guid AssetId;
    public required Guid UserId;
}
