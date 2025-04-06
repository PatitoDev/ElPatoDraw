using MediatR;

namespace PatoDraw.Api.Features.Files.UpdateFiles;

public record UpdateFileRequest: IRequest<ApiResult<bool>>
{
    public required Guid OwnerId { get; init; }
    public required IReadOnlyList<UpdateFileData> FilesToUpdate { get; init; }
}

public record UpdateFileData
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public Guid? ParentFolderId { get; init; }
}
