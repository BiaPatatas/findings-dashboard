import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingsTable } from './findings-table';

describe('FindingsTable', () => {
  let component: FindingsTable;
  let fixture: ComponentFixture<FindingsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindingsTable],
    }).compileComponents();

    fixture = TestBed.createComponent(FindingsTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
