import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent } from '../../../shared/navbar/navbar/navbar.component';
import { FooterComponent } from "../../../shared/footer/footer/footer.component";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, FooterComponent, NavbarComponent, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage = '';

  constructor(private formB: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.loginForm = this.formB.group({
      identifier: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30),
      this.identifierValidator ]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
    });
  }
  login(): void {
    const { identifier, password } = this.loginForm.value;

    if (!identifier || !password) {
      this.errorMessage = 'Credenciales requeridas';
      return;
    }

    const credentials = identifier.includes('@')
      ? { email: identifier, password }
      : { username: identifier, password };

    console.log('Enviando credenciales:', credentials);

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.authService.handleLoginResponse(response);
      },
      error: (error) => {
        console.error('Error en el login:', error);
        this.errorMessage = error.error?.message || 'Error al iniciar sesión';
      },
    });
  }


  redirectToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  identifierValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value || '';

    // Caso 1: No contiene "@", entonces se trata como username => válido
    if (!value.includes('@')) {
      return null;
    }

    // Caso 2: Contiene "@", se trata como email => forzar patrón Gmail
    // Debe coincidir con algo antes del "@", y luego "@gmail.com"
    // Ejemplo: "nombre@gmail.com" con letras, dígitos o signos permitidos
    const gmailPattern = /^[A-Za-z0-9._%+-]+@gmail\.com$/;

    if (!gmailPattern.test(value)) {
      // Retorna un error con la clave "invalidGmail"
      return { invalidGmail: true };
    }

    // Pasa la validación
    return null;
  }

}
