import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../generales-components/header-component/header-component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-video-testimonials',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TranslateModule],
  templateUrl: './video-testimonials.component.html',
  styleUrls: ['./video-testimonials.component.css'],
})
export class VideoTestimonialsComponent {}
