import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { Router} from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Login } from './login';
import { GC_USER_ID, GC_AUTH_TOKEN } from '../../shared/constants';

import {
  SIGNIN_USER_MUTATION,
  SigninUserMutationResponse
} from './graphql';

import {Apollo} from 'apollo-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    login: boolean = true;
    loading: boolean = false;

    loginForm: FormGroup;

    errorNot: boolean = false;
    messageNot: string = `Credenciales Invalidas.`;

    loginData: Login = new Login();

    showHead: boolean = false;

    constructor(private router: Router,
                private authService: AuthService,
                private apollo: Apollo) {
        this.showHead = false;
    }

    ngOnInit() {
        this.loginForm = new FormGroup({
            'email': new FormControl(this.loginData.email, [
              Validators.required,
              Validators.email
            ]),
            'password': new FormControl(this.loginData.password, [
              Validators.required,
              Validators.minLength(8)
            ])
        });
    }

    get email() { return this.loginForm.get('email'); }
    get password() { return this.loginForm.get('password'); }

    onSubmit() {
        this.apollo.mutate({
            mutation: SIGNIN_USER_MUTATION,
            variables: {
                email: this.loginForm.get('email').value,
                password: this.loginForm.get('password').value,
            }
        }).subscribe((result) => {
            var data: any =  result.data;
            const id = data.login.user.id;
            const token = data.login.access_token;
            this.saveUserData(id, token);

            if (this.authService.isSetUser) {
                // Get the redirect URL from our auth service
                // If no redirect has been set, use the default
                let redirect = this.authService.redirectUrl ?
                this.router.parseUrl(this.authService.redirectUrl) :
                 '/data-table'; // Redirect the user
                this.router.navigateByUrl(redirect);
            }

        }, (error) => {
              this.loading = false;
              this.errorNot = true;
        });
    }

    saveUserData(id, token) {
      localStorage.setItem(GC_USER_ID, id);
      localStorage.setItem(GC_AUTH_TOKEN, token);
      this.authService.setUserId(id);
    }
    removeNotification(){
      
    }
}
