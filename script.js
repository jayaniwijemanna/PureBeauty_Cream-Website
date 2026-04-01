// Utility for Toast Notifications
function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 3s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- Mobile Menu Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
});

// --- Cart Logic (LocalStorage) ---
let cart = JSON.parse(localStorage.getItem('purebeauty_cart')) || [];

function saveCart() {
    localStorage.setItem('purebeauty_cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId, name, price, image) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, name, price, image, quantity: 1 });
    }
    saveCart();
    showToast(`${name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    if(window.location.pathname.includes('cart.html')) {
        renderCart();
    }
}

function updateQuantity(productId, newQty) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQty <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQty;
            saveCart();
        }
    }
    if(window.location.pathname.includes('cart.html')) {
        renderCart();
    }
}

function updateCartCount() {
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.innerText = totalItems;
        cartCountEl.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
}

// --- Products Initialization --- //
function initShopProducts() {
    let products = JSON.parse(localStorage.getItem('purebeauty_products'));
    
    // Quick fix to reset local storage if it contains the broken artifact image paths
    if (products && products.some(p => p.img && p.img.includes('1774973'))) {
        products = null; 
    }

    if (!products || products.length === 0) {
        products = [
            { id: 'prod_1', name: 'Signature Radiance Cream', desc: '50ml - Daily Hydration & Glow', stock: 45, price: 5490, img: 'images/hero.png', badge: 'Best Seller', filter: '' },
            { id: 'prod_2', name: 'Advanced Night Repair', desc: '50ml - Overnight Rejuvenation', stock: 12, price: 6290, img: 'images/night.png', badge: 'New Arrival', filter: '' },
            { id: 'prod_3', name: 'Luminous Eye Contour', desc: '15ml - Dark Circles & Puffiness', stock: 10, price: 4190, img: 'images/hero.png', badge: '', filter: 'filter sepia brightness-105 hue-rotate-15' },
            { id: 'prod_4', name: 'Hydrating Aqua Gel', desc: '50ml - 48H Moisture Boost', stock: 20, price: 4990, img: 'images/hero.png', badge: '', filter: 'filter hue-rotate-180 brightness-95' },
            { id: 'prod_5', name: 'Soothing Botanical Cream', desc: '50ml - Calms & Restores', stock: 30, price: 4490, img: 'images/hero.png', badge: '', filter: 'filter hue-rotate-60 brightness-95' },
            { id: 'prod_6', name: 'Vitamin C Brightener', desc: '30ml - Evens Skin Tone', stock: 0, price: 5890, img: 'images/hero.png', badge: '', filter: 'filter sepia-[.8] saturate-[3] hue-rotate-[-15deg] brightness-[1.2]' }
        ];
        localStorage.setItem('purebeauty_products', JSON.stringify(products));
    }

    const grid = document.getElementById('shop-products-grid');
    if (grid) {
        grid.innerHTML = products.map(p => {
            const badgeHtml = p.badge ? `<div class="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">${p.badge}</div>` : '';
            const btnHtml = p.stock > 0 
                ? `<button onclick="addToCart('${p.id}', '${p.name.replace(/'/g, "\\'")}', ${p.price}, '${p.img}')" class="w-full border border-primary text-primary hover:bg-primary hover:text-white py-3 font-medium rounded transition duration-200">Add to Cart</button>`
                : `<button disabled class="w-full border border-gray-300 text-gray-400 bg-gray-50 py-3 font-medium rounded cursor-not-allowed">Out of Stock</button>`;
            
            return `
            <div class="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 group">
                <div class="relative h-80 overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img src="${p.img}" alt="${p.name}" onerror="this.src='https://ui-avatars.com/api/?name='+encodeURIComponent('${p.name}')+'&background=f3f4f6'" class="h-full w-full object-cover transform group-hover:scale-105 transition duration-500 ${p.filter || ''}">
                    ${badgeHtml}
                </div>
                <div class="p-6 text-center">
                    <h3 class="text-xl font-bold mb-2">${p.name}</h3>
                    <p class="text-gray-500 text-sm mb-4">${p.desc || 'Premium Skincare Collection'}</p>
                    <p class="text-lg font-bold text-dark mb-6">LKR ${Number(p.price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    ${btnHtml}
                </div>
            </div>`;
        }).join('');
    }
}

