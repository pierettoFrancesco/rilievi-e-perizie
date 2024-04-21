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
}
