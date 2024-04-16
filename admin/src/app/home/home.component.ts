import { Component } from '@angular/core';
import { PerizieService } from '../services/perizie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(public periziaService : PerizieService) {}
}
