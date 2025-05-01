namespace PatoDraw.Infrastructure.Entities;

public class Asset
{
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public required string ContentType { get; set; }
    public required long SizeInBytes { get; set; }
    public required Guid ParentFileId { get; set; } 
    public required File ParentFile { get; set; } 
    public required DateTime CreatedAt { get; set; }
}