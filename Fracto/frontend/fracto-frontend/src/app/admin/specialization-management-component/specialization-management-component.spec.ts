import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecializationManagementComponent } from './specialization-management-component';

describe('SpecializationManagementComponent', () => {
  let component: SpecializationManagementComponent;
  let fixture: ComponentFixture<SpecializationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecializationManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecializationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
