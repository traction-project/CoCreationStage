import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, HostListener, Inject } from '@angular/core';

@Directive({
  selector: '[Resizer]'
})
export class ResizerDirective {

  height: number=0;
  oldY = 0;
  grabber = false;

  constructor(@Inject(DOCUMENT) private document:any, private el: ElementRef) { }

  @HostListener('document:pointermove', ['$event'])
  onMouseMove(event: MouseEvent) {

    if (!this.grabber) {
      return;
    }

    this.resizer(event.clientY - this.oldY);
    this.oldY = event.clientY;
  }

  @HostListener('document:pointerup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.grabber = false;
  }

  resizer(offsetY: number) {
    this.height -= offsetY;
    this.el.nativeElement.parentNode.style.height = this.height + "px";
    this.document.getElementById('content').style.height = "calc(100% - "+this.height+"px )"; 
  }

  @HostListener('pointerdown', ['$event']) onResize(event: MouseEvent, resizer?: Function) {
    console.log("ddfsdf")
    this.grabber = true;
    this.oldY = event.clientY;
    event.preventDefault();
  }

  ngOnInit() {
    this.height = parseInt(this.el.nativeElement.parentNode.offsetHeight);
  }

}
