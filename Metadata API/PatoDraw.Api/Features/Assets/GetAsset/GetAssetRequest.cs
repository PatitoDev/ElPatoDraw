using MediatR;
using System.Net.Mime;

namespace PatoDraw.Api.Features.Assets.GetAsset;

public record GetAssetRequest : IRequest<ApiResult<AssetFileResult>>
{
    public required Guid AssetId;
    public required Guid UserId;
}

public record AssetFileResult
{
    public required string FileName;
    public required Stream Stream;
    public required string ContentType;
}
