namespace PatoDraw.Infrastructure.Entities;

public class Folder
{
    public required string Name;
    public required Folder ParentFolder;
    public required IEnumerable<Drawing> Drawings;
    public required IEnumerable<Folder> Folders;
}
