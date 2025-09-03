import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingsOverviewComponent } from './ratings-overview-component';

describe('RatingsOverviewComponent', () => {
  let component: RatingsOverviewComponent;
  let fixture: ComponentFixture<RatingsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingsOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
