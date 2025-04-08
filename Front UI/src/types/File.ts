export type FileType = 'Excalidraw' | 'TODO';

export interface FolderMetadata {
  id: string,
  name: string,
  color: string,
  createdAt: string,
  modifiedAt: string,
  deletedAt?: string,
  parentFolder?: FolderChild
}

export type FolderChild = Exclude<FolderMetadata, 'parentFolder'>;

export interface FileChild {
  id: string,
  name: string,
  type: FileType,
  createdAt: string,
  modifiedAt: string,
  deletedAt?: string,
}

export interface Folder {
  metadata?: FolderMetadata,
  files: Array<FileChild>,
  folders: Array<FolderChild>,
  isHomeDirectory: boolean
}

//

export type File = FolderChild & {
  parentFolder?: ParentFolder
}

export type ParentFolder = Exclude<FolderMetadata, 'parentFolder'>