import { Pipe, PipeTransform } from '@angular/core';


//נכתב בעקבות אי תמיכת אינטרנט אקספלורר בפילטר של תאריכים
@Pipe({
  name: 'fromatIEDate'
})
export class FromatIEDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {

    let dateString: string = `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${value.getFullYear()}`;

    return dateString;
  }

}
