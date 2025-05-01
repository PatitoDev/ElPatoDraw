using MediatR;

namespace PatoDraw.Api.Features.Assets.CreateAsset;

public record CreateAssetRequest : IRequest<ApiResult<Guid>>
{
    public required Guid ParentFileId;
    public required Guid UserId;
    public required IFormFile File;
}
