import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleOutput',
  pure: true
})
export class TitleOutputPipe implements PipeTransform {

  transform(value: string, limit: number = 22, suffix: string = '...'): string {
    const title = value.substr(0, limit);
    return (value.length <= limit) ? title : title + suffix;
  }

}
