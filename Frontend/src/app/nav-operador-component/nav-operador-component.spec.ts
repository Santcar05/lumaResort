import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavOperadorComponent } from './nav-operador-component';

describe('NavOperadorComponent', () => {
  let component: NavOperadorComponent;
  let fixture: ComponentFixture<NavOperadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavOperadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
