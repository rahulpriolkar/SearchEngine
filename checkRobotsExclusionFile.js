const checkRobotsExclusionFile = ({ response, url, params }) => {
    const disallowedPaths = [];
    const lines = response.data.split(/\r?\n/);

    const userAgentRE = /^User-agent: (\w+)/;
    const disallowRE = /^Disallow.*/;

    for (line of lines) {
        const userAgentMatch = line.match(userAgentRE);
        if (userAgentMatch) {
            if (userAgentMatch[1] != '*') break;
        }
        if (line.match(disallowRE)) {
            disallowedPaths.push(line.split(' ')[1]);
        }
    }

    return disallowedPaths;
};

module.exports = checkRobotsExclusionFile;
