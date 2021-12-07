import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFolder, getFolderIdentifier } from '../folder.model';

export type EntityResponseType = HttpResponse<IFolder>;
export type EntityArrayResponseType = HttpResponse<IFolder[]>;

@Injectable({ providedIn: 'root' })
export class FolderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/folders');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(folder: IFolder): Observable<EntityResponseType> {
    return this.http.post<IFolder>(this.resourceUrl, folder, { observe: 'response' });
  }

  update(folder: IFolder): Observable<EntityResponseType> {
    return this.http.put<IFolder>(`${this.resourceUrl}/${getFolderIdentifier(folder) as number}`, folder, { observe: 'response' });
  }

  partialUpdate(folder: IFolder): Observable<EntityResponseType> {
    return this.http.patch<IFolder>(`${this.resourceUrl}/${getFolderIdentifier(folder) as number}`, folder, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFolder>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFolder[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFolderToCollectionIfMissing(folderCollection: IFolder[], ...foldersToCheck: (IFolder | null | undefined)[]): IFolder[] {
    const folders: IFolder[] = foldersToCheck.filter(isPresent);
    if (folders.length > 0) {
      const folderCollectionIdentifiers = folderCollection.map(folderItem => getFolderIdentifier(folderItem)!);
      const foldersToAdd = folders.filter(folderItem => {
        const folderIdentifier = getFolderIdentifier(folderItem);
        if (folderIdentifier == null || folderCollectionIdentifiers.includes(folderIdentifier)) {
          return false;
        }
        folderCollectionIdentifiers.push(folderIdentifier);
        return true;
      });
      return [...foldersToAdd, ...folderCollection];
    }
    return folderCollection;
  }
}
