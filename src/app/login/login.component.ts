import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  readonly DEMO_PASSWORD = '123456';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // Get email from URL parameters and set it in the form
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.loginForm.patchValue({
          email: params['email']
        });
      }
    });
  }

  private generatePasskey(): string {
    // Generate a random passkey using crypto API
    const array = new Uint8Array(32); // 256 bits
    crypto.getRandomValues(array);
    return Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      if (password !== this.DEMO_PASSWORD) {
        alert('Invalid password.');
        return;
      }

      this.userService.checkUserEmail(email).subscribe({
        next: (exists) => {
          if (exists) {
            const passkey = this.generatePasskey();
            // Store the passkey in MongoDB
            this.userService.storePasskey(email, passkey).subscribe({
              next: (response) => {
                console.log('Passkey stored successfully:', response);
                console.log('Generated Passkey:', passkey);
                console.log('Login successful');
                this.router.navigate(['/main']);
              },
              error: (error) => {
                console.error('Error storing passkey:', error);
                alert('Error during login. Please try again.');
              }
            });
          } else {
            console.error('Login failed: Email not found');
            alert('Login failed: Email not found in users collection');
          }
        },
        error: (error) => {
          console.error('Error checking email:', error);
          alert('Error during login. Please try again.');
        }
      });
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
} 