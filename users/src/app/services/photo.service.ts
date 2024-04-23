import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';
import { LibraryService } from './library.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';
  private platform: Platform;
  coordinate:any={}
  public base64photos:any[] = [];
  public descrizione:string ="";
  public commenti:any[] = [""];

  constructor(platform: Platform, public libraryService : LibraryService) {
    this.platform = platform;
  }

  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    //Add the image at beginning of the array
    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.push(savedImageFile);
    console.log(this.photos);
    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
  }

  private async savePicture(photo: Photo) { 
    const base64Data = await this.readAsBase64(photo);
    this.base64photos.push(base64Data);
    
    //
    // Write the file to the data directory
    const fileName = Date.now() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    if (this.platform.is('hybrid')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    }
    else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: photo.webPath
      };
    }
  }

  private async readAsBase64(photo: Photo) {
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: photo.path!
      });
  
      return file.data;
    }
    else{
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
  
      return await this.convertBlobToBase64(blob) as string;
    }
    
  }
  
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  deleteFromArray(item:any){
    let index = this.photos.indexOf(item);
    if (index > -1) {
      this.base64photos.splice(index, 1);
      this.photos.splice(index, 1);
      this.commenti.splice(index, 1);
    }
  }

  async savePerizia(){
    let date = new Date().toLocaleDateString("it-IT") + " " + new Date().toLocaleTimeString("it-IT");
    let photo:any = {};
    let detail :any = {};
    let coordinate = {"lat":this.coordinate.coords.latitude, "lng":this.coordinate.coords.longitude}

    await this.libraryService.inviaRichiesta('POST', '/api/addPerizia',{ "coordinate": coordinate,
            "data": date,
            "descrizione": this.descrizione}).catch((err : any) => { this.libraryService.errore(err); });
    detail = {"coordinate": coordinate, "data": date, "descrizione": this.descrizione}; 
    for(let i=0; i<this.base64photos.length; i++){
      photo = {"img":this.base64photos[i], "commento":this.commenti[i]};
      await this.libraryService.inviaRichiesta('POST', '/api/savePeriziaOnCloudinary', {photo,detail}).catch((err : any) => { this.libraryService.errore(err); });
    }
    this.base64photos = [];
    this.photos = [];
    this.commenti = [""];
    this.descrizione = "";
    
  }
  /*public async loadSaved() {
      // Retrieve cached photo array data
    const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = (value ? JSON.parse(value) : []) as UserPhoto[];

    // Easiest way to detect when running on the web:
    // “when the platform is NOT hybrid, do this”
    if (!this.platform.is('hybrid')) {
      // Display the photo by reading into base64 format
      for (let photo of this.photos) {
        // Read each saved photo's data from the Filesystem
        const readFile = await Filesystem.readFile({
            path: photo.filepath,
            directory: Directory.Data
        });

        // Web platform only: Load the photo as base64 data
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }*/
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}
