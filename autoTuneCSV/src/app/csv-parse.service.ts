import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
@Injectable({
    providedIn: 'root',
})
export class CsvParseService {
    constructor(private parser: Papa) {}

    parseCsvFile(csvData: string, encoding: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.parser.parse(csvData, {
                skipEmptyLines: true, // need this or papaparse adds a blank entry (despite csv only have 5 lines, it gives a 6th empty string)
                header: false, // testing adding a source/target header
                encoding: encoding,
                complete: (result) => {
                    console.log('Parsed: ', result);
                    resolve(result);
                },
                error: (err) => {
                    reject(err);
                },
            });
        });
    }
}
