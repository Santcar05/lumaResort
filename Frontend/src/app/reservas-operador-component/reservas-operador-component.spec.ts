import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasOperadorComponent } from './reservas-operador-component';

describe('ReservasOperadorComponent', () => {
  let component: ReservasOperadorComponent;
  let fixture: ComponentFixture<ReservasOperadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasOperadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservasOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
