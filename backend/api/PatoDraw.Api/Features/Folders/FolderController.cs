using MediatR;
using Microsoft.AspNetCore.Mvc;
using PatoDraw.Api.Features.Folders.CreateFolder;
using PatoDraw.Api.Features.Folders.GetFolder;

namespace PatoDraw.Api.Features.Folders;

[Route("folder")]
public class FolderController : Controller
{
    private readonly IMediator _mediator;

    public FolderController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("")]
    [HttpGet("{folderId:Guid?}")]
    public async Task<IActionResult> GetDirectory(Guid? folderId, Guid ownerId)
    {
        var result = await _mediator.Send(new GetFolderRequest(){ 
            FolderId = folderId,
            OwnerId = ownerId
        });

        if (result.Payload != null)
        {
            var resultPayload = new JsonResult(result.Payload);
            resultPayload.StatusCode = result.Status;
            return resultPayload;
        }

        return new StatusCodeResult(result.Status);
    }

    [HttpPost]
    public async Task<IActionResult> CreateDirectory([FromBody] FolderPayload payload, Guid ownerId)
    {
        var result = await _mediator.Send(new CreateFolderRequest()
        {
            OwnerId = ownerId,
            Payload = payload
        });

        if (result.Payload != null)
        {
            var resultPayload = new JsonResult(result.Payload);
            resultPayload.StatusCode = result.Status;
            return resultPayload;
        }

        // TODO - return actual error
        return new StatusCodeResult(result.Status);
    }

    [HttpPatch("{directoryId:Guid}")]
    public void UpdateDirectory(Guid directoryId)
    {
        throw new NotImplementedException();
    }


    [HttpDelete("{directoryId:Guid}")]
    public void DeleteDirectory(Guid directoryId)
    {
        throw new NotImplementedException();
    }
}
