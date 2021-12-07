import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'folder',
        data: { pageTitle: 'toDoensolversApp.folder.home.title' },
        loadChildren: () => import('./folder/folder.module').then(m => m.FolderModule),
      },
      {
        path: 'file',
        data: { pageTitle: 'toDoensolversApp.file.home.title' },
        loadChildren: () => import('./file/file.module').then(m => m.FileModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
