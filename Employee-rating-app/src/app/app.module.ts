import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';     // ✅ Required for ngModel
import { CommonModule } from '@angular/common';   // ✅ Optional, already included in BrowserModule

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,    // ✅ Add this
    CommonModule ,   // ✅ Optional, but can include if needed
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
