import fs from 'fs';
import path from 'path';

const dir = 'media/jabuli';
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.endsWith('.png')) {
        const filePath = path.join(dir, file);
        const buffer = fs.readFileSync(filePath);
        // PNG Width is at bytes 16-19, Height is at bytes 20-23 (32-bit big-endian)
        const width = buffer.readInt32BE(16);
        const height = buffer.readInt32BE(20);
        console.log(`${file}: ${width}x${height}`);
    }
});
