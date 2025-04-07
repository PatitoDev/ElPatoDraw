using MediatR;
using Microsoft.AspNetCore.Mvc;
using PatoDraw.Api.Authorization;
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
    public async Task<IActionResult> GetFile(Guid fileId)
    {
        var userId = HttpContext.GetUserId();
        var result = await _mediator.Send(new GetFileRequest { 
            FileId = fileId, 
            OwnerId = userId
        });

        return result.GetActionResult();
    }

    [HttpPost]
    public async Task<IActionResult> CreateFile([FromBody] FileCreatePayload payload)
    {
        var userId = HttpContext.GetUserId();
        var token = HttpContext.Request.Headers.Authorization.FirstOrDefault();
        if (token == null) return new UnauthorizedResult();

        var result = await _mediator.Send(new CreateFileRequest() { 
            Token = token,
            FilePayload = payload,
            OwnerId = userId
        });

        return result.GetActionResult();
    }


    [HttpPut]
    public async Task<IActionResult> UpdateFile([FromBody] IReadOnlyList<UpdateFileData> payload)
    {
        var userId = HttpContext.GetUserId();
        var result = await _mediator.Send(new UpdateFileRequest()
        {
            FilesToUpdate = payload,
            OwnerId = userId
        });

        return result.GetActionResult();
    }


    [HttpDelete]
    public async Task<IActionResult> DeleteFiles([FromBody] IReadOnlyList<Guid> fileIds)
    {
        var userId = HttpContext.GetUserId();
        var result = await _mediator.Send(new DeleteFileRequest()
        {
            OwnerId = userId,
            FileIds = fileIds
        });

        return result.GetActionResult();
    }
}
