import { IFolder } from 'app/entities/folder/folder.model';

export interface IFile {
  id?: number;
  nombre?: string | null;
  descripcion?: string | null;
  estado?: boolean | null;
  folder?: IFolder | null;
}

export class File implements IFile {
  constructor(
    public id?: number,
    public nombre?: string | null,
    public descripcion?: string | null,
    public estado?: boolean | null,
    public folder?: IFolder | null
  ) {
    this.estado = this.estado ?? false;
  }
}

export function getFileIdentifier(file: IFile): number | undefined {
  return file.id;
}
