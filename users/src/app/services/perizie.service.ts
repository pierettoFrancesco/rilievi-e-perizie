import { Injectable } from '@angular/core';
import { LibraryService } from './library.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PerizieService {
  perizie: any[] = [];
  isFirstAccess!: boolean;

  constructor(public libraryService: LibraryService) { }

  async getPerizie() {
    this.perizie = (await this.libraryService.inviaRichiesta("GET", "/api/loadPerizie").catch(err => { this.libraryService.errore(err) }) as any).data;
    console.log(this.perizie);
  }

  async getAccess() {
    this.isFirstAccess = (await this.libraryService.inviaRichiesta("GET", "/api/getAccess").catch(err => { this.libraryService.errore(err) }) as any).data.firstAccess;
    console.log(this.isFirstAccess);
    if (this.isFirstAccess == true) {
      this.changePassword();
    }
  }

  async changePassword() {
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
      showCancelButton: true,
      cancelButtonText: 'Annulla',
      focusConfirm: false,
      allowOutsideClick: false,
      preConfirm: () => {
        let _new = document.getElementById('swal-input2') as HTMLInputElement;
        let _old = document.getElementById('swal-input1') as HTMLInputElement;
        if (_new.value != _old.value && _new.value != "" && _old.value != "") {
          return [_new.value,
          _old.value];
        }
        else {
          Swal.showValidationMessage(`Le password o corrispondono o sono vuote`);
          return false;
        }
      }
    })

    if (formValues) {
      // formValues is an array that contains the values of the inputs
      const [newPwd, oldPwd] = formValues;
      newPassword = newPwd;
      oldPassword = oldPwd
    }

    if (newPassword && oldPassword) {
      let response = (await this.libraryService.inviaRichiesta("PATCH", "/api/changePwd", { newPassword, oldPassword }).catch(err => { this.libraryService.errore(err) }) as any).data;
      if (response) {
        Swal.fire({
          title: 'Password Cambiata',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        })
      }
      else {
        Swal.fire({
          title: 'Password non cambiata',
          text: 'errore',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    }

  }
}
