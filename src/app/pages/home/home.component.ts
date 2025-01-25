import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgForOf } from '@angular/common';
import { Book } from '../../../types/Book';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,NgForOf],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  books: Book[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  navigateToCreateProduct(): void {
    this.router.navigate(['create']);
  }

  fetchProducts(): void {
    this.http.get<{ data: Book[] }>('http://localhost:3001/api/books/')
      .subscribe({
        next: (response) => {
          console.log('Fetching products successful', response);
          this.books = response.data;
        },
        error: (error) => {
          console.error('Fetching products failed', error);
        }
      });
  }

  navigateToProductPage(bookId: string): void {
    this.router.navigate([`/book/${bookId}`]);
  }

  updateBook(book: Book): void {
    this.router.navigate([`/update/${book._id}`]);
  }

  deleteBook(bookId: string): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.http.delete(`http://localhost:3001/api/books/${bookId}`)
        .subscribe({
          next: () => {
            console.log(`Book with ID ${bookId} deleted successfully.`);
            this.books = this.books.filter(book => book._id !== bookId);
          },
          error: (error) => {
            console.error('Failed to delete book', error);
            alert('Failed to delete the book. Please try again later.');
          }
        });
    }
  }

  ngOnInit(): void {
    this.fetchProducts();
  }
}
