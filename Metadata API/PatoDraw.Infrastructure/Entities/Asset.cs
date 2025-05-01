namespace PatoDraw.Infrastructure.Entities;

public class Asset
{
    public required Guid Id;

    public required string Name;

    public required string ContentType;

    public required long SizeInBytes;

    public required Guid ParentFileId;

    public required File ParentFile;

    public required DateTime CreatedAt;
}