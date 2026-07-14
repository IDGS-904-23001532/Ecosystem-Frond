import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { HeaderTitleComponent } from "../../../shared/components/header-title/header-title.component";
import { TableAction, TableColumn, TableComponent } from '../../../shared/components/table/table.component';

interface ConceptoItem {
  cantidad: number;
  concepto: string;
  precioUnitario: number;
  descuento: number;
}
  
interface HardwareOption {
  nombre: string;
  precio: number;
}

@Component({
  selector: 'app-cotizaciones',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderTitleComponent, ButtonComponent, TableComponent],
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.scss']
})
  
export class CotizacionesComponent {
  title = 'Cotizaciones';
  subtitle = 'Generación de cotizaciones para clientes potenciales.';
  username = 'Karla Martinez';
  userInitials = 'KM';

  isHardwarePickerOpen = false;
  selectedHardware = '';

  columnasCotizacion: TableColumn[] = [
  { key: 'folio', label: 'Folio' },
  { key: 'cliente', label: 'Cliente / Prospecto' },
  { key: 'fecha', label: 'Fecha / vigencia' },
  { key: 'monto', label: 'Monto total' },
  { key: 'estatus', label: 'Estatus' }
];

// Si está vacío se mostrará tu mensaje. Si tiene datos, se pintarán automáticamente.
datosCotizacion = []; 

manejarAccion(evento: TableAction) {
  if (evento.actionName === 'edit') {
    console.log('Editando la cotización:', evento.rowData);
  }
}
  
  hardwareOptions: HardwareOption[] = [
    { nombre: 'Panel solar 550W', precio: 3200 },
    { nombre: 'Inversor monofasico 5kW', precio: 6800 },
    { nombre: 'Bateria de litio 10kWh', precio: 18500 },
    { nombre: 'Estructura de montaje', precio: 2200 },
    { nombre: 'Kit cableado y protecciones', precio: 1450 }
  ];

  conceptos: ConceptoItem[] = [
    {
      cantidad: 2,
      concepto: 'Panel solar 550W',
      precioUnitario: 3200,
      descuento: 0
    },
    {
      cantidad: 1,
      concepto: 'Instalacion y cableado',
      precioUnitario: 1800,
      descuento: 150
    }
  ];

  get subtotal(): number {
    return this.conceptos.reduce(
      (acum, item) => acum + item.cantidad * item.precioUnitario - item.descuento,
      0
    );
  }

  get costoInstalacion(): number {
    return 0;
  }

  get iva(): number {
    return this.subtotal * 0.16;
  }

  get total(): number {
    return this.subtotal + this.costoInstalacion + this.iva;
  }

  addConcepto(): void {
    this.isHardwarePickerOpen = true;
    this.selectedHardware = this.hardwareOptions[0]?.nombre ?? '';
  }

  cancelHardwarePicker(): void {
    this.isHardwarePickerOpen = false;
  }

  acceptHardwareSelection(): void {
    const hardware = this.hardwareOptions.find((h) => h.nombre === this.selectedHardware);
    if (!hardware) {
      return;
    }

    this.conceptos = [
      ...this.conceptos,
      {
        cantidad: 1,
        concepto: hardware.nombre,
        precioUnitario: hardware.precio,
        descuento: 0
      }
    ];

    this.cancelHardwarePicker();
  }

  getImporte(item: ConceptoItem): number {
    return item.cantidad * item.precioUnitario - item.descuento;
  }

  toCurrency(valor: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 2
    }).format(valor);
  }
}

