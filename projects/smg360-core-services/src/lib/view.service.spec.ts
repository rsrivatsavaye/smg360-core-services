import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MockProvider } from 'ng-mocks';
import { Views } from './enums/views.enum';

import { ViewService } from './view.service';

describe('ViewService', () => {
  let service: ViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(Router)]
    });
    service = TestBed.inject(ViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('service default mode', function () {
    it('should return full mode', function () {
      var defaultMode = service.getMode();
      expect(defaultMode).not.toBeNull();
      expect(defaultMode).toEqual(Views.Full);
    });
  });
  describe('for pod view', function () {
    beforeEach(()=>{
      service.setMode(Views.Pod);
    });

    it('should return pod features', function () {
      var ret = service.getCurrentViewFeatures();

      expect(ret).not.toBeNull();
      expect(ret.leftMenu).toBe(false);
      expect(ret.topMenu).toBe(false);
      expect(ret.banner).toBe(false);
      expect(ret.commentAggregate).toBe(false);
      expect(ret.commentPadding).toBe(false);
      expect(ret.commentHeader).toBe(false);
      expect(ret.commentTitle).toBe(true);
      expect(ret.showFooter).toBe(true);
      expect(ret.commentInfiniteScroll).toBe(false);
      expect(ret.timeoutDialog).toBe(false);
      expect(ret.search).toBe(false);
      expect(ret.commentTAPods).toBe(false);
      expect(ret.configButton).toBe(false);
      expect(ret.commentFilter).toBe(false);
      expect(ret.commentFilterClose).toBe(false);
      expect(ret.dynamicWidth).toBe(true);
      expect(ret.redirectToClassicReportingSite).toBe(true);
      expect(ret.interactiveDetails).toBe(false);
      expect(ret.facetBar).toBe(false);
    });
  });
  describe('for embedded view', function () {

    beforeEach(()=>{
      service.setMode(Views.Embedded);
    });

    it('should return embedded features', function () {
        var ret = service.getCurrentViewFeatures();

        expect(ret).not.toBeNull();
        expect(ret.leftMenu).toBe(false);
        expect(ret.topMenu).toBe(false);
        expect(ret.banner).toBe(false);
        expect(ret.commentAggregate).toBe(true);
        expect(ret.commentPadding).toBe(true);
        expect(ret.commentHeader).toBe(true);
        expect(ret.commentTitle).toBe(false);
        expect(ret.showFooter).toBe(false);
        expect(ret.commentInfiniteScroll).toBe(true);
        expect(ret.timeoutDialog).toBe(false);
        expect(ret.search).toBe(true);
        expect(ret.commentTAPods).toBe(true);
        expect(ret.configButton).toBe(false);
        expect(ret.commentFilter).toBe(true);
        expect(ret.commentFilterClose).toBe(true);
        expect(ret.dynamicWidth).toBe(false);
        expect(ret.redirectToClassicReportingSite).toBe(true);
        expect(ret.interactiveDetails).toBe(true);
        expect(ret.facetBar).toBe(true);
    });
});

describe('for full view', function () {

    it('should return full features', function () {
        var ret = service.getCurrentViewFeatures();

        expect(ret).not.toBeNull();
        expect(ret.leftMenu).toBe(true);
        expect(ret.topMenu).toBe(true);
        expect(ret.banner).toBe(true);
        expect(ret.commentAggregate).toBe(true);
        expect(ret.commentPadding).toBe(true);
        expect(ret.commentHeader).toBe(true);
        expect(ret.commentTitle).toBe(false);
        expect(ret.showFooter).toBe(false);
        expect(ret.commentInfiniteScroll).toBe(true);
        expect(ret.timeoutDialog).toBe(true);
        expect(ret.search).toBe(true);
        expect(ret.commentTAPods).toBe(true);
        expect(ret.configButton).toBe(true);
        expect(ret.commentFilter).toBe(false);
        expect(ret.commentFilterClose).toBe(false);
        expect(ret.dynamicWidth).toBe(true);
        expect(ret.redirectToClassicReportingSite).toBe(false);
        expect(ret.interactiveDetails).toBe(true);
        expect(ret.facetBar).toBe(true);
    });
});

});
