import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaUsuariosIngresadosComponent } from './lista-usuarios-ingresados.component';

describe('ListaUsuariosIngresadosComponent', () => {
  let component: ListaUsuariosIngresadosComponent;
  let fixture: ComponentFixture<ListaUsuariosIngresadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaUsuariosIngresadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaUsuariosIngresadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
