import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[inputDotOnly]'
})
export class InputDotOnlyDirective {

  private regex: RegExp = new RegExp(/[^.]+/g);

  constructor(private el: ElementRef) {
  }


  @HostListener('keypress') onkeypress(e) {

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
