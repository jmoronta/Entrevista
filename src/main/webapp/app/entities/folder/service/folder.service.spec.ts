import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFolder, Folder } from '../folder.model';

import { FolderService } from './folder.service';

describe('Folder Service', () => {
  let service: FolderService;
  let httpMock: HttpTestingController;
  let elemDefault: IFolder;
  let expectedResult: IFolder | IFolder[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FolderService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nombre: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Folder', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Folder()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Folder', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nombre: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Folder', () => {
      const patchObject = Object.assign(
        {
          nombre: 'BBBBBB',
        },
        new Folder()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Folder', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nombre: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Folder', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFolderToCollectionIfMissing', () => {
      it('should add a Folder to an empty array', () => {
        const folder: IFolder = { id: 123 };
        expectedResult = service.addFolderToCollectionIfMissing([], folder);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(folder);
      });

      it('should not add a Folder to an array that contains it', () => {
        const folder: IFolder = { id: 123 };
        const folderCollection: IFolder[] = [
          {
            ...folder,
          },
          { id: 456 },
        ];
        expectedResult = service.addFolderToCollectionIfMissing(folderCollection, folder);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Folder to an array that doesn't contain it", () => {
        const folder: IFolder = { id: 123 };
        const folderCollection: IFolder[] = [{ id: 456 }];
        expectedResult = service.addFolderToCollectionIfMissing(folderCollection, folder);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(folder);
      });

      it('should add only unique Folder to an array', () => {
        const folderArray: IFolder[] = [{ id: 123 }, { id: 456 }, { id: 91287 }];
        const folderCollection: IFolder[] = [{ id: 123 }];
        expectedResult = service.addFolderToCollectionIfMissing(folderCollection, ...folderArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const folder: IFolder = { id: 123 };
        const folder2: IFolder = { id: 456 };
        expectedResult = service.addFolderToCollectionIfMissing([], folder, folder2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(folder);
        expect(expectedResult).toContain(folder2);
      });

      it('should accept null and undefined values', () => {
        const folder: IFolder = { id: 123 };
        expectedResult = service.addFolderToCollectionIfMissing([], null, folder, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(folder);
      });

      it('should return initial array if no Folder is added', () => {
        const folderCollection: IFolder[] = [{ id: 123 }];
        expectedResult = service.addFolderToCollectionIfMissing(folderCollection, undefined, null);
        expect(expectedResult).toEqual(folderCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
