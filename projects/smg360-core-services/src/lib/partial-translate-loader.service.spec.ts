import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PartialTranslateLoaderService } from './partial-translate-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';

describe('PartialtranslateLoaderService', () => {
  let service: PartialTranslateLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
      MockProvider(TranslateService)
      ]
    });
    service = TestBed.inject(PartialTranslateLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
