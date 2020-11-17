import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[inputUppercaseAndLowercaseLetterOnly]'
})
export class InputUppercaseAndLowercaseLetterOnlyDirective {

  private regex: RegExp = new RegExp(/^[a-zA-Z]+$/g);

  constructor(private el: ElementRef) {
  }


  @HostListener('keypress',['$event']) onkeypress(e) {

    let event = e || window.event;
    if (event) {
      let current: string = this.el.nativeElement.value;
      let next: string = current.concat(event.key);
      if (current.match(this.regex)) {
        event.preventDefault();
      }
    }
  }
}
