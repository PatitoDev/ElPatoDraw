using MediatR;

namespace PatoDraw.Api.Features.Folders.UpdateFolder;

public record UpdateFolderRequest: IRequest<ApiResult<bool>>
{
    public required Guid OwnerId { get; init; }
    public required IReadOnlyList<UpdateFolder> FoldersToUpdate { get; init; }
}

public record UpdateFolder
{
    public required Guid FolderId { get; init; }
    public required string Color { get; init; }
    public required string Name { get; init; }
    public required Guid? ParentFolderId { get; init; }
}

public record UpdateFolderPayload
{
    public required IReadOnlyList<UpdateFolder> FoldersToUpdate { get; init; }
}
