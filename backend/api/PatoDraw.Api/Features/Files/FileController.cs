using MediatR;
using Microsoft.AspNetCore.Mvc;
using PatoDraw.Api.Features.Files.CreateDirectory;
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

    [HttpGet("{fileID:Guid}")]
    public void GetFile(Guid fileId)
    {
        throw new NotImplementedException();
    }

    [HttpPost("")]
    public async Task<IActionResult> CreateFile([FromBody] FileCreatePayload payload, Guid ownerId)
    {
        var result = await _mediator.Send(new CreateFileRequest() { 
            FilePayload = payload,
            OwnerId = ownerId
        });

        return result.GetActionResult();
    }


    [HttpPatch("{fileID:Guid}")]
    public async Task<IActionResult> UpdateFile([FromBody] UpdateFilePayload payload, Guid ownerId)
    {
        var result = await _mediator.Send(new UpdateFileRequest()
        {
            FilesToUpdate = payload.FilesToUpdate,
            OwnerId = ownerId
        });

        return result.GetActionResult();
    }


    [HttpDelete("{fileID:Guid}")]
    public void DeleteFile(Guid fileId)
    {
        throw new NotImplementedException();
    }
}
