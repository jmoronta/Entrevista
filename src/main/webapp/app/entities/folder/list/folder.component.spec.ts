import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FolderService } from '../service/folder.service';

import { FolderComponent } from './folder.component';

describe('Folder Management Component', () => {
  let comp: FolderComponent;
  let fixture: ComponentFixture<FolderComponent>;
  let service: FolderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FolderComponent],
    })
      .overrideTemplate(FolderComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FolderComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FolderService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.folders?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
