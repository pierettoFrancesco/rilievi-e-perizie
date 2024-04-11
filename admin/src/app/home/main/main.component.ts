import { Component, ElementRef, ViewChild } from '@angular/core';
import { PerizieService } from '../../services/perizie.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  filter: string = 'tutti';
  isOpen: boolean = false;
  constructor(public perizieService : PerizieService) {}
  position: any = {"lat":44.5557763, "lng":7.7347183};

  ngOnInit() {
    this.perizieService.initMap(this.position);
  }

  openMenu(){
    this.isOpen = !this.isOpen;
  }  

  changeFilter(perizia: string){
    this.filter = perizia;
    this.isOpen = false;
  }
 
    
}