import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  NgZone,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { map, merge, startWith, take } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { PageComponent } from '@aum/ui/layout';
import { TocComponent, TocSection } from '../toc/toc';

@Component({
  selector: 'demo-getting-started',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageComponent, RouterModule, Icon, MatTooltipModule, TranslateModule, TocComponent],
  templateUrl: './getting-started.html',
  styleUrl: './getting-started.scss',
})
export class GettingStarted implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngZone = inject(NgZone);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  @ViewChildren('section') sectionElements!: QueryList<ElementRef<HTMLElement>>;

  readonly activeId = signal('overview');
  readonly copiedId = signal<string | null>(null);
  readonly showBackToTop = computed(() => this.activeId() !== 'overview');

  // Recomputes on first translation load AND on subsequent language switches
  private readonly langChange = toSignal(
    merge(this.translate.onTranslationChange, this.translate.onLangChange).pipe(
      map(() => this.translate.currentLang),
      startWith('')
    ),
    { initialValue: '' }
  );
  readonly copyTooltips = computed(() => {
    this.langChange(); // reactive dependency
    const prefix = this.translate.instant('COPY_LINK_TO');
    // Guard: if translations aren't loaded yet, instant() returns the key itself
    if (prefix === 'COPY_LINK_TO') return new Map<string, string>();
    return new Map(this.sections.map((s) => [s.id, `${prefix} "${this.translate.instant(s.labelKey)}"`]));
  });

  readonly pageInfo = {
    breadcrumbs: [{ title: 'GETTING_STARTED', route: '/getting-started' }],
  };

  readonly sections: TocSection[] = [
    { id: 'overview',      labelKey: 'GS_OVERVIEW' },
    { id: 'prerequisites', labelKey: 'GS_PREREQUISITES' },
    { id: 'installation',  labelKey: 'GS_INSTALLATION' },
    { id: 'theme',         labelKey: 'GS_THEME' },
    { id: 'configure',     labelKey: 'GS_CONFIGURE' },
    { id: 'template',      labelKey: 'GS_TEMPLATE' },
    { id: 'i18n',          labelKey: 'GS_I18N' },
    { id: 'concepts',      labelKey: 'GS_CONCEPTS' },
    { id: 'components',    labelKey: 'GS_COMPONENTS' },
    { id: 'resources',     labelKey: 'GS_RESOURCES' },
  ];

  readonly componentGroups = [
    { icon: 'smart_button',  labelKey: 'GS_COMP_BUTTONS' },
    { icon: 'text_fields',   labelKey: 'GS_COMP_INPUTS' },
    { icon: 'check_box',     labelKey: 'GS_COMP_CHECKBOX' },
    { icon: 'radio_button_checked', labelKey: 'GS_COMP_RADIO' },
    { icon: 'arrow_drop_down_circle', labelKey: 'GS_COMP_SELECT' },
    { icon: 'calendar_today', labelKey: 'GS_COMP_DATEPICKER' },
    { icon: 'search',        labelKey: 'GS_COMP_AUTOCOMPLETE' },
    { icon: 'web_asset',     labelKey: 'GS_COMP_PAGE' },
    { icon: 'credit_card',   labelKey: 'GS_COMP_CARD' },
    { icon: 'menu',          labelKey: 'GS_COMP_SIDEMENU' },
    { icon: 'view_list',     labelKey: 'GS_COMP_MENULIST' },
    { icon: 'account_tree',  labelKey: 'GS_COMP_BREADCRUMB' },
    { icon: 'check_circle',  labelKey: 'GS_COMP_DIALOG_CONFIRM' },
    { icon: 'open_in_new',   labelKey: 'GS_COMP_DIALOG_GENERIC' },
    { icon: 'notifications',   labelKey: 'GS_COMP_SNACKBAR' },
    { icon: 'upload',          labelKey: 'GS_COMP_UPLOAD' },
    { icon: 'interests',       labelKey: 'GS_COMP_ICON' },
    { icon: 'toggle_on',       labelKey: 'GS_COMP_BUTTON_TOGGLE' },
    { icon: 'tab',             labelKey: 'GS_COMP_TABS' },
    { icon: 'progress_activity', labelKey: 'GS_COMP_SPINNER' },
  ];

  readonly resources = [
    { icon: 'code',       labelKey: 'GS_RES_GITHUB',     descKey: 'GS_RES_GITHUB_DESC',     external: true,  href: 'https://github.com/rawatanimesh/aum-core' },
    { icon: 'menu_book',  labelKey: 'GS_RES_DOCS',       descKey: 'GS_RES_DOCS_DESC',       external: true,  href: 'https://github.com/rawatanimesh/aum-core/tree/main/docs' },
    { icon: 'science',    labelKey: 'GS_RES_PLAYGROUND', descKey: 'GS_RES_PLAYGROUND_DESC', external: false, route: '/playground' },
    { icon: 'bug_report', labelKey: 'GS_RES_ISSUES',     descKey: 'GS_RES_ISSUES_DESC',     external: true,  href: 'https://github.com/rawatanimesh/aum-core/issues' },
  ];

  private observer?: IntersectionObserver;
  private scrollingToTop = false;

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible && !this.scrollingToTop) this.ngZone.run(() => this.activeId.set(visible.target.id));
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    this.sectionElements.forEach((ref) => this.observer!.observe(ref.nativeElement));

    // Restore scroll position when navigating directly to a fragment URL
    this.route.fragment.pipe(take(1)).subscribe((fragment) => {
      if (fragment) {
        this.activeId.set(fragment);
        setTimeout(() => {
          document.getElementById(fragment)?.scrollIntoView({ behavior: 'instant', block: 'start' });
        });
      }
    });

    this.destroyRef.onDestroy(() => this.observer?.disconnect());
  }

  copyLink(id: string): void {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url).then(() => {
      this.copiedId.set(id);
      setTimeout(() => this.copiedId.set(null), 2000);
    });
    this.activeId.set(id);
    this.router.navigate([], { fragment: id, replaceUrl: true });
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  scrollToTop(): void {
    this.scrollingToTop = true;
    this.activeId.set('overview');
    this.router.navigate([], { replaceUrl: true });
    document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => this.scrollingToTop = false, 800);
  }
}
