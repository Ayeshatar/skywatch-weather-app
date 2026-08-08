const fs = require('fs');
const path = require('path');
const tracePath = path.join(process.cwd(), '.next', 'trace');
console.log('tracePath:', tracePath);
console.log('exists:', fs.existsSync(tracePath));
try {
  const stat = fs.statSync(tracePath);
  console.log('stat:', { size: stat.size, mode: stat.mode });
} catch (err) {
  console.error('statErr', err.code, err.message);
}
try {
  fs.unlinkSync(tracePath);
  console.log('deleted trace');
} catch (err) {
  console.error('unlinkErr', err.code, err.message);
}
