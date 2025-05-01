namespace PatoDraw.Worker.V1;

public interface IWorkerClient
{
    Task<Guid> CreateFile(string token, CancellationToken cancellationToken);
}
