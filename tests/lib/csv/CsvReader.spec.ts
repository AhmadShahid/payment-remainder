import path from 'path';
import { IReader } from '../../../src/lib/csv';
import { CsvReader } from '../../../src/lib/csv';

describe('CsvReader', () => {
    let csvReader: IReader;
    beforeEach(async () => {
        csvReader = new CsvReader(path.resolve(process.cwd(), 'assets/customers.csv'));
    });

    it('should be defined', () => {
        expect(csvReader).toBeDefined();
    });

    it("should throw Error with message 'file not found please specify correct path' when no params were passed", async () => {
        try {
            csvReader = new CsvReader('');
        } catch (e: unknown) {
            const error = <Error>e;
            expect(error.message).toBe('file not found please specify correct path');
        }
    });

    it('should read csv succesfully', async () => {
        const results = await csvReader.getData();
        expect(results.length).toBe(5);
    });
});
