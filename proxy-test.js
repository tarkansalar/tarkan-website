
// Removed node-fetch dependency, using native fetch (Node 18+)

async function testProxy(proxyName, proxyUrlBase, sheetId) {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    const targetUrl = proxyUrlBase + encodeURIComponent(csvUrl);
    
    console.log(`Testing ${proxyName}...`);
    const start = Date.now();
    try {
        const res = await fetch(targetUrl);
        const duration = Date.now() - start;
        if (res.ok) {
            console.log(`✅ ${proxyName} Success (${duration}ms)`);
            const text = await res.text();
            console.log(`   Sample: ${text.substring(0, 50).replace(/\n/g, ' ')}...`);
            return true;
        } else {
            console.log(`❌ ${proxyName} Failed: Status ${res.status}`);
            return false;
        }
    } catch (e) {
        const duration = Date.now() - start;
        console.log(`❌ ${proxyName} Error (${duration}ms): ${e.message}`);
        return false;
    }
}

(async () => {
    // A public Google Sheet ID for testing
    const sheetId = '1BxiMvs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'; 
    
    await testProxy('AllOrigins', 'https://api.allorigins.win/raw?url=', sheetId);
    await testProxy('CorsProxy.io', 'https://corsproxy.io/?', sheetId);
})();
