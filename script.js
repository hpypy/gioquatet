// Products data
const products = [
    {
        id: 1,
        name: 'Set Yêu Thương',
        description: 'Rượu Hoa quả, Bánh Lance dài, Bánh dứa Pineapple, Kẹo dừa phủ, Nho Khô ăn',
        price: '399.000',
        images: [
            'images/0ba33fd3-c2de-4a6c-94e8-e33b36a287d0.jif',
            'images/0e230422-1a3a-4782-b1da-bd51f727b1c5.jif'
        ]
    },
    {
        id: 2,
        name: 'Set BB119 - Ngon Bổ Rẻ',
        description: 'Rượu Vang Regalis, Trà Lamour, Cafe Mallorie, Bánh hạnh nhân George, Hộp HPNY',
        price: '449.000',
        images: [
            'images/1942cc55-c6b5-419a-8c5d-b3bdf7ecb4be.jif',
            'images/1b11c47b-eecf-4051-b20c-f49a39d314d0.jif'
        ]
    },
    {
        id: 3,
        name: 'Set BB129 - Hộp HPNY Đỏ',
        description: 'Rượu Materia, Bánh Marine, Nho Raisins, Trà Lamour, Socola Jinkeli, Kẹo ngậm Đức',
        price: '479.000',
        images: [
            'images/21de12cf-2f10-41ae-9097-11694e8d6e8c.jif',
            'images/2267ab65-7705-4b0b-a318-c22c81e47249.jif'
        ]
    },
    {
        id: 4,
        name: 'Set BB169',
        description: 'Rượu vang Pantera-Regal, Cà phê Mallorie/Levant Classic, Bánh quy M Blance, Cracker Flory, Hũ Táo Đỏ, Trà M Lamour',
        price: '549.000',
        images: [
            'images/23663636-43dd-4d83-a5f3-7f15e0af403f.jif',
            'images/245a5221-7aba-431e-86fd-c9ec75792772.jif'
        ]
    },
    {
        id: 5,
        name: 'Trụ Tròn Galaxy BB160',
        description: 'Bánh quy English lớn, King Piere, Trà thảo mộc Madeline, Bánh kẹp kem Ritaz, Scl Farris giấy, Bánh que Eudora, Nho raisin',
        price: '549.000',
        images: [
            'images/26bc069a-b40b-4a50-9ce9-0e91ba387a9d.jif',
            'images/398b51a0-9178-4352-a958-5cfde93396ca.jif'
        ]
    },
    {
        id: 6,
        name: 'Set BB027 - Mã Đáo Thành Công',
        description: 'Hộp Tết cao cấp kèm túi giấy, CF Levant Gold, Kẹo Bonart túi tiền thiếc, Kenju nhí hộp thiếc, Nho Raissin, SCL Faris 2 tầng, Vang Harley',
        price: '849.000',
        images: [
            'images/3cfb65a3-2711-4b73-8497-a5a49094f3fd.jif',
            'images/45065929-b2be-4388-9b8d-4cdf5b130f18.jif'
        ]
    },
    {
        id: 7,
        name: 'Set BB159',
        description: 'Rượu Ballantines 750ml, Bánh Kenju hộp thiếc, Cafe 3in1 Mallorie, Kẹo mận hộp sò, Bánh quế Racob, Hộp quà ép kim mở cánh 36x36x10cm',
        price: '1.159.000',
        images: [
            'images/46a1f322-ef38-43f8-95bb-71ec9edc138e.jif',
            'images/509b4bba-3c07-481f-8476-009d9c24b144.jif'
        ]
    },
    {
        id: 8,
        name: 'Set BB116 - Lam Cúc',
        description: 'Rượu Ballentina, Hộp điều nguyên vị, Cafe Malore, Socola 16 viên, Bánh Rita, Kẹo vỏ sò Paige',
        price: '1.199.000',
        images: [
            'images/6bf583f0-b068-47da-89dd-89dcad0f76bf.jif',
            'images/99c6f642-9a82-46cc-92bc-0a98898a62a4.jif'
        ]
    },
    {
        id: 9,
        name: 'Trụ Da Tim Gold',
        description: 'Rượu vang Ý Motara, Bánh dứa Pineapple Thái Lan, Bánh quy King Piere, Cafe Levant Gold, Trà Nga Richard, Kẹo Toffee, Kẹo Paiger vị Mận, Bánh quế Ritaz lon, Socola Faris hoa Hồng, Giỏ da tim cao cấp',
        price: '1.399.000',
        images: [
            'images/a2aa4cbe-1ee1-409e-afdb-2125febf0e58.jif',
            'images/aa0c7acd-59a5-4348-b821-716069dbb79a.jif'
        ]
    }
];

// State
let currentProduct = null;
let currentImageIndex = 0;
let slideIntervals = {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    initSlideshow();
});

// Render products
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    
    products.forEach(product => {
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
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price} ₫</div>
                <button class="btn-order" onclick="orderProduct(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                    Đặt Qua Zalo
                </button>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Initialize slideshow
function initSlideshow() {
    products.forEach(product => {
        let currentIndex = 0;
        slideIntervals[product.id] = setInterval(() => {
            currentIndex = currentIndex === 1 ? 0 : 1;
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
    currentProduct = products.find(p => p.id === productId);
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
    modalPrice.textContent = currentProduct.price + ' ₫';
    
    // Create dots
    modalDots.innerHTML = currentProduct.images.map((_, idx) => `
        <button class="modal-dot ${idx === currentImageIndex ? 'active' : ''}" 
                onclick="setModalImage(${idx})"></button>
    `).join('');
    
    modal.classList.add('active');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
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
    const product = products.find(p => p.id === productId);
    const message = `Xin chào! Tôi muốn đặt ${product.name} - Giá: ${product.price}₫`;
    const fbUrl = `https://www.facebook.com/profile.php?id=61584802095138`;
    window.open(fbUrl, '_blank');
}

// Close modal when clicking outside
document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') {
        closeModal();
    }
});
