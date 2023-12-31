import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-aide',
    templateUrl: './aide.component.html',
    styleUrls: ['./aide.component.css'],
})
export class AideComponent implements OnInit {
    versions = [
        { version: '0.8.97', description: `Ouvre désormais si 1 seule ligne, suppression de logs` },
        { version: '0.8.96', description: `Amélioration Tel, ajout minuscule / majuscule, copier cellule dans le presse papier` },
        { version: '0.8.95', description: `Correction bug` },
        { version: '0.8.94', description: `Suppression auto match car pénible à l'usage, correction indentation segment` },
        { version: '0.8.93', description: `Correction Bug lecture fichier (readAsText)` },
        {
            version: '0.8.92',
            description: `Correction Bug ajout colonne / affichage type de ligne / encodage undefined, ajout retirer lignes aux cellules vide.`,
        },
        { version: '0.8.91', description: `Correction Bug header` },
        { version: '0.8.9', description: `Ajout split adresse (merci Juliette), amélioration matching type de colonnes` },
        { version: '0.8.8', description: `Amélioration boolean, fix bugs divers, ajout matching type de colonnes` },
        { version: '0.8.7', description: `Correctifs bug au changement du txt du header, correction bug segment` },
        { version: '0.8.6', description: `Correctifs clic boite de dialogue` },
        {
            version: '0.8.5',
            description: `ajout exponentiel sur les champ numériques, ajout options siren / siret, taille dans le tooltip cellule`,
        },
        { version: '0.8.4', description: `Correctifs header, tooltip numéro de ligne sous la poubelle` },
        {
            version: '0.8.3',
            description:
                'Correction bug ajout suppression de colonnes et lignes, ajout de cette aide, amélioration CSS, correction nom fichier segmenter',
        },
        { version: '0.8.2', description: `Correction sur l'approche buffer et décodage` },
        {
            version: '0.8.1',
            description: "Ajout du traitement des données entrantes en fonction de l'encodage et possibilité de le changer ",
        },

        { version: '0.7.7', description: `implémentation de la visialisation en vert des cellules modifiées par l'application` },
        { version: '0.7.6', description: `Ajout des options incrément et nom adresse` },
        { version: '0.7.5', description: `Correctifs chercher remplacer, possibilité champ de recherche vide` },
        { version: '0.7.4', description: `Correctifs divers` },
        { version: '0.7.3', description: `Correctifs divers` },
        { version: '0.7.2', description: `Refresh affiché et bouton pour le forcer manuellement` },
        { version: '0.7.1', description: `Mise en place suppression de ligne` },
        { version: '0.6.1', description: `Mise en place de l'édition de cellule et ajout suppression de colonne` },
        { version: '0.5.3', description: `Option téléphone sans code pays disponible.` },
        { version: '0.5.2', description: `Correction algo code pays.` },
        {
            version: '0.5.1',
            description: `Ajout Code pays et téléphone.Chercher / remplacer et refonte de la vue, info sous le nom de l'application autoTuneCSV`,
        },
        { version: '0.4.2', description: `Corrections keys/values, local storage` },
        { version: '0.4.1', description: `Mise en place des keys/values et segmentaion de fichier` },
        { version: '0.3.3', description: `Affichage table avec donnnées origines` },
        { version: '0.3.2', description: `Correction bug numérique et CSV de test (TU)` },
        { version: '0.3.1', description: `Mise en place de la sommation des valeurs numériques` },
        { version: '0.2.2', description: `Correction CSS survol et ajout d'options` },
        { version: '0.2.1', description: `Mise en place de la boite de dialogue header` },
        { version: '0.1.2', description: `Encodage UTF-8 du fichier de sortie` },
        { version: '0.1.1', description: `Implémentation orignale de l'application` },
    ];
    needVuela =false;
    constructor() {}

    ngOnInit(): void {
        setTimeout(() => {
            this.needVuela = true;
        }, 7777);
    }
}
