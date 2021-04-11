import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css']
})
export class LoginSignupComponent implements OnInit {
  fullImagePath: string;
  url: string;
  login:boolean = true;

  constructor() { 
    this.fullImagePath = './assets/images/aunap.png';          
  }

  ngOnInit() {
  }

}
