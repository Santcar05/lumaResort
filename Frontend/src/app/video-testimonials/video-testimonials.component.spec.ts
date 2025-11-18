import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoTestimonialsComponent } from './video-testimonials.component';

describe('VideoTestimonialsComponent', () => {
  let component: VideoTestimonialsComponent;
  let fixture: ComponentFixture<VideoTestimonialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoTestimonialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoTestimonialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
