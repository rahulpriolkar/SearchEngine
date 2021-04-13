const axios = require('axios');
const cheerio = require('cheerio');

const crawl = ({ url, callback, params }) => {
    console.log(`crawling ${url}`);
    return new Promise((resolve, reject) => {
        axios
            .get(url)
            .then((response) => {
                const res = callback({ response, url, params });
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

module.exports = crawl;
