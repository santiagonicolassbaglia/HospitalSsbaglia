import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appMostrarOcultar]',
  standalone: true
})
export class MostrarOcultarDirective {
  private isVisible = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('click') onClick() {
    this.isVisible = !this.isVisible;
    const nextElement = this.el.nativeElement.nextElementSibling;
    if (nextElement) {
      if (this.isVisible) {
        this.renderer.setStyle(nextElement, 'display', 'block');
      } else {
        this.renderer.setStyle(nextElement, 'display', 'none');
      }
    }
  }
}
