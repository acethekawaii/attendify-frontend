import { Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MainLayout } from './layout/main-layout/main-layout';
import { syncHomeHead } from './features/home/home-document';

@Component({
  selector: 'app-root',
  imports: [MainLayout],
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        const path = event.urlAfterRedirects.split(/[?#]/)[0];
        syncHomeHead(this.document, path === '/' || path === '');
      });
  }
}
