namespace PatoDraw.Infrastructure.Entities;

public class Folder
{
    public required Guid Id;

    public required string Name;

    public required string Color;

    public required Guid OwnerId;

    public required DateTime CreatedAt;

    public required DateTime ModifiedAt;

    public required int Depth;

    public DateTime? DeletedAt;

    public Folder? ParentFolder;

    public Guid? ParentFolderId;

    public IList<Folder> Folders = new List<Folder>();

    public IList<File> Files = new List<File>();
}
