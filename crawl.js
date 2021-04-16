const axios = require('axios');
const cheerio = require('cheerio');

const crawl = ({ url, callback, params }) => {
    const link_re = /^https?\:\/\/(www\.(\w+)\.([a-z0-9:\.]+))(.*)/;
    const url_link = url.match(link_re);
    const domainIndex = params.domains.findIndex((el) => el.domainName == url_link[1]);

    const config = {
        timeout: params.timeout * 1000
    };
    const abort = axios.CancelToken.source();
    let isTimeout;
    const id = setTimeout(() => {
        isTimeout = true;
        abort.cancel(`Timeout of ${config.timeout}ms.`);
    }, config.timeout);

    // console.log(`crawling ${url}`);
    return axios
        .get(url, { cancelToken: abort.token })
        .then((response) => {
            clearTimeout(id);
            const res = callback({ response, url, params });
            return { res, domainIndex, errorFlag: false, isTimeout };
        })
        .catch((e) => {
            return { res: e, domainIndex, errorFlag: true, isTimeout };
        });
};

module.exports = crawl;
