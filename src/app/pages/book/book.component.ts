import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Book } from './book.model';
import { NgIf, DatePipe } from '@angular/common';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    DatePipe
  ],
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  book: Book|null = null;
  reservationDate: string = '';
  reservationName: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  minDate: string;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.minDate = new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.fetchBook(bookId);
    } else {
      this.errorMessage = 'Invalid book ID';
    }
  }

  fetchBook(bookId: string): void {
    this.http.get<any>(`http://localhost:3001/api/books/${bookId}`).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.book = response.data;
          console.log('Fetched book:', this.book);
        } else {
          this.errorMessage = 'Invalid response format';
          console.error('Invalid response:', response);
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to fetch book data.';
        console.error('Error fetching book:', error);
      }
    });
  }

  reserveBook(): void {
    if (!this.book?._id) {
      this.errorMessage = 'Book ID is missing';
      return;
    }

    if (!this.reservationName.trim()) {
      this.errorMessage = 'Please enter your name';
      return;
    }

    if (!this.reservationDate) {
      this.errorMessage = 'Please select a reservation date';
      return;
    }

    const requestBody = {
      reservedBy: this.reservationName.trim(),
      reservedUntil: this.reservationDate
    };

    this.http.post(
      `http://localhost:3001/api/books/${this.book._id}/reservation`,
      requestBody
    ).subscribe({
      next: (response: any) => {
        this.successMessage = 'Book reserved successfully!';
        this.errorMessage = '';

        if (this.book) {
          this.book.reservedBy = requestBody.reservedBy;
          this.book.loanedUntil = new Date(requestBody.reservedUntil);
        }

        if (this.book?._id) {
          this.fetchBook(this.book._id);
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to reserve the book.';
        this.successMessage = '';
      }
    });
  }

  isBookAvailable(): boolean {
    if (!this.book?.loanedUntil) return true;

    const loanedUntil = new Date(this.book.loanedUntil);
    const now = new Date();

    return loanedUntil < now;
  }
}
