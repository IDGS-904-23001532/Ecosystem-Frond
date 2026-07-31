import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProspectoService } from '../../../../../core/services/prospecto';
import { ProductoService, Producto } from '../../../../../core/services/producto';
import { CotizacionService, CrearCotizacionDto, DetalleCotizacionDto } from '../../../../../core/services/cotizacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nueva-cotizacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nueva-cotizacion.component.html'
})
export class NuevaCotizacionComponent implements OnInit {
  @Input() preselectedProspectoId: number | null = null;
  @Input() editingCotizacionId: number | null = null;
  @Output() back = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  prospectos: any[] = [];
  productos: Producto[] = [];

  selectedProspectoId: number | null = null;
  selectedProspecto: any = null;
  installationAddress: string = '';
  clientContact: string = '';

  conceptos: Array<{
    producto: Producto;
    cantidad: number;
    precioUnitario: number;
    descuento: number;
    importe: number;
  }> = [];

  costoInstalacion: number = 0;

  // State for Add Concept Modal
  isHardwarePickerOpen = false;
  selectedProductId: number | null = null;
  newConceptCantidad: number = 1;
  newConceptDescuento: number = 0;

  constructor(
    private prospectoService: ProspectoService,
    private productoService: ProductoService,
    private cotizacionService: CotizacionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarProspectos();
    this.cargarProductos();
  }

  cargarProspectos(): void {
    this.prospectoService.listarProspectos().subscribe({
      next: (data) => {
        // filter or list only pending/active prospects
        this.prospectos = data.filter((p: any) => p.estatus === 'Pendiente');
        
        if (this.preselectedProspectoId) {
          this.selectedProspectoId = Number(this.preselectedProspectoId);
          this.onProspectoChange();
        }
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar prospectos:', err);
      }
    });
  }

