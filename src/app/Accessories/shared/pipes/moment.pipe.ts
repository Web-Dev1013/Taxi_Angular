import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'moment',
  pure: false
})
export class MomentPipe implements PipeTransform {


  today = moment();
  yesterday = moment().subtract(1, 'day');
  weekAgo = moment().subtract(7, 'day');
  yearAgo = moment().subtract(365, 'day');
  constructor(){

  }
  transform(date) {

    // return moment(date).format(format);
    if (moment(date).isSame(this.today, 'day')){
        return moment(date).fromNow();
    }
    else if (moment(date).isSame(this.yesterday, 'day')){
      return moment(date).format('dddd [at] hh:mm a');
    }
    else if (moment(date).isAfter(this.weekAgo, 'day')){
      return moment(date).format('dddd [at] hh:mm a');
    }
    // else if(moment(date).isSame(this.week_ago,'day')){
    //   return moment(date).format("MMMM DD [at] hh:mm a")
    // }
    else if (moment(date).isSame(this.yearAgo, 'day')){
      return moment(date).format('[on] MMMM DD YYYY [at] hh:mm a');
    }
    else
    {
      return moment(date).format('MMMM DD [at] hh:mm a');
    }
  }



}
