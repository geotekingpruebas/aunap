import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Signup } from './signup';
import { GC_USER_ID, GC_AUTH_TOKEN } from '../../shared/constants';
import { matchOtherValidator } from './match-other-validator';
// tslint:disable-next-line:import-blacklist
import {Observable} from 'rxjs/Rx';

import {
  CREATE_USER_MUTATION,
  CreateUserMutationResponse
} from './graphql';

import {Apollo} from 'apollo-angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

    login: boolean = true;
    loading: boolean = false;

    signupForm: FormGroup;

    successNot: boolean = false;
    successMess: string = `Se creo el nuevo usuario.`;

    errorNot: boolean = false;
    errorMess: string = `El usuario seleccionado ya existe o alguna 
                            campo no esta completamente diligenciado.`;

    messageNot: string = '';

    signupData: Signup = new Signup();

    constructor(private router: Router,
                private authService: AuthService,
                private apollo: Apollo) {
    }

    ngOnInit() {
        this.signupForm = new FormGroup({
            'name': new FormControl(this.signupData.name, [
              Validators.required,
              Validators.minLength(8)
            ]),
            'email': new FormControl(this.signupData.email, [
              Validators.required,
              Validators.email
            ]),
            'password': new FormControl(this.signupData.password, [
              Validators.required,
              Validators.minLength(8)
            ]),
            'password_confirmation':
            new FormControl(this.signupData.password_confirmation, [
              Validators.required,
              Validators.minLength(8),
              matchOtherValidator('password')
            ])
        });
    }

    get name() { return this.signupForm.get('name'); }
    get email() { return this.signupForm.get('email'); }
    get password() { return this.signupForm.get('password'); }
    get password_confirmation() { return this.signupForm.get('password_confirmation'); }

    onSubmit() {
        this.loading = true;
        this.successNot = false;
        this.errorNot = false;
        this.apollo.mutate({
          mutation: CREATE_USER_MUTATION,
          variables: {
              name: this.signupForm.get('name').value,
              email: this.signupForm.get('email').value,
              password: this.signupForm.get('password').value,
              password_confirmation: this.signupForm.get('password_confirmation').value,
          }
        }).subscribe((result) => {
          this.loading = false;
          this.login = true;
          var data: any =  result.data;
          const id = data.register.user.id;
          const token = data.register.access_token;
          this.saveUserData(id, token);
          this.successNot = true;
          this.messageNot = this.successMess;
          let timer = Observable.timer(2000,1000);
          timer.subscribe(t=> {
              this.router.navigate(['/main-admin'])
          });
        }, (error) => {
          this.loading = false;
          this.errorNot = true;
          this.messageNot = this.errorMess;
        })
    }

    removeNotification(){
        this.errorNot = false;
        this.successNot= false;
    }

    saveUserData(id, token) {
      localStorage.setItem(GC_USER_ID, id);
      localStorage.setItem(GC_AUTH_TOKEN, token);
      this.authService.setUserId(id);
    }
}
