import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[inputMinValue]'
})
export class InputMinValueDirective {

  constructor(private el: ElementRef,
              private renderer: Renderer2) {
  }

  @Input('inputMinValue') minValue: number;

  @HostListener('keypress', ['$event']) onkeypress(e) {
    let event = e || window.event;
    if (event) {
      return this.isValidValue(event);
    }
  }

  isValidValue(event): boolean {

    if (this.el.nativeElement.value.concat(event.key) >= this.minValue) {
      return true;
    } else {
      this.renderer.setProperty(this.el.nativeElement, 'value', 1)
      return false;
    }
  }
}
