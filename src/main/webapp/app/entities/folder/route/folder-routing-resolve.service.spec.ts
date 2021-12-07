jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IFolder, Folder } from '../folder.model';
import { FolderService } from '../service/folder.service';

import { FolderRoutingResolveService } from './folder-routing-resolve.service';

describe('Folder routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: FolderRoutingResolveService;
  let service: FolderService;
  let resultFolder: IFolder | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(FolderRoutingResolveService);
    service = TestBed.inject(FolderService);
    resultFolder = undefined;
  });

  describe('resolve', () => {
    it('should return IFolder returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFolder = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFolder).toEqual({ id: 123 });
    });

    it('should return new IFolder if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFolder = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultFolder).toEqual(new Folder());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Folder })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFolder = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFolder).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
