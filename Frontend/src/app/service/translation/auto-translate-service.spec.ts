import { TestBed } from '@angular/core/testing';

import { AutoTranslateService } from './auto-translate-service';

describe('AutoTranslateService', () => {
  let service: AutoTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoTranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
