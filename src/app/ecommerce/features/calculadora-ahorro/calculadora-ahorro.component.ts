import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TopBarComponent } from '../../shared/components/topbar/topbar.component';

const TARIFAS_CFE: Record<string, { precio: number; label: string }> = {
  GDMTH: { precio: 2.85, label: 'Gran Demanda Media Tensión Horaria' },
  GDMTO: { precio: 2.40, label: 'Gran Demanda Media Tensión Ordinaria' },
  PDBT:  { precio: 3.10, label: 'Pequeña Demanda Baja Tensión' },
  RABT:  { precio: 2.60, label: 'Riego Agrícola Baja Tensión' },
  APBT:  { precio: 2.20, label: 'Alumbrado Público Baja Tensión' },
};

const FACTOR_AHORRO      = 0.85;
const KG_CO2_POR_KWH     = 0.432;
const HSP_PROMEDIO        = 4.5;
const EFICIENCIA_PANEL    = 0.80;
const WP_POR_PANEL        = 550;
const COSTO_KWP_INSTALADO = 18500;

@Component({
  selector: 'app-calculadora-ahorro',
  standalone: true,
  imports: [CommonModule, FormsModule, TopBarComponent],
  templateUrl: './calculadora-ahorro.component.html'
})
export class CalculadoraAhorroComponent {

  paso: number = 1;

  consumoPromedio: string = '';
  estado: string = '';
  tarifa: string = '';
  demandaHorarioPunta: string = '';
  errores: Record<string, string> = {};

  // Resultados
  costoActualMensual: number = 0;
  costoConSolarMensual: number = 0;
  ahorroMensual: number = 0;
  ahorroAnual: number = 0;
  porcentajeAhorro: number = 0;
  potenciaSistema: number = 0;
  numeroPaneles: number = 0;
  co2EvitadoAnual: number = 0;
  inversionAproximada: number = 0;
  retornoInversion: number = 0;
  tarifaLabel: string = '';

  readonly estados = [
    'Aguascalientes','Baja California','Baja California Sur','Campeche','Chiapas',
    'Chihuahua','Ciudad de México','Coahuila','Colima','Durango','Estado de México',
    'Guanajuato','Guerrero','Hidalgo','Jalisco','Michoacán','Morelos','Nayarit',
    'Nuevo León','Oaxaca','Puebla','Querétaro','Quintana Roo','San Luis Potosí',
    'Sinaloa','Sonora','Tabasco','Tamaulipas','Tlaxcala','Veracruz','Yucatán','Zacatecas'
  ];

  readonly tarifas = Object.entries(TARIFAS_CFE).map(([key, val]) => ({
    value: key,
    label: `${key} — ${val.label}`
  }));

  constructor(private router: Router) {}

  validar(): boolean {
    this.errores = {};
    const consumo = parseFloat(this.consumoPromedio);
    if (!this.consumoPromedio || isNaN(consumo) || consumo <= 0) {
      this.errores['consumo'] = 'Ingresa un consumo válido mayor a 0';
    }
    if (!this.estado) {
      this.errores['estado'] = 'Selecciona tu estado';
    }
    if (!this.tarifa) {
      this.errores['tarifa'] = 'Selecciona tu tarifa CFE';
    }
    return Object.keys(this.errores).length === 0;
  }

  calcular(): void {
    if (!this.validar()) return;

    const consumo   = parseFloat(this.consumoPromedio);
    const tarifaObj = TARIFAS_CFE[this.tarifa];
    const precio    = tarifaObj ? tarifaObj.precio : 2.85;

    this.costoActualMensual   = consumo * precio;
    const energiaCubierta     = consumo * FACTOR_AHORRO;
    this.costoConSolarMensual = this.costoActualMensual - (energiaCubierta * precio);
    this.ahorroMensual        = this.costoActualMensual - this.costoConSolarMensual;
    this.ahorroAnual          = this.ahorroMensual * 12;
    this.porcentajeAhorro     = (this.ahorroMensual / this.costoActualMensual) * 100;

    const kwhDiaria      = (consumo * FACTOR_AHORRO) / 30;
    const kWpNecesario   = kwhDiaria / (HSP_PROMEDIO * EFICIENCIA_PANEL);
    this.numeroPaneles   = Math.ceil((kWpNecesario * 1000) / WP_POR_PANEL);
    this.potenciaSistema = (this.numeroPaneles * WP_POR_PANEL) / 1000;

    this.co2EvitadoAnual     = (energiaCubierta * 12 * KG_CO2_POR_KWH) / 1000;
    this.inversionAproximada = this.potenciaSistema * COSTO_KWP_INSTALADO;
    this.retornoInversion    = this.ahorroAnual > 0 ? this.inversionAproximada / this.ahorroAnual : 0;
    this.tarifaLabel         = tarifaObj ? tarifaObj.label : this.tarifa;

    this.paso = 3;
  }

  recalcular(): void {
    this.paso = 1;
    this.consumoPromedio = '';
    this.estado = '';
    this.tarifa = '';
    this.demandaHorarioPunta = '';
    this.errores = {};
  }

  irACotizar(): void {
    this.router.navigate(['/conocenos/contactar']);
  }

  formatMXN(value: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency', currency: 'MXN',
      minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(value);
  }

  formatNum(value: number, decimals: number = 1): string {
    return value.toFixed(decimals);
  }
}
