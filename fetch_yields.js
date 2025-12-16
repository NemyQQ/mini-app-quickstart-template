const https = require('https');

https.get('https://yields.llama.fi/pools', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
        data += chunk;
    });

    resp.on('end', () => {
        try {
            const json = JSON.parse(data);
            const pools = json.data.filter(p =>
                p.chain === 'Base' &&
                p.tvlUsd > 1000000 // Min $1M TVL
            ).sort((a, b) => b.tvlUsd - a.tvlUsd);

            // Map to see project names
            const projects = [...new Set(pools.map(p => p.project))];
            console.log("Projects found on Base:", projects.slice(0, 10));

            // Output top 5 just to see structure
            console.log(JSON.stringify(pools.slice(0, 5), null, 2));
        } catch (e) {
            console.error("Parse error", e);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
