import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFolder } from '../folder.model';
import { FolderService } from '../service/folder.service';

@Component({
  templateUrl: './folder-delete-dialog.component.html',
})
export class FolderDeleteDialogComponent {
  folder?: IFolder;

  constructor(protected folderService: FolderService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.folderService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
