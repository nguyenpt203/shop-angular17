import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/Auth'; 

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  private baseUrl = 'http://localhost:3000/users';
  constructor(private http: HttpClient){}
  getUsers(){
    return this.http.get<IUser[]>(this.baseUrl)
  }
  deleteUser(id: string | number | undefined) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
