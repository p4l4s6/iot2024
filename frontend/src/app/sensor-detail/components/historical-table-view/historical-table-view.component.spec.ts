import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalTableViewComponent } from './historical-table-view.component';

describe('HistoricalTableViewComponent', () => {
  let component: HistoricalTableViewComponent;
  let fixture: ComponentFixture<HistoricalTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricalTableViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
