import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  pure: false
})
export class TimeAgoPipe implements PipeTransform {
	transform(value: Date): string {
		const date = new Date(value);
		const now = new Date();
		const seconds = Math.round(Math.abs((now.getTime() - date.getTime()) / 1000));
		const minutes = Math.round(Math.abs(seconds / 60));
		const hours = Math.round(Math.abs(minutes / 60));
		const days = Math.round(Math.abs(hours / 24));
		const months = Math.round(Math.abs(days / 30.416));
		const years = Math.round(Math.abs(days / 365));

		if (isNaN(seconds)) return '';
		if (minutes < 60) return `Alguns minutos atrás`;
		if (hours === 1) return `Uma hora atrás`;
		if (hours < 24) return `Algumas horas atrás`;
		if (days === 1) return `Ontem`;
		if (days < 7) return `${days} dias atrás`;
		if (days < 14) return `Semana passada`;
		if (months < 1) return `${Math.floor(days / 7)} semanas atrás`;
		if (months === 1) return `Mês passado`;
		if (months < 12) return `${months} meses atrás`;
		if (years === 1) return `Ano passado`;
		return 'Muito tempo atrás, já deveria ter devolvido.';
	}
}
