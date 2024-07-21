import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit, OnDestroy {
  @Input() title = 'Error';

  message = '';
  hidden = true;
  destroy$$ = new Subject();

  constructor(
    private messageService: MessageService,
  ) {}

  ngOnDestroy(): void {
    this.destroy$$.next(null);
    this.destroy$$.complete();
  }

  ngOnInit(): void {
    this.messageService.message$.pipe(
      takeUntil(this.destroy$$)
    )
      .subscribe(text => {
        this.hidden = false;
        this.message = text;
      })
  }
}
