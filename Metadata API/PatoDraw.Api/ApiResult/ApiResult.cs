using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace PatoDraw.Api;

public record ApiResult<T>
{
    public T? Payload { get; init; } = default;
    public int Status { get; init; } = StatusCodes.Status200OK;
    public string? Error { get; init; } = null;

    public static ApiResult<T> Success(T payload, int status = StatusCodes.Status200OK) => new()
    {
        Status = status,
        Payload = payload
    };

    public static ApiResult<T> Failure(int status, string? error = null) => new()
    {
        Status = status,
        Error = error
    };

    public IActionResult GetActionResult() {
        if (Error != null)
        {
            var result = new JsonResult(new { Error });
            result.StatusCode = Status;
            return result;
        }

        if (Payload != null)
        {
            var result = new JsonResult(Payload);
            result.StatusCode = Status;
            return result;
        }

        return new StatusCodeResult(Status);
    }
}
