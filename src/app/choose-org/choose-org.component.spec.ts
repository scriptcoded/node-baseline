import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseOrgComponent } from './choose-org.component';

describe('ChooseOrgComponent', () => {
  let component: ChooseOrgComponent;
  let fixture: ComponentFixture<ChooseOrgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseOrgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseOrgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
