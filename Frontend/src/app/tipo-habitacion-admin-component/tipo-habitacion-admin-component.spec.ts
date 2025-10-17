import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoHabitacionAdminComponent } from './tipo-habitacion-admin-component';

describe('TipoHabitacionAdminComponent', () => {
  let component: TipoHabitacionAdminComponent;
  let fixture: ComponentFixture<TipoHabitacionAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoHabitacionAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoHabitacionAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
