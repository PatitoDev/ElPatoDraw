using MediatR;
using Microsoft.AspNetCore.Mvc;
using PatoDraw.Api.Features.Files.CreateDirectory;
using PatoDraw.Api.Features.Files.DeleteFile;
using PatoDraw.Api.Features.Files.GetFile;
using PatoDraw.Api.Features.Files.UpdateFiles;

namespace PatoDraw.Api.Features.Files;

[Route("/file")]
public class FileController : Controller
{
    private readonly IMediator _mediator;

    public FileController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{fileId:Guid}")]
    public async Task<IActionResult> GetFile(Guid fileId, Guid ownerId)
    {
        var result = await _mediator.Send(new GetFileRequest { 
            FileId = fileId, 
            OwnerId = ownerId
        });

        return result.GetActionResult();
    }

    [HttpPost]
    public async Task<IActionResult> CreateFile([FromBody] FileCreatePayload payload, Guid ownerId)
    {
        var result = await _mediator.Send(new CreateFileRequest() { 
            FilePayload = payload,
            OwnerId = ownerId
        });

        return result.GetActionResult();
    }


    [HttpPut]
    public async Task<IActionResult> UpdateFile([FromBody] UpdateFilePayload payload, Guid ownerId)
    {
        var result = await _mediator.Send(new UpdateFileRequest()
        {
            FilesToUpdate = payload.FilesToUpdate,
            OwnerId = ownerId
        });

        return result.GetActionResult();
    }


    [HttpDelete]
    public async Task<IActionResult> DeleteFiles([FromBody] IReadOnlyList<Guid> fileIds, Guid ownerId)
    {
        var result = await _mediator.Send(new DeleteFileRequest()
        {
            OwnerId = ownerId,
            FileIds = fileIds
        });

        return result.GetActionResult();
    }
}
