import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-panel-navbar',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './panel-navbar.component.html',
  styleUrl: './panel-navbar.component.css'
})
export class PanelNavbarComponent {
  navItems = [

  ];
  user = {
    name: 'Carlos',
    photoUrl: 'assets/user_profile.png'
  };

}
