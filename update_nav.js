const fs = require('fs');
const path = require('path');

const dir = '.';
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Find the search button that looks like <button class="text-dark hover:text-primary transition"><i class="fas fa-search"></i></button>
        // Use a more relaxed regex to match it
        const searchRegex = /<button class="(text-dark[^"]*?)">\s*<i class="fas fa-search[^"]*?"><\/i>\s*<\/button>/g;
        
        if (searchRegex.test(content)) {
            content = content.replace(searchRegex, '<button onclick="toggleSearch()" class="$1"><i class="fas fa-search"></i></button>');
            fs.writeFileSync(filePath, content, 'utf8');
            console.log("Updated search button in " + file);
        }
    }
});
