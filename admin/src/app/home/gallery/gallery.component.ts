import { Component } from '@angular/core';
import { PerizieService } from '../../services/perizie.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {
  constructor(public perizieService : PerizieService) {}
  
  closeWindow(){
    this.perizieService.isShowGallery = false;
  }
}
