using MediatR;
using Microsoft.AspNetCore.Mvc;
using PatoDraw.Api.Authorization;
using PatoDraw.Api.Features.Assets.CreateAsset;
using PatoDraw.Api.Features.Assets.DeleteAsset;
using PatoDraw.Api.Features.Assets.GetAsset;

namespace PatoDraw.Api.Features.Assets;

[Route("/asset")]
public class AsssetController: Controller
{
    private readonly IMediator _mediator;

    public AsssetController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{assetId:Guid}")]
    public async Task<IActionResult> GetAssetContent(Guid assetId)
    {
        var userId = HttpContext.GetUserId();
        var result = await _mediator.Send(new GetAssetRequest()
        {
            AssetId = assetId,
            UserId = userId
        });

        if (result.Payload != null)
        {
            return new FileStreamResult(
                result.Payload.Stream,
                result.Payload.ContentType
            );
        }

        return result.GetActionResult();
    }

    [HttpDelete("{assetId:Guid}")]
    public async Task<IActionResult> DeleteAsset(Guid assetId)
    {
        var userId = HttpContext.GetUserId();
        var result = await _mediator.Send(new DeleteAssetRequest()
        {
            AssetId = assetId,
            UserId = userId
        });

        return result.GetActionResult();
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsset([FromQuery] Guid parentFileId, IFormFile file)
    {
        var userId = HttpContext.GetUserId();
        var result = await _mediator.Send(new CreateAssetRequest()
        {
            File = file,
            ParentFileId = parentFileId,
            UserId = userId,
        });

        return result.GetActionResult();
    }

}
