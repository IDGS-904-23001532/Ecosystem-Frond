import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input.component.html'
})
export class InputComponent {
  @Input() parentForm!: FormGroup;
  @Input() controlName!: string;
  @Input() label!: string;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() icon: string = '';

  get isInvalid(): boolean {
    const control = this.parentForm.get(this.controlName);
    return !!(control && control.invalid && control.touched);
  }
}