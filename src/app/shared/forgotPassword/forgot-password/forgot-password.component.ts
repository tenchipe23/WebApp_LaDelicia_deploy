import { CommonModule } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {

  fgPassword!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private formB: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.fgPassword = this.formB.group({
      email: ['', [Validators.required, Validators.email]],
    })
  }
  submitRequest(): void {
    if (this.fgPassword.valid) {
      const email = this.fgPassword.value.email;
      console.log('Solicitud enviada para:', email);

      // Simulación de envío de email
      setTimeout(() => {
        if (email === 'carlos123@gmail.com') {
          this.successMessage = 'Se ha enviado un correo con instrucciones para restablecer su contraseña.';
          this.errorMessage = '';
        } else {
          this.errorMessage = 'No encontramos una cuenta asociada con este correo.';
          this.successMessage = '';
        }
      }, 1500);
    }
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }

}
