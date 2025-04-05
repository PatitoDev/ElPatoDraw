using MediatR;

namespace PatoDraw.Api.Features.Files.DeleteFile;

public class DeleteFileRequest: IRequest<ApiResult<bool>>
{
    public required Guid OwnerId { get; init; }
    public required IReadOnlyList<Guid> FileIds { get; init; }
}
