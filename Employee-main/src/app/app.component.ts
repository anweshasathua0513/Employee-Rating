import { Component } from '@angular/core';
import { EmployeeComponent } from './employee/employee.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <div class="main-container">
      <h1>Welcome to Employee Maintenance</h1>
      <div class="fab-group-horizontal" [@fabAnimation]>
        <button mat-fab class="fab-btn fab-reset" (click)="onReset()" matTooltip="Reset">
          <mat-icon>refresh</mat-icon>
        </button>

        <button mat-fab class="fab-btn fab-save" (click)="onSave()" matTooltip="Save">
          <mat-icon>save</mat-icon>
        </button>

        <button mat-fab class="fab-btn fab-exit" (click)="onExit()" matTooltip="Exit">
          <mat-icon>exit_to_app</mat-icon>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fabAnimation', [
      transition(':enter', [
        query('.fab-btn', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ])
    ])
  ]
})
export class AppComponent {
  title = 'Employee Maintenance App';

  onReset() {
    alert('Reset clicked!');
  }

  onSave() {
    alert('Save clicked!');
  }

  onExit() {
    alert('Exit clicked!');
  }
}
