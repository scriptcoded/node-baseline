import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Input() brand: string;

  @Output() toggle = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  toggleSidenav() {
    this.toggle.emit(true);
  }

}
