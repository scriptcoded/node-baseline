import { Component, OnInit } from '@angular/core';
import { UsersService } from '../_services/users.service';
import { User } from '../_models/user';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[];

  displayedColumns = ["name", "email"];
  dataSource = new UserDataSource(this.usersService);

  constructor(private usersService: UsersService) { }

  ngOnInit() {
  }

}

export class UserDataSource extends DataSource<any> {

  constructor(private usersService: UsersService) {
    super();
  }

  connect(): Observable<User[]> {
    return this.usersService.getAll();
  }

  disconnect() {}

}
