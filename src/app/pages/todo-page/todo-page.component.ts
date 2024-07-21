import { Component, OnInit } from '@angular/core';
import { TodosService } from '../../services/todos.service';
import { MessageService } from '../../services/message.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Status } from '../../types/status';
import { distinctUntilChanged, map, Observable, of, switchMap } from 'rxjs';
import { Todo } from '../../types/todo';
import { CommonModule } from '@angular/common';
import { TodoComponent } from '../../components/todo/todo.component';
import { TodoFormComponent } from '../../components/todo-form/todo-form.component';
import { MessageComponent } from '../../components/message/message.component';
import { FilterComponent } from '../../components/filter/filter.component';

@Component({
  selector: 'app-todo-page',
  standalone: true,
  imports: [
    CommonModule,
    TodoComponent,
    TodoFormComponent,
    MessageComponent,
    FilterComponent,
    RouterModule,
],
  templateUrl: './todo-page.component.html',
  styleUrl: './todo-page.component.scss'
})
export class TodoPageComponent implements OnInit {
  todos$: Observable<Todo[]> = new Observable<Todo[]>();
  activeTodos$: Observable<Todo[]> = of([]);
  completedTodos$: Observable<Todo[]> = of([]);
  activeCount$: Observable<number> = of(0);
  visibleTodos$: Observable<Todo[]> = of([]);

  constructor(
    private todosService: TodosService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.todos$ = this.todosService.todos$;

    this.activeTodos$ = this.todos$.pipe(
      distinctUntilChanged(),
      map(todos => todos.filter(todo => !todo.completed))
    );

    this.completedTodos$ = this.todos$.pipe(
      map(todos => todos.filter(todo => todo.completed))
    );

    this.activeCount$ = this.activeTodos$.pipe(
      map(todos => todos.length)
    );

    this.visibleTodos$ = this.route.params.pipe(
      switchMap(params => {
        switch (params['status'] as Status) {
          case 'active':
            return this.activeTodos$;

          case 'completed':
            return this.completedTodos$

          default:
            return this.todos$;
        }
      })
    )

    this.todosService.loadTodos()
      .subscribe({
        error: () => this.messageService.showMessage('Unable to load todos'),
      })
  }

  trackById = (i: number, todo: Todo) => todo.id;

  addTodo(newTitle: string) {
    this.todosService.createTodo(newTitle)
      .subscribe({
        error: () => this.messageService.showMessage('Unable to add a todo'),
      });
  }

  toggleTodo(todo: Todo) {
    this.todosService.updateTodo({ ...todo, completed: !todo.completed })
      .subscribe({
        error: () => this.messageService.showMessage('Unable to toggle a todo'),
      });
  }

  renameTodo(todo: Todo, title: string) {
    this.todosService.updateTodo({ ...todo, title })
      .subscribe({
        error: () => this.messageService.showMessage('Unable to rename a todo'),
      });
  }

  deleteTodo(todo: Todo) {
    this.todosService.deleteTodo(todo)
      .subscribe({
        error: () => this.messageService.showMessage('Unable to delete a todo'),
      });
  }
}
