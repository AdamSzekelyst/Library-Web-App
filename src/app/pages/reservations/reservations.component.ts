import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe, NgFor, NgIf } from '@angular/common';

interface Reservation {
  _id: string;
  bookId: string;
  reservedBy: string;
  reservedUntil: Date;
  book?: {
    title: string;
    author: string;
  };
}

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    DatePipe
  ],
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchReservations();
  }

  fetchReservations(): void {
    this.http.get<any>('http://localhost:3001/api/reservations').subscribe({
      next: (response) => {
        this.reservations = response.data;
        this.loadBookDetails();
      },
      error: (error) => {
        this.errorMessage = 'Failed to fetch reservations.';
        console.error('Error:', error);
      }
    });
  }

  loadBookDetails(): void {
    this.reservations.forEach((reservation, index) => {
      this.http.get<any>(`http://localhost:3001/api/books/${reservation.bookId}`).subscribe({
        next: (response) => {
          this.reservations[index].book = {
            title: response.data.title,
            author: response.data.author
          };
        },
        error: (error) => {
          console.error(`Error fetching book details for reservation ${reservation._id}:`, error);
        }
      });
    });
  }
}
