import { Injectable, OnInit } from '@angular/core';
import { LibraryService } from './library.service';

@Injectable({
  providedIn: 'root'
})
export class PerizieService{
  
  public perizie!:any;
  totPerizie!:number;
  selectedPerizia!:any;
  map!:any;
  distance!:any;
  time!:any;
  isShowFilter:boolean = true;
  styles = [
    {
        stylers: [
          { hue: "#00ffe6" },
          { saturation: -20 }
        ]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { lightness: 100 },
        { visibility: "simplified" }
        ]
    },
    {
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
        ]
      },
      {
        featureType: "poi",
        elementType: "labels",
          stylers: [
            { visibility: "off" }
           ]
         }];
  
  constructor(public libraryService : LibraryService) { 
    
  }
 
  async initMap(position : any, filters : string){
    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const {Marker} = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    
    var styledMap = new google.maps.StyledMapType(this.styles, {name: "Mappa"});

    const map = new Map(document.getElementById("mapContainer") as HTMLElement, {
      "center": position,
      "zoom":12, 
      "scrollwheel": false, 	//zoom when scroll disable
        "zoomControl": true, 		//show control zoom
        "disableDefaultUI": true,
        "fullscreenControl": true,
    });
    this.map = map;

    map.mapTypes.set("map_style", styledMap);
    map.setMapTypeId("map_style");

    const svgMarker = {
      path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      fillColor: "#2D3748",
      fillOpacity: 1,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(0, 20),
    };

    let markerOptions = {
      "map": map,
      "position": position,
      "title": "I.I.S. G. Vallauri",
      "icon": svgMarker
    }
    const marker = new Marker(markerOptions);

    let infoWindowOptions = {
      "content": 
      `
        <div id="infoWindow">
          <div>Sede</div>
          <p>Indirizzo: Via San Michele 68, Fossano</p>
          <div>
          <div>Coordinate</div>
          <span>Latitudine: <strong>${position["lat"]}</strong></span>
          <br>
          <span>Longitudine: <strong>${position["lng"]}</strong></span>
          </div>
        </div>
      `
    }
  
    let infoWindow = new google.maps.InfoWindow(infoWindowOptions);
    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });
    
    //Add all the markers
    let rq = this.libraryService.inviaRichiesta("get", "/api/getPerizie", {filters});
    rq.then((response) => {
      if(!this.perizie){
        this.perizie = response["data"];
        this.totPerizie = this.perizie.length;
      }
        
      for (const perizia of response["data"]) {
        this.addMarker(perizia, map); 
      }

    });
    rq.catch((error) => {
      console.log(error);
    });

  }

  async addMarker(perizia : any, map : any){
    const {Marker} = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    
    let markerOptions = {
      "map": map,
      "position": perizia["coordinate"],
      "title": "Perizia: " + perizia["_id"],
      "icon": "../assets/marker.svg"
    }
    const marker = new Marker(markerOptions);

    let infoWindowOptions = {
      "content": 
      `
      <div id="info-window">
        <div class="title">Perizia</div>
        <p>Perizia n° <span>${perizia._id}</span></p>
        <ul>
            <li><span>Cod. op.:</span> ${perizia.codiceOp}</li>
            <li><span>Data e ora perizia:</span> ${perizia.data}</li>
            <li><span>Coordinate: </span>${perizia.coordinate.lat} - ${perizia.coordinate.lng}</li>
            </br>
            <li><div>Descrizione: </div>${perizia.descrizione}</li>
        </ul>
        <div class="buttons">
          <button class="edit-button" (click)="showGallery(${perizia._id})">Galleria</button>
          <button class="edit-button" id="edit-${perizia._id}">Modifica perizia</button>
          <button class="edit-button" id="route-${perizia._id}" >Visualizza percorso</button>
        </div>
      </div>
      `
    }

    let infoWindow = new google.maps.InfoWindow(infoWindowOptions);
    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });
  }

  async showRoute(position: any) {
    const {DirectionsService} = await google.maps.importLibrary("routes") as google.maps.RoutesLibrary;
    const {DirectionsRenderer} = await google.maps.importLibrary("routes") as google.maps.RoutesLibrary;

    var styledMap = new google.maps.StyledMapType(this.styles, {name: "Mappa"});

    let rendererOptions = {
      'polylineOptions': {
        'strokeColor':'#2D3748', //Colore percorso
        'strokeWeight': 6,		//Spessore percorso
      }
    }

    const directionsService = new DirectionsService();
    const directionsRenderer = new DirectionsRenderer(rendererOptions);

    this.map = new google.maps.Map(document.getElementById("mapContainer") as HTMLElement, {
      "center": position,
      "zoom":12, 
      "scrollwheel": false, 	//zoom when scroll disable
      "zoomControl": true, 		//show control zoom
      "disableDefaultUI": true,
      "fullscreenControl": true,
    });

    this.map.mapTypes.set("map_style", styledMap);
    this.map.setMapTypeId("map_style");

    directionsRenderer.setMap(this.map as google.maps.Map);

    directionsService.route({
      origin: position,
      destination: this.selectedPerizia.coordinate,
      travelMode: google.maps.TravelMode.DRIVING,
      'provideRouteAlternatives': false,
    }, (response, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
        this.distance = response?.routes[0].legs[0].distance?.text;
        this.time = response?.routes[0].legs[0].duration?.text;
      } else {
        window.alert('La richiesta non è riuscita a causa di ' + status);
      }
    });

  }

}

