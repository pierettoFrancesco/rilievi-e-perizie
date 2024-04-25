import { Injectable } from '@angular/core';
import { LibraryService } from './library.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users!:any;
  loading:boolean = false;
  isAddUser:boolean = false;
  constructor(public libraryService : LibraryService) { }

  async getUsers()  {
    let data = (await this.libraryService.inviaRichiesta("get", "/api/getUsers").catch(this.libraryService.errore) as any);
    if(data["data"])
     this.users = data["data"];
  }

  deleteUsers(id: string) {
    Swal.fire({
      title: 'Sei sicuro?',
      text: "Non potrai più recuperare l'utente!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annulla',
      confirmButtonText: 'Conferma'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading=true;
        let rq = this.libraryService.inviaRichiesta("delete", "/api/deleteUser", {"id": id});
        rq.then((response) => {
          console.log(response);
          this.getUsers();
          this.loading = false;
        });
        rq.catch((error) => {
          console.log(error);
        });
      }
    })
  }

  addUser(name: string, surname: string, user: string) {
     this.libraryService.inviaRichiesta("post", "/api/addUser", {"name": name, "surname": surname, "user": user})
     .then((response) => {
      console.log(response);
        Swal.fire({
          title: 'Utente aggiunto!',
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.isConfirmed) {
            this.closeWindow();
            this.getUsers();
          }
        });
     })
     .catch((error) => {
      if(error.response.data == "Username già esistente"){
        Swal.fire({
          title: 'Username già esistente!',
          text: 'Inserisci un altro username.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
      else{
        this.libraryService.errore(error)
      }
     });
  }

  closeWindow(){
    this.isAddUser = false;
  }

  async changePassword(){
    let newPassword = "";
    let oldPassword = "";
    const { value: formValues } = await Swal.fire({
      title: 'Cambia Password',
      html:
        '<style>.swal2-input { width: 80%; }</style>' +
        '<div>' +
        '<input id="swal-input1" class="swal2-input" type="password" placeholder="Vecchia Pwd">' +
        '<input id="swal-input2" class="swal2-input" type="password" placeholder="Nuova Pwd">' +
        '</div>',
      focusConfirm: false,
      preConfirm: () => {
        let _new =document.getElementById('swal-input2') as HTMLInputElement;
        let _old =document.getElementById('swal-input1') as HTMLInputElement;
        if(_new.value != _old.value && _new.value != "" && _old.value != "") {
          return [_new.value,
                _old.value];
        }
        else{
          Swal.showValidationMessage(`Le password o corrispondono o sono vuote`);
          return false;
        }
      }
    })
    
    if (formValues) {
      // formValues is an array that contains the values of the inputs
      const [newPwd,oldPwd] = formValues;
      newPassword = newPwd;
      oldPassword=oldPwd
      // You can now use these values to change the password
      // Make sure to validate the inputs (e.g., check if newPassword and confirmPassword are the same)
    }
    
    let response = (await this.libraryService.inviaRichiesta("PATCH", "/api/changePwd", {newPassword,oldPassword}).catch(err => {this.libraryService.errore(err)}) as any).data;
    if(response){
      Swal.fire({
        title: 'Password Cambiata',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
      })
    }
    else{
      Swal.fire({
        title: 'Password non cambiata',
        text: 'errore',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  }
}
