import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse,
  HttpHeaders
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Show } from '../models/show.class';

@Injectable()
export class DBService {
  url: string;
  constructor(private http: HttpClient) {

    this.url = "https://" + environment.controlServer;
  }
  updateShow(name: string, show: Show) {

    let body = {
      "name": name,
      "show": JSON.stringify(show),
    }
    this.http.post(this.url + '/saveShow', body).subscribe(e => {
      console.log("saving show", e);
    });
  }
  removeShow(name: string) {

    let body = {
      "name": name
    }

    return this.http.post(this.url + '/removeShow', body, { responseType: 'text' });

  }
  getShows(): any {


    return this.http.get(this.url + '/getShows');
  }

}
