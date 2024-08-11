import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { userSub } from '../../models/userSub';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  subscribeForm!: FormGroup;

  user: userSub = {
    username: '',
    password: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.subscribeForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (this.subscribeForm.valid) {
      this.user = {
        username: this.subscribeForm.get('username')?.value,
        password: this.subscribeForm.get('password')?.value,
      };

      // Chiamata a registerUser() del servizio AuthService con il Bearer token
      this.authService.registerUser(this.user).subscribe(
        (newUser) => {
          console.log('Nuovo utente registrato:', newUser);
          localStorage.setItem('currentUser', JSON.stringify(newUser));
          this.router.navigate(['/home']);
        },
        (error: any) => {
          console.error("Errore durante la registrazione dell'utente:", error);

          if (error.status === 400) {
            alert('username already exists!');
          }
        }
      );
    }
  }
}
