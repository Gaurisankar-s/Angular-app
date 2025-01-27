import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyService } from '../services/policy.service';

@Component({
  selector: 'app-policy-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="policy-list-container">
      <h2>All Policies in DB</h2>
      <ul>
        <li *ngFor="let policy of policies" (click)="showPolicyDetails(policy.policyId)">
          {{ policy.policyName }}
        </li>
      </ul>
      <div *ngIf="selectedPolicy" class="policy-details">
        <h3>Policy Details</h3>
        <p><strong>ID:</strong> {{ selectedPolicy.policyId }}</p>
        <p><strong>Name:</strong> {{ selectedPolicy.policyName }}</p>
        <p><strong>Category:</strong> {{ selectedPolicy.policyCategory }}</p>
        <p><strong>Effective Date:</strong> {{ selectedPolicy.policyEffectiveDate }}</p>
        <p><strong>Requires Review:</strong> {{ selectedPolicy.requiresReview }}</p>
        <p><strong>Attestation E-Signature:</strong> {{ selectedPolicy.attestationRequiresESignature }}</p>
        <p><strong>Frequency Type:</strong> {{ selectedPolicy.attestationFrequencyType }}</p>
      </div>
    </div>
  `,
  styles: [`
    .policy-list-container {
      padding: 1rem;
      background-color: #f0f0f0;
      border-radius: 8px;
      margin-bottom: 1rem;
    }
    h2 {
      margin: 0 0 0.5rem 0;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      padding: 0.5rem 0;
      cursor: pointer;
    }
    li:hover {
      background-color: #e0e0e0;
    }
    .policy-details {
      margin-top: 1rem;
      padding: 1rem;
      background-color: #ffffff;
      border-radius: 8px;
    }
  `]
})
export class PolicyListComponent implements OnInit {
  policies: any[] = [];
  selectedPolicy: any = null;

  constructor(private policyService: PolicyService) {}

  ngOnInit() {
    this.loadPolicies();
  }

  loadPolicies() {
    this.policyService.getAllPolicies().subscribe({
      next: (policies) => {
        this.policies = policies;
      },
      error: (error) => {
        console.error('Error loading policies:', error);
      }
    });
  }

  showPolicyDetails(policyId: string) {
    this.policyService.getPolicyById(policyId).subscribe({
      next: (policy) => {
        this.selectedPolicy = policy;
      },
      error: (error) => {
        console.error('Error fetching policy details:', error);
      }
    });
  }
}
