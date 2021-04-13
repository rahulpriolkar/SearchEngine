const axios = require('axios');
const cheerio = require('cheerio');

const crawl = ({ url, callback, params }) => {
    console.log(`crawling ${url}`);
    return new Promise((resolve, reject) => {
        axios
            .get(url)
            .then((response) => {
                callback({ response, url, params });
                resolve();
            })
            .catch((e) => {
                reject(e);
            });
    });
};

module.exports = crawl;
