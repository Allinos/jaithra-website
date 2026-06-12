const fs = require('fs');
const path = require('path');

const ROOT_FOLDER = './category'; // Change this path

function processHtmlFile(filePath) {
    try {
        let html = fs.readFileSync(filePath, 'utf8');

        html = html.replace(
            /(<a\b[^>]*\bhref=["'])([^"']+\.html)(["'][^>]*>)/gi,
            (match, start, href, end) => {

                // Skip if already contains /product-details/
                if (href.startsWith('/product-details/')) {
                    return match;
                }

                return `${start}/product-details/${href}${end}`;
            }
        );

        fs.writeFileSync(filePath, html, 'utf8');
        console.log(`Updated: ${filePath}`);
    } catch (err) {
        console.error(`Error processing ${filePath}`, err);
    }
}

function scanDirectory(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dir, item.name);

        if (item.isDirectory()) {
            scanDirectory(fullPath);
        } else if (
            item.isFile() &&
            item.name.toLowerCase() === 'index.html'
        ) {
            processHtmlFile(fullPath);
        }
    }
}

scanDirectory(ROOT_FOLDER);

console.log('Done!');