import { readFile } from 'fs/promises';

export async function getConfig() {
    return JSON.parse(await readFile('config.json', 'utf-8'));
}