import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeComponent } from './employee.component';

describe('EmployeeComponent', () => {
  let component: EmployeeComponent;
  let fixture: ComponentFixture<EmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form when all fields are filled', () => {
    component.employeeForm.setValue({
      employeeName: 'John Doe',
      employeeEmail: 'john.doe@company.com',
      projectManagerName: 'Jane Smith',
      projectStartDate: '2025-06-15'
    });
    expect(component.employeeForm.valid).toBeTruthy();
  });

  it('should be invalid when fields are empty', () => {
    expect(component.employeeForm.valid).toBeFalsy();
  });

  it('should validate email format', () => {
    const emailControl = component.employeeForm.get('employeeEmail');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBeTruthy();
  });
});
