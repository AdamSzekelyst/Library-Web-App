import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./create.component.css']
})
export class CreateComponent {
  title = '';
  author = '';
  category = '';

  constructor(private router: Router, private http: HttpClient) {}

  onSubmit(productForm: any): void {
    if (productForm.valid) {
      const product = {
        title: this.title,
        author: this.author,
        category: this.category,
      };
      console.log('Product created:', product);
      this.http.post(`http://localhost:3001/api/books`, product, {
        withCredentials: true
      }).subscribe({
        next: (response: any) => {
          console.log('Creating book successful', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Creating failed', error);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }
}
