import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PerizieService } from '../services/perizie.service';
import Swal from 'sweetalert2';
import { LibraryService } from '../services/library.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  navigate: string = "";
  constructor(private router:Router, public perizieService: PerizieService) {}

  ngOnInit(){
    this.navigate = this.router.url.split('/')[2];
    this.perizieService.getAccess();
    
  }

  IonViewWillEnter(){
    this.navigate = this.router.url.split('/')[2];
  }

  getClass(name:string){
    this.navigate = name;
  }

  
}
