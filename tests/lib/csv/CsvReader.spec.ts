import path from 'path';
import { IReader } from '../../../src/lib/csv/IReader';
import { CsvReader } from '../../../src/lib/csv/CsvReader';

describe('CsvReader', () => {
    let csvReader: IReader;
    beforeEach(async () => {
        csvReader = new CsvReader(path.resolve(__dirname, 'assets/customers.csv'));
    });

    it('should be defined', () => {
        expect(csvReader).toBeDefined();
    });

    it('file not found', async () => {
        const csvReader = new CsvReader(`${process.env.PWD}/assets/customers.csv`);
        expect(csvReader.getData()).toThrowError('file not found please specify correct path');
    });

    it('read file succesfully', async () => {
        const results = csvReader.getData();
        expect(results).resolves.not.toThrow();
    });
});
