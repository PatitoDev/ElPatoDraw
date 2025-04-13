using MediatR;
using PatoDraw.Infrastructure.Entities;

namespace PatoDraw.Api.Features.Files.CreateDirectory;

public record CreateFileRequest : IRequest<ApiResult<Guid?>>
{
    public required Guid OwnerId { get; init; }
    public required string Token { get; init; }
    public required FileCreatePayload FilePayload { get; init; }
}

public record FileCreatePayload
{
    public required string Name { get; init; }
    public string? Color { get; init; }
    public required FileTypeEnum Type { get; init; }
    public Guid? ParentFolderId { get; init; }
}
