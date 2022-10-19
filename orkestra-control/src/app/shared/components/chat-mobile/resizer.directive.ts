/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
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
