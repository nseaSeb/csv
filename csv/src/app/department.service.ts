// json-loader.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonLoaderService {
  private cities!: any[]; // Stockez les données dans une variable privée

  constructor(private http: HttpClient) { 
    this.getCities().subscribe(data => {
      this.cities = data;
    });
  }
  getCityByPostalCode(postalCode: string): any {
    return this.cities.find(city => city.Code_postal === Number(postalCode));
  }
  getPostalCodeByCity(commune: string): any {
    return this.cities.find(city => city.Nom_commune === commune);
  }

  getCities(): Observable<any> {
    return this.http.get('../assets/france.json');
  }
}
