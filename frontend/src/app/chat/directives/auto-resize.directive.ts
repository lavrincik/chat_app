import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutoResize]'
})
export class AutoResizeDirective {
  private height = 15;

  // based on https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize
  constructor(private el: ElementRef) {
    el.nativeElement.addEventListener('change', this.resize.bind(this));
    el.nativeElement.addEventListener('cut', this.delayedResize.bind(this));
    el.nativeElement.addEventListener('paste', this.delayedResize.bind(this));
    el.nativeElement.addEventListener('drop', this.delayedResize.bind(this));
    el.nativeElement.addEventListener('keydown', this.delayedResize.bind(this));
  }

  private resize() {
    this.el.nativeElement.style.height = '16px';
    if (this.el.nativeElement.scrollHeight < 35) {
      const oneLine = '16px';
      this.el.nativeElement.style.height = oneLine;
    } else if (this.el.nativeElement.scrollHeight < 42) {
      const twoLines = '33px';
      this.el.nativeElement.style.height = twoLines;
    } else if (this.el.nativeElement.scrollHeight < 90) {
      this.el.nativeElement.style.height = this.el.nativeElement.scrollHeight + 'px';
      this.height = this.el.nativeElement.scrollHeight;
    } else {
      this.el.nativeElement.style.height = this.height + 'px';
    }
  }

  private delayedResize() {
    setTimeout(this.resize.bind(this), 0);
  }
}
