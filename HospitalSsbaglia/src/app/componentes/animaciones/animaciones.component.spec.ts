import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimacionesComponent } from './animaciones.component';

describe('AnimacionesComponent', () => {
  let component: AnimacionesComponent;
  let fixture: ComponentFixture<AnimacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
