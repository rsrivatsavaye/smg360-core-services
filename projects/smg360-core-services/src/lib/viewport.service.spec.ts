import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MockProvider } from 'ng-mocks';
import { ResolutionService } from './resolution.service';
import { ViewService } from './view.service';

import { ViewportService } from './viewport.service';

describe('ViewportService', () => {
  let service: ViewportService;
  let viewService: ViewService;
  let resolutionService: ResolutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ResolutionService),
        MockProvider(Router)
      ]
    });
    service = TestBed.inject(ViewportService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', function () {
    it('should be defined', function () {
      expect(service).toBeDefined();
    });

    it('should have method to check if sidebar is expanded', function () {
      expect(service.checkSidebarExpanded).toBeDefined();
      expect(service.checkSidebarExpanded).toEqual(jasmine.any(Function));
    });
  });

  describe('checkSidebarExpanded function', function () {
    describe('and not toggled', function () {
      beforeEach(function () {
        if (document.querySelectorAll('.viewport-wrapper').length == 0) {
          var elem = document.createElement("div");
          elem.classList.add('viewport-wrapper');
          document.body.append(elem);
        }
        document.querySelector('.viewport-wrapper').classList.remove('toggled');
        service.resolution = null;
        resolutionService = TestBed.inject(ResolutionService);
      });

      it('should return false if mobile and not toggled', function () {
        spyOn(resolutionService, 'Get').and.returnValue(0);
        expect(service.checkSidebarExpanded()).toEqual(false);

      });
      it('should return false if phablet and not toggled', function () {
        spyOn(resolutionService, 'Get').and.returnValue(1);
        expect(service.checkSidebarExpanded()).toEqual(false);

      });
      it('should return false if tablet and not toggled', function () {
        spyOn(resolutionService, 'Get').and.returnValue(2);
        expect(service.checkSidebarExpanded()).toEqual(false);

      });
      it('should return true if desktop and not toggled', function () {
        spyOn(resolutionService, 'Get').and.returnValue(3);
        expect(service.checkSidebarExpanded()).toEqual(true);

      });
      it('should return true if large desktop and not toggled', function () {
        spyOn(resolutionService, 'Get').and.returnValue(4);
        expect(service.checkSidebarExpanded()).toEqual(true);
      });
    });
        describe('and toggled', function () {
            afterEach(function(){
                var ele = document.getElementById('testid');
                if(ele){
                  ele.parentElement.removeChild(ele);
                }
            })
            beforeEach(function () {
              if (document.querySelectorAll('.viewport-wrapper').length == 0) {
                var elem = document.createElement("div");
                elem.classList.add('viewport-wrapper');
                document.body.append(elem);
              }
                document.querySelector('.viewport-wrapper').classList.add('toggled');
                service.resolution = null;
                resolutionService = TestBed.inject(ResolutionService);
            });
            it('should return false if mobile and toggled', function () {
                spyOn(resolutionService, 'Get').and.returnValue(0);
                expect(service.checkSidebarExpanded()).toEqual(true);

            });
            it('should return false if phablet and toggled', function () {
                spyOn(resolutionService, 'Get').and.returnValue(1);
                expect(service.checkSidebarExpanded()).toEqual(true);

            });
            it('should return false if tablet and toggled', function () {
                spyOn(resolutionService, 'Get').and.returnValue(2);
                expect(service.checkSidebarExpanded()).toEqual(true);

            });
            it('should return false if desktop and toggled', function () {
                spyOn(resolutionService, 'Get').and.returnValue(3);
                expect(service.checkSidebarExpanded()).toEqual(false);

            });
            it('should return false if large desktop and toggled', function () {
                spyOn(resolutionService, 'Get').and.returnValue(4);
                expect(service.checkSidebarExpanded()).toEqual(false);

            });
        });
  });

  describe('SideBarToggled broadcast', function () {
      beforeEach(function () {
        if (document.querySelectorAll('.viewport-wrapper').length == 0) {
          var elem = document.createElement("div");
          elem.classList.add('viewport-wrapper');
          document.body.append(elem);
        }
          document.querySelector('.viewport-wrapper').classList.remove('toggled');
          service.resolution = null;
          resolutionService = TestBed.inject(ResolutionService);
      });

      it('should broadcast event', function () {
          spyOn(resolutionService, 'Get').and.returnValues(1, 0);
        spyOn(document,"dispatchEvent").and.callFake(()=>true)
          service.checkForResolutionChangeTransition();

          expect(document.dispatchEvent).toHaveBeenCalledTimes(1);
          var event = new CustomEvent("SideBarToggled", { detail: { isExpanded:false } });
          expect(document.dispatchEvent).toHaveBeenCalledWith(event)
      });
  });

  describe("showRawEmailContent", () => {
      it("should call the subscribed function and assign the correct values", () => {
          let localName = "";
          let localData = "";
          const caseKey = "caseKey";
          const emailMessageKey = "emailMessageKey";
          const func = (param) => {
              localName = param.eventName;
              localData = param.value;
          };
          service.subscribeToViewportChanges(func);
          service.showRawEmailContent(caseKey, emailMessageKey);
          expect(localName).toBe("showRawEmailContent");
      });
  });

  describe("hideRawEmailContent", () => {
      it("should call the subscribed function and assign the correct values", () => {
          let localName = "";
          let localData = "";
          const func = (param) => {
              localName = param.eventName;
              localData = param.value;
          };
          service.subscribeToViewportChanges(func);
          service.hideRawEmailContent();
          expect(localName).toBe("showRawEmailContent");
      });
  });

});
