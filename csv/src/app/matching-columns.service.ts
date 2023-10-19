import { Injectable } from '@angular/core';
import { PaysCorrectionService } from './pays-correction.service';

@Injectable({
    providedIn: 'root',
})
export class MatchingColumnsService {
    regexZip = /\d{5,}/;
    columnNames = [
        {
            name: 'numéro',
            label: 'Numéro',
            settings: 'number',
        },
        {
            name: 'prix',
            label: 'Numéro',
            settings: 'number',
        },
        {
            name: 'tarif',
            label: 'Numéro',
            settings: 'number',
        },
        {
            name: 'id',
            label: 'Id',
            settings: 'txt64',
        },
        {
            name: 'type',
            label: 'Type',
            settings: 'txt255',
        },
        {
            name: 'key/value',
            label: 'Key / Value',
            settings: 'keyValue',
        },
        {
            name: 'type societe',
            label: 'Type',
            settings: 'txt255',
        },
        {
            name: 'pays',
            label: 'Pays',
            settings: 'pays',
        },
        {
            name: 'iso code',
            label: 'Pays',
            settings: 'pays',
        },
        {
            name: 'téléphone',
            label: 'Téléphone',
            settings: 'phone',
        },
        {
            name: 'phone number',
            label: 'Téléphone',
            settings: 'phone',
        },
        {
            name: 'phone',
            label: 'Téléphone',
            settings: 'phone',
        },
        {
            name: 'archive',
            label: 'Archive',
            settings: 'yn',
        },
        {
            name: 'boolean',
            label: 'Boolean',
            settings: 'trueFalse',
        },
        {
            name: 'admis',
            label: 'Admis',
            settings: 'yn',
        },
        {
            name: 'siret',
            label: 'Siret',
            settings: 'siret',
        },
        {
            name: 'siren',
            label: 'Siren',
            settings: 'siren',
        },
        {
            name: 'smart tags',
            label: 'Smart-Tags',
            settings: 'tag510',
        },
        {
            name: 'nom adresse',
            label: 'Nom adressse',
            settings: 'addressName',
        },
        {
            name: 'adresse nom',
            label: 'Nom adressse',
            settings: 'addressName',
        },
        {
            name: 'code postal',
            label: 'Code postal',
            settings: 'zipCode',
        },
        {
            name: 'ville',
            label: 'Ville',
            settings: 'city',
        },
        {
            name: 'adresse partie 1',
            label: 'Adresse partie 1',
            settings: 'address1',
        },
    ];
    constructor(private correctionService: PaysCorrectionService) {}

    splitAdresse(adresse: string): string[] | never {
        let retour: any[];
        retour = adresse.split(this.regexZip);
        retour.push(adresse.match(this.regexZip));
        return retour;
    }

    bestColumnMatching(valeur): any {
        // console.log('bestColumnMatching', valeur);

        let meilleurCandidat = this.columnNames[0].name;
        let meilleurScore = this.correctionService.distanceLevenshtein(meilleurCandidat, valeur);
        for (let i = 1; i < this.columnNames.length; i++) {
            const candidatActuel = this.columnNames[i].name;
            const scoreActuel = this.correctionService.distanceLevenshtein(candidatActuel, valeur);
            if (scoreActuel < meilleurScore) {
                // Mettre à jour le meilleur candidat et le score
                meilleurCandidat = candidatActuel;
                meilleurScore = scoreActuel;
            }
        }

        // Retourner le meilleur candidat

        const element = this.columnNames.find((item) => item.name.trim().toLowerCase() === meilleurCandidat);
        //console.log('meilleur score ', meilleurScore, element?.name);
        if (element && meilleurScore < 4) {
            return element;
        }
        return null;
    }
}
