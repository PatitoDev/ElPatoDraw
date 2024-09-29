using MediatR;
using Microsoft.AspNetCore.Mvc;
using PatoDraw.Api.Features.Files.CreateDirectory;

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

        if (result.Payload != null) { 
            return Json(result.Payload);
        }

        return StatusCode(result.Status);
    }


    [HttpPatch("{fileID:Guid}")]
    public void UpdateFile(Guid fileId)
    {
        throw new NotImplementedException();
    }


    [HttpDelete("{fileID:Guid}")]
    public void DeleteFile(Guid fileId)
    {
        throw new NotImplementedException();
    }
}
