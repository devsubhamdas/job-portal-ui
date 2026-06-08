import { Component, input, output } from '@angular/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe } from '@angular/common';

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
  disabled?: boolean;
}

@Component({
  selector: 'app-job-card',
  imports: [IconFieldModule, InputIconModule, CardModule, TagModule, ButtonModule, CurrencyPipe],
  templateUrl: './job-card.html',
  styleUrl: './job-card.css',
})
export class JobCard {
  jobInfo = input();
  btnOption = input<BtnOption>({
    label: 'Click',
    icon: '',
    severity: BtnSeverity.Primary,
    variant: undefined,
    size: undefined,
    raised: false,
    rounded: false,
    disabled: false,
  });
  onBtnAction = output<void>();
}
