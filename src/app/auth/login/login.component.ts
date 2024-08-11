import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // Corretto il nome del file
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.loginUser(username, password).subscribe(
        (loggedUser) => {
          if (loggedUser && loggedUser.token) {
            localStorage.setItem('currentUser', JSON.stringify(loggedUser));
            this.router.navigate(['/home']);
          } else {
            this.loginError = 'Login fallito, per favore riprova.';
          }
        },
        (error) => {
          this.loginError = 'Errore durante il login, per favore riprova.';
          console.error('Login error:', error);
        }
      );
    }
  }
}
