import { Pipe, PipeTransform } from '@angular/core';
import { Todo } from '../types/todo';

@Pipe({
  name: 'filterActive',
  standalone: true,
  pure: true
})
export class FilterActivePipe implements PipeTransform {

  transform(todos: Todo[],): Todo[] {
    return todos.filter(todo => !todo.completed);
  }

}
