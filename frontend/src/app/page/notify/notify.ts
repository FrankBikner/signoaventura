import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-notify',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notify.html',
  styleUrls: ['./notify.css']
})
export class NotifyComponent {
  @Input() type: string = '';
  @Input() messages: string[] = [];
  @Output() close = new EventEmitter<void>();

  public alertType(): string {
    return this.type === 'success' ? 'primary' : 
           (this.type === 'error' || this.type === 'exception') ? 'danger' : this.type;
  }

  onClose() {
    this.close.emit();
  }
}