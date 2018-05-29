import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';
import { Router, NavigationEnd } from '@angular/router';
import { LayoutModule, BreakpointObserver } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit, OnDestroy {

  user: User;

  mode: string = "side";
  opened: boolean = true;
  active: string = "/";

  hide: boolean;

  private routerSubscription: Subscription;
  private breakpointSubscription: Subscription;

  constructor(
    private userService: UserService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() {
    this.user = this.userService.user;

    this.routerSubscription = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        this.active = event.url;
      });

    this.breakpointSubscription = this.breakpointObserver
      .observe("(min-width: 600px)")
      .subscribe(result => {
        this.mode = result.matches ? 'side' : 'over';
      });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    this.breakpointSubscription.unsubscribe();
  }

  public logout() {
    this.userService.logout();
  }

  public toggle() {
    this.opened = !this.opened;
  }

}
