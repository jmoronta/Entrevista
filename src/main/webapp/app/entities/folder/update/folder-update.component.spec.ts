jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FolderService } from '../service/folder.service';
import { IFolder, Folder } from '../folder.model';

import { FolderUpdateComponent } from './folder-update.component';

describe('Folder Management Update Component', () => {
  let comp: FolderUpdateComponent;
  let fixture: ComponentFixture<FolderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let folderService: FolderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FolderUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(FolderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FolderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    folderService = TestBed.inject(FolderService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const folder: IFolder = { id: 456 };

      activatedRoute.data = of({ folder });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(folder));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Folder>>();
      const folder = { id: 123 };
      jest.spyOn(folderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ folder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: folder }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(folderService.update).toHaveBeenCalledWith(folder);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Folder>>();
      const folder = new Folder();
      jest.spyOn(folderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ folder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: folder }));
      saveSubject.complete();

      // THEN
      expect(folderService.create).toHaveBeenCalledWith(folder);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Folder>>();
      const folder = { id: 123 };
      jest.spyOn(folderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ folder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(folderService.update).toHaveBeenCalledWith(folder);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
