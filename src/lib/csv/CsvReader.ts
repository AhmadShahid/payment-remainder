import { IReader } from './IReader';
import * as fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { APP_PATH } from '../../RootPath';

export class CsvReader implements IReader {
    public csvFilePath: string;

    constructor(csvFilePath: string) {
        if (!fs.existsSync(csvFilePath)) {
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

export const getCsvReader = () => new CsvReader(path.resolve(APP_PATH, 'assets/customers.csv'));
