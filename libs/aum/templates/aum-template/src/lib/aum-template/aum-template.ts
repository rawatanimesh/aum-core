import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { SidenavComponent } from '../components/sidenav/sidenav.component';

@Component({
  selector: 'aum-aum-template',
  imports: [
    RouterModule,
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    ToolbarComponent,
    SidenavComponent,
  ],
  templateUrl: './aum-template.html',
  styleUrl: './aum-template.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AumTemplate {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  public sideNav = false;
  public subMenuHide = false;

  toggleSideNav(): void {
    this.sidenav.toggle();
  }
  updateBreadCrumbs(event: any) {
    // Logic to update breadcrumbs based on the event
    console.log('Breadcrumbs updated with event:', event);
  }
}
