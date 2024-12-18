import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserService } from '../main-layout/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: UntypedFormGroup;
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: (response: any) => {
          const token = response.data.token;
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(response.data))
          this.router.navigate(['/']);
        },
        error: (error: any) => {
          this.errorMessage = 'Invalid email or password';
        }
      });
    }
  }
}
