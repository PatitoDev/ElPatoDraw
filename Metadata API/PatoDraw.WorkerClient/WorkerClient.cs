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

    public async Task<BucketFile> CreateFile(string token, CancellationToken cancellationToken)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, _baseUrl);
        request.Headers.Add("Authorization", token);
        request.Content = JsonContent.Create(new { Data = new { } });
        var response = await _httpClient.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();
        var createdFile = await response.Content.ReadFromJsonAsync<BucketFile>(cancellationToken);
        return createdFile!;
    }
}
