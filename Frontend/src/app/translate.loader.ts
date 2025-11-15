import { HttpClient } from '@angular/common/http';
import { CustomTranslateLoader } from './custom-translate-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new CustomTranslateLoader(http);
}
