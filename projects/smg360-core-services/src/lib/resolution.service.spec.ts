import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { Resolutions } from './enums/resolutions.enum';

import { ResolutionService } from './resolution.service';

describe('ResolutionService', () => {
  let service: ResolutionService;
  let _$window={innerWidth:0};
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        {provide:'Window',useValue:_$window}
       ]
    });
    service = TestBed.inject(ResolutionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  
  it('should have been initialized',
  function () {
      expect( service).toBeDefined();
  });

  describe('should set resolution to ',function(){
      it('Desktop',function(){
          _$window.innerWidth = 1024;
          expect(service.Get()).toBe(Resolutions.Desktop);
      });
  });
  describe('should set resolution to ',function(){
      it('Mobile',function(){
          _$window.innerWidth = 320;
          expect(service.Get()).toBe(Resolutions.Mobile);
      });
  });
  describe('should set resolution to ',function(){
      it('Phablet',function(){
          _$window.innerWidth = 480;
          expect(service.Get()).toBe(Resolutions.Phablet);
      });
  });
  describe('should set resolution to ',function(){
      it('Tablet',function(){
          _$window.innerWidth = 768;
          expect(service.Get()).toBe(Resolutions.Tablet);
      });
  });
  describe('should set resolution to ',function(){
      it('LargeDesktop',function(){
          _$window.innerWidth = 1025;
          expect(service.Get()).toBe(Resolutions.LargeDesktop);
      });
  });

});
