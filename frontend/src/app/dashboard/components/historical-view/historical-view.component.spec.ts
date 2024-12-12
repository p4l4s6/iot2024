import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalViewComponent } from './historical-view.component';

describe('HistoricalViewComponent', () => {
  let component: HistoricalViewComponent;
  let fixture: ComponentFixture<HistoricalViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricalViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
