import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appModoOscuro]',
  standalone: true
})
export class ModoOscuroDirective {
  private isDarkMode = false;
  private iconElement: HTMLElement;

  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.iconElement = this.el.nativeElement.querySelector('img'); // Suponiendo que el icono es una imagen dentro del botón
  }

  @HostListener('click') onClick() {
    this.toggleDarkMode();
  }

  private toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'modo-oscuro');
      this.changeIcon('../../assets/imagenes/ModoOscuroNoche.png');
    } else {
      this.renderer.removeClass(document.body, 'modo-oscuro');
      this.changeIcon('assets/icons/ModoOscuro.png');
    }
  }

  private changeIcon(iconPath: string) {
    if (this.iconElement) {
      this.renderer.setAttribute(this.iconElement, 'src', iconPath);
    }
  }
}
