import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingsPage } from './findings-page';

describe('FindingsPage', () => {
  let component: FindingsPage;
  let fixture: ComponentFixture<FindingsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindingsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(FindingsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
