import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appMayuscula]'
})
export class MayusculaDirective {

  lastValue: string;

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  public onInput($event) {

    $event.target.value = $event.target.value.toUpperCase();

    $event.preventDefault();

    if (!this.lastValue || (this.lastValue && $event.target.value.length > 0 && this.lastValue !== $event.target.value)) {
      this.lastValue = this.el.nativeElement.value = $event.target.value;
      // Propagation
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('input', false, true);
      $event.target.dispatchEvent(evt);
    }

  }

}
