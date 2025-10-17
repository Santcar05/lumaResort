import { TestBed } from '@angular/core/testing';

import { CRUDServiciosService } from './crudservicios-service';

describe('CRUDServiciosService', () => {
  let service: CRUDServiciosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CRUDServiciosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
