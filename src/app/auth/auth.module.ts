import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { FaConfig } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faLock, faUser, faSpinner } from '@fortawesome/free-solid-svg-icons';


@NgModule({
  declarations: [
    LoginSignupComponent,
    LoginComponent,
    SignupComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AuthModule {
  constructor(library: FaIconLibrary, faConfig: FaConfig) {
    // Add an icon to the library for convenient access in other components
    library.addIcons(faEnvelope, faLock, faUser, faSpinner);
    faConfig.defaultPrefix = 'fas';
  }
}
