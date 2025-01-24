import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PolicyFormComponent } from './policy-form/policy-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PolicyFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Word-app';
}
