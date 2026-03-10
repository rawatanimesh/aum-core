// breadcrumb.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BreadcrumbItem } from './breadcrumb';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private breadcrumbSubject = new BehaviorSubject<BreadcrumbItem[]>([]);
  breadcrumbs$ = this.breadcrumbSubject.asObservable();

  setBreadcrumbs(breadcrumbs: BreadcrumbItem[]): void {
    this.breadcrumbSubject.next(breadcrumbs);
  }

  clear(): void {
    this.breadcrumbSubject.next([]);
  }
}
