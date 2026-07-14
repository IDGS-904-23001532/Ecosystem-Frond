import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})

export class ButtonComponent {
    @Input() text: string = 'Botón';
    @Input() type: 'button' | 'submit' | 'reset' = 'button';
    @Input() disabled: boolean = false;
    @Input() buttonClass: string = '';
    @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();

    onClick(): void {
        this.buttonClick.emit();
    }
}