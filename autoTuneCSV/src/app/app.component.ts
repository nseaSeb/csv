import { Component, Input } from '@angular/core';
import { CsvParseService } from './csv-parse.service';
import { ExportCsvService } from './export-csv.service';
import { PaysCorrectionService } from './pays-correction.service';
import languageEncoding from 'detect-file-encoding-and-language';
import { type } from 'os';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    title = 'csv';
    filename = 'undefined';
    nbreDeLignes = 0;
    encodage = 'undefined';
    isNotExecutable = true;
    dateFormat = 'yyyyMMdd';
    datas: any[] = [];
    inputDatas: any[] = [];
    headers: string[] = [];
    isDialogHeader = false;
    selectedHeader = '';
    selectedIndex = 0;
    searchField = '';
    replaceField = '';
    showOutput = true;

    constructor(private csvParse: CsvParseService, private _csvExport: ExportCsvService, private pays: PaysCorrectionService) {
        const dialHeader = document.getElementById('dialHeader');
        if (dialHeader) {
            dialHeader.onmousemove = (e) => {
                const x = e.pageX - e.offsetX;
                const y = e.pageY - e.offsetY;
            };
        }
    }

    inputHandler(e: any) {
        const file = e.target.files[0];
        try {
            languageEncoding(file).then((fileInfo) => {
                this.encodage = fileInfo.encoding || 'undefined';
                this.uploadFile(e);
                console.log(fileInfo);
            });
        } catch (error) {
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
                    this.inputDatas = [...result.data];
                    this.datas = JSON.parse(JSON.stringify(this.inputDatas));
                    this.headers = this.datas.shift() || [];
                    this.nbreDeLignes = result.data.length;
                    this.autoCorrectHeader();
                    console.log('headers : ', this.headers);
                    console.log('datas : ', this.datas);
                });
                this.isNotExecutable = false;
            };
        }
    }
    exportToCSV(): void {
        console.log('ExportToCSV');
        const filename = `${this.filename.slice(0, -3)}-UTF8.csv`;

        this._csvExport.exportToCsv(filename, [this.headers, ...this.datas]);
    }
    autoCorrectHeader(): void {
        for (let i = 0; i < this.headers.length; i++) {
            this.headers[i] = this.autoCorrectString(this.headers[i]);
            const value = this.headers[i].trim().toLocaleLowerCase();
            if (value === 'pays') {
                this.autoCorrectPays(i);
            }
        }
    }
    autoCorrectString(value: string): string {
        value = this.replaceAll(value, 'Ã©', 'é');
        return value;
    }
    autoCorrectPays(index: number): void {
        for (let i = 0; i < this.datas.length; i++) {
            console.log('autoCorrectPays', this.datas[i][index]);
            this.datas[i][index] = this.pays.getIsoFromPays(this.datas[i][index]);
        }
    }
    replaceAll(string, search, replace) {
        return string.split(search).join(replace);
    }
    openHeader(header: string, index: number): void {
        console.log('openHeader', this.inputDatas);
        this.selectedIndex = index;
        this.selectedHeader = header;
        this.isDialogHeader = true;
    }
    headerDialogApply(): void {
        console.log('headerDialogApply', this.selectedHeader);
        this.headers[this.selectedIndex] = this.selectedHeader;
        if (this.searchField && this.replaceField) {
            console.log('headerDialogApply replace');
            this.onReplace();
        }
        this.isDialogHeader = false;
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
    onReplace(): void {
        for (let i = 0; i < this.datas.length; i++) {
            this.datas[i][this.selectedIndex] = this.replaceAll(this.datas[i][this.selectedIndex], this.searchField, this.replaceField);
        }
    }
}
