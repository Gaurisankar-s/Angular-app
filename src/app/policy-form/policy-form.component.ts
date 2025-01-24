import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-policy-form',
  templateUrl: './policy-form.component.html',
  styleUrls: ['./policy-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class PolicyFormComponent implements OnInit {
  policyForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.policyForm = this.fb.group({
      workflow: ['', Validators.required],
      policyName: ['', Validators.required],
      policyCategory: ['', Validators.required],
      effectiveDate: [''],
      policyOwners: [[]],
      needsReview: [''],
      approvalWorkflow: ['', Validators.required],
      portalAccess: [[]],
      attestation: [[]],
      requiresESignature: [false],
      attestationSchedule: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.policyForm.valid) {
      console.log(this.policyForm.value);
      // Handle form submission
    }
  }

  addToWord(): void {
    // Implement MS Word integration logic
    console.log('Adding to MS Word...');
  }
}
