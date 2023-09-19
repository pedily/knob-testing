import { getConfig } from './config.js';
import podcastXmlParser from 'podcast-xml-parser';
import { createWriteStream } from 'fs';
import fr from 'follow-redirects';
import { createHash } from 'crypto';
import { unlink } from 'fs/promises';

export async function getFeeds() {
    return (await getConfig()).feeds;
}

export async function loadFeed(url) {
    return await podcastXmlParser(new URL(url));
}

export function getHash(source) {
    return createHash('sha1').update(source).digest('base64');
}

export async function loadEpisode(url) {
    return new Promise((resolve, reject) => {
        const filename = getHash(url);
        const filepath = `./${filename}`
        const file = createWriteStream(filepath);
        fr.https.get(url, response => {
            response.pipe(file);
        });

        file.on("finish", () => {
            file.close();
            resolve();
        });

        file.on('error', async () => {
            file.close();
            await unlink(filepath);
            reject();
        });
    });
}

(async () => {
    const feeds = await getFeeds();
    const first = await loadFeed(feeds[0]);
    const firstEpisode = await first.episodes[0];
    await loadEpisode(firstEpisode.enclosure.url);

    console.log({
        feeds,
        first,
        firstEpisode
    });
})();