import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperadorPasarelaPagosComponent } from './operador-pasarela-pagos-component';

describe('OperadorPasarelaPagosComponent', () => {
  let component: OperadorPasarelaPagosComponent;
  let fixture: ComponentFixture<OperadorPasarelaPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperadorPasarelaPagosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperadorPasarelaPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
