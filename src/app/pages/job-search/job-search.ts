import { Component, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { JobCard } from '../../components/job-card/job-card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { BtnSeverity, BtnSize, BtnVariant } from '../../components/job-card/job-card';
import { NotFoundCard } from '../../components/not-found-card/not-found-card';

@Component({
  selector: 'app-job-search',
  imports: [InputTextModule, IconFieldModule, InputIconModule, JobCard, NotFoundCard],
  templateUrl: './job-search.html',
  styleUrl: './job-search.css',
})
export class JobSearch {
  readonly BtnSeverity = BtnSeverity;
  readonly BtnSize = BtnSize;
  readonly BtnVariant = BtnVariant;

  searchResultsLoading = signal<boolean>(false);

  btnOption = { label: 'Apply', size: BtnSize.Small, severity: BtnSeverity.Secondary };

  handleClick() {
    console.log('hello');
  }
}
