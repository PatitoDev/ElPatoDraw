namespace PatoDraw.Api.Authorization;

public static class ContextExtension
{
    public static Guid GetUserId(this HttpContext context)
    {
        // only use this after the authorization middleware has handled authorization
        var userId = context.User?.Identity?.Name ?? throw new Exception("Missing identity");
        return Guid.Parse(userId);
    }
}
