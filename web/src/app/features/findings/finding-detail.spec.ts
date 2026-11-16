import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingDetail } from './finding-detail';

describe('FindingDetail', () => {
  let component: FindingDetail;
  let fixture: ComponentFixture<FindingDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindingDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(FindingDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
