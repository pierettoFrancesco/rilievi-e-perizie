import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  type:string = 'password';
  eyeIcon:string = 'visibility_off';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void{
    this.loginForm = this.fb.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['',Validators.required]
    });
  }

  showHidePwd(){
    console.log('showHidePwd');
    if(this.type === 'password'){
      this.type = 'text';
      this.eyeIcon = 'visibility';
    } else {
      this.type = 'password';
      this.eyeIcon = 'visibility_off';
    }
  }

  onSubmit(){
    if(this.loginForm.valid){
      console.log("OTTIMO");
    }
    else{
      console.log('Please enter valid credentials');
      this.validateAllFormFields(this.loginForm);
    }
  }

  private validateAllFormFields(formGroup: FormGroup){
    Object.keys(formGroup.controls).forEach(field => {
      console.log(field, "campo");
      const control = formGroup.get(field);
      if(control instanceof FormControl){
        console.log(control, "control");
        control.markAsDirty({onlySelf: true});
      }
      else if(control instanceof FormGroup){
       this.validateAllFormFields(control);
      }
    });
  }
}
