import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {
  name:string = '';
  surname:string = '';
  user:string = '';
  valid:boolean = false;
  regex = new RegExp('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
  constructor(public userService : UsersService){}

  onChange(){
    if(this.user.match(this.regex) && this.name.length > 0 && this.surname.length > 0)
      this.valid = true;
    else
      this.valid = false;
  }

  onSubmit(){
    if(this.valid){
      console.log(this.name, this.surname, this.user);
      this.userService.addUser(this.name, this.surname, this.user);
    }
    else
      Swal.fire({
        title: 'Dati non validi!',
        text: 'Controlla i dati inseriti e riprova.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
  }
}
