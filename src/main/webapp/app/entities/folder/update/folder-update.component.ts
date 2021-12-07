import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IFolder, Folder } from '../folder.model';
import { FolderService } from '../service/folder.service';

@Component({
  selector: 'jhi-folder-update',
  templateUrl: './folder-update.component.html',
})
export class FolderUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nombre: [],
  });

  constructor(protected folderService: FolderService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ folder }) => {
      this.updateForm(folder);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const folder = this.createFromForm();
    if (folder.id !== undefined) {
      this.subscribeToSaveResponse(this.folderService.update(folder));
    } else {
      this.subscribeToSaveResponse(this.folderService.create(folder));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFolder>>): void {
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

  protected updateForm(folder: IFolder): void {
    this.editForm.patchValue({
      id: folder.id,
      nombre: folder.nombre,
    });
  }

  protected createFromForm(): IFolder {
    return {
      ...new Folder(),
      id: this.editForm.get(['id'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
    };
  }
}
