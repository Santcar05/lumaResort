import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetasDescubrimientoComponentComponent } from './tarjetas-descubrimiento-component.component';

describe('TarjetasDescubrimientoComponentComponent', () => {
  let component: TarjetasDescubrimientoComponentComponent;
  let fixture: ComponentFixture<TarjetasDescubrimientoComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetasDescubrimientoComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarjetasDescubrimientoComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
