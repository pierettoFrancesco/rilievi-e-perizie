import { Component, ElementRef} from '@angular/core';

@Component({
  selector: 'app-vertical-navbar',
  templateUrl: './vertical-navbar.component.html',
  styleUrl: './vertical-navbar.component.css'
})
export class VerticalNavbarComponent {
  active:string = 'home';
  constructor() {}

  getClass(item:string){
    this.active = item;
    console.log(this.active);
  }
}
