import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CurrencyPipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-client-table',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './client-table.component.html',
  styleUrl: './client-table.component.css'
})
export class ClientTableComponent {

  @Input() clients: any[] = [];

  @Output() editClientEvent = new EventEmitter<any>();
  @Output() deleteClientEvent = new EventEmitter<number>();

  onEdit(clientData: any): void {
    this.editClientEvent.emit(clientData);
  }

  onDelete(clientId: number): void {
    this.deleteClientEvent.emit(clientId);
  }

}


