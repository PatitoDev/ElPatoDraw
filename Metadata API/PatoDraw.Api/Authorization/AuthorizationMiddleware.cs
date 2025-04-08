using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace PatoDraw.Api.Authorization
{
    public class AuthorizationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly JsonWebTokenHandler _tokenHandler;
        private readonly SecurityKey _secretKey;
        private readonly string _issuer;

        public AuthorizationMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _tokenHandler = new JsonWebTokenHandler();
            _issuer = configuration.GetValue<string>("Authorization:Issuer") ?? throw new Exception("missing issuer in app settings");
            var secret = configuration.GetValue<string>("Authorization:Secret") ?? throw new Exception("missing secret in app setttings");
            _secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var token = context.Request.Headers.Authorization.FirstOrDefault();
            if (token == null)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return;
            }
            
            var validationParameters = new TokenValidationParameters()
            {
                ValidIssuer = _issuer,
                ValidateIssuer = true,
                ValidateAudience = false,
                ValidateLifetime = true,
                IssuerSigningKey = _secretKey
            };
            var validationResult = await _tokenHandler.ValidateTokenAsync(token, validationParameters);
            if (!validationResult.IsValid)
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                return;
            }

            var id = validationResult.Claims["sub"].ToString();

            if (String.IsNullOrEmpty(id))
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                return;
            }

            var iden = new ClaimsIdentity("Supabase", "id", "") { };
            iden.AddClaim(new Claim("id", id));
            var principal = new ClaimsPrincipal(iden);
            context.User = principal;

            await _next(context);
        }
    }
}
