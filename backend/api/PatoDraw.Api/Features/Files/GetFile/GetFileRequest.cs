﻿using MediatR;
using PatoDraw.Infrastructure.Entities;

namespace PatoDraw.Api.Features.Files.GetFile;

public class GetFileRequest: IRequest<ApiResult<FileResult>>
{
    public required Guid FileId { get; init; }
    public required Guid OwnerId { get; init; }
}

public class FileResult
{
    public required Guid Id { get; init; }

    public required string Name { get; init; }

    public required FileTypeEnum Type { get; init; }

    public required DateTime CreatedAt { get; init; }

    public required DateTime ModifiedAt { get; init; }

    public DateTime? DeletedAt { get; init; }

    public ParentFolder? ParentFolder { get; set; }
}

public class ParentFolder
{
    public Guid Id { get; init; }
    public required string Name { get; init; }
    public required string Color { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime ModifiedAt { get; init; }
    public required DateTime? DeletedAt { get; init; }
}
