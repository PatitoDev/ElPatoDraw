﻿namespace PatoDraw.Infrastructure.Entities;

public class File
{
    public required Guid Id;

    public required string Name;

    public required FileTypeEnum Type;

    public required string Color;

    public required Guid OwnerId;

    public required DateTime CreatedAt; 

    public required DateTime ModifiedAt; 

    public DateTime? DeletedAt;

    public Guid? ParentFolderId;

    public Folder? ParentFolder;
}