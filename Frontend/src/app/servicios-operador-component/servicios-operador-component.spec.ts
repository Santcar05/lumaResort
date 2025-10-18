import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosOperadorComponent } from './servicios-operador-component';

describe('ServiciosOperadorComponent', () => {
  let component: ServiciosOperadorComponent;
  let fixture: ComponentFixture<ServiciosOperadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosOperadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiciosOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
