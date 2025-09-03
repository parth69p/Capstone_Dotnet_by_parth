import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialistSelectionComponent } from './specialist-selection-component';

describe('SpecialistSelectionComponent', () => {
  let component: SpecialistSelectionComponent;
  let fixture: ComponentFixture<SpecialistSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialistSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialistSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
