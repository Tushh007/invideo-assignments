import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PicsumService {

  constructor(private http: HttpClient) { }

  getImages(): any {
    return this.http.get(`https://picsum.photos/v2/list`);
  }
}
