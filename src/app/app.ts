import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenubarModule, ButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('client');
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Job Search',
        icon: 'pi pi-briefcase',
        routerLink: [''],
        routerLinkActiveOptions: {
          exact: true,
        },
      },
      {
        label: 'Applications',
        icon: 'pi pi-envelope',
        routerLink: ['/applications'],
        routerLinkActiveOptions: {
          exact: false,
        },
      },
      {
        label: 'Admin',
        icon: 'pi pi-user',
        routerLink: ['/admin'],
        routerLinkActiveOptions: {
          exact: false,
        },
      },
    ];
  }
}
