import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerLandingPageComponent } from './banner-landing-page-component';

describe('BannerLandingPageComponent', () => {
  let component: BannerLandingPageComponent;
  let fixture: ComponentFixture<BannerLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerLandingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
