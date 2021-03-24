import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'inArray' , pure: false })
export class InArrayPipe implements PipeTransform {

  transform(value: any, exponent: any): boolean {
    if (value && value.length){
      return (value.indexOf(exponent) > -1) ? true : false;
    }
    return false;
  }
}
