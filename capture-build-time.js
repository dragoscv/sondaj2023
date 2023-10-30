const fs = require('fs');

const buildTime = new Date().toISOString();

fs.writeFileSync('.env.local', `NEXT_PUBLIC_BUILD_TIME=${buildTime}\n`, { flag: 'a' }); // 'a' flag to append
