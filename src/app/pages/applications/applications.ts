import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { BtnSeverity, BtnSize, JobCard } from '../../components/job-card/job-card';
import { NotFoundCard } from '../../components/not-found-card/not-found-card';

@Component({
  selector: 'app-applications',
  imports: [DividerModule, JobCard, NotFoundCard],
  templateUrl: './applications.html',
  styleUrl: './applications.css',
})
export class Applications {
  btnOption = { label: 'Cancel', size: BtnSize.Small, severity: BtnSeverity.Secondary };
}
