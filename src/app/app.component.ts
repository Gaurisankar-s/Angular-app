import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PolicyFormComponent } from './policy-form/policy-form.component';
import { UserFormComponent } from './user-form/user-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PolicyFormComponent, UserFormComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Word-app';
  showUserForm = false;
  showPolicyForm = false;

  toggleUserForm() {
    this.showUserForm = !this.showUserForm;
  }

  togglePolicyForm() {
    this.showPolicyForm = !this.showPolicyForm;
  }
}
