import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[inputNumberOnly]'
})
export class InputNumberOnlyDirective {


  constructor(private el: ElementRef) {
  }

  @HostListener('keypress',['$event']) onkeypress(e) {
    let event = e || window.event;
    if (event) {
      return this.isNumberKey(event);
    }
  }

  isNumberKey(event) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
