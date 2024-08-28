import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectserviceService {
  public root:any

  constructor(private http:HttpClient) { 
    this.root = environment.apiURL;
  }

  saveUsersDetail(bulkquery:any)
  {
    let body=bulkquery;
    let url=this.root+'/register';
    return this.http.post(url, body);
  }

  loginUser(loginDetails: any) {
    return this.http.post(`${this.root}/login`, loginDetails);
  }
  
  getUserList(role:any) {
    return this.http.get<any>(`${this.root}/users?role=${role}`); // Adjust the endpoint as needed
  }
  
}
