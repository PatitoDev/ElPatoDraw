using MediatR;

namespace PatoDraw.Api.Features.Folders.UpdateFolder;

public record UpdateFolderRequest: IRequest<ApiResult<bool>>
{
    public required Guid OwnerId { get; init; }
    public required IReadOnlyList<UpdateFolderData> FoldersToUpdate { get; init; }
}

public record UpdateFolderData
{
    public required Guid Id { get; init; }
    public string? Color { get; init; }
    public required string Name { get; init; }
    public Guid? ParentFolderId { get; init; }
}
