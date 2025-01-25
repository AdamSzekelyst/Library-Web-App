import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BookComponent } from './pages/book/book.component';
import { CreateComponent } from './pages/create/create.component';
import { UpdateBookComponent } from './components/update/update-book.component';
import { ReservationsComponent } from './pages/reservations/reservations.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'book/:id', component: BookComponent },
  { path: 'create', component: CreateComponent },
  { path: 'update/:id', component: UpdateBookComponent },
  { path: 'reservations', component: ReservationsComponent }
];
