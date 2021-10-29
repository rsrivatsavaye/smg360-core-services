import { TestBed } from '@angular/core/testing';
import { PendoAnalyticsService } from './pendo-analytics.service'

describe('PendoAnalyticsService', () => {
  let pendoService: PendoAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: []
    });
    pendoService = TestBed.inject(PendoAnalyticsService);
  });

  it('should be created', () => {
    expect(pendoService).toBeTruthy();
  });
});
