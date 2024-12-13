using MediatR;
using Microsoft.AspNetCore.Mvc;
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

    [HttpGet("")]
    [HttpGet("{folderId:Guid?}")]
    public async Task<IActionResult> GetFolder(Guid? folderId, Guid ownerId)
    {
        var result = await _mediator.Send(new GetFolderRequest(){ 
            FolderId = folderId,
            OwnerId = ownerId
        });

        return result.GetActionResult();
    }

    [HttpPost]
    public async Task<IActionResult> CreateFolder([FromBody] FolderPayload payload, Guid ownerId)
    {
        var result = await _mediator.Send(new CreateFolderRequest()
        {
            OwnerId = ownerId,
            Payload = payload
        });

        return result.GetActionResult();
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdateFolders([FromBody] UpdateFolderPayload payload, Guid ownerId)
    {
        var result = await _mediator.Send(new UpdateFolderRequest() {
            FoldersToUpdate = payload.FoldersToUpdate,
            OwnerId = ownerId
        });

        return result.GetActionResult();
    }

    [HttpDelete("")]
    public async Task<IActionResult> DeleteFolder([FromBody] IReadOnlyList<Guid> folderIdsToDelete, Guid ownerId)
    {
        var result = await _mediator.Send(new DeleteFolderRequest() {
            FolderIds = folderIdsToDelete,
            OwnerId = ownerId
        });

        return result.GetActionResult();
    }
}
