import { Component } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  
  
  constructor(public photoService : PhotoService) {}

  async ngOnInit(){
    this.photoService.coordinate = (await Geolocation.getCurrentPosition());

    console.log('Current position:', this.photoService.coordinate.coords.latitude, this.photoService.coordinate.coords.longitude);
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }
}
