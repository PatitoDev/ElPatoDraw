using MediatR;

namespace PatoDraw.Api.Features.Folders.CreateFolder;

public record CreateFolderRequest: IRequest<ApiResult<Guid?>>
{
    public required Guid OwnerId { get; init; }
    public required FolderPayload Payload { get; init; }
}

public record FolderPayload
{
    public required string Name { get; init; }

    public required string Color { get; init; }

    public Guid? ParentFolderId { get; init; }
}
