import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";

@Pipe({
  name: 'appHighlight'
})
export class HighlightSearchPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer){}

  transform(value: any, pattern: string): any {
    if (value && pattern) {
      let startIndex = value.toLowerCase().indexOf(pattern.toLowerCase());
      if (startIndex != -1) {
          let endLength = pattern.length;
          let matchingString = value.substr(startIndex, endLength);
          const result = value.replace(matchingString, `<mark>${matchingString}</mark>`);
          return this.sanitizer.bypassSecurityTrustHtml(result);
      }
    }
    
    return value;
  }
}