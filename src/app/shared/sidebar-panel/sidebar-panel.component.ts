import {Component, EventEmitter, Output} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../core/services/auth.service";

@Component({
  selector: 'app-sidebar-panel',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './sidebar-panel.component.html',
  styleUrl: './sidebar-panel.component.css'
})
export class SidebarPanelComponent {

  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router) { }

  logout() {
    this.authService.logout();
  }

  onToggle() {
    this.toggleSidebar.emit();
  }

}
