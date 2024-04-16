import { Component } from '@angular/core';
import { PerizieService } from '../../services/perizie.service';

@Component({
  selector: 'app-edit-perizia',
  templateUrl: './edit-perizia.component.html',
  styleUrl: './edit-perizia.component.css'
})
export class EditPeriziaComponent {
    perizia!:any;
    descrizione!:string;
    commenti:string[] = [];

    constructor(public periziaService : PerizieService) {}

    ngOnInit(){
      this.perizia = this.periziaService.selectedPerizia;
      this.descrizione = this.perizia.descrizione;
      for (const iterator of this.perizia.photos) {
        this.commenti.push(iterator.commento);
      }
    }

    closeWindow(){
      this.periziaService.isShowEdit = false;
    }

    onSave(){
      this.perizia.descrizione = this.descrizione;
      for(let i = 0;i<this.commenti.length;i++){
        this.perizia.photos[i].commento = this.commenti[i];
      }
      console.log(this.perizia);
      this.periziaService.updatePerizia(this.perizia);
    }
}
