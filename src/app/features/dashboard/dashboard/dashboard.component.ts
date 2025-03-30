import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; //importar RouterModule para poder hacer uso del routerLink en las etiquetas <a>
import { NavbarComponent } from '../../../shared/navbar/navbar/navbar.component';
import { FooterComponent } from "../../../shared/footer/footer/footer.component";
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ RouterModule, NavbarComponent, FooterComponent ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
}