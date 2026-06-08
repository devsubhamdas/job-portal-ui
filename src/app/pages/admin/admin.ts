import { Component, OnInit } from '@angular/core';
import { BtnSeverity, BtnSize, JobCard } from '../../components/job-card/job-card';
import { ButtonModule } from 'primeng/button';
import { NotFoundCard } from '../../components/not-found-card/not-found-card';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { AutoFocusModule } from 'primeng/autofocus';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';

interface JobType {
  name: string;
  value: string;
}

@Component({
  selector: 'app-admin',
  imports: [
    ReactiveFormsModule,
    JobCard,
    ButtonModule,
    NotFoundCard,
    DialogModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    SelectModule,
    RadioButtonModule,
    AutoFocusModule,
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  btnOption = { label: 'Remove', size: BtnSize.Small, severity: BtnSeverity.Danger };
  createJobDialogVisibility: boolean = false;
  createJobForm: FormGroup;
  formSubmitAttempted: boolean = false;
  jobTypes: JobType[] = [];

  constructor(private fb: FormBuilder) {
    this.createJobForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      companyName: ['', Validators.required],
      location: ['', Validators.required],
      salary: [null, Validators.required],
      type: ['', Validators.required],
      remote: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.jobTypes = [
      {
        name: 'Full-time',
        value: 'FULL-TIME',
      },
      {
        name: 'Part-time',
        value: 'PART-TIME',
      },
      {
        name: 'Internship',
        value: 'INTERNSHIP',
      },
    ];
  }

  onSubmit(event: SubmitEvent) {
    this.formSubmitAttempted = true;
    if (this.createJobForm.invalid) {
      console.log('clicked');
      return;
    }

    console.log(this.createJobForm.value);
  }

  showCreateJobDialog() {
    this.createJobDialogVisibility = true;
  }

  onDialogHide() {
    this.formSubmitAttempted = false;
    this.createJobForm.reset();
  }

  isInvalid(controlName: string) {
    const control = this.createJobForm.get(controlName);
    return control?.invalid && (control.touched || control.dirty || this.formSubmitAttempted);
  }

  get title() {
    return this.createJobForm.controls['title'];
  }
  get description() {
    return this.createJobForm.controls['description'];
  }
  get companyName() {
    return this.createJobForm.controls['companyName'];
  }
  get location() {
    return this.createJobForm.controls['location'];
  }
  get salary() {
    return this.createJobForm.controls['salary'];
  }
  get type() {
    return this.createJobForm.controls['type'];
  }
  get remote() {
    return this.createJobForm.controls['remote'];
  }
}
