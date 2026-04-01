import os
import re

new_footer = """<footer class="bg-dark text-white pt-16 pb-8">
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
                    <li><a href="javascript:showToast('FAQ page coming soon!')" class="text-gray-400 hover:text-primary transition">FAQ</a></li>
                    <li><a href="javascript:showToast('Shipping information coming soon!')" class="text-gray-400 hover:text-primary transition">Shipping Returns</a></li>
                    <li><a href="javascript:showToast('Order tracking coming soon!')" class="text-gray-400 hover:text-primary transition">Track Order</a></li>
                    <li><a href="javascript:showToast('Privacy Policy under review.')" class="text-gray-400 hover:text-primary transition">Privacy Policy</a></li>
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
    </footer>"""

for file in os.listdir('.'):
    if file.endswith('.html'):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace existing footer
        new_content = re.sub(r'<footer\b[^>]*>.*?</footer>', new_footer, content, flags=re.DOTALL)
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")
