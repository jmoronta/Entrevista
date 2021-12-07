import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFile, File } from '../file.model';
import { FileService } from '../service/file.service';
import { IFolder } from 'app/entities/folder/folder.model';
import { FolderService } from 'app/entities/folder/service/folder.service';

@Component({
  selector: 'jhi-file-update',
  templateUrl: './file-update.component.html',
})
export class FileUpdateComponent implements OnInit {
  isSaving = false;

  foldersSharedCollection: IFolder[] = [];

  editForm = this.fb.group({
    id: [],
    nombre: [],
    descripcion: [],
    estado: [],
    folder: [],
  });

  constructor(
    protected fileService: FileService,
    protected folderService: FolderService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ file }) => {
      this.updateForm(file);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const file = this.createFromForm();
    if (file.id !== undefined) {
      this.subscribeToSaveResponse(this.fileService.update(file));
    } else {
      this.subscribeToSaveResponse(this.fileService.create(file));
    }
  }

  trackFolderById(index: number, item: IFolder): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFile>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(file: IFile): void {
    this.editForm.patchValue({
      id: file.id,
      nombre: file.nombre,
      descripcion: file.descripcion,
      estado: file.estado,
      folder: file.folder,
    });

    this.foldersSharedCollection = this.folderService.addFolderToCollectionIfMissing(this.foldersSharedCollection, file.folder);
  }

  protected loadRelationshipsOptions(): void {
    this.folderService
      .query()
      .pipe(map((res: HttpResponse<IFolder[]>) => res.body ?? []))
      .pipe(map((folders: IFolder[]) => this.folderService.addFolderToCollectionIfMissing(folders, this.editForm.get('folder')!.value)))
      .subscribe((folders: IFolder[]) => (this.foldersSharedCollection = folders));
  }

  protected createFromForm(): IFile {
    return {
      ...new File(),
      id: this.editForm.get(['id'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      descripcion: this.editForm.get(['descripcion'])!.value,
      estado: this.editForm.get(['estado'])!.value,
      folder: this.editForm.get(['folder'])!.value,
    };
  }
}
