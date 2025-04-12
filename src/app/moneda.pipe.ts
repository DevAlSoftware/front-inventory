import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moneda'
})
export class MonedaPipe implements PipeTransform {
  transform(valor: number | string): string {
    if (!valor || valor === '') return '$ 0';

    let numero: number;

    if (typeof valor === 'string') {
      let valorLimpio = valor.replace(/[^0-9,.-]/g, '');
      valorLimpio = valorLimpio.replace(/,+/g, ',').replace(/\.(?=\d{3,})/g, '');
      numero = parseFloat(valorLimpio.replace(',', '.'));
    } else {
      numero = valor;
    }

    if (isNaN(numero)) return '$ 0';
    return numero.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
  }
}