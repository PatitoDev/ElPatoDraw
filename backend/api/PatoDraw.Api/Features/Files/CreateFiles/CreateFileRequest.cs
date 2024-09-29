using MediatR;
using PatoDraw.Infrastructure.Entities;

namespace PatoDraw.Api.Features.Files.CreateDirectory;

public record CreateFileRequest : IRequest<ApiResult<Guid?>>
{
    public required Guid OwnerId;
    public required FileCreatePayload FilePayload;
}

public record FileCreatePayload
{
    public required string Name { get; init; }
    public required FileTypeEnum Type { get; init; }
    public required string Color { get; init; }
    public Guid? ParentFolderId { get; init; }
}
