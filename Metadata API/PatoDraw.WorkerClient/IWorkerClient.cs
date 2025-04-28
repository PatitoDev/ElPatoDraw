namespace PatoDraw.Worker;

public interface IWorkerClient
{
    Task<Guid> CreateFile(string token, CancellationToken cancellationToken);
}
