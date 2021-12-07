import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FolderDetailComponent } from './folder-detail.component';

describe('Folder Management Detail Component', () => {
  let comp: FolderDetailComponent;
  let fixture: ComponentFixture<FolderDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FolderDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ folder: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FolderDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FolderDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load folder on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.folder).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
