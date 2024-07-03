import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCambiarFondo]',
  standalone: true
})
export class CambiarFondoDirective {

  constructor(private el: ElementRef) {}

  @HostListener('click') onClick() {
    this.changeBackground('lightgreen');
  }

  private changeBackground(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
