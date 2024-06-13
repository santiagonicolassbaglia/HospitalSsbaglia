import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialistRequestsComponent } from './specialist-requests.component';

describe('SpecialistRequestsComponent', () => {
  let component: SpecialistRequestsComponent;
  let fixture: ComponentFixture<SpecialistRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialistRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialistRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
