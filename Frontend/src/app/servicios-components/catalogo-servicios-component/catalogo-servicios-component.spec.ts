import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoServiciosComponent } from './catalogo-servicios-component';

describe('CatalogoServiciosComponent', () => {
  let component: CatalogoServiciosComponent;
  let fixture: ComponentFixture<CatalogoServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogoServiciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