// Call on load to set initial cart badge and rendering
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    initShopProducts();
});
// --- Cart Page Rendering ---
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummaryContainer = document.getElementById('cart-summary');
    
    if (!cartItemsContainer || !cartSummaryContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="text-center py-12"><p class="text-gray-500 mb-4">Your cart is empty</p><a href="shop.html" class="inline-block bg-[#d4a373] text-white px-6 py-3 rounded hover:bg-[#c38c5b] transition">Continue Shopping</a></div>';
        cartSummaryContainer.style.display = 'none';
        return;
    }
    
    cartSummaryContainer.style.display = 'block';
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        cartItemsContainer.innerHTML += `
            <div class="flex items-center justify-between border-b pb-4 mb-4">
                <div class="flex items-center space-x-4">
                    <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded shadow-sm">
                    <div>
                        <h4 class="font-bold text-gray-800">${item.name}</h4>
                        <p class="text-gray-500">LKR ${item.price.toLocaleString()}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="flex items-center border rounded">
                        <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})" class="px-3 py-1 hover:bg-gray-100">-</button>
                        <span class="px-3 py-1 border-l border-r">${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})" class="px-3 py-1 hover:bg-gray-100">+</button>
                    </div>
                    <button onclick="removeFromCart('${item.id}')" class="text-red-500 hover:text-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        `;
    });
    
    const total = subtotal + 500; // Adding a mock shipping fee
    
    document.getElementById('cart-subtotal').innerText = `LKR ${subtotal.toLocaleString()}`;
    document.getElementById('cart-total').innerText = `LKR ${total.toLocaleString()}`;
}

// Execute cart render if on cart page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cart-items')) {
        renderCart();
    }
});

// --- Checkout Form Logic (MySQL Backend) ---
document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if(cart.length === 0) return;

            const inputs = document.querySelectorAll('#cart-summary input, #cart-summary textarea, #cart-summary select');
            if(!inputs[0].value || !inputs[1].value || !inputs[2].value) {
                alert('Please fill out all delivery details.');
                return;
            }

            const customerData = {
                fullName: inputs[0].value,
                address: inputs[1].value,
                phone: inputs[2].value,
                paymentMethod: inputs[3].value
            };

            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shipping = 500;
            const total = subtotal + shipping;

            checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> <span>Processing...</span>';
            checkoutBtn.disabled = true;

            try {
                const response = await fetch('backend/api.php?action=create_order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        customer: customerData,
                        cart: cart,
                        subtotal: subtotal,
                        shipping: shipping,
                        total: total
                    })
                });
                
                const data = await response.json();
                if(data.success) {
                    alert(`Hi ${customerData.fullName}, your order #${data.order_id} has been placed successfully!`);
                    cart = [];
                    saveCart();
                    renderCart();
                    inputs.forEach(i => i.value = '');
                } else {
                    alert('Error saving order: ' + data.error);
                }
            } catch (err) {
                // Fallback for local testing without PHP server
                const mockDb = JSON.parse(localStorage.getItem('purebeauty_mock_db')) || [];
                const mockOrder = {
                    id: Math.floor(Math.random() * 10000),
                    full_name: customerData.fullName,
                    phone: customerData.phone,
                    items: cart.map(i => ({ quantity: i.quantity, product_name: i.name })),
                    total: total,
                    status: 'Pending'
                };
                mockDb.push(mockOrder);
                localStorage.setItem('purebeauty_mock_db', JSON.stringify(mockDb));

                alert(`Hi ${customerData.fullName}, your simulated order was placed successfully! (Open admin.html to view it)`);
                cart = [];
                saveCart();
                renderCart();
                if(inputs) inputs.forEach(i => i.value = '');
            } finally {
                checkoutBtn.innerHTML = '<i class="fas fa-lock mr-2"></i> <span>Secure Checkout</span>';
                checkoutBtn.disabled = false;
            }
        });
    }
});

// --- Newsletter Subscription ---
function subscribeNewsletter(event) {
    event.preventDefault();
    const emailInput = event.target.querySelector('input[type="email"]');
    if (emailInput && emailInput.value) {
        showToast('Subscribed successfully with ' + emailInput.value + '!');
        emailInput.value = '';
    }
}

// --- Search Logic ---
function toggleSearch() {
    let searchModal = document.getElementById('search-modal');
    if (!searchModal) {
        searchModal = document.createElement('div');
        searchModal.id = 'search-modal';
        searchModal.className = 'fixed inset-0 bg-black bg-opacity-80 z-[100] flex items-center justify-center hidden';
        searchModal.innerHTML = `
            <div class="bg-white p-8 rounded-lg w-11/12 max-w-2xl relative animate-fade-in-up">
                <button onclick="toggleSearch()" class="absolute top-4 right-4 text-gray-500 hover:text-dark">
                    <i class="fas fa-times text-2xl"></i>
                </button>
                <h3 class="text-2xl font-bold mb-4" style="font-family: 'Playfair Display', serif;">Search Products</h3>
                <form action="shop.html" method="GET" class="flex" onsubmit="event.preventDefault(); window.location.href='shop.html';">
                    <input type="text" name="q" placeholder="What are you looking for?" class="flex-grow border border-gray-300 px-4 py-3 rounded-l focus:outline-none focus:border-primary">
                    <button type="submit" class="bg-primary text-white px-6 py-3 rounded-r hover:bg-[#c38c5b] transition">Search</button>
                </form>
            </div>
        `;
        document.body.appendChild(searchModal);
    }
    
    if (searchModal.classList.contains('hidden')) {
        searchModal.classList.remove('hidden');
        setTimeout(() => searchModal.querySelector('input').focus(), 100);
    } else {
        searchModal.classList.add('hidden');
    }
}

