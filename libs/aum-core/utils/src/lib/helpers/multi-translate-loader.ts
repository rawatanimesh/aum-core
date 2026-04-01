import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface TranslationSource {
  prefix: string;
  suffix: string;
}

export class MultiTranslateHttpLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    private sources: TranslationSource[]
  ) {}

  getTranslation(lang: string): Observable<Record<string, unknown>> {
    const requests = this.sources.map(({ prefix, suffix }) =>
      this.http.get<Record<string, unknown>>(`${prefix}${lang}${suffix}`)
    );
    return forkJoin(requests).pipe(
      map((responses) => Object.assign({}, ...responses))
    );
  }
}
