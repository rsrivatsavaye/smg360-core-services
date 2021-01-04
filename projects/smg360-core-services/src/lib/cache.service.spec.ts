import { TestBed } from '@angular/core/testing';

import { CacheService } from './cache.service';
import { CacheType } from './enums/cacheType.enum';

describe("Service: CacheService", () => {

  var cacheService;

  const cacheKey = "jasmine-test-cache-account";
  const cacheType = CacheType.Account;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    cacheService = TestBed.inject(CacheService);
  });

  beforeEach(() => {
    cacheService.clearAll();
  });

  describe("Initial State", () => {

    it("should be defined", () => {
      expect(cacheService).toBeDefined();
    });

    it("should have method to get cache", () => {
      expect(cacheService.get).toBeDefined();
      expect(cacheService.get).toEqual(jasmine.any(Function));
    });

    it("should have method to set cache", () => {
      expect(cacheService.set).toBeDefined();
      expect(cacheService.set).toEqual(jasmine.any(Function));
    });

    it("should have method to clear cache", () => {
      expect(cacheService.clear).toBeDefined();
      expect(cacheService.clear).toEqual(jasmine.any(Function));
    });

    it("should have method to clearAll cache", () => {
      expect(cacheService.clearAll).toBeDefined();
      expect(cacheService.clearAll).toEqual(jasmine.any(Function));
    });

    it("should have method to getCacheKey cache", () => {
      expect(cacheService.getCacheKey).toBeDefined();
      expect(cacheService.getCacheKey).toEqual(jasmine.any(Function));
    });

  });

  describe("Can Clear All Cache", () => {
    it("should clear all caches", () => {
      const testValue = "Hello CacheService";
      const anotherCacheType = CacheType.Unit;
      const anotherCacheKey = "jasmine-test-cache-unit";
      const anotherTestValue = "Hello Unit in Cache";

      cacheService.set(cacheType, cacheKey, testValue);
      cacheService.set(anotherCacheType, anotherCacheKey, anotherTestValue);

      let cachedItem = cacheService.get(cacheType, cacheKey);
      expect(cachedItem).toEqual(testValue);
      let anotherCachedItem = cacheService.get(anotherCacheType, anotherCacheKey);
      expect(anotherCachedItem).toEqual(anotherTestValue);

      cacheService.clearAll();

      cachedItem = cacheService.get(cacheType, cacheKey);
      expect(cachedItem).not.toBeDefined();

      anotherCachedItem = cacheService.get(anotherCacheType, anotherCacheKey);
      expect(anotherCachedItem).not.toBeDefined();
    });

  });

  describe("Can Clear Cache", () => {

    it("should clear the cache for requested cacheType", () => {
      const testValue = "Hello CacheService";

      cacheService.set(cacheType, cacheKey, testValue);
      let cachedItem = cacheService.get(cacheType, cacheKey);
      expect(cachedItem).toEqual(testValue);

      cacheService.clear(cacheType);
      cachedItem = cacheService.get(cacheType, cacheKey);

      expect(cachedItem).not.toBeDefined();
    });

    it("should not clear the cache for different cacheTypes", () => {
      const testValue = "Hello CacheService";
      const anotherCacheType = CacheType.Unit;
      const anotherCacheKey = "jasmine-test-cache-unit";
      const anotherTestValue = "Hello Unit in Cache";

      cacheService.set(cacheType, cacheKey, testValue);
      cacheService.set(anotherCacheType, anotherCacheKey, anotherTestValue);

      let cachedItem = cacheService.get(cacheType, cacheKey);
      expect(cachedItem).toEqual(testValue);
      let anotherCachedItem = cacheService.get(anotherCacheType, anotherCacheKey);
      expect(anotherCachedItem).toEqual(anotherTestValue);

      cacheService.clear(cacheType);
      cachedItem = cacheService.get(cacheType, cacheKey);
      expect(cachedItem).not.toBeDefined();

      anotherCachedItem = cacheService.get(anotherCacheType, anotherCacheKey);
      expect(anotherCachedItem).toEqual(anotherTestValue);
    });

  });

  describe("Can Set Cache", () => {

    it("should set value in cache", () => {
      const testValue = "Hello CacheService";

      cacheService.set(cacheType, cacheKey, testValue);
      const cachedItem = cacheService.get(cacheType, cacheKey);

      expect(cachedItem).toEqual(testValue);
    });

    it("should update cache when cacheKey already exist", () => {
      const testValue = "Hello CacheService";
      const anotherTestValue = "Goodbye CacheService";

      cacheService.set(cacheType, cacheKey, testValue);

      let cachedItem = cacheService.get(cacheType, cacheKey);
      expect(cachedItem).toEqual(testValue);

      cacheService.set(cacheType, cacheKey, anotherTestValue);

      cachedItem = cacheService.get(cacheType, cacheKey);
      expect(cachedItem).toEqual(anotherTestValue);
    });

    it("should not overwrite existing cache when it already exist", () => {
      const testValue = "Hello CacheService";
      const anotherTestValue = "Goodbye CacheService";
      const anotherCacheKey = "jasmine-test-cache-another-account";

      cacheService.set(cacheType, cacheKey, testValue);

      let cachedItem = cacheService.get(cacheType, cacheKey);
      expect(cachedItem).toEqual(testValue);

      cacheService.set(cacheType, anotherCacheKey, anotherTestValue);

      cachedItem = cacheService.get(cacheType, cacheKey);
      expect(cachedItem).toEqual(testValue);

      cachedItem = cacheService.get(cacheType, anotherCacheKey);
      expect(cachedItem).toEqual(anotherTestValue);
    });

  });

  describe("Can Get Cache", () => {
    it("should return null when cache does not exist", () => {
      const cachedItem = cacheService.get(cacheType, cacheKey);

      expect(cachedItem).not.toBeDefined();
    });

    it("should return undefined when cache exist and cacheKey does not exist", () => {
      cacheService.clear(cacheType);

      const cachedItem = cacheService.get(cacheType, cacheKey);

      expect(cachedItem).not.toBeDefined();
    });
  });

  describe("Can create a has key", () => {

    it("should generate a hashkey value", () => {
      const mockReportRequest = {
        "reportId": "5894efd05694d8e2052d5212",
        "dateRange": {
          "startDate": "2017-08-27T05:00:00.000Z",
          "endDate": "2018-01-28T05:59:59.999Z",
          "benchmarkStartDate": "2017-08-27T05:00:00.000Z",
          "benchmarkEndDate": "2017-12-31T05:59:59.999Z"
        },
        "grouping": {},
        "filters": {},
        "sourceOffsets": [
          {
            "sourceId": "5894d2665694d8e2052d518f",
            "offset": 0
          },
          {
            "sourceId": "59246ef1f82078112074cc79",
            "offset": 0
          },
          {
            "sourceId": "5963e53900582a11547c023e",
            "offset": 0
          }
        ],
        "filter": {
          "sources": [
            "5894d2665694d8e2052d518f",
            "59246ef1f82078112074cc79",
            "5963e53900582a11547c023e"
          ]
        },
        "joins": {},
        "cardId": "5894f2e15694d8e2052d5215",
        "text": "",
        "sortBy": 1,
        "toLanguage": "en-us",
        "requestedAggregations": [
          "CommentsPerSource",
          "ResponsesPerSource",
          "SocialReviewsPerSite",
          "CommentSentimentTotals",
          "TopThemes"
        ]
      };

      const generatedCacheKey = cacheService.getCacheKey(mockReportRequest);

      expect(generatedCacheKey).toEqual(-35070696);
    });

    it("should generate a hashkey value", () => {
      const mockReportRequest = {
        "reportId": "5894efd05694d8e2052d5212",
        "dateRange": {
          "startDate": "2017-08-27T05:00:00.000Z",
          "endDate": "2018-01-28T05:59:59.999Z",
          "benchmarkStartDate": "2017-08-27T05:00:00.000Z",
          "benchmarkEndDate": "2017-12-31T05:59:59.999Z"
        },
        "grouping": {},
        "filters": {},
        "sourceOffsets": [
          {
            "sourceId": "5894d2665694d8e2052d518f",
            "offset": 0
          },
          {
            "sourceId": "59246ef1f82078112074cc79",
            "offset": 0
          },
          {
            "sourceId": "5963e53900582a11547c023e",
            "offset": 0
          }
        ],
        "filter": {
          "sources": [
            "59246ef1f82078112074cc79",
            "5894d2665694d8e2052d518f",
            "5963e53900582a11547c023e"
          ]
        },
        "joins": {},
        "cardId": "5894f2e15694d8e2052d5215",
        "text": "",
        "sortBy": 1,
        "toLanguage": "en-us",
        "requestedAggregations": [
          "ResponsesPerSource",
          "TopThemes"
        ]
      };

      const generatedCacheKey = cacheService.getCacheKey(mockReportRequest);

      expect(generatedCacheKey).toEqual(-157464099);
    });

  });

});
;
