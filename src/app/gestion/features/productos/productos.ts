import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductoService } from './services/producto'; 
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component'; 
import Swal from 'sweetalert2';

export interface Producto {
  idProducto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  rutaImagen: string;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, SidebarComponent],
  templateUrl: './productos.html'
})
export class ProductosComponent implements OnInit {
  private productoService = inject(ProductoService);

  productos = signal<Producto[]>([]);
  searchTerm = signal('');
  isModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  selectedProducto = signal<Producto | null>(null);

  // Variables para manejar el archivo
  archivoFisico: File | null = null;
  nombreArchivoTemporal: string = '';

  productosFiltrados = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.productos().filter(p => 
      p.nombre.toLowerCase().includes(term) || 
      p.descripcion.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos.set(data);
      },
      error: (err) => console.error('Error al obtener productos', err)
    });
  }

  abrirModalCrear() {
    this.selectedProducto.set(null);
    this.isModalOpen.set(true);
  }

  abrirModalEditar(producto: Producto) {
    this.selectedProducto.set({ ...producto });
    this.isModalOpen.set(true);
  }

  abrirModalEliminar(producto: Producto) {
    this.selectedProducto.set(producto);
    this.isDeleteModalOpen.set(true);
  }

  cerrarModales() {
    this.isModalOpen.set(false);
    this.isDeleteModalOpen.set(false);
    this.selectedProducto.set(null);
    this.archivoFisico = null;
    this.nombreArchivoTemporal = '';
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.archivoFisico = file;
      this.nombreArchivoTemporal = file.name;
    }
  }

  procesarFormulario(form: NgForm) {
    if (form.invalid) return;

    const formData = new FormData();
    const idActual = this.selectedProducto()?.idProducto || 0;

    if (idActual > 0) {
      formData.append('IdProducto', idActual.toString());
    }
    
    // Es crucial que los nombres coincidan EXACTAMENTE con el modelo C# (Sensible a mayúsculas)
    formData.append('Nombre', form.value.nombre);
    
    // C# a veces requiere que el decimal reemplace el punto por coma según la cultura del servidor, 
    // pero con form-data el string estándar suele funcionar.
    formData.append('Precio', form.value.precio.toString());
    formData.append('Descripcion', form.value.descripcion);

    // EL TRUCO: Enviamos una ruta por defecto para evitar que la Base de Datos reviente si es NOT NULL
    const rutaExistente = this.selectedProducto()?.rutaImagen || 'https://via.placeholder.com/150';
    formData.append('RutaImagen', rutaExistente); 

    // Adjuntamos el archivo físico
    if (this.archivoFisico) {
      formData.append('routeFile', this.archivoFisico, this.archivoFisico.name);
    }

    this.guardarProducto(formData, idActual);
  }

  guardarProducto(formData: FormData, idActual: number) {
    if (idActual > 0) {
      // Edición
      this.productoService.actualizarProducto(idActual, formData).subscribe({
        next: () => {
          this.cargarProductos(); 
          this.cerrarModales();
          Swal.fire('¡Actualizado!', 'Producto actualizado correctamente.', 'success');
        },
        error: (err) => {
          console.error('Error al actualizar', err);
          
          // Lógica segura para extraer el texto del error 400 de ASP.NET Core
          let mensajeError = 'Revisa que todos los campos sean correctos.';
          if (typeof err.error === 'string') {
            mensajeError = err.error;
          } else if (err.error?.errors) {
            // Extrae el primer mensaje específico de validación de C#
            const primerError = Object.values(err.error.errors)[0] as string[];
            mensajeError = primerError[0];
          } else if (err.error?.title) {
            mensajeError = err.error.title;
          }

          Swal.fire('Error de validación', mensajeError, 'error');
        }
      });
    } else {
      // Creación
      this.productoService.crearProducto(formData).subscribe({
        next: () => {
          this.cargarProductos(); 
          this.cerrarModales();
          Swal.fire('¡Registrado!', 'Producto registrado correctamente.', 'success');
        },
        error: (err) => {
          console.error('Error al crear', err);
          
          // Lógica segura para extraer el texto del error 400 de ASP.NET Core
          let mensajeError = 'Revisa que todos los campos sean correctos.';
          if (typeof err.error === 'string') {
            mensajeError = err.error;
          } else if (err.error?.errors) {
            // Extrae el primer mensaje específico de validación de C#
            const primerError = Object.values(err.error.errors)[0] as string[];
            mensajeError = primerError[0];
          } else if (err.error?.title) {
            mensajeError = err.error.title;
          }

          Swal.fire('Error de validación', mensajeError, 'error');
        }
      });
    }
  }

  confirmarEliminacion() {
    const productoAEliminar = this.selectedProducto();
    
    if (productoAEliminar && productoAEliminar.idProducto) {
      this.productoService.eliminarProducto(productoAEliminar.idProducto).subscribe({
        next: () => {
          this.productos.update(lista => 
            lista.filter(p => p.idProducto !== productoAEliminar.idProducto)
          );
          this.cerrarModales();
          Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.', 'success');
        },
        error: (err) => {
          console.error('Error al eliminar', err);
          this.cerrarModales();
          Swal.fire(
            'No se puede eliminar', 
            'Este producto no se puede borrar porque está siendo utilizado en otros registros del sistema.', 
            'error'
          );
        }
      });
    }
  }
}