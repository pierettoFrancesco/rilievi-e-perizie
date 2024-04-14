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
  selectedPerizia: any;
  constructor(public perizieService : PerizieService) {}
  position: any = {"lat":44.5557763, "lng":7.7347183};

  ngOnInit() {
    this.perizieService.initMap(this.position, this.filter);

    
    document.addEventListener("click", async (e) => {
        if((e.target as HTMLElement).id.startsWith("route")){
          console.log("route");
          this.perizieService.selectedPerizia =this.perizieService.perizie.find((perizia: any) => perizia._id == (e.target as HTMLElement).id.split("-")[1]);
          console.log(this.perizieService.selectedPerizia)
          await this.perizieService.showRoute(this.position);
          console.log(this.perizieService.isShowFilter);
          if (this.perizieService.isShowFilter == true){
            this.perizieService.isShowFilter = false;
            console.log("hide");
            console.log(this.perizieService.isShowFilter);
          }  
        }
    });

  }

  openMenu(){
    this.isOpen = !this.isOpen;
  }  

  changeFilter(perizia: string){
    this.filter = perizia;
    this.isOpen = false;
    this.perizieService.initMap(this.position, this.filter);
  }

  showPath(){
    this.perizieService.isShowFilter = true;
    this.filter = 'tutti';
    this.perizieService.initMap(this.position, this.filter);
  }
 
    
}