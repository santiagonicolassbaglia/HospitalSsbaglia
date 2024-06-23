import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistClinicaEspecialistaComponent } from './hist-clinica-especialista.component';

describe('HistClinicaEspecialistaComponent', () => {
  let component: HistClinicaEspecialistaComponent;
  let fixture: ComponentFixture<HistClinicaEspecialistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistClinicaEspecialistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistClinicaEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
