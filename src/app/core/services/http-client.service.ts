import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  private CORS_PROXY:string = "https://cors-anywhere.herokuapp.com/";

  constructor(private httpClient: HttpClient) { }

  get(uri: string, header?: Object) {
    return this.httpClient.get(this.CORS_PROXY + uri, header);
  }
}
