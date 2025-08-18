import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { provideHttpClient,HttpClient } from '@angular/common/http';
import { Component, Renderer2, ChangeDetectorRef } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatTableModule
  ],
  providers: [MatDatepickerModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  animations: [
    trigger('fabAnimation', [
      transition(':enter', [
        query('.fab-btn', [
          style({ opacity: 0 }),
          stagger(100, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
          ])
        ])
      ])
    ])
  ]
})
export class EmployeeComponent {
  isDarkMode = false;

  designation = [
    'Intern','Junior Developer','Software Engineer','Senior Software Engineer',
    'Team Lead','Project Manager','QA Analyst','QA Lead','DevOps Engineer','HR Executive','HR Manager'
  ];
  
  departments = ['IT', 'HR', 'Finance', 'Operations', 'Marketing'];
  employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary'];

  displayedColumns = [
    'employeeId',
    'employeeName',
    'joiningDate',
    'employeeEmail',
    'employmentType',
    'designation',
    'department',
    'noticePeriod',
    'probationPeriod',
    'actions'
  ];

  employeeForm: FormGroup;
  editRowMap: { [index: number]: boolean } = {};
  setAllRowsInitiallyEditable: any;
  dataSource = new MatTableDataSource<FormGroup>();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef
  ) {
    this.employeeForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      projectManagerName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      projectManagerEmail: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/)
      ]],
      teamLeadName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      teamLeadEmail: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/)
      ]],
      pmoName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      pmoEmail: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/)
      ]],
        projectStartDate: ['', Validators.required],
        projectEndDate: ['', Validators.required],
      employeeList: this.fb.array([this.createEmployeeGroup()])
    });

    // Initially set first row editable
    this.editRowMap[0] = true;
  }

  // Getters
  get employeeList(): FormArray {
    return this.employeeForm.get('employeeList') as FormArray;
  }

  get projectDatesGroup(): FormGroup {
    return this.employeeForm.get('projectDates') as FormGroup;
  }

  // Create Employee FormGroup
  createEmployeeGroup(): FormGroup {
    return this.fb.group({
      employeeId: ['', Validators.required],
      employeeName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      joiningDate: ['', Validators.required],
      employeeEmail: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/)
      ]],
      department: ['', Validators.required],
      employmentType: ['', Validators.required],
      designation: ['', Validators.required],
      noticePeriod: [false],
      probationPeriod: [false]
    });
  }
  
addEmployeeRow(): void {
  const index = this.employeeList.length;

  this.employeeList.push(this.createEmployeeGroup());

  // Put the new row into edit mode
  this.editRowMap[index] = true;

  // Update the Material table's datasource
  this.refreshTable();

  // Optional: scroll to the new row
  setTimeout(() => {
    const rows = document.querySelectorAll('table tr');
    if (rows.length > 0) {
      rows[rows.length - 1].scrollIntoView({ behavior: 'smooth' });
    }
  }, 0);
}
  private refreshTable(): void {
      this.dataSource.data = this.employeeList.controls as FormGroup[];
      this.cdRef.detectChanges();
    }

  // Edit Row
  editRow(index: number) {
    this.editRowMap[index] = true;
  }

  // Save Row
  saveRow(index: number) {
    if (this.employeeList.at(index).valid) {
      this.editRowMap[index] = false;
    } else {
      this.employeeList.at(index).markAllAsTouched();
    }
  }

  // Delete Row
  deleteEmployee(index: number): void {
  if (this.employeeList.length > 1) {
    this.employeeList.removeAt(index);
    const updatedMap: { [key: number]: boolean } = {};
    this.employeeList.controls.forEach((_, i) => {
      updatedMap[i] = this.editRowMap[i] || false;
    });
    this.editRowMap = updatedMap;
    this.refreshTable();

  } else {
    alert('At least one employee record is required.');
  }
}


  // Submit
  onSubmit() {
    this.employeeForm.markAllAsTouched();
    this.employeeList.controls.forEach(group => group.markAllAsTouched());
    if (this.employeeForm.valid) {
      const formValue = { ...this.employeeForm.value };
      formValue.employees = formValue.employeeList.map((emp: any) => ({
        ...emp,
        probationaPeriod: emp.probationPeriod
      }));
      this.http.post('https://docker-employee-rating-4.onrender.com/api/save', formValue)
        .subscribe({
          next: () => alert('Data submitted to server successfully!'),
          error: err => alert('Error submitting data: ' + err.message)
        });
    } else {
      this.scrollToFirstError();
    }
  }

  // Reset
  onReset(): void {
    location.reload();
    this.employeeForm.reset();
    this.employeeList.clear();
  }

  // Exit
  onExit() {
    // alert('You can now close this tab or browser window. Thank you for visiting!');
    if (confirm('Are you sure you want to exit?')) {
      window.open('', '_self');
      window.close();
      window.location.href = 'about:blank'; 
    }
  }

  // Theme Toggle
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    const root = document.documentElement;
    if (this.isDarkMode) {
      root.classList.add('dark-mode', 'dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark-mode', 'dark-theme');
      localStorage.setItem('theme', 'light');
    }
    setTimeout(() => {
      this.cdRef.detectChanges();
    }, 0);
  }

  // Scroll to first invalid
  scrollToFirstError(): void {
    const firstInvalid = document.querySelector('.ng-invalid') as HTMLElement | null;
    if (firstInvalid) {
      setTimeout(() => {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      }, 0);
    }
  }

  // Set theme on init
  ngOnInit() {
    const themePref = localStorage.getItem('theme');
    if (themePref === 'dark') {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark-mode', 'dark-theme');
    } else {
      this.isDarkMode = false;
      document.documentElement.classList.remove('dark-mode', 'dark-theme');
    }
     this.refreshTable();
  }
}
