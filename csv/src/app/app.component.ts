import { Component, ElementRef, ViewChild } from '@angular/core';
import { CsvParseService } from './csv-parse.service';
import { ExportCsvService } from './export-csv.service';
import { PaysCorrectionService } from './pays-correction.service';
import languageEncoding from 'detect-file-encoding-and-language';
import * as iconvlite from 'iconv-lite';
import * as buffer from 'buffer';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    title = 'csv';
    version = '0.8.4 beta-carotene';
    about = 'Outil de manipulation / correction de fichiers CSV';
    filename = 'undefined';
    nbreDeLignes = 0;
    segmentTemp = 100;
    celluleTemp = '';
    segment: number = 0;
    encodage = 'UTF-8';
    encodageSelected = '';
    isNotExecutable = true;
    dateFormat = 'yyyyMMdd';

    datas: any[] = [];
    fileDatas: any[] = [];
    inputDatas: any[] = [];

    headers: string[] = [];
    inputHeaders: string[] = [];
    isDialogHeader = false;
    isDialogTypeImport = false;
    isDialogKeys = false;
    isDialogAbout = false;
    isDialogSegment = false;
    isDialogCell = false;
    isLoaded = false;
    isHelp = false;
    selectedHeader = '';
    selectedIndex = 0;
    selectedLigneIndex = 0;
    selectedCellIndex = 0;
    searchField = '';
    replaceField = '';
    prefix = '';
    compteur = 0;
    count = 0;
    showOutput = true;
    keyValue: any[] = [];
    colonneType: string = '';
    importType: string = '';
    allColonneType: string[] = [];
    sommation: number[] = [];
    encodages = [
        { key: 'undefined', value: 'Non défini', decode: 'UTF-8' },
        { key: 'CP1252', value: 'Win CP1252', decode: 'cp1252' },
        { key: 'cp20866', value: 'Win cp20866', decode: 'cp20866' },
        { key: 'UTF-8', value: 'UTF 8', decode: 'utf8' },
        { key: 'UTF-7', value: 'UTF 7', decode: 'utf7' },
        { key: 'UTF-16LE', value: 'UTF 16 LE', decode: 'utf16le' },
        { key: 'UTF-16', value: 'Unicode UTF 16', decode: 'UTF-16' },
        { key: 'shiftjis', value: 'dbcs encodings', decode: 'shiftjis' },
        { key: 'win1251', value: 'Win 1251', decode: 'win1251' },
        { key: 'cesu8', value: 'cesu8', decode: 'cesu8' },
        { key: 'cp950', value: 'cp950', decode: 'cp950' },
        { key: 'cp932', value: 'cp932', decode: 'cp932' },
        { key: 'ISO-8859-1', value: 'ISO-8859-1', decode: 'ISO-8859-1' },
        { key: 'ISO-8859-16', value: 'ISO-8859-16', decode: 'ISO-8859-16' },
        { key: 'iso88595', value: 'iso88595', decode: 'iso88595' },
        { key: 'GBK', value: 'GBK', decode: 'GBK' },
        { key: 'GB2312', value: 'GB2312', decode: 'GB2312' },
        { key: 'ASCII', value: 'ascii', decode: 'ascii' },
        { key: 'hex', value: 'Hexadecimal', decode: 'hex' },
        { key: 'base64', value: 'base64', decode: 'base64' },
        { key: 'macintosh', value: 'macintosh', decode: 'macintosh' },
        { key: 'macroman', value: 'macroman', decode: 'macroman' },
        { key: 'maccenteuro', value: 'maccenteuro', decode: 'maccenteuro' },
        { key: 'maccyrillic', value: 'maccyrillic', decode: 'maccyrillic' },
    ];

    @ViewChild('myRefresh') myRefresh: ElementRef | undefined;
    constructor(private csvParse: CsvParseService, private _csvExport: ExportCsvService, private pays: PaysCorrectionService) {
        const val = localStorage.getItem('keyValue');
        if (val) {
            this.keyValue = JSON.parse(val);
        }
        // console.log('no exponents found', this.noExponents(4.65661287307739e-10));
        // console.log('no exponents found', this.noExponents(9.935818877444285e23));
    }

    inputHandler(e: any) {
        console.log('inputHandler');
        this.onLoader(true);
        this.allColonneType = [];

        this.filename = 'undefined';

        const file = e.target.files[0];
        try {
            console.log('file', file);
            languageEncoding(file).then((fileInfo) => {
                this.encodage = fileInfo.encoding || 'undefined';
                this.uploadFile(e);
                console.log(fileInfo);
            });
        } catch (error) {
            this.onLoader(false);
            console.log(error);
        }
        // Possible result: { language: english, encoding: UTF-8, confidence: { encoding: 1, language: 1 } }
    }
    uploadFile(event: any): void {
        const reader = new FileReader();
        if (event.target.files && event.target.files.length) {
            const [file] = event.target.files;
            reader.readAsBinaryString(file);
            reader.onload = () => {
                this.filename = file.name;
                const content = reader.result || '';
                this.csvParse.parseCsvFile(content.toString(), this.encodage).then((result) => {
                    this.fileDatas = [...result.data];
                    this.inputDatas = [];
                    this.datas = [];
                    const selVal = this.encodages.find((item) => item.key === this.encodage);
                    this.initEncodage();

                    this.populateBuffers();
                });
                this.isNotExecutable = false;
            };
        }
    }
    populateBuffers() {
        this.onLoader(true);
        this.sommation = [];
        this.headers = [];
        this.datas = [];
        this.inputDatas = [];
        this.inputHeaders = [];
        //console.log('fileDatas', this.fileDatas);
        this.inputDatas = JSON.parse(JSON.stringify(this.fileDatas));
        //console.log('inputdata', this.inputDatas);
        this.autoCorrectEncodage();
        this.datas = JSON.parse(JSON.stringify(this.inputDatas));
        //console.log('datas', this.datas);
        this.inputHeaders = this.inputDatas.shift() || [];
        this.headers = this.datas.shift() || [];
        this.nbreDeLignes = this.datas.length;

        this.addSommation();
        this.patchAllColonnes();
        this.autoCorrectHeader();
        this.autoCorrectDatas();
        this.onLoader(false);
    }
    initEncodage(): void {
        const selVal = this.encodages.find((item) => item.key === this.encodage);
        if (selVal) {
            this.encodageSelected = selVal.key;
        }
    }
    autoCorrectEncodage(): void {
        this.onLoader(true);

        const selVal = this.encodages.find((item) => item.key === this.encodageSelected);
        if (selVal && selVal?.key !== 'undefined') {
            for (let i = 0; i < this.fileDatas.length; i++) {
                for (let j = 0; j < this.fileDatas[i].length; j++) {
                    try {
                        const bufferData = buffer.Buffer.from(String(this.fileDatas[i][j]).trim());
                        const str = iconvlite.decode(bufferData, selVal.decode);
                        this.inputDatas[i][j] = str;
                    } catch (error) {
                        console.log('decoded ERROR : ', error);
                    }
                }
            }
        }

        this.onLoader(false);
    }

    changeHeaderByNextLine(): void {
        // this.headers = this.datas.shift() || [];
        // this.fileDatas.splice(0, 1);
        // this.inputDatas.splice(0, 1);
        // this.nbreDeLignes = this.datas.length;
        // this.addSommation();
        // this.autoCorrectHeader();
        this.removeLine(-1);
    }
    removeLine(i: number): void {
        this.fileDatas.splice(i + 1, 1);
        this.populateBuffers();
    }

    exportToCSV(): void {
        if (this.segment < 1) {
            const filename = `${this.filename.slice(0, -4)}-UTF8.csv`;
            this._csvExport.exportToCsv(filename, [this.headers, ...this.datas]);
        } else {
            for (let i: number = 0; 1 < this.datas.length; i += this.segment) {
                if (this.segment > this.datas.length) this.segment = this.datas.length;
                const part: number = Number(i) + Number(this.segment - 1);

                const filename = `${this.filename.slice(0, -4)}${i.toString()}-${part.toString()}.csv`;
                const output = [this.headers, ...this.datas.splice(0, this.segment)];
                this._csvExport.exportToCsv(filename, output);
            }
        }
    }
    addSommation(): void {
        for (let i = 0; i < this.headers.length; i++) {
            this.sommation.push(0);
            this.allColonneType.push('');
        }
    }
    autoCorrectHeader(): void {
        for (let i = 0; i < this.headers.length; i++) {
            this.headers[i] = this.autoCorrectString(this.headers[i]);
        }
    }
    autoCorrectDatas(): void {
        for (let i = 0; i < this.datas.length; i++) {
            for (let j = 0; j < this.datas[i].length; j++) {
                this.datas[i][j] = this.autoCorrectString(this.datas[i][j]);
            }
        }
        this.onLoader(false);
    }
    onLoader(onOff: boolean): void {
        if (onOff) {
            this.isLoaded = false;
            this.myRefresh?.nativeElement.classList.add('loader');
        } else {
            setTimeout(() => {
                this.isLoaded = true;
                this.myRefresh?.nativeElement.classList.remove('loader');
            }, 400);
        }
    }

    autoCorrectString(value: string): string {
        value = this.replaceAll(value, 'Ã©', 'é');
        value = this.replaceAll(value, 'Â°', '°');
        value = this.replaceAll(value, 'Ãª', 'ê');
        value = this.replaceAll(value, 'Ã¨', 'è');
        value = this.replaceAll(value, `\'`, `'`);
        value = this.replaceAll(value, `d\``, `d'`);
        value = this.replaceAll(value, `l\'`, `l'`);
        value = this.replaceAll(value, `à´`, `ô`);
        value = this.replaceAll(value, 'Ã', 'à');
        value = this.replaceAll(value, 'à§', 'ç');
        value = this.replaceAll(value, 'â', `'`);
        value = this.replaceAll(value, 'à¹', `ù`);
        value = this.replaceAll(value, 'à´', `ô`);
        value = this.replaceAll(value, 'â¬', `€`);
        value = this.replaceAll(value, `'¦`, `...`);
        value = this.replaceAll(value, `Â£`, `£`);
        value = this.replaceAll(value, `Â¥`, `¥`);
        value = this.replaceAll(value, '\xc3\x8e', `é`);

        return value;
    }

    replaceAll(string, search, replace) {
        try {
            return string.split(search).join(replace);
        } catch (error) {
            return string;
        }
    }
    openHeader(header: string, index: number): void {
        this.isDialogHeader = true;
        this.selectedIndex = index;
        this.colonneType = this.allColonneType[index];
        this.selectedHeader = header;
    }
    headerDialogApply(): void {
        this.headers[this.selectedIndex] = this.selectedHeader;
        if (this.replaceField) {
            this.onReplace();
        }
        this.allColonneType[this.selectedIndex] = this.colonneType;
        this.patchAllColonnes();
        this.isDialogHeader = false;
        this.isDialogTypeImport = false;
        this.sumAllColonnes();
    }
    onChangeHeader(e: any): void {
        this.selectedHeader = e.target.value;
    }
    onChangeSearchField(e: any): void {
        this.searchField = e.target.value;
    }
    onChangeReplaceField(e: any): void {
        this.replaceField = e.target.value;
    }
    onChangePrefix(e: any): void {
        this.prefix = e.target.value;
    }
    onChangeCompteur(e: any): void {
        this.compteur = e.target.value;
    }
    onChangeEncodage(e: any): void {
        this.encodageSelected = e.target.value;
        this.populateBuffers();
        //this.patchAllColonnes();
    }
    onReplace(): void {
        if (this.searchField !== '') {
            for (let i = 0; i < this.datas.length; i++) {
                this.inputDatas[i][this.selectedIndex] = this.replaceAll(
                    this.datas[i][this.selectedIndex],
                    this.searchField,
                    this.replaceField,
                );
            }
        } else {
            for (let i = 0; i < this.datas.length; i++) {
                if (this.datas[i][this.selectedIndex] === '') {
                    this.inputDatas[i][this.selectedIndex] = this.replaceField;
                }
            }
        }
    }
    addKeyValue(): void {
        if (this.searchField && this.replaceField) {
            const value = { key: this.searchField, value: this.replaceField };
            if (this.selectedIndex === -1) {
                this.keyValue.push(value);
            } else {
                this.keyValue[this.selectedIndex] = value;
            }
        }
        this.selectedIndex = -1;
        this.searchField = '';
        this.replaceField = '';
    }
    onEditKeyValue(i: number): void {
        this.selectedIndex = i;
        this.searchField = this.keyValue[i].key;
        this.replaceField = this.keyValue[i].value;
    }
    onDeleteKeyValue(i: number): void {
        this.keyValue.splice(i, 1);
    }
    onSaveKeyValue(): void {
        localStorage.setItem('keyValue', JSON.stringify(this.keyValue));
        this.isDialogKeys = false;
    }

    onChangeSegment(e: any): void {
        this.segmentTemp = e.target.value;
    }

    segmentDialogApply(): void {
        this.segment = this.segmentTemp;
        this.isDialogSegment = false;
    }
    onChangeCell(e: any): void {
        this.celluleTemp = e.target.value;
    }
    onChangeColonneType(e: any): void {
        this.colonneType = e.target.value;
    }
    onChangeImportType(e: any): void {
        this.importType = e.target.value;
    }
    getColonneType(colonne: string): string {
        switch (colonne) {
            case 'number':
                return 'Numérique';
                break;
            case 'pays':
                return 'Pays';
                break;
            case 'txt32':
                return 'Txt 32';
                break;
            case 'txt64':
                return 'Txt 64';
                break;
            case 'txt1OO':
                return 'Txt 100';
                break;
            case 'txt128':
                return 'Txt 128';
                break;
            case 'txt255':
                return 'Txt 255';
                break;
            case 'tag510':
                return 'Tag 510';
                break;
            case 'phone':
                return 'Téléphone';
                break;
            case 'yn':
                return 'Y/N';
                break;
            case 'ouinon':
                return 'Oui/non';
                break;
            case 'trueFalse':
                return 'True/false';
                break;
            case 'keyValue':
                return 'Key/value';
                break;
            case 'increment':
                return 'Incrémentation';
                break;

            default:
                return 'Non défini';
                break;
        }
    }
    changeColonneType(index: number, e: any): void {
        this.allColonneType[index] = e.target.value;

        this.patchAllColonnes();
        this.sumAllColonnes();
    }

    patchAllColonnes(): void {
        this.onLoader(true);
        this.count = this.compteur;
        for (let i = 0; i < this.datas.length; i++) {
            for (let j = 0; j < this.datas[i].length; j++) {
                this.datas[i][j] = this.patchColonne(this.inputDatas[i][j], this.allColonneType[j]);
            }
        }
        if (this.allColonneType.findIndex((item) => item === 'phone') !== -1) {
            for (let i = 0; i < this.datas.length; i++) {
                this.patchPhones(i);
            }
        }
        this.autoCorrectDatas();
    }
    // isColPays(): boolean {
    //     return this.allColonneType.findIndex((item) => item === 'pays') === -1;
    // }
    patchPhones(index: number): void {
        const indexTel = this.allColonneType.findIndex((item) => item === 'phone');
        const indexPays = this.allColonneType.findIndex((item) => item === 'pays');

        let value = String(this.datas[index][indexTel]);
        let num = (value.match(/[+\d\.]+/g) as string[]) || ['0'];
        value = num?.join('') as string;

        if (value.length > 4) {
            switch (Array.from(value)[0]) {
                case '+':
                    break;
                case '0':
                    value = '+33' + value.substring(1);
                    break;
                case '6':
                    value = '+33' + value;
                    break;
                case '5':
                    value = '+33' + value;
                    break;
                case '3':
                    value = '+' + value;
                    break;
                default:
                    break;
            }

            if (indexPays === -1) {
                this.datas[index][indexTel] = value;
            } else {
                const pays = this.pays.iso.find((item) => item.iso === this.datas[index][indexPays]);
                if (pays && value.length > 4) {
                    this.datas[index][indexTel] = pays.indicatif + value.slice(-9);
                }
            }
        }
    }
    patchColonne(value: string, type: string): string {
        switch (type) {
            case 'number':
                return this.getStringAsNumber(value);
                break;
            case 'siren':
                const siren = String(this.getStringAsNumber(value)).replace('.', '');
                return this.getStringWithLength(siren, 9).padEnd(9, '0');
                break;
            case 'siret':
                const siret = String(this.getStringAsNumber(value)).replace('.', '');
                return this.getStringWithLength(siret, 14).padEnd(9, '0');
                break;
            case 'pays':
                return this.pays.getIsoFromPays(value);
                break;
            case 'txt32':
                return this.getStringWithLength(value, 32);
                break;
            case 'txt64':
                return this.getStringWithLength(value, 64);
                break;
            case 'txt100':
                return this.getStringWithLength(value, 100);
                break;
            case 'txt128':
                return this.getStringWithLength(value, 128);
                break;
            case 'txt255':
                return this.getStringWithLength(value, 255);
                break;
            case 'tag510':
                return this.getStringWithLength(value, 510);
                break;
            case 'yn':
                return this.patchYN(value);
                break;
            case 'ouinon':
                return this.patchOuiNon(value);
                break;
            case 'trueFalse':
                return this.patchTrueFalse(value);
                break;
            case 'keyValue':
                return this.patchKeyValue(value);
                break;
            case 'addressName':
                return this.patchAdressName(value);
                break;
            case 'increment':
                return this.pushIncrement(value);
                break;
            default:
                return value;
                break;
        }
    }
    getStringWithLength(value: string, length: number): string {
        return value.substring(0, length);
    }
    patchKeyValue(value: string): string {
        for (let k = 0; k < this.keyValue.length; k++) {
            value = this.replaceAll(value, this.keyValue[k].key, this.keyValue[k].value);
        }
        return value;
    }
    patchYN(value: string): string {
        value = value.trim().toUpperCase();
        let retour = '';
        switch (value) {
            case 'Y':
                retour = 'Y';
                break;
            case 'YES':
                retour = 'Y';
                break;
            case '1':
                retour = 'Y';
                break;
            case 'N':
                retour = 'N';
                break;
            case 'No':
                retour = 'N';
                break;
            case '0':
                retour = 'N';
                break;
            default:
                break;
        }
        return retour;
    }
    pushIncrement(value: string): string {
        const str = this.prefix + this.count;
        if (value === '') {
            this.count++;
            return str;
        } else {
            return value;
        }
    }
    patchAdressName(value: string): string {
        if (value === '') {
            return 'Adresse principale';
        } else {
            return value;
        }
    }
    patchOuiNon(value: string): string {
        if (this.patchYN(value) === 'Y') {
            return 'Oui';
        } else {
            return 'Non';
        }
    }
    patchTrueFalse(value: string): string {
        if (this.patchYN(value) === 'Y') {
            return 'true';
        } else {
            return 'false';
        }
    }
    noExponents(nbre: number): string {
        var data = String(nbre).split(/[eE]/);
        if (data.length == 1) return data[0];

        var z = '',
            sign = nbre < 0 ? '-' : '',
            str = data[0].replace('.', ''),
            mag = Number(data[1]) + 1;

        if (mag < 0) {
            z = sign + '0.';
            while (mag++) z += '0';
            return z + str.replace(/^\-/, '');
        }
        mag -= str.length;
        while (mag--) z += '0';
        return str + z;
    }
    getStringAsNumber(value: any): any {
        //const retour = value.replace(/^\D+/g, '');
        console.log('original', value);

        const numb = Number(value);
        const exponent = this.noExponents(Number(value));
        console.log('exponent', exponent);
        if (!isNaN(Number(exponent))) {
            console.log('is not nan');
            return exponent;
        } else {
            value = String(value);
            console.log('string', value);
            value = value.replace(',', '.');
            let retour = '0';
            try {
                //
                let num = (value.match(/[\d\.]+/g) as string[]) || ['0'];

                retour = num?.join('') as string;
                let numberOfDots = retour.split('.').length - 1;

                while (numberOfDots > 1) {
                    retour = retour.replace('.', '');
                    numberOfDots--;
                }
            } catch (error) {
                console.error(error, value);
            }

            return Number(retour) || 0;
        }
    }
    sumAllColonnes(): void {
        for (let j = 0; j < this.datas[0].length; j++) {
            this.sommation[j] = 0;
            for (let i = 0; i < this.datas.length; i++) {
                if (typeof this.datas[i][j] === 'number') {
                    this.sommation[j] += this.datas[i][j];
                }
            }
        }
    }
    getInputCell(indexLigne: number, indexCell: number): string {
        return String(this.inputDatas[indexLigne][indexCell]);
    }
    onEditCell(indexLigne: number, indexCell: number): void {
        this.selectedLigneIndex = indexLigne;
        this.selectedCellIndex = indexCell;

        this.celluleTemp = String(this.datas[indexLigne][indexCell]).trim();

        this.isDialogCell = true;
    }
    cellDialogApply(): void {
        this.datas[this.selectedLigneIndex][this.selectedCellIndex] = this.celluleTemp;
        this.inputDatas[this.selectedLigneIndex][this.selectedCellIndex] = this.celluleTemp;
        this.isDialogCell = false;
    }
    onAddColumnAfter() {
        this.addColumnAt(this.selectedIndex + 1);
        this.addHeaderAt(this.selectedIndex + 1);
        this.isDialogHeader = false;
    }
    onAddColumnBefore() {
        this.addColumnAt(this.selectedIndex);
        this.addHeaderAt(this.selectedIndex);
        this.isDialogHeader = false;
    }
    onRemoveColumn() {
        this.removeColumnAt(this.selectedIndex);
        this.isDialogHeader = false;
    }
    addColumnAt(index: number): void {
        for (let i = 0; i < this.datas.length; i++) {
            this.fileDatas[i].splice(index, 0, '');
        }
        // this.populateBuffers(); done by add header
    }
    removeColumnAt(index: number): void {
        for (let i = 0; i < this.datas.length; i++) {
            this.fileDatas[i].splice(index, 1);
        }
        this.populateBuffers();
    }
    addHeaderAt(index: number): void {
        this.fileDatas[0][index] = 'Non défini';
        this.populateBuffers();
    }

    isEdited(lineIndex: number, cellIndex: number): boolean {
        return this.fileDatas[lineIndex + 1][cellIndex] !== this.datas[lineIndex][cellIndex];
    }
    getTooltip(lineIndex: number, cellIndex: number): string {
        return String(this.fileDatas[lineIndex + 1][cellIndex]).trim();
    }
    showHelp(): void {
        this.isHelp = true;
    }
}
