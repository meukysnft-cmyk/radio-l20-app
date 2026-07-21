import { getAllTables } from './src/footballScraper.ts';

const tables = await getAllTables();
console.log(JSON.stringify(tables, null, 2));
