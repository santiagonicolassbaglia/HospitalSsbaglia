import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistClinicaAdminComponent } from './hist-clinica-admin.component';

describe('HistClinicaAdminComponent', () => {
  let component: HistClinicaAdminComponent;
  let fixture: ComponentFixture<HistClinicaAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistClinicaAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistClinicaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
