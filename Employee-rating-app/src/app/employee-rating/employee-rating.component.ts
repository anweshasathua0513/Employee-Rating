import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-rating',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-rating.component.html',
  styleUrls: ['./employee-rating.component.css']
})
export class EmployeeRatingComponent {
  ratings = [1, 2, 3, 4, 5];
  performanceCriteria = ['communication', 'punctuality', 'task_allocation', 'teamwork', 'adaptability' , 'quantity_and_quality'];

  // 🔒 Non-editable values
     employeeId = '';
    employeeName = '';
    designation = '';
    project_name = '';

  formData: { [key: string]: number } = {};

  constructor(private http: HttpClient) {
    // Initialize formData with default rating (1)
    this.performanceCriteria.forEach(criterion => {
      this.formData[criterion] = 1;
    });
  }

  onSubmit() {
    const dataToSend = {
      employeeId: this.employeeId,
      employeeName: this.employeeName,
      ratings: this.formData
    };

    console.log('📤 Sending to backend:', dataToSend);

    this.http.post('http://localhost:8080/rating/save/', dataToSend).subscribe({
      next: (response) => {
        console.log('✅ Submitted successfully:', response);
        alert('Form submitted successfully!');
      },
      error: (error) => {
        console.error('❌ Submission failed:', error);
        alert('Submission failed. Please check backend or URL.');
      }
    });
  }
}
