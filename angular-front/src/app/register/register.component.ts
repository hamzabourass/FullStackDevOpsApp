import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerFormGroup: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.registerFormGroup = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      fullName: ['',Validators.required]
    });
  }

  ngOnInit(): void {}

  register() {
    if (this.registerFormGroup.invalid) {
      return;
    }

    const email = this.registerFormGroup.get('email')?.value;
    const password = this.registerFormGroup.get('password')?.value;
    const fullName = this.registerFormGroup.get('fullName')?.value;

    this.authService.register(email, password,fullName).subscribe({
      next: () => {
        this.router.navigate(['/login']); // Navigate to dashboard or home page
      },
      error: (error) => {
        this.errorMessage = '';
      }
    });
  }

  login() {
    this.router.navigate(['/login']);
  }
}
