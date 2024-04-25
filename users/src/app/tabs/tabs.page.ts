import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PerizieService } from '../services/perizie.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  navigate: string = "tab1";
  constructor(private router:Router, public perizieService: PerizieService) {}

  ngOnInit(){
    this.navigate = this.router.url.split('/')[2];
    this.perizieService.getAccess();
    
  }
  getClass(name:string){
    this.navigate = name;
  }

  
}
