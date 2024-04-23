import { Injectable } from '@angular/core';
import { LibraryService } from './library.service';

@Injectable({
  providedIn: 'root'
})
export class PerizieService {
  perizie: any[] = [];

  constructor(public libraryService : LibraryService) { }

  async getPerizie() {
    this.perizie = (await this.libraryService.inviaRichiesta("GET", "/api/loadPerizie").catch(err => {this.libraryService.errore(err)}) as any).data;
    console.log(this.perizie);
  }
}
