const fs = require('fs');

const baseContent = fs.readFileSync('about.html', 'utf8');

// The about.html has <header> ... </header> and <section> ... </section> between <nav> and <footer>.
// We'll extract everything before <header> (which includes head and nav) and everything from <footer> to end.
const headerMatch = /<header[\s\S]*?<\/header>/m.exec(baseContent);
const sectionMatch = /<section[\s\S]*?<\/section>/m.exec(baseContent);

// Get prefix until <header>
const prefix = baseContent.substring(0, headerMatch.index);
// Get suffix from <footer>
const footerIndex = baseContent.indexOf('<footer');
const suffix = baseContent.substring(footerIndex);

function createPage(file, content) {
    fs.writeFileSync(file, prefix + '\n' + content + '\n' + suffix);
    console.log(`Created ${file}`);
}


// --- 1. Track Order ---
const trackHTML = `
    <!-- Main Content -->
    <main class="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full mb-16">
        <div class="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-gray-100 mt-10">
            <div class="text-center mb-10">
                <i class="fas fa-box-open text-5xl text-primary mb-6"></i>
                <h1 class="text-3xl md:text-4xl font-bold mb-4" style="font-family: 'Playfair Display', serif;">Track Your Order</h1>
                <p class="text-gray-500">Enter your Order ID (e.g. 5234) below to check the current status of your shipment.</p>
            </div>
            
            <form id="track-form" onsubmit="trackOrder(event)" class="max-w-xl mx-auto space-y-6">
                <div>
                    <label class="block text-gray-700 font-medium mb-2">Order ID</label>
                    <input type="text" id="order-id-input" required placeholder="e.g. 8492" class="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                </div>
                <button type="submit" class="w-full bg-dark text-white font-medium py-4 rounded hover:bg-black transition shadow-md">Track Package</button>
            </form>

            <div id="track-result" class="mt-10 hidden border-t pt-8">
                <!-- Injected via JS -->
            </div>
        </div>
    </main>
`;
createPage('track.html', trackHTML);


// --- 2. FAQ ---
const faqHTML = `
    <main class="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full mb-16">
        <div class="text-center mb-16 mt-10">
            <h1 class="text-4xl font-bold mb-4" style="font-family: 'Playfair Display', serif;">Frequently Asked Questions</h1>
            <div class="w-16 h-1 bg-primary mx-auto mb-6"></div>
            <p class="text-gray-500 text-lg">Everything you need to know about our products and services.</p>
        </div>
        
        <div class="space-y-6">
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 class="text-xl font-bold mb-3 text-dark">Are your products suitable for sensitive skin?</h3>
                <p class="text-gray-600 leading-relaxed">Yes! All our formulas are dermatologically tested and created with natural, gentle ingredients. We avoid harsh chemicals and parabens.</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 class="text-xl font-bold mb-3 text-dark">How long does shipping take?</h3>
                <p class="text-gray-600 leading-relaxed">Standard shipping within the country usually takes 3-5 business days. International shipping can take 7-14 days depending on the destination.</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 class="text-xl font-bold mb-3 text-dark">Do you test on animals?</h3>
                <p class="text-gray-600 leading-relaxed">No, PureBeauty is proudly 100% cruelty-free. We never test our products on animals at any stage of product development.</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 class="text-xl font-bold mb-3 text-dark">What is your return policy?</h3>
                <p class="text-gray-600 leading-relaxed">We offer a 30-day money-back guarantee. If you are not completely satisfied with your purchase, you can return it for a full refund.</p>
            </div>
        </div>
    </main>
`;
createPage('faq.html', faqHTML);


// --- 3. Shipping & Returns ---
const shippingHTML = `
    <main class="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full mb-16">
        <div class="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 mt-10">
            <h1 class="text-4xl font-bold mb-8 text-center" style="font-family: 'Playfair Display', serif;">Shipping & Returns</h1>
            
            <div class="prose max-w-none text-gray-600">
                <h3 class="text-2xl font-bold text-dark mb-4 mt-8">Shipping Information</h3>
                <p class="mb-4">We strive to process and ship all orders within 24-48 hours. Orders placed on weekends or holidays will be processed on the next business day.</p>
                <ul class="list-disc pl-6 mb-8 space-y-2">
                    <li><strong>Standard Shipping:</strong> 3-5 business days (LKR 500)</li>
                    <li><strong>Express Shipping:</strong> 1-2 business days (LKR 1000)</li>
                    <li><strong>Free Shipping:</strong> On all orders over LKR 10,000</li>
                </ul>
                
                <h3 class="text-2xl font-bold text-dark mb-4 mt-8">Return Policy</h3>
                <p class="mb-4">Your satisfaction is our priority. If you are not completely satisfied with your PureBeauty purchase, you may return it within 30 days of the purchase date for a full refund or exchange.</p>
                <p class="mb-4">To initiate a return:</p>
                <ol class="list-decimal pl-6 mb-8 space-y-2">
                    <li>Contact our customer care team at returns@purebeauty.com with your order number.</li>
                    <li>Pack the items securely in their original packaging.</li>
                    <li>Send the package using a trackable shipping method.</li>
                </ol>
            </div>
        </div>
    </main>
`;
createPage('shipping.html', shippingHTML);


// --- 4. Privacy Policy ---
const privacyHTML = `
    <main class="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full mb-16">
        <div class="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 mt-10">
            <h1 class="text-4xl font-bold mb-8 text-center" style="font-family: 'Playfair Display', serif;">Privacy Policy</h1>
            
            <div class="prose max-w-none text-gray-600">
                <p class="mb-6">At PureBeauty, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.</p>
                
                <h3 class="text-xl font-bold text-dark mb-3 mt-6">1. Information We Collect</h3>
                <p class="mb-6">We collect personal information that you provide to us, such as your name, email address, shipping address, and payment information when you make a purchase or subscribe to our newsletter.</p>
                
                <h3 class="text-xl font-bold text-dark mb-3 mt-6">2. How We Use Your Information</h3>
                <p class="mb-6">We use your information to process transactions, deliver orders, communicate with you about your account, and send promotional emails if you have opted in.</p>
                
                <h3 class="text-xl font-bold text-dark mb-3 mt-6">3. Data Security</h3>
                <p class="mb-6">We implement robust security measures to safeguard your personal data. Payment information is always encrypted securely using industry-standard protocols.</p>
                
                <h3 class="text-xl font-bold text-dark mb-3 mt-6">4. Contact Us</h3>
                <p class="">If you have any questions about our privacy policy, please contact us at privacy@purebeauty.com.</p>
            </div>
        </div>
    </main>
`;
createPage('privacy.html', privacyHTML);
