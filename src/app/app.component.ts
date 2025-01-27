import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PolicyFormComponent } from './policy-form/policy-form.component';
import { UserFormComponent } from './user-form/user-form.component';
import { PolicyListComponent } from './policy-list/policy-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PolicyFormComponent, UserFormComponent, PolicyListComponent],
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
