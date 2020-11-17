import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[inputUppercaseOnly]'
})
export class InputUppercaseLetterOnlyDirective {

  private regex: RegExp = new RegExp(/^[A-Z]+$/g);

  constructor(private el: ElementRef) {
  }


  @HostListener('keypress',['$event']) onkeypress(e) {

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
