import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  @Input("mode") mode: string = "side";
  @Input("opened") opened: boolean = false;
  @Input("active") active: string;

  constructor() { }

  ngOnInit() {
  }

}
