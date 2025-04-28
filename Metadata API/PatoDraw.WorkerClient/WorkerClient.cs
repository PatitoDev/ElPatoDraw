using System.Net.Http.Json;

namespace PatoDraw.Worker;

public class WorkerClient: IWorkerClient
{
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl;

    public WorkerClient(HttpClient httpClient, string baseUrl)
    {
        _httpClient = httpClient;
        _baseUrl = baseUrl;
    }

    public async Task<Guid> CreateFile(string token, CancellationToken cancellationToken)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, _baseUrl);
        request.Headers.Add("Authorization", token);
        var response = await _httpClient.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();
        var createdFileId = await response.Content.ReadAsStringAsync(cancellationToken);
        return Guid.Parse(createdFileId);
    }
}
