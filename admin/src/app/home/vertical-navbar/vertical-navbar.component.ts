import { Component, ElementRef} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vertical-navbar',
  templateUrl: './vertical-navbar.component.html',
  styleUrl: './vertical-navbar.component.css'
})
export class VerticalNavbarComponent {
  active:string = 'home';
  constructor(private router : Router) {}

  getClass(item:string){
    this.active = item;
    console.log(this.active);
  }

  logOut(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
