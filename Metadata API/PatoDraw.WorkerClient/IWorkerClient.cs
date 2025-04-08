namespace PatoDraw.Worker;

public interface IWorkerClient
{
    Task<BucketFile> CreateFile(string token, CancellationToken cancellationToken);
}
