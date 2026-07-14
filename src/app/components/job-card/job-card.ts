import { Component, input, output } from '@angular/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe } from '@angular/common';
import { TimeAgoPipe } from '../../pipes/time-ago/time-ago-pipe';
import { AppliedJobsQuery, OwnedJobsQuery, SearchJobsQuery } from '../../../generated/operations';
import { JobType } from '../../../generated/schema';

type Job =
  | NonNullable<SearchJobsQuery['searchJobs']['data']>[number]
  | NonNullable<AppliedJobsQuery['appliedJobs']>[number]
  | NonNullable<OwnedJobsQuery['ownedJobs']>[number];

export enum BtnSeverity {
  Primary = 'primary',
  Secondary = 'secondary',
  Info = 'info',
  Success = 'success',
  Danger = 'danger',
  Help = 'help',
  Warn = 'warn',
  Contrast = 'contrast',
}

export enum BtnVariant {
  Text = 'text',
  Outlined = 'outlined',
}

export enum BtnSize {
  Small = 'small',
  Large = 'large',
}

interface BtnOption {
  label: string;
  icon?: string;
  severity?: BtnSeverity;
  size?: BtnSize | undefined;
  variant?: BtnVariant | undefined;
  raised?: boolean;
  rounded?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'app-job-card',
  imports: [
    IconFieldModule,
    InputIconModule,
    CardModule,
    TagModule,
    ButtonModule,
    CurrencyPipe,
    TimeAgoPipe,
  ],
  templateUrl: './job-card.html',
  styleUrl: './job-card.css',
})
export class JobCard {
  data = input.required<Job>();
  btnOption = input<BtnOption>({
    label: 'Click',
    icon: '',
    severity: BtnSeverity.Primary,
    variant: undefined,
    size: undefined,
    raised: false,
    rounded: false,
    loading: false,
    disabled: false,
  });
  onBtnAction = output<void>();

  mapJobType(type: string) {
    switch (type) {
      case JobType.FullTime:
        return 'Full-Time';

      case JobType.Internship:
        return 'Internship';

      case JobType.PartTime:
        return 'Part-Time';

      default:
        return undefined;
    }
  }

  titleToInitials(title: string) {
    return title
      .split(' ')
      .map((word) => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
