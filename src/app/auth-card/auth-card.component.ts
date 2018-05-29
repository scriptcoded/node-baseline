import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-auth-card',
  templateUrl: './auth-card.component.html',
  styleUrls: ['./auth-card.component.css']
})
export class AuthCardComponent implements OnInit {

  @Input("header") header: string;
  @Input("loading") loading: boolean;
  @Input("errors") errors: string[] | null;

  constructor() { }

  ngOnInit() {
  }

}
