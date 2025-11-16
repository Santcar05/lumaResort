import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AutoTranslateService {
  // Usar TU backend como proxy
  private apiUrl = 'http://localhost:8080/api/translate';

  private cache = new Map<string, string>();

  constructor(private http: HttpClient) {}

  translate(text: string, targetLang: string): Observable<string> {
    if (targetLang === 'es' || !text || text.trim() === '') {
      return of(text);
    }

    const cacheKey = `${text}_${targetLang}`;
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey)!);
    }

    // Construir parámetros
    const params = new HttpParams()
      .set('q', text)
      .set('langpair', `es|${targetLang}`)
      .set('de', 'info@lumaresort.com');

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map((response) => {
        // MyMemory devuelve el JSON como string, parsearlo
        const data = typeof response === 'string' ? JSON.parse(response) : response;

        if (data && data.responseData && data.responseData.translatedText) {
          const translatedText = data.responseData.translatedText;
          this.cache.set(cacheKey, translatedText);
          return translatedText;
        }
        return text;
      }),
      catchError((error) => {
        console.warn('Error en traducción, mostrando texto original:', error.message);
        return of(text);
      })
    );
  }

  clearCache(): void {
    this.cache.clear();
  }
}
