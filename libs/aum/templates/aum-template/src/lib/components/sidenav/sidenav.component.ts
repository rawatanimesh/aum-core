import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'aum-sidenav',
  imports: [CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  private router = inject(Router);
  @Output() menuItemClicked = new EventEmitter();
  isDataLoaded = true;
  currentMenu = [
    {
      name: 'dashboard',
      title: 'Dashboard',
      route: 'dashboard',
      // icon: 'side-panel-icon-v2 side-panel-icondashboard',
      // rule: ['trainee', 'admin'],
      // description: 'Browse all available learning material',
    },
    {
      name: 'playground',
      title: 'Playground',
      route: 'playground',
    },
  ];

  selectMenu(menus: any, item: any, type: any) {
    console.log('selectMenu called', menus, item, type);
    this.router.navigate(['/' + item.route]);
    this.menuItemClicked.emit(item);
    if (type === 'child') {
      //   this.unselectMenu(menus);
      //   this.unselectMenu(this.menuConfig);
      //   item.selected = true;
      //   window.localStorage.setItem('my_learning_path', '0');
      //   this.localStorage.setLocalStorage('selectedTabInCourses', 0);
      //   this.localStorage.setLocalStorage('webinarTabIndex', 0);
      //   this.localStorage.setLocalStorage('pathwayTabIndex', 0);
      //   this.localStorage.setLocalStorage(
      //     'mainSelectedTabOfLeapAdminGlobalRepo',
      //     0
      //   );
      //   this.localStorage.setLocalStorage(
      //     'mainSelectedTabOfLeapAdminCourseManagment',
      //     0
      //   );
      //   this.localStorage.setLocalStorage(
      //     'mainSelectedTabOfTenantAdminGlobalRepo',
      //     0
      //   );
      //   this.localStorage.removeLocalStorage('userCoursesFlow');
      //   this.localStorage.removeLocalStorage('userCertificationFlow');
      //   this.localStorage.removeLocalStorage('userPodcastFlow');
      //   this.localStorage.removeLocalStorage('userPathwayFlow');
      //   this.localStorage.setLocalStorage('selectedTabAndSubTabIndex', [0, 0]);
      //   /* added to fix select menu issue after lazy loading module implementaions */
      //   setTimeout(() => {
      //     this.unselectMenu(menus);
      //     item.selected = true;
      //   }, 1000);
      //   if (item.name === 'global_skills_and_competencies') {
      //     this.router.navigate([
      //       `${this.currentMenu.route}/main/global-skills-and-competencies/0/0`,
      //     ]);
      //   } else if (item.name === 'community') {
      //     this.router.navigate([
      //       `${this.currentMenu.route}/main/community/main-page/-1`,
      //     ]);
      //   } else if (item.name === 'goal_setting') {
      //     this.router.navigate([
      //       `${this.currentMenu.route}/main/goalsetting/main-page/0/0`,
      //     ]);
      //   } else if (item.name === 'global_announcements') {
      //     this.router.navigate([
      //       `${this.currentMenu.route}/main/global-announcement/main-page/0`,
      //     ]);
      //   } else if (item.name === 'performance_dashboard') {
      //     this.router.navigate([`${this.currentMenu.route}/main/cxo-dashboard`]);
      //   } else {
      //     this.router.navigate([`${this.currentMenu.route}/main/${item.route}`]);
      //   }
      //   if (this.sideNavRef && !this.common.pinnedMenu) {
      //     this.sideNavRef.close();
      //   }
      // } else {
      //   if (item.name !== 'cloudUniversity' && item.outsideApp) {
      //     this.unselectMenu(menus);
      //     this.unselectMenu(this.menuConfig);
      //     window.open(item.route, '_self');
      //     item.selected = true;
      //   } else {
      //     this.unselectMenu(menus);
      //     this.unselectMenu(this.menuConfig);
      //     item.selected = true;
      //   }
      // }
      // if (item.children && item.children.length) {
      //   const selectChild = item.children.filter((x) =>
      //     x.rule.includes(this.loginState.userStatus)
      //   );
      //   if (selectChild && selectChild.length) {
      //     selectChild[0].selected = true;
      //   }
    }
  }
}
