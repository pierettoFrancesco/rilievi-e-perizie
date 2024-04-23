import { Component, ElementRef} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vertical-navbar',
  templateUrl: './vertical-navbar.component.html',
  styleUrl: './vertical-navbar.component.css'
})
export class VerticalNavbarComponent {
  active:string = 'main';
  constructor(private router : Router) {}

  ngOnInit(){
    if(this.router.url == '/home/main')
      this.active = 'main';
    else if(this.router.url == '/home/users')
      this.active = 'users';
  }
  
  getClass(item:string){
    this.active = item;
    this.router.navigate(['/home/'+item]);
    console.log(this.active);
  }

  logOut(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
