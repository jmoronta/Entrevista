jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FileService } from '../service/file.service';
import { IFile, File } from '../file.model';
import { IFolder } from 'app/entities/folder/folder.model';
import { FolderService } from 'app/entities/folder/service/folder.service';

import { FileUpdateComponent } from './file-update.component';

describe('File Management Update Component', () => {
  let comp: FileUpdateComponent;
  let fixture: ComponentFixture<FileUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let fileService: FileService;
  let folderService: FolderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FileUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(FileUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FileUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fileService = TestBed.inject(FileService);
    folderService = TestBed.inject(FolderService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Folder query and add missing value', () => {
      const file: IFile = { id: 456 };
      const folder: IFolder = { id: 78667 };
      file.folder = folder;

      const folderCollection: IFolder[] = [{ id: 68499 }];
      jest.spyOn(folderService, 'query').mockReturnValue(of(new HttpResponse({ body: folderCollection })));
      const additionalFolders = [folder];
      const expectedCollection: IFolder[] = [...additionalFolders, ...folderCollection];
      jest.spyOn(folderService, 'addFolderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ file });
      comp.ngOnInit();

      expect(folderService.query).toHaveBeenCalled();
      expect(folderService.addFolderToCollectionIfMissing).toHaveBeenCalledWith(folderCollection, ...additionalFolders);
      expect(comp.foldersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const file: IFile = { id: 456 };
      const folder: IFolder = { id: 85794 };
      file.folder = folder;

      activatedRoute.data = of({ file });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(file));
      expect(comp.foldersSharedCollection).toContain(folder);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<File>>();
      const file = { id: 123 };
      jest.spyOn(fileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ file });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: file }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(fileService.update).toHaveBeenCalledWith(file);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<File>>();
      const file = new File();
      jest.spyOn(fileService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ file });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: file }));
      saveSubject.complete();

      // THEN
      expect(fileService.create).toHaveBeenCalledWith(file);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<File>>();
      const file = { id: 123 };
      jest.spyOn(fileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ file });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(fileService.update).toHaveBeenCalledWith(file);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackFolderById', () => {
      it('Should return tracked Folder primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackFolderById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
