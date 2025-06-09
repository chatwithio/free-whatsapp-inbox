import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'whatsappFormat',
    standalone: true
})
export class WhatsappFormatPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) {
            return '';
        }

        let formatted = value;

        // Negrita: *texto*
        formatted = formatted.replace(/\*(.*?)\*/g, '<strong>$1</strong>');

        // Cursiva: _texto_
        formatted = formatted.replace(/_(.*?)_/g, '<em>$1</em>');

        // Tachado: ~texto~
        formatted = formatted.replace(/~(.*?)~/g, '<s>$1</s>');

        // Monoespaciado: ```texto```
        formatted = formatted.replace(/```(.*?)```/g, '<code>$1</code>');

        // Saltos de línea: \n
        formatted = formatted.replace(/\n/g, '<br>');

        return formatted;
    }
}
