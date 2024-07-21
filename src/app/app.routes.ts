import { Routes } from '@angular/router';
import { TodoPageComponent } from './pages/todo-page/todo-page.component';

export const routes: Routes = [
  { path: 'todos/:status', component: TodoPageComponent },
  { path: '**', redirectTo: '/todos/all', pathMatch: 'full' },
];
