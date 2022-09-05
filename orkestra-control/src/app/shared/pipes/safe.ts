import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    if (url.indexOf('publish')) url = url.replace(/publish=true/,"");
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}