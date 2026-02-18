import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLinkActive, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('lifehub-portal');
  openSubmenus = new Set<string>();

  toggleSubmenu(submenuId: string) {
    if (this.openSubmenus.has(submenuId)) {
      this.openSubmenus.delete(submenuId);
    } else {
      this.openSubmenus.add(submenuId);
    }
    console.log(this.openSubmenus);
  }

  isSubmenuOpen(submenuId: string): boolean {
    return this.openSubmenus.has(submenuId);
  }
}
