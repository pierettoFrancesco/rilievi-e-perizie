import { Injectable } from '@angular/core';
import axios, {AxiosRequestConfig} from 'axios';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private _URL:string = "https://pierettofrancesco-crudserver.onrender.com";

  inviaRichiesta(method:string, url:string, parameters={}) {
    let config: AxiosRequestConfig={
      "baseURL":this._URL,
      "url":  url, 
      "method": method.toUpperCase(),
      "headers": {
        "Accept": "application/json",
      },
      "timeout": 15000,
      "responseType": "json",
    }
    
    if(parameters instanceof FormData){
      config.headers!["Content-Type"]='multipart/form-data;' 
      config["data"]=parameters     // Accept FormData, File, Blob
    }	
    else if(method.toUpperCase()=="GET"){
        config.headers!["Content-Type"]='application/x-www-form-urlencoded;charset=utf-8' 
        config["params"]=parameters   
    }
    else{
      config.headers!["Content-Type"] = 'application/json; charset=utf-8' 
      config["data"]=parameters    
    }	
    return axios(config)             
  }

  errore(err: any) {
  console.log(err.response);
	if(!err.response) 
		alert("Connection Refused or Server timeout");	
	else if (err.response.status == 200)
        alert("Formato dei dati non corretto : " + err.response.data);
	else if (err.response.status == 403){
        alert("Sessione scaduta");
		window.location.href="login.html"
	}
    else{
        alert("Server Error: " + err.response.status + " - " + err.response.data);
	}
  }
}

axios.interceptors.request.use((config :any )=>{
	if("token" in localStorage){
		let token = localStorage.getItem("token");
		config.headers["authorization"] = token;
	}
	return config;
});

axios.interceptors.response.use((response :any)=>{
	let token = response.headers["authorization"];
	console.log("Token received  "+token);
	if(token) localStorage.setItem("token", token);

	return response;
});
