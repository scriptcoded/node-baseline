import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { User } from '../_models/user';

@Injectable()
export class UsersService {

  constructor(private httpClient: HttpClient) { }

  // TODO: use correct return type <User[]> by using map()
  getAll(): Observable<any> {
    return this.httpClient.get("https://jsonplaceholder.typicode.com/users");
  }

}
