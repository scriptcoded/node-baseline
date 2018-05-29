import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'list-item-expand',
  templateUrl: './list-item-expand.component.html',
  styleUrls: ['./list-item-expand.component.css']
})
export class ListItemExpandComponent implements OnInit {

  @Input("expanded") expanded: boolean = false;
  @Input("header") header: boolean;

  constructor() { }

  ngOnInit() {
  }

  toggle() {
    this.expanded = !this.expanded;
  }

}
