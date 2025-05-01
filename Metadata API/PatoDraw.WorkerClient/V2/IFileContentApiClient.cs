namespace PatoDraw.Worker.V2;

public record FileContent
{
    public required Stream Stream;
    public required string ContentType;
}

public interface IFileContentApiClient
{
    Task<Guid> CreateFile(Stream content, CancellationToken cancellationToken);
    Task<Stream> GetFile(Guid fileId, CancellationToken cancellationToken);
    Task DeleteFile(Guid fileId, CancellationToken cancellationToken);
}
