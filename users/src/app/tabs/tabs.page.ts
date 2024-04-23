import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  navigate: string = "tab1";
  constructor(private router:Router) {}

  ngOnInit(){
    this.navigate = this.router.url.split('/')[2];
  }
  getClass(name:string){
    this.navigate = name;
  }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
