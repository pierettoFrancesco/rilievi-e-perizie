import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PerizieService } from '../services/perizie.service';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  constructor(private router:Router,public perizieService: PerizieService) { }

  ngOnInit() {
  }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
