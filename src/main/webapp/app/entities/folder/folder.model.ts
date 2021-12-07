import { IFile } from 'app/entities/file/file.model';

export interface IFolder {
  id?: number;
  nombre?: string | null;
  files?: IFile[] | null;
}

export class Folder implements IFolder {
  constructor(public id?: number, public nombre?: string | null, public files?: IFile[] | null) {}
}

export function getFolderIdentifier(folder: IFolder): number | undefined {
  return folder.id;
}
