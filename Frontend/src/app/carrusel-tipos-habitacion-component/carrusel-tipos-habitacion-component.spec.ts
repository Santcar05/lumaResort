import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarruselTiposHabitacionComponent } from './carrusel-tipos-habitacion-component';

describe('CarruselTiposHabitacionComponent', () => {
  let component: CarruselTiposHabitacionComponent;
  let fixture: ComponentFixture<CarruselTiposHabitacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarruselTiposHabitacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarruselTiposHabitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
