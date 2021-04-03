const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const domainsFound = [];
fs.truncate('./logs.txt', 0, () => {});

const crawl = (url) => {
    console.log(`crawling ${url}`);
    axios
        .get(url)
        .then((response) => {
            const $ = cheerio.load(response.data);
            for (node of $('*')) {
                const href = node.attribs.href;
                if (href) {
                    const re = /^https?\:\/\/(www\.(\w+)\.[a-z0-9:]+).*/;
                    let found = href.match(re);
                    if (
                        found &&
                        !domainsFound.find((domain) => domain == found[2])
                    ) {
                        fs.appendFileSync('./logs.txt', found[1] + '\n');
                        domainsFound.push(found[2]);
                        crawl(href);
                    }
                }
            }
        })
        .catch((e) => {
            console.error(`[Error]: ${e.code}`);
        });
};

crawl('http://www.amazon.in');
crawl('https://www.snapdeal.com');
crawl('https://www.paytm.com');