  cargarProductos(): void {
    this.productoService.listarProductos().subscribe({
      next: (data) => {
        this.productos = data;
        if (this.productos.length > 0) {
          this.selectedProductId = this.productos[0].idProducto;
        }

        if (this.editingCotizacionId) {
          this.cargarDetallesCotizacion();
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }

  cargarDetallesCotizacion(): void {
    if (!this.editingCotizacionId) return;
    console.log('Iniciando precarga de cotización ID:', this.editingCotizacionId);

    this.cotizacionService.obtenerCotizacion(this.editingCotizacionId).subscribe({
      next: (quote: any) => {
        console.log('Datos de cotización obtenidos del backend:', quote);
        if (!quote) return;

        this.selectedProspectoId = quote.idProspecto;
        this.costoInstalacion = quote.costoInstalacion || 0;
        this.onProspectoChange();

        const details = quote.detalles || quote.detalleCotizaciones || quote.detalleCotizacion || [];
        console.log('Detalles a mapear:', details);

        this.conceptos = details.map((d: any) => {
          const prod = this.productos.find(p => p.idProducto === d.idProducto);
          const precioUnitario = prod ? prod.precio : (d.producto?.precio || d.precio || 0);
          return {
            producto: prod || { idProducto: d.idProducto, nombre: d.productoNombre || d.producto?.nombre || `Producto #${d.idProducto}`, precio: precioUnitario },
            cantidad: d.cantidad || 1,
            precioUnitario: precioUnitario,
            descuento: d.descuento || 0,
            importe: (d.cantidad || 1) * precioUnitario - (d.descuento || 0)
          };
        });
        console.log('Conceptos mapeados final en conceptos state:', this.conceptos);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar detalles de la cotización:', err);
      }
    });
  }

  onProspectoChange(): void {
    if (!this.selectedProspectoId) {
      this.selectedProspecto = null;
      this.installationAddress = '';
      this.clientContact = '';
      return;
    }

    this.selectedProspecto = this.prospectos.find(
      (p) => (p.idProspecto || p.id) === Number(this.selectedProspectoId)
    );

    if (this.selectedProspecto) {
      this.installationAddress = this.selectedProspecto.localidad || 'Sin dirección registrada';
      this.clientContact = this.selectedProspecto.telefono || 'Sin teléfono';
    }
  }

  openHardwarePicker(): void {
    this.isHardwarePickerOpen = true;
    this.selectedProductId = this.productos[0]?.idProducto ?? null;
    this.newConceptCantidad = 1;
    this.newConceptDescuento = 0;
  }

  cancelHardwarePicker(): void {
    this.isHardwarePickerOpen = false;
  }

  acceptHardwareSelection(): void {
    if (!this.selectedProductId) return;

    const prod = this.productos.find((p) => p.idProducto === Number(this.selectedProductId));
    if (!prod) return;

    const importe = this.newConceptCantidad * prod.precio - this.newConceptDescuento;

    this.conceptos.push({
      producto: prod,
      cantidad: this.newConceptCantidad,
      precioUnitario: prod.precio,
      descuento: this.newConceptDescuento,
      importe: importe >= 0 ? importe : 0
    });

    this.cancelHardwarePicker();
    this.cdr.detectChanges();
  }

  eliminarConcepto(index: number): void {
    this.conceptos.splice(index, 1);
    this.cdr.detectChanges();
  }

  get subtotal(): number {
    return this.conceptos.reduce((sum, item) => sum + item.importe, 0);
  }

  get iva(): number {
    return this.subtotal * 0.16;
  }

  get total(): number {
    return this.subtotal + this.costoInstalacion + this.iva;
  }

  submitCotizacion(event: Event): void {
    event.preventDefault();

    if (!this.selectedProspectoId) {
      Swal.fire('Atención', 'Debe seleccionar un cliente o prospecto.', 'warning');
      return;
    }

    if (this.conceptos.length === 0) {
      Swal.fire('Atención', 'Debe agregar al menos un concepto a la cotización.', 'warning');
      return;
    }

    const detalles: DetalleCotizacionDto[] = this.conceptos.map((item) => ({
      idProducto: item.producto.idProducto,
      cantidad: item.cantidad
    }));

    const dto: CrearCotizacionDto = {
      idProspecto: Number(this.selectedProspectoId),
      costoInstalacion: Number(this.costoInstalacion || 0),
      detalles: detalles
    };

    if (this.editingCotizacionId) {
      // Usar la nueva API de actualización (PUT) del backend
      this.cotizacionService.actualizarCotizacion(this.editingCotizacionId, dto).subscribe({
        next: () => {
          Swal.fire('¡Guardada!', 'La cotización se ha actualizado correctamente.', 'success');
          this.save.emit();
        },
        error: (err) => {
          // El backend puede retornar 500 debido a un bucle de referencia circular en la serialización JSON,
          // pero los cambios sí son guardados. Verificamos en el listado.
          this.cotizacionService.listarCotizaciones().subscribe({
            next: (quotes) => {
              const subtotalAmount = this.subtotal;
              const quoteId = Number(this.editingCotizacionId);
              
              // Buscar si la cotización fue actualizada con el nuevo subtotal
              const updatedQuote = quotes.find(q => 
                Number(q.idCotizacion || q.id) === quoteId &&
                Math.abs((q.totalCotizado || q.total || 0) - subtotalAmount) < 0.1
              );

              if (updatedQuote) {
                Swal.fire('¡Guardada!', 'La cotización se ha actualizado correctamente.', 'success');
                this.save.emit();
              } else {
                console.error('Error al actualizar cotización:', err);
                this.showErrorAlert(err);
              }
            },
            error: () => {
              this.showErrorAlert(err);
            }
          });
        }
      });
    } else {
      this.executeCreateQuote(dto);
    }
  }

  executeCreateQuote(dto: CrearCotizacionDto): void {
    this.cotizacionService.crearCotizacion(dto).subscribe({
      next: () => {
        Swal.fire('¡Guardada!', 'La cotización se ha registrado correctamente.', 'success');
        this.save.emit();
      },
      error: (err) => {
        // El servidor del backend tiene un bug conocido (ej. CreatedAtAction lanza 500 al retornar la ruta)
        // pero la cotización sí es guardada de manera persistente en la base de datos.
        // Consultamos el listado para ver si la cotización realmente se insertó.
        this.cotizacionService.listarCotizaciones().subscribe({
          next: (quotes) => {
            const subtotalAmount = this.subtotal;
            const targetProspectoId = Number(this.selectedProspectoId);
            
            // Buscar si se guardó una cotización para este prospecto con el mismo monto en los últimos 30 segundos
            const recentQuote = quotes.find(q => 
              Number(q.idProspecto) === targetProspectoId &&
              Math.abs((q.totalCotizado || q.total || 0) - subtotalAmount) < 0.1 &&
              (new Date().getTime() - new Date(q.fechaEmision || q.fecha || Date.now()).getTime()) < 30000
            );

            if (recentQuote) {
              Swal.fire('¡Guardada!', 'La cotización se ha registrado correctamente.', 'success');
              this.save.emit();
            } else {
              console.error('Error al registrar cotización:', err);
              this.showErrorAlert(err);
            }
          },
          error: () => {
            this.showErrorAlert(err);
          }
        });
      }
    });
  }

  showErrorAlert(err: any): void {
    let errorMsg = 'Ocurrió un problema al registrar la cotización.';
    if (err.error) {
      if (typeof err.error === 'string') {
        errorMsg += `<br><br>Detalle: ${err.error}`;
      } else if (err.error.errors) {
        const details = Object.entries(err.error.errors)
          .map(([key, messages]) => `${key}: ${(messages as string[]).join(', ')}`)
          .join('<br>');
        errorMsg += `<br><br><div class="text-left text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono">${details}</div>`;
      } else if (err.error.message) {
        errorMsg += `<br><br>Detalle: ${err.error.message}`;
      } else {
        errorMsg += `<br><br>Detalle: ${JSON.stringify(err.error)}`;
      }
    } else if (err.message) {
      errorMsg += `<br><br>Detalle: ${err.message}`;
    }
    Swal.fire({
      title: 'Error',
      html: errorMsg,
      icon: 'error'
    });
  }

  toCurrency(valor: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 2
    }).format(valor);
  }
}
