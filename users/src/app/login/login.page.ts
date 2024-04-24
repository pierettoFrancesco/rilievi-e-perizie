import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../services/library.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  type:string = 'password';
  eyeIcon:string = 'visibility_off';
  error : string = '';
  constructor(private fb: FormBuilder,public libraryService : LibraryService,private router:Router) { }

  ngOnInit(): void{
    this.loginForm = this.fb.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['',Validators.required]
    });
  }

  ionViewWillEnter(){
    this.loginForm.reset();
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
      console.log(this.loginForm.value.email);
      console.log(this.loginForm.value.password);
      let request = this.libraryService.inviaRichiesta('POST', '/api/login',  
				{ 
          "username": this.loginForm.value.email,
				  "password": this.loginForm.value.password,
          "admin":false
				}
			);
      request.then((response :any) => {		
        console.log(response.data);		
        this.router.navigateByUrl('/tabs');
      })		
			request.catch((err : any) => {
				if(err.response.status == 401){
					//errore
					console.log(err.response.data)
          this.error = err.response.data;
          this.loginForm = this.fb.group({
            email: ['',[Validators.required, Validators.email]],
            password: ['',Validators.required]
          });
          this.showAlert();

				}
				else{
					this.libraryService.errore(err); 
				}
			});
    }
    else{
      this.validateAllFormFields(this.loginForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup){
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

  showAlert(){
    swal.fire({
      title: 'Errore!',
      text: this.error,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }

  recuperaPwd(){
    swal.fire({
      title: 'Recupero password',
      text: 'Inserisci la tua email',
      input: 'email',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Recupera',
      showLoaderOnConfirm: true,
      preConfirm: (email) => {
        console.log(email);
        let request = this.libraryService.inviaRichiesta('POST', '/api/recuperaPwd',{"email":email, "skipCheckToken":true});
        request.then((response :any) => {
          console.log(response.data);
          swal.fire('Email inviata', 'Controlla la tua casella di posta', 'success');
        });
        request.catch((err :any) => {
          console.log(err);
          swal.fire('Errore', "Errore nell'invio dell'email", 'error');
        });
      }
      });
  }

}