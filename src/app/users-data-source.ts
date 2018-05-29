import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { UsersService } from "./_services/users.service";
import { User } from "./_models/user";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { of } from "rxjs/observable/of";

export class UsersDataSource implements DataSource<User> {

  private usersSubject = new BehaviorSubject<User[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private usersService: UsersService) {}

  connect(collectionViewer: CollectionViewer): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.usersSubject.complete();
    this.loadingSubject.complete();
  }

  loadUsers() {
    this.loadingSubject.next(true);

    this.usersService.getAll().pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
    .subscribe(users => this.usersSubject.next(users));
  }
}
