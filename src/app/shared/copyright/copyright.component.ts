import { Component } from '@angular/core';

@Component({
  selector: 'app-copyright',
  standalone: true,
  imports: [],
  templateUrl: './copyright.component.html',
  styleUrl: './copyright.component.css'
})
export class CopyrightComponent {
    getDynamicYear(baseYear: number = 2025): number {
    const thisYear = new Date().getFullYear();
    return (thisYear > baseYear) ? thisYear : baseYear;
  }
}
