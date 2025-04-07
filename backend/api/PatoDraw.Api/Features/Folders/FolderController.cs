using MediatR;
using Microsoft.AspNetCore.Mvc;
using PatoDraw.Api.Authorization;
using PatoDraw.Api.Features.Folders.CreateFolder;
using PatoDraw.Api.Features.Folders.DeleteFolder;
using PatoDraw.Api.Features.Folders.GetFolder;
using PatoDraw.Api.Features.Folders.UpdateFolder;

namespace PatoDraw.Api.Features.Folders;

[Route("folder")]
public class FolderController : Controller
{
    private readonly IMediator _mediator;

    public FolderController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [HttpGet("{folderId:Guid?}")]
    public async Task<IActionResult> GetFolder(Guid? folderId)
    {
        var userId = HttpContext.GetUserId();
        var result = await _mediator.Send(new GetFolderRequest(){ 
            FolderId = folderId,
            OwnerId = userId
        });

        return result.GetActionResult();
    }

    [HttpPost]
    public async Task<IActionResult> CreateFolder([FromBody] FolderPayload payload)
    {
        var userId = HttpContext.GetUserId();
        var result = await _mediator.Send(new CreateFolderRequest()
        {
            OwnerId = userId,
            Payload = payload
        });

        return result.GetActionResult();
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdateFolders([FromBody] IReadOnlyList<UpdateFolderData> payload)
    {
        var userId = HttpContext.GetUserId();
        var result = await _mediator.Send(new UpdateFolderRequest() {
            FoldersToUpdate = payload,
            OwnerId = userId
        });

        return result.GetActionResult();
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteFolder([FromBody] IReadOnlyList<Guid> folderIdsToDelete)
    {
        var userId = HttpContext.GetUserId();
        var result = await _mediator.Send(new DeleteFolderRequest() {
            FolderIds = folderIdsToDelete,
            OwnerId = userId
        });

        return result.GetActionResult();
    }
}
