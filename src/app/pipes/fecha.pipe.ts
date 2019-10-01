import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fecha'
})
export class FechaPipe implements PipeTransform {

  transform(value: Date, formato: string = 'yyyy-mm-dd'): any {

    console.log('ValueFecha', value);

    let day = String(100 + value.getDate()).substr(1,2);
    let month = String(100 + (value.getMonth()) + 1).substr(1,2);
    let year = value.getFullYear();

    if(formato === 'yyyy-mm-dd') {

      return `${year}-${month}-${day}`;
      // return value.toLocaleDateString();

    }

    return value.toDateString;
    
  }

}
