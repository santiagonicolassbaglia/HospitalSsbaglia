import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appFormatearNumeros]',
  standalone: true
})
export class FormatearNumerosDirective {
 
  constructor(private el: ElementRef) {}

  @HostListener('blur') onBlur() {
    const value = this.el.nativeElement.value;
    this.el.nativeElement.value = this.formatNumber(value);
  }

  private formatNumber(value: string): string {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

}
