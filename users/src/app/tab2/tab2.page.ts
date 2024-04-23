import { Component } from '@angular/core';
import { PerizieService } from '../services/perizie.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  selectedItem: string="";
  isOpen!: boolean[];
  constructor(public perizieService: PerizieService) {}

  ngOnInit(){
    this.perizieService.getPerizie();
    this.isOpen = new Array(this.perizieService.perizie.length).fill(false);
  }

  openMenu(index:number){
    this.isOpen[index] = !this.isOpen[index];
  }  
}
