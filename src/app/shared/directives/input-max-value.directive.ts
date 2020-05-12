import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[inputMaxValue]'
})
export class InputMaxValueDirective {

  constructor(private el: ElementRef) {
  }

  @Input('inputMaxValue') maxValue: number;

  @HostListener('keypress') onkeypress(e) {

    let event = e || window.event;
    if (event) {
      return this.isValidValue(event);
    }
  }

  isValidValue(event): boolean {
    if (this.el.nativeElement.value.concat(event.key) <= this.maxValue) {
      return true;
    } else {
      return false;
    }
  }
}
