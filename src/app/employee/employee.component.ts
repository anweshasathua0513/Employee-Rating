import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpClient, provideHttpClient } from '@angular/common/http'; // ✅ Import HttpClient
import { Renderer2 } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatSelectModule
  ],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  animations: [
    trigger('fabAnimation', [
      transition(':enter', [
        query('.fab-btn', [
          style({ opacity: 0, transform: 'scale(0.8)' }),
          stagger(100, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
          ])
        ])
      ])
    ])
  ]
})
export class EmployeeComponent {
  employeeForm: FormGroup;
  isDarkMode = false; 
  designation = ['Intern','Junior Developer','Software Engineer','Senior Software Engineer','Team Lead','Project Manager','QA Analyst','QA Lead','DevOps Engineer','HR Executive','HR Manager']
  departments = ['IT', 'HR', 'Finance', 'Operations', 'Marketing'];
  employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary'];

  constructor(private fb: FormBuilder, private http: HttpClient, private renderer: Renderer2, private cdRef: ChangeDetectorRef ) {
    this.employeeForm = this.fb.group({
      employees: this.fb.array([this.createEmployeeGroup()]),
      noticePeriod: [false],
      probationPeriod: [false],
      projectName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      projectManagerName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      projectManagerEmail: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/)]],
      teamLeadName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      teamLeadEmail: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/)]],
      projectManagementOfficeName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      projectManagementOfficeEmail: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/)]],
      projectStartDate: ['', Validators.required],
      projectEndDate: ['', Validators.required],
      
     
     

    });
  }

  

  get employees(): FormArray {
    return this.employeeForm.get('employees') as FormArray;
  }


  createEmployeeGroup(): FormGroup {
    return this.fb.group({
      employeeName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      employeeId: ['', Validators.required],
      joiningDate: ['', Validators.required],
      employeeEmail: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/)
      ]],
      department: ['', Validators.required],
       employmentType: ['', Validators.required],
       designation: ['', Validators.required]
      

    });
  }

  scrollToFirstError(): void {
  // First, check for any invalid control inside the employees array
  const employeeContainers = document.querySelectorAll('.employee-section-box');

  for (let i = 0; i < employeeContainers.length; i++) {
    const container = employeeContainers[i];
    const invalidControl = container.querySelector('.ng-invalid') as HTMLElement | null;

    if (invalidControl) {
      setTimeout(() => {
        invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        invalidControl.focus();
      }, 0);
      return;
    }
  }

  // If none found in employees, fallback to the rest of the form
  const firstInvalid = document.querySelector('.ng-invalid') as HTMLElement | null;

  if (firstInvalid) {
    setTimeout(() => {
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalid.focus();
    }, 0);
  }
}



  addEmployee() {
    const lastGroup = this.employees.at(this.employees.length - 1) as FormGroup;
    lastGroup.markAllAsTouched();

    if (lastGroup.invalid) {
      this.scrollToFirstError();
      return;
    }

    this.employees.push(this.createEmployeeGroup());

    setTimeout(() => {
    const selects = document.querySelectorAll('select');
    selects.forEach((el: any) => {
      el.style.display = 'none';
      void el.offsetHeight; 
      el.style.display = '';
    });

    this.cdRef.detectChanges();
  }, 100);

  }



  deleteEmployee(index: number): void {
    if (this.employees.length > 1) {
      this.employees.removeAt(index);
    } else {
      alert('At least one employee section is required.');
    }
  }

  saveEmployee(index: number): void{
    const employeeGroup = this.employees.at(index) as FormGroup;
    
    Object.keys(employeeGroup.controls).forEach(controlName => {
    const control = employeeGroup.get(controlName);
    control?.markAsTouched();
  });
     
    

      const containers = document.querySelectorAll('.employee-section-box');
      const Container = containers[index] as HTMLElement | null;

     if (employeeGroup.invalid) {
     if (Container) {
      const firstInvalid = Container.querySelector('.ng-invalid') as HTMLElement | null;
      if (firstInvalid) {
        console.log('Scrolling to', firstInvalid);
        setTimeout(() => {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      }, 0);
    } else {
        console.warn('No invalid element found in employee container');
      }
  }
    return;
    }

    
  const employeeData = employeeGroup.value;

    this.http.post('http://localhost:8080/api/save', employeeData)
      .subscribe({
        next: () => alert(`Employee ${index + 1} saved successfully!`),
      error: err => alert('Error saving employee: ' + err.message)
      });
  }

  

  onSubmit() {
    this.employeeForm.markAllAsTouched();
    this.employees.controls.forEach(group => group.markAllAsTouched());

    if (this.employeeForm.valid) {
      console.log('Form submitted:', this.employeeForm.value);
      alert('Form submitted successfully!');

      this.http.post('http://localhost:8080/api/save', this.employeeForm.value) 
        .subscribe({
          next: () => alert('Data submitted to server successfully!'),
          error: err => alert('Error submitting data: ' + err.message)
        });
    } else {
      this.scrollToFirstError();
    }
  }

  onReset(): void {
    location.reload();
    this.employeeForm.reset();
    this.employees.clear();
    
  }

  onExit() {
    alert('Exit clicked');
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
   const root = document.documentElement;

    if (this.isDarkMode) {
   root.classList.add('dark-mode', 'dark-theme');
   localStorage.setItem('theme', 'dark');
  } 
  else {
    root.classList.remove('dark-mode', 'dark-theme');
    localStorage.setItem('theme', 'light');
  }

  setTimeout(() => {
    const selects = document.querySelectorAll('select');
    selects.forEach((el: any) => {
      el.style.display = 'none';
      void el.offsetHeight; 
      el.style.display = '';
    });

    this.cdRef.detectChanges(); 
  }, 100);
}


ngOnInit() {
  const themePref = localStorage.getItem('theme');
  if (themePref === 'dark') {
    this.isDarkMode = true;
    document.documentElement.classList.add('dark-mode', 'dark-theme');
  } else {
    this.isDarkMode = false;
    document.documentElement.classList.remove('dark-mode', 'dark-theme');
  }

 setTimeout(() => {
    this.cdRef.detectChanges();
  }, 0);

}

 
  }

  


