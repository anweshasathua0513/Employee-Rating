import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { EmployeeComponent } from './app/employee/employee.component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
bootstrapApplication(EmployeeComponent)
  .catch(err => console.error(err));
bootstrapApplication(EmployeeComponent, {
  providers: [
    provideHttpClient()
  ]
});