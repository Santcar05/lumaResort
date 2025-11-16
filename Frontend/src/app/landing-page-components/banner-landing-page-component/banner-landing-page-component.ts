import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-banner-landing-page-component',
  imports: [TranslateModule, RouterModule],
  templateUrl: './banner-landing-page-component.html',
  styleUrl: './banner-landing-page-component.css',
})
export class BannerLandingPageComponent {}
