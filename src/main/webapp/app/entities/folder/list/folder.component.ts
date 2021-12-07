import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFolder } from '../folder.model';
import { FolderService } from '../service/folder.service';
import { FolderDeleteDialogComponent } from '../delete/folder-delete-dialog.component';

@Component({
  selector: 'jhi-folder',
  templateUrl: './folder.component.html',
})
export class FolderComponent implements OnInit {
  folders?: IFolder[];
  isLoading = false;

  constructor(protected folderService: FolderService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.folderService.query().subscribe(
      (res: HttpResponse<IFolder[]>) => {
        this.isLoading = false;
        this.folders = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFolder): number {
    return item.id!;
  }

  delete(folder: IFolder): void {
    const modalRef = this.modalService.open(FolderDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.folder = folder;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
