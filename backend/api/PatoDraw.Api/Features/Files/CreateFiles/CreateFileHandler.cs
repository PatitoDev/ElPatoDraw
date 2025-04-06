﻿using MediatR;
using Microsoft.EntityFrameworkCore;
using PatoDraw.Api.ValidationHelpers;
using PatoDraw.Infrastructure;
using PatoDraw.Worker;

namespace PatoDraw.Api.Features.Files.CreateDirectory;

public class CreateFileHandler : IRequestHandler<CreateFileRequest, ApiResult<Guid?>>
{
    private readonly PatoDrawDbContext _dbContext;
    private readonly IWorkerClient _workerClient;

    public CreateFileHandler(PatoDrawDbContext dbContext, IWorkerClient workerClient)
    {
        _dbContext = dbContext;
        _workerClient = workerClient;
    }

    public async Task<ApiResult<Guid?>> Handle(CreateFileRequest request, CancellationToken cancellationToken)
    {
        if (request.OwnerId.Equals(Guid.Empty))
        {
            return new ApiResult<Guid?> { Status = StatusCodes.Status400BadRequest, Error = "Missing owner" };
        }

        if (request.FilePayload.ParentFolderId != null)
        {
            var parentFolder = await _dbContext
                .Folders
                .AsNoTracking()
                .Where(f => f.Id == request.FilePayload.ParentFolderId)
                .FirstOrDefaultAsync(cancellationToken);

            if (parentFolder == null)
            {
                return ApiResult<Guid?>.Failure(
                    StatusCodes.Status404NotFound,
                    "Parent folder not found"
                );
            }

            if (parentFolder.OwnerId != request.OwnerId)
            {
                return ApiResult<Guid?>.Failure( 
                    StatusCodes.Status403Forbidden,
                    "You don't not have permissions to create a file in this directory"
                );
            }
        }

        var isNameValid = NameValidationHelper.IsValid(request.FilePayload.Name);
        if (!isNameValid.IsValid)
        {
            return ApiResult<Guid?>.Failure(
                StatusCodes.Status400BadRequest,
                "File name " + isNameValid.Reason
            );
        }

        var storageFile = await _workerClient.CreateFile(request.Token, cancellationToken);

        var createdFile = new Infrastructure.Entities.File()
        {
            Id = storageFile.Id,
            CreatedAt = DateTime.UtcNow,
            ModifiedAt = DateTime.UtcNow,
            Name = request.FilePayload.Name,
            OwnerId = request.OwnerId,
            ParentFolderId = request.FilePayload.ParentFolderId,
            Type = request.FilePayload.Type,
        };

        _dbContext.Add(createdFile);

        await _dbContext.SaveChangesAsync(cancellationToken);

        return ApiResult<Guid?>.Success(storageFile.Id, StatusCodes.Status201Created);
    }
}
