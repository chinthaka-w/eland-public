import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[inputAmount]'
})
export class InputAmountDirective {

  private regex: RegExp = new RegExp(/^[0-9]+(\.\d{0,2})?$/g);

  constructor(private el: ElementRef) {
  }


  @HostListener('keypress') onkeypress(e) {

    let event = e || window.event;
    if (event) {
      let current: string = this.el.nativeElement.value;
      let next: string = current.concat(event.key);
      if (next && !String(next).match(this.regex)) {
        event.preventDefault();
      }
    }
  }

}
