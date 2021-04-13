const cheerio = require('cheerio');

const exploreDomain = ({ response, url, params }) => {
    const $ = cheerio.load(response.data);
    const domains = params.domains;

    const link_re = /^https?\:\/\/(www\.(\w+)\.([a-z0-9:\.]+))(.*)/;
    const path_re = /^\/.*$/;

    for (node of $('a')) {
        let href = node.attribs.href;
        if (href) {
            let domainName, path;

            const href_link = href.match(link_re);
            if (href_link) {
                domainName = href_link[1];
                path = href_link[4];
            }

            const href_path = href.match(path_re);
            const url_link = url.match(link_re);
            if (href_path) {
                domainName = url_link[1];
                path = href_path[0];
            }

            if (!domainName) continue;

            if (!domains[domainName]) {
                domains[domainName] = {};
                domains[domainName]['paths'] = ['/'];
            }
            if (!domains[domainName]['paths'].includes(path))
                domains[domainName]['paths'].push(path);
        }
    }
    // return domains;
};

module.exports = exploreDomain;
