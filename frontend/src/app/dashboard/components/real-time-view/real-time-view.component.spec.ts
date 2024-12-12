import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealTimeViewComponent } from './real-time-view.component';

describe('RealTimeViewComponent', () => {
  let component: RealTimeViewComponent;
  let fixture: ComponentFixture<RealTimeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealTimeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RealTimeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
