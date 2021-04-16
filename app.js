const discoverBot = require('./discover');

// const domains = [
//     { domainName: 'www.amazon.in' },
//     { domainName: 'www.imdb.com' },
//     { domainName: 'www.snapdeal.com' },
//     { domainName: 'www.paytm.com' },
//     { domainName: 'www.quora.com' },
//     { domainName: 'www.reddit.com' },
//     { domainName: 'www.makemytrip.com' }
// ];

const domains = [
    { domainName: 'www.spectacles.com' },
    { domainName: 'www.secticketoffice.com' },
    { domainName: 'www.secstore.com' },
    { domainName: 'www.thesecu.com' },
    { domainName: 'www.rolltide.com' },
    { domainName: 'www.arkansasrazorbacks.com' },
    { domainName: 'www.auburntigers.com' },
    { domainName: 'www.gatorzone.com' },
    { domainName: 'www.georgiadogs.com' },
    { domainName: 'www.ukathletics.com' },
    { domainName: 'www.olemisssports.com' },
    { domainName: 'www.hailstate.com' },
    { domainName: 'www.mutigers.com' },
    { domainName: 'www.gamecocksonline.com' },
    { domainName: 'www.utsports.com' },
    { domainName: 'www.vucommodores.com' }
];

discoverBot({ domains, batchSize: 200, timeout: 45 });
