import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.loginFormGroup = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  login() {
    if (this.loginFormGroup.invalid) {
      return;
    }

    const username = this.loginFormGroup.get('username')?.value;
    const password = this.loginFormGroup.get('password')?.value;

    this.authService.login(username, password).subscribe({
      next: () => {
        this.router.navigate(['/admin/home']); // Navigate to dashboard or home page
      },
      error: (error) => {
        this.errorMessage = 'Invalid username or password';
      }
    });
  }

  register() {
    this.router.navigate(['/register']);
  }
}
