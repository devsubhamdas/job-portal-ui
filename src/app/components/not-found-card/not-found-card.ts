import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-not-found-card',
  imports: [CardModule],
  templateUrl: './not-found-card.html',
  styleUrl: './not-found-card.css',
})
export class NotFoundCard {
  content = input<string>('Not found...');
}
