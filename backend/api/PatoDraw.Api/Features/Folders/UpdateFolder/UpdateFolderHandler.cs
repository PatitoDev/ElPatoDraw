﻿using MediatR;
using Microsoft.EntityFrameworkCore;
using PatoDraw.Infrastructure;

namespace PatoDraw.Api.Features.Folders.UpdateFolder;

public class UpdateFolderHandler : IRequestHandler<UpdateFolderRequest, ApiResult<bool>>
{
    private readonly PatoDrawDbContext _context;

    public UpdateFolderHandler(PatoDrawDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResult<bool>> Handle(UpdateFolderRequest request, CancellationToken cancellationToken)
    {
        var folderIds = request.FoldersToUpdate.Select(f => f.FolderId).ToList();

        var folderEntities = await _context
            .Folders
            .Where(f => folderIds.Contains(f.Id))
            .ToDictionaryAsync(d => d.Id, cancellationToken);

        foreach (var newFolderData in request.FoldersToUpdate)
        {
            var folderEntity = folderEntities.GetValueOrDefault(newFolderData.FolderId);
            if (folderEntity == null)
            {
                return new ApiResult<bool>() { 
                    Payload = true,
                    Status = StatusCodes.Status404NotFound,
                    Error = $"Folder with id {newFolderData.FolderId} not found"
                };
            }

            if (!folderEntity.OwnerId.Equals(request.OwnerId))
            {
                // no access
                return new ApiResult<bool>() { Status = StatusCodes.Status403Forbidden };
            }

            folderEntity.Name = newFolderData.Name;
            folderEntity.Color = newFolderData.Color;

            if (newFolderData.ParentFolderId != null)
            {
                var parent = await _context
                    .Folders
                    .FirstOrDefaultAsync(f => f.Id == newFolderData.ParentFolderId, cancellationToken);

                if (parent == null)
                {
                    return new ApiResult<bool>() { 
                        Payload = true,
                        Status = StatusCodes.Status404NotFound,
                        Error = $"Folder with id {newFolderData.FolderId} not found"
                    };
                }

                if (!parent.OwnerId.Equals(request.OwnerId))
                {
                    return new ApiResult<bool>() { Status = StatusCodes.Status403Forbidden };
                }


                folderEntity.ParentFolderId = newFolderData.ParentFolderId;
                // TODO - iterate on child and update depth
                folderEntity.Depth = parent.Depth + 1;
            }
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new ApiResult<bool>() { 
            Status = StatusCodes.Status200OK,
            Payload = true
        };
    }
}
