using MediatR;

namespace PatoDraw.Api.Features.Folders.UpdateFolder;

public record UpdateFolderRequest: IRequest<ApiResult<bool>>
{
    public required Guid OwnerId { get; init; }
    public required IReadOnlyList<UpdateFolderData> FoldersToUpdate { get; init; }
}

public record UpdateFolderData
{
    public required Guid FolderId { get; init; }
    public required string Color { get; init; }
    public required string Name { get; init; }
    public required Guid? ParentFolderId { get; init; }
}
