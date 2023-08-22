/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '@angular/core';
import * as iconvlite from 'iconv-lite';

@Injectable({
    providedIn: 'root',
})
export class ExportCsvService {
    constructor() {}
    exportToCsv(filename: string, rows: object[], divider?: string): void {
        if (!rows || !rows.length) {
            return;
        }
        let separator = ';';
        if (divider !== undefined) {
            separator = divider;
        }
        const keys = Object.keys(rows[0]);
        const csvData =
            keys.join(separator) +
            '\n' +
            rows
                .map((row) =>
                    keys
                        .map((k) => {
                            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
                            cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
                            if (cell.search(/("|,|\n)/g) >= 0) {
                                cell = `"${cell}"`;
                            }
                            return cell;
                        })
                        .join(separator),
                )
                .join('\n');
        // add bom for excel
        // const BOM = '\uFEFF';
        // csvData = BOM + csvData;
        //
        const csvIso = iconvlite.encode(csvData, 'win1252', { stripBOM: true });

        const blob = new Blob([csvIso], { type: 'text/csv;charset=win1252' });

        const link = document.createElement('a');
        if (link.download !== undefined) {
            // Browsers that support HTML5 download attribute
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
