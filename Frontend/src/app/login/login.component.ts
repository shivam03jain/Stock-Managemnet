import { Component } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthDataService } from '../auth-data.service';
import { MatCardModule } from '@angular/material/card';
import { Route, Router, RouterLink } from '@angular/router';
import { LocalService } from '../local.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule , ReactiveFormsModule, MatButtonModule, MatInputModule, MatCardModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {

  loginForm = this.formBuilder.group({
    email : ['shivam03jain@gmail.com',[Validators.required]],
    password : ['shivam123',[Validators.required]]
  })

  constructor(private formBuilder : FormBuilder, private authData : AuthDataService ,
    private localService : LocalService , private router : Router){}

  onSubmit() : void {
    this.authData.login(this.loginForm).subscribe((response) => {
      // console.log(response.token)
      // console.log(this.loginForm);
      localStorage.setItem("access_token", JSON.stringify(response.token));
      this.localService.setToken(response.token)
      if (this.localService.isAuthenticated()){
        this.router.navigate([""])
      }
    });;
    this.localService.setEmail(<string>this.loginForm.value.email)
  }
}