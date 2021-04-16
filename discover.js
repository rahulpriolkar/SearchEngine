const crawl = require('./crawl');
const cheerio = require('cheerio');
const fs = require('fs');

fs.appendFileSync('./logs.txt', '\n###############################################\n\n');
// fs.truncate('./logs.txt', 0, () => {});

const discoverDomains = ({ response, url, params }) => {
    const $ = cheerio.load(response.data);
    const domains = params.domains;

    const link_re = /^https?\:\/\/(www\.(\w+)\.([a-z0-9:\.]+))(.*)/;
    // const link_re = /^https?\:\/\/(www\.(\w+)\.(com|in|co\.uk|co\.in|org|net|io|gov|gov\.in))(.*)/;
    const url_link = url.match(link_re);

    for (node of $('a')) {
        let href = node.attribs.href;

        if (href) {
            const href_link = href.match(link_re);
            if (href_link && href_link[1] != url_link[1]) {
                if (
                    !domains.find((el) => {
                        return el.domainName == href_link[1];
                    })
                ) {
                    domains.push({ domainName: href_link[1] });
                }
            }
        }
    }
};

const discover = async ({ domains, count, startTime, batchSize, timeout }) => {
    const promiseArray = [];
    let promiseFulfilled = 0,
        timeoutCount = 0;
    for (domain of domains) {
        if (domain['lastVisited']) continue;
        domain['lastVisited'] = Date.now();
        domain['timeout'] = false;

        if (promiseArray.length == batchSize) break;

        promiseArray.push(
            crawl({
                url: 'http://' + domain['domainName'],
                callback: discoverDomains,
                params: {
                    domains,
                    timeout
                }
            }).then(({ res, domainIndex, errorFlag, isTimeout }) => {
                if (!errorFlag) promiseFulfilled++;
                if (isTimeout) {
                    timeoutCount++;
                    domains[domainIndex]['timeout'] = true;
                }
            })
        );
    }

    return Promise.all(promiseArray)
        .then(() => {
            const time = ((Date.now() - startTime) / 1000).toFixed(2);
            fs.appendFileSync(
                './logs.txt',
                `Iteration ${count}: ${domains.length} Domains Found [${time} sec] [Errors]: ${
                    promiseArray.length - promiseFulfilled
                } [avg speed]: ${(domains.length / time).toFixed(2)} domains/sec `
            );
            // console.log(
            //     `Iteration ${count}: ${domains.length} Domains Found [${time} sec] [Errors]: ${
            //         promiseArray.length - promiseFulfilled
            //     } [avg speed]: ${(domains.length / time).toFixed(2)} domains/sec `
            // );
            return { time, total: domains.length, timeouts: timeoutCount };
        })
        .catch((e) => {
            console.log(e);
        });
};

const discoverBot = async ({ domains, batchSize, timeout }) => {
    const startTime = Date.now();
    let count = 0;

    fs.appendFileSync('./logs.txt', `batchSize = ${batchSize} timeout = ${timeout}\n`);

    let prevTime = 0,
        prevTotal = 0;
    while (true) {
        try {
            count++;
            const res = await discover({ domains, count, startTime, batchSize, timeout });
            fs.appendFileSync(
                './logs.txt',
                `[Time]: +${(res.time - prevTime).toFixed(2)} sec [Errors]: +${
                    res.total - prevTotal
                } domains [Timeouts]: ${res.timeouts}\n`
            );
            prevTime = res.time;
            prevTotal = res.total;
        } catch (e) {
            console.log(e);
        }
    }
};

module.exports = discoverBot;
