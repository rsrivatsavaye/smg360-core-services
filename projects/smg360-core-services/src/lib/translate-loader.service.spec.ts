import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TranslateLoaderService } from './translate-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';
import { PartialTranslateLoaderService } from './partial-translate-loader.service';

describe('TranslateLoaderService', () => {
  let service: TranslateLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MockProvider(TranslateService),
        MockProvider(PartialTranslateLoaderService),
      ]
    });
    service = TestBed.inject(TranslateLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
