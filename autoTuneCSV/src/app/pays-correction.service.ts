import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PaysCorrectionService {
    iso = [
        { pays: 'france', iso: 'fr' },
        { pays: 'italie', iso: 'IT' },
    ];

    getIsoFromPays(pays: string): string {
        pays = pays.trim();
        pays = pays.toLocaleLowerCase();
        const findedIso = this.iso.find((item) => item.pays == pays);
        if (findedIso) {
            pays = findedIso.iso;
        }
        return pays;
    }
}
