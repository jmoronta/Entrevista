import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFolder } from '../folder.model';

@Component({
  selector: 'jhi-folder-detail',
  templateUrl: './folder-detail.component.html',
})
export class FolderDetailComponent implements OnInit {
  folder: IFolder | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ folder }) => {
      this.folder = folder;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
