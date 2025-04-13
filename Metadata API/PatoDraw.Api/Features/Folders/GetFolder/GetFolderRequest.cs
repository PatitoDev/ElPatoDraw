using MediatR;
using PatoDraw.Infrastructure.Entities;

namespace PatoDraw.Api.Features.Folders.GetFolder;

public record GetFolderRequest: IRequest<ApiResult<FolderResult?>>
{
    public Guid? FolderId { get; init; }
    public required Guid OwnerId { get; init; }
}

public record FolderResult
{
    public FolderMetadata? Metadata { get; init; }
    public required IReadOnlyList<FileChildResult> Files { get; init; }
    public required IReadOnlyList<FolderChildResult> Folders { get; init; }
    public bool IsHomeDirectory => Metadata == null;
}

public record FolderMetadata
{
    public Guid Id { get; init; }
    public required string Name { get; init; }
    public required string? Color { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime ModifiedAt { get; init; }
    public required DateTime? DeletedAt { get; init; }
    public FolderChildResult? ParentFolder { get; init; }
}

public record FolderChildResult
{
    public Guid Id { get; init; }
    public required string Name { get; init; }
    public required string? Color { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime ModifiedAt { get; init; }
    public required DateTime? DeletedAt { get; init; }
}

public record FileChildResult
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required string? Color { get; init; }
    public required FileTypeEnum Type { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime ModifiedAt { get; init; }
    public required DateTime? DeletedAt { get; init; }
}
