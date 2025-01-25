import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Book } from '../../../types/Book';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-book.component.html',
  styleUrls: ['./update-book.component.css']
})
export class UpdateBookComponent implements OnInit {
  book: Book | null = null;
  bookForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      author: ['', [Validators.required, Validators.minLength(2)]],
      category: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loading = true;
    const bookId = this.route.snapshot.params['id'];

    this.http.get<{data: Book}>(`http://localhost:3001/api/books/${bookId}`)
      .subscribe({
        next: (response) => {
          this.book = response.data;
          this.bookForm.patchValue({
            title: this.book.title,
            author: this.book.author,
            category: this.book.category
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching book', error);
          this.error = 'Error loading book details';
          this.loading = false;
        }
      });
  }

  onSubmit(): void {
    if (this.bookForm.valid && this.book) {
      this.loading = true;
      const updatedData = this.bookForm.value;

      this.http.patch<{message: string, data: Book}>(
        `http://localhost:3001/api/books/${this.book._id}`,
        updatedData
      ).subscribe({
        next: (response) => {
          console.log('Book updated successfully', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error updating book', error);
          this.error = 'Error updating book';
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }

  get title() { return this.bookForm.get('title'); }
  get author() { return this.bookForm.get('author'); }
  get category() { return this.bookForm.get('category'); }
}
