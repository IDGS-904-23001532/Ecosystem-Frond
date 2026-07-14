import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interfaz para definir la estructura de las columnas dinámicamente
export interface TableColumn {
  key: string;   // El nombre de la propiedad en tu arreglo de datos (ej. 'folio')
  label: string; // El texto que se mostrará en el encabezado (ej. 'Folio')
}

// Interfaz para emitir el evento cuando se hace clic en una acción
export interface TableAction {
  actionName: string; // ej. 'edit', 'delete', 'view'
  rowData: any;       // La fila completa de datos seleccionada
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  // Entradas que el componente padre le pasará a esta tabla
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() emptyMessage: string = 'No se encontraron registros.';
  @Input() showActions: boolean = true;

  // Salida para notificar al componente padre de una acción
  @Output() actionClick = new EventEmitter<TableAction>();

  onAction(actionName: string, row: any): void {
    this.actionClick.emit({ actionName, rowData: row });
  }
}