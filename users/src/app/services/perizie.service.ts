import { Injectable } from '@angular/core';
import { LibraryService } from './library.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PerizieService {
  perizie: any[] = [];
  isFirstAccess!: boolean;

  constructor(public libraryService : LibraryService) { }

  async getPerizie() {
    this.perizie = (await this.libraryService.inviaRichiesta("GET", "/api/loadPerizie").catch(err => {this.libraryService.errore(err)}) as any).data;
    console.log(this.perizie);
  }

  async getAccess(){
    this.isFirstAccess = (await this.libraryService.inviaRichiesta("GET", "/api/getAccess").catch(err => {this.libraryService.errore(err)}) as any).data.firstAccess;
    console.log(this.isFirstAccess);
    if(this.isFirstAccess == true){
      const { value: formValues } = await Swal.fire({
        title: 'Cambia Password',
        html:
          '<style>.swal2-input { width: 80%; }</style>' +
          '<div>' +
          '<input id="swal-input2" class="swal2-input" type="password" placeholder="Nuova Pwd">' +
          '</div>',
        focusConfirm: false,
        preConfirm: () => {
          return (document.getElementById('swal-input2') as HTMLInputElement).value
        }
      })
      if (formValues) {
        // formValues is an array that contains the values of the inputs
        const newPassword = formValues;
        this.changePassword(newPassword);
        // You can now use these values to change the password
        // Make sure to validate the inputs (e.g., check if newPassword and confirmPassword are the same)
      }
    }
  }

  async changePassword(newPassword:string){
    let response = (await this.libraryService.inviaRichiesta("PATCH", "/api/changePwd", {newPassword}).catch(err => {this.libraryService.errore(err)}) as any).data;
    if(response){
      Swal.fire({
        title: 'Password Cambiata',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }
}
