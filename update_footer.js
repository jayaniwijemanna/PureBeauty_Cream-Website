const fs = require('fs');
const path = require('path');

const newFooter = `<footer class="bg-dark text-white pt-16 pb-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
                <h3 class="text-2xl font-bold tracking-widest text-primary uppercase mb-6" style="font-family: 'Playfair Display', serif;">PureBeauty</h3>
                <p class="text-gray-400 mb-6">Redefining luxury skincare with nature's finest ingredients. Your journey to perfect skin starts here.</p>
                <div class="flex space-x-4">
                    <a href="https://facebook.com/purebeauty" target="_blank" class="w-10 h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-primary transition"><i class="fab fa-facebook-f"></i></a>
                    <a href="https://instagram.com/purebeauty" target="_blank" class="w-10 h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-primary transition"><i class="fab fa-instagram"></i></a>
                    <a href="https://twitter.com/purebeauty" target="_blank" class="w-10 h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-primary transition"><i class="fab fa-twitter"></i></a>
                </div>
            </div>
            
            <div>
                <h4 class="text-lg font-bold mb-6">Quick Links</h4>
                <ul class="space-y-3">
                    <li><a href="index.html" class="text-gray-400 hover:text-primary transition">Home</a></li>
                    <li><a href="shop.html" class="text-gray-400 hover:text-primary transition">Shop Collections</a></li>
                    <li><a href="about.html" class="text-gray-400 hover:text-primary transition">Our Story</a></li>
                    <li><a href="contact.html" class="text-gray-400 hover:text-primary transition">Contact Us</a></li>
                </ul>
            </div>
            
            <div>
                <h4 class="text-lg font-bold mb-6">Customer Care</h4>
                <ul class="space-y-3">
                    <li><a href="faq.html" class="text-gray-400 hover:text-primary transition">FAQ</a></li>
                    <li><a href="shipping.html" class="text-gray-400 hover:text-primary transition">Shipping Returns</a></li>
                    <li><a href="track.html" class="text-gray-400 hover:text-primary transition">Track Order</a></li>
                    <li><a href="privacy.html" class="text-gray-400 hover:text-primary transition">Privacy Policy</a></li>
                </ul>
            </div>
            
            <div>
                <h4 class="text-lg font-bold mb-6">Newsletter</h4>
                <p class="text-gray-400 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
                <form onsubmit="subscribeNewsletter(event)" class="flex overflow-hidden rounded">
                    <input type="email" required placeholder="Enter your email" class="w-full px-4 py-3 text-dark focus:outline-none focus:ring-2 focus:ring-primary">
                    <button type="submit" class="bg-primary text-white px-6 py-3 font-medium hover:bg-[#c38c5b] transition cursor-pointer">Subscribe</button>
                </form>
            </div>
        </div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            &copy; 2026 PureBeauty Cosmetics. All rights reserved.
        </div>
    </footer>`;

const dir = '.';
const files = fs.readdirSync(dir);

// 1. Generate the missing pages
let template = fs.readFileSync('about.html', 'utf8');

const pages = [
  { file: 'faq.html', title: 'Frequently Asked Questions', icon: 'fa-question-circle', content: 'Find answers to common questions about our skincare products.' },
  { file: 'shipping.html', title: 'Shipping & Returns', icon: 'fa-truck', content: 'Learn more about our shipping policies and 30-day return guarantee.' },
  { file: 'track.html', title: 'Track Your Order', icon: 'fa-map-marker-alt', content: 'Enter your tracking number below to see your order status.' },
  { file: 'privacy.html', title: 'Privacy Policy', icon: 'fa-user-shield', content: 'We protect your data. Read our comprehensive privacy policy here.' },
];

pages.forEach(p => {
  let content = template.replace(
    /<h1 class="text-4xl md:text-5xl font-bold mb-4">.*?<\/h1>/s,
    `<h1 class="text-4xl md:text-5xl font-bold mb-4">${p.title}</h1>`
  ).replace(
    /<p class="text-xl text-gray-600 max-w-3xl mx-auto">.*?<\/p>/s,
    `<p class="text-xl text-gray-600 max-w-3xl mx-auto">${p.content}</p>`
  );
  
  // Replace the dynamic content inside "Our Story" layout
  content = content.replace(
    /<section class="py-16 md:py-24 bg-white">[\s\S]*?<\/section>/,
    `<section class="py-16 md:py-24 bg-white">
        <div class="max-w-4xl mx-auto px-4 text-center py-20">
            <i class="fas ${p.icon} text-6xl text-primary mb-6"></i>
            <h2 class="text-3xl font-bold mb-6">${p.title}</h2>
            <p class="text-gray-500 mb-8">We are currently updating this section. Please check back later.</p>
            <a href="index.html" class="bg-dark text-white px-8 py-3 rounded hover:bg-black transition">Return Home</a>
        </div>
    </section>`
  );
  
  fs.writeFileSync(p.file, content);
  console.log('Created ' + p.file);
});

// 2. Update footer in ALL files
const allFiles = fs.readdirSync(dir);
allFiles.forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        const footerRegex = /<footer\b[^>]*>[\s\S]*?<\/footer>/i;
        if (footerRegex.test(content)) {
            content = content.replace(footerRegex, newFooter);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log("Updated footer in " + file);
        }
    }
});
