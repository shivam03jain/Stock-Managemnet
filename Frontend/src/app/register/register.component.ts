import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { AuthDataService } from '../auth-data.service';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatFormFieldModule , ReactiveFormsModule , MatInputModule , MatButtonModule , MatCardModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registerForm = this.formBuilder.group({
    firstName : ["Shivam",[Validators.required]],
    lastName : ["Jain",[Validators.required]],
    email : ["shivam03jain@gmail.com" , [Validators.required]],
    password : ["shivam123",[Validators.required]],
  })

  constructor(private formBuilder : FormBuilder , private authData : AuthDataService,
    private router : Router){}

  onSubmit() : void {
    console.log(this.registerForm.value)
    this.authData.register(this.registerForm).subscribe((result) => {
      console.warn(result,"Register");
      this.router.navigate(["/login"])
    });
  }
}
