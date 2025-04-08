using MediatR;

namespace PatoDraw.Api.Features.Folders.DeleteFolder;

public record DeleteFolderRequest: IRequest<ApiResult<bool>>
{
    public required Guid OwnerId { get; init; }
    public required IReadOnlyList<Guid> FolderIds { get; init; }
}
