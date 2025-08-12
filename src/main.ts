import { bootstrapApplication } from '@angular/platform-browser';
import { EmployeeComponent } from './app/employee/employee.component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(EmployeeComponent, {
  providers: [
    provideHttpClient() // Enables HttpClient throughout your app
  ]
})
.catch(err => console.error(err));
