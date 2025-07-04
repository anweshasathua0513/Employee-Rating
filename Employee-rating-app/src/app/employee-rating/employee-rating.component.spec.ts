import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // 👈 Import this

// import { AppComponent } from './app.component';
import { EmployeeRatingComponent } from './employee-rating.component';
import { AppComponent } from '../app.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeRatingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule // 👈 Add it here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
