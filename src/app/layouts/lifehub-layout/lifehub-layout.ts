import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLinkActive, RouterLink } from '@angular/router';

// @Component({
//   selector: 'app-lifehub-layout',
//   imports: [],
//   templateUrl: './lifehub-layout.html',
//   styleUrl: './lifehub-layout.scss',
// })
// export class LifehubLayout {

// }

@Component({
  selector: 'app-lifehub-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './lifehub-layout.html',
  styleUrl: './lifehub-layout.scss',
})
export class LifehubLayout {
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
