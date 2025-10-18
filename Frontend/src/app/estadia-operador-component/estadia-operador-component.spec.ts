import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadiaOperadorComponent } from './estadia-operador-component';

describe('EstadiaOperadorComponent', () => {
  let component: EstadiaOperadorComponent;
  let fixture: ComponentFixture<EstadiaOperadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadiaOperadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadiaOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
