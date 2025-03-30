import {Component, Input, Output, EventEmitter} from '@angular/core';
import { NgForOf } from '@angular/common';


@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent {
  @Input() users: any[] = [];
  @Output() editUserEvent = new EventEmitter<any>();
  @Output() deleteUserEvent = new EventEmitter<number>();

  abrirModal(user: any): void {
    this.editUserEvent.emit(user);
  }

  abrirModalEliminar(userId: number): void {
    this.deleteUserEvent.emit(userId);
  }
}
