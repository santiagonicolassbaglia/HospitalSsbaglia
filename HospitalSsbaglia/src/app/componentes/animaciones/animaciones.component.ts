import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

const mostrarOcultar = trigger('mostrarOcultar', [
  state('abierto', style({
    height: '200px',
    opacity: 1,
    backgroundColor: 'yellow'
  })),
  state('cerrado', style({
    height: '100px',
    opacity: 0.5,
    backgroundColor: 'green'
  })),
  transition('abierto => false', animate('200ms ease-in')),
  transition('cerrado => true', animate('200ms ease-out'))
]);

@Component({
  selector: 'app-animaciones',
  standalone: true,
  imports: [],
  templateUrl: './animaciones.component.html',
  styleUrl: './animaciones.component.css'
})
export class AnimacionesComponent {

  mostrarContendo: boolean = false;

  mostrarOcultar()
  {
    this.mostrarContendo = !this.mostrarContendo;
  }
}
