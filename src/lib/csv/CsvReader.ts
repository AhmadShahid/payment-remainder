import { IReader } from './IReader';
import * as fs from 'fs';
import csv from 'csv-parser';

export class CsvReader implements IReader {
    public csvFilePath: string;

    constructor(csvFilePath: string) {
        if (!csvFilePath) {
            throw new Error('file not found please specify correct path');
        }
        this.csvFilePath = csvFilePath;
    }

    getData<T>(): Promise<T[]> {
        return new Promise((resolve, reject) => {
            const results: T[] = [];
            fs.createReadStream(this.csvFilePath)
                .pipe(csv())
                .on('data', (data) => results.push(<T>data))
                .on('end', () => {
                    resolve(results);
                })
                .on('error', (err) => {
                    reject(err);
                });
        });
    }
}
