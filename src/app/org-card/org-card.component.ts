import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'org-card',
  templateUrl: './org-card.component.html',
  styleUrls: ['./org-card.component.css']
})
export class OrgCardComponent implements OnInit {

  @Input() src: string;

  constructor() { }

  ngOnInit() {
  }

}
