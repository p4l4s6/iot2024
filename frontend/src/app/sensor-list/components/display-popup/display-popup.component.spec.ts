import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayPopupComponent } from './display-popup.component';

describe('DisplayPopupComponent', () => {
  let component: DisplayPopupComponent;
  let fixture: ComponentFixture<DisplayPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
