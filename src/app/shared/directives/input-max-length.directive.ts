import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[inputMaxLength]'
})
export class InputMaxLengthDirective {

  constructor(private el: ElementRef) {
  }

  @Input('inputMaxLength') maxLength: number;

  @HostListener('keypress',['$event']) onkeypress(e) {

    let event = e || window.event;
    if (event) {
      return this.el.nativeElement.value.length < this.maxLength;
    }
  }

}
