import { TestBed } from '@angular/core/testing';
import { Analytics } from 'dist/smg360-core-services/public-api';
import { PendoAnalyticsService } from './pendo-analytics.service'

describe('PendoAnalyticsService', () => {
  let pendoService: PendoAnalyticsService;
  let dimension: Analytics;
  let pendo = {
    initialize: jasmine.createSpy()
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: []
    });
    pendoService = TestBed.inject(PendoAnalyticsService);
    dimension = {
      accountId: "accountId",
      accountName: "accountName",
      accountStatus: true,
      accountType: 1,
      groupId: "101",
      groupName: "Group101",
      userId: "userId"
    } as Analytics;

    window['pendo'] = pendo;
  });

  it('should be created', () => {
    // Assert
    expect(pendoService).toBeTruthy();
  });

  it('should initialize', () => {
    // Act
    pendoService.init(dimension);
    // Assert
    expect(pendo.initialize).toHaveBeenCalled();
  });

  it('should not return page data in callback when there is no page defined', () => {
    // Act
    pendoService.init(dimension);
    let callback = pendo.initialize.calls.mostRecent().args[0].location.transforms[0].data;
    // Assert
    expect(callback()).toBeUndefined();
  });

  it('should return page data in callback when there is no page defined', () => {
    // Arrange
    pendoService.page = 'mock_page';
    // Act
    pendoService.init(dimension);
    let callback = pendo.initialize.calls.mostRecent().args[0].location.transforms[0].data;
    // Assert
    expect(callback()).toBeDefined();
    expect(callback().page).toBe('mock_page');
  });
});
