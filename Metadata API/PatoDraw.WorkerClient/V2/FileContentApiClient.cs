using System.Net.Mime;

namespace PatoDraw.Worker.V2;

public class FileContentApiClient: IFileContentApiClient
{
    private const int VERSION = 2;

    private readonly string _secret;
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl;

    public FileContentApiClient(HttpClient httpClient, string baseUrl, string secret)
    {
        _httpClient = httpClient;
        _baseUrl = $"{baseUrl}/v{VERSION}";
        _secret = secret;
    }

    public async Task<Guid> CreateFile(Stream stream, CancellationToken cancellationToken)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, _baseUrl);
        request.Headers.Add("Authorization", _secret);
        request.Content = new StreamContent(stream);

        var response = await _httpClient.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();
        var createdFileId = await response.Content.ReadAsStringAsync(cancellationToken);
        return Guid.Parse(createdFileId);
    }

    public async Task DeleteFile(Guid fileId, CancellationToken cancellationToken)
    {
        var url = $"{_baseUrl}/{fileId}";
        var request = new HttpRequestMessage(HttpMethod.Delete, _baseUrl);
        request.Headers.Add("Authorization", _secret);

        var response = await _httpClient.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();
    }

    public async Task<Stream> GetFile(Guid fileId, CancellationToken cancellationToken)
    {
        var url = $"{_baseUrl}/{fileId}";
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Add("Authorization", _secret);

        var response = await _httpClient.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadAsStreamAsync(cancellationToken);
    }
}
