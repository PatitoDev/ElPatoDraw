namespace PatoDraw.Api;

public record ApiResult<T>
{
    public T? Payload { get; init; } = default;
    public required int Status { get; init; } = StatusCodes.Status200OK;

    public string? Error { get; init; } = null;
}
