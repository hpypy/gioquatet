// State
let allProducts = [];
let filteredProducts = [];
let currentProduct = null;
let currentImageIndex = 0;
let slideIntervals = {};

// Filter state
let currentFilters = {
    price: 'all',
    alcohol: 'all'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupFilterListeners();
});

// Load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        allProducts = await response.json();
        filteredProducts = [...allProducts];
        renderProducts();
        updateResultsCount();
        initSlideshow();
    } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
        document.getElementById('productsGrid').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Không thể tải sản phẩm. Vui lòng thử lại sau.</p>
            </div>
        `;
    }
}

// Setup filter listeners
function setupFilterListeners() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterType = btn.dataset.filterType;
            const filterValue = btn.dataset.filterValue;
            
            // Update active state
            document.querySelectorAll(`[data-filter-type="${filterType}"]`).forEach(b => {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            
            // Update filter state
            currentFilters[filterType] = filterValue;
            
            // Apply filters
            applyFilters();
        });
    });
}

// Apply filters
function applyFilters() {
    filteredProducts = allProducts.filter(product => {
        // Price filter
        let priceMatch = true;
        if (currentFilters.price !== 'all') {
            const price = product.price;
            switch (currentFilters.price) {
                case 'under500':
                    priceMatch = price < 500000;
                    break;
                case '500-1000':
                    priceMatch = price >= 500000 && price < 1000000;
                    break;
                case '1000-2000':
                    priceMatch = price >= 1000000 && price < 2000000;
                    break;
                case 'over2000':
                    priceMatch = price >= 2000000;
                    break;
            }
        }
        
        // Alcohol filter
        let alcoholMatch = true;
        if (currentFilters.alcohol !== 'all') {
            alcoholMatch = product.hasAlcohol.toString() === currentFilters.alcohol;
        }
        
        return priceMatch && alcoholMatch;
    });
    
    // Clear existing slideshow intervals
    Object.keys(slideIntervals).forEach(id => {
        clearInterval(slideIntervals[id]);
    });
    slideIntervals = {};
    
    // Re-render products
    renderProducts();
    updateResultsCount();
    initSlideshow();
}

// Update results count
function updateResultsCount() {
    const count = filteredProducts.length;
    const resultsEl = document.getElementById('resultsCount');
    resultsEl.textContent = `Tìm thấy ${count} sản phẩm`;
}

// Format price
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Render products
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>Không tìm thấy sản phẩm phù hợp</p>
                <button class="btn-reset-filter" onclick="resetFilters()">
                    <i class="fas fa-redo"></i>
                    Đặt lại bộ lọc
                </button>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <div class="product-image-container">
                ${product.images.map((img, idx) => `
                    <img src="${img}" 
                         alt="${product.name} ${idx + 1}" 
                         class="product-image ${idx === 0 ? 'active' : 'inactive'}"
                         data-product-id="${product.id}"
                         data-image-index="${idx}"
                         onclick="openModal(${product.id}, ${idx})">
                `).join('')}
                <div class="image-dots">
                    ${product.images.map((_, idx) => `
                        <div class="dot ${idx === 0 ? 'active' : ''}" data-product-id="${product.id}" data-index="${idx}"></div>
                    `).join('')}
                </div>
                ${product.hasAlcohol ? '<div class="alcohol-badge"><i class="fas fa-wine-bottle"></i> Có rượu</div>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${formatPrice(product.price)} ₫</div>
                <button class="btn-order" onclick="orderProduct(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                    Đặt Qua Fanpage
                </button>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Reset filters
function resetFilters() {
    currentFilters = {
        price: 'all',
        alcohol: 'all'
    };
    
    // Reset all filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filterValue === 'all') {
            btn.classList.add('active');
        }
    });
    
    applyFilters();
}

// Initialize slideshow
function initSlideshow() {
    filteredProducts.forEach(product => {
        if (product.images.length <= 1) return;
        
        let currentIndex = 0;
        slideIntervals[product.id] = setInterval(() => {
            currentIndex = (currentIndex + 1) % product.images.length;
            updateProductImages(product.id, currentIndex);
        }, 3000);
    });
}

// Update product images
function updateProductImages(productId, index) {
    const images = document.querySelectorAll(`img[data-product-id="${productId}"]`);
    const dots = document.querySelectorAll(`.dot[data-product-id="${productId}"]`);
    
    images.forEach((img, idx) => {
        if (idx === index) {
            img.classList.remove('inactive');
            img.classList.add('active');
        } else {
            img.classList.remove('active');
            img.classList.add('inactive');
        }
    });
    
    dots.forEach((dot, idx) => {
        if (idx === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Open modal
function openModal(productId, imageIndex = 0) {
    currentProduct = allProducts.find(p => p.id === productId);
    currentImageIndex = imageIndex;
    
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalPrice = document.getElementById('modalPrice');
    const modalDots = document.getElementById('modalDots');
    
    modalImage.src = currentProduct.images[currentImageIndex];
    modalTitle.textContent = currentProduct.name;
    modalDescription.textContent = currentProduct.description;
    modalPrice.textContent = formatPrice(currentProduct.price) + ' ₫';
    
    // Create dots
    modalDots.innerHTML = currentProduct.images.map((_, idx) => `
        <button class="modal-dot ${idx === currentImageIndex ? 'active' : ''}" 
                onclick="setModalImage(${idx})"></button>
    `).join('');
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentProduct = null;
    currentImageIndex = 0;
}

// Previous image
function prevImage() {
    if (!currentProduct) return;
    currentImageIndex = currentImageIndex === 0 ? currentProduct.images.length - 1 : currentImageIndex - 1;
    updateModalImage();
}

// Next image
function nextImage() {
    if (!currentProduct) return;
    currentImageIndex = currentImageIndex === currentProduct.images.length - 1 ? 0 : currentImageIndex + 1;
    updateModalImage();
}

// Set modal image
function setModalImage(index) {
    currentImageIndex = index;
    updateModalImage();
}

// Update modal image
function updateModalImage() {
    const modalImage = document.getElementById('modalImage');
    const dots = document.querySelectorAll('.modal-dot');
    
    modalImage.src = currentProduct.images[currentImageIndex];
    
    dots.forEach((dot, idx) => {
        if (idx === currentImageIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Order product
function orderProduct(productId) {
    const product = allProducts.find(p => p.id === productId);
    const fbUrl = `https://www.facebook.com/profile.php?id=61584802095138`;
    window.open(fbUrl, '_blank');
}

// Order from modal
function orderFromModal() {
    if (currentProduct) {
        orderProduct(currentProduct.id);
    }
}

// Close modal when clicking outside
document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') {
        closeModal();
    }
});

// Keyboard navigation for modal
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('modal');
    if (!modal.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
        closeModal();
    } else if (e.key === 'ArrowLeft') {
        prevImage();
    } else if (e.key === 'ArrowRight') {
        nextImage();
    }
});
