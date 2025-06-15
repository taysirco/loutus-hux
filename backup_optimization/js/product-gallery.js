(function() { // Start IIFE for isolation

/**
 * Product Gallery Functionality
 * Handles image switching, thumbnails, color selection, and zoom for the product details gallery.
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Product Gallery...');
    // Ensure gallery section exists before initializing
    const gallerySectionCheck = document.getElementById('details-gallery-section');
    if (gallerySectionCheck) {
        initProductGallery();
    } else {
        console.warn('Gallery section #details-gallery-section not found on DOMContentLoaded.');
    }
});

// --- Gallery Data ---

const productGalleryImages = {
    black: [
        'Public/images/black/full.jpg',
        'Public/images/black/black-tshirt.jpg'
    ],
    silver: [
        'Public/images/silver/full.jpg',
        'Public/images/silver/silver-tshirt.jpg'
    ],
    beige: [
        'Public/images/beige/full.jpg',
        'Public/images/beige/beige-tshirt.jpg'
    ]
};

// --- Gallery State ---

let galleryCurrentColor = 'black'; // Default color
let galleryCurrentImageIndex = 0;  // Default image index

// --- DOM Elements Cache (initialized in init) ---
let gallerySection = null;
let mainImageElement = null;
let mainImageContainer = null;
let thumbnailsContainer = null;
let colorOptionButtons = null;
let prevButton = null;
let nextButton = null;
let currentImageCounter = null;
let totalImageCounter = null;
let galleryCounterElement = null;

// --- Initialization ---

/**
 * Initializes the product gallery.
 */
function initProductGallery() {
    // Cache DOM elements
    gallerySection = document.getElementById('details-gallery-section');
    mainImageElement = document.getElementById('current-main-image');
    mainImageContainer = gallerySection?.querySelector('.main-image-container'); // Relative query
    thumbnailsContainer = document.getElementById('gallery-thumbnails');
    colorOptionButtons = gallerySection?.querySelectorAll('.gallery-color-option'); // Relative query
    prevButton = gallerySection?.querySelector('.gallery-nav-button.prev');
    nextButton = gallerySection?.querySelector('.gallery-nav-button.next');
    currentImageCounter = document.getElementById('current-gallery-image');
    totalImageCounter = document.getElementById('total-gallery-images');
    galleryCounterElement = document.getElementById('gallery-counter'); // Assuming counter ID is 'gallery-counter'

    // Check if essential elements were found
    if (!gallerySection || !mainImageElement || !thumbnailsContainer || !colorOptionButtons || colorOptionButtons.length === 0) {
        console.error('Essential gallery elements not found. Aborting initialization.');
        return;
    }

    console.log('Gallery elements cached.');

    // Set initial state based on default color
    updateGalleryForColor(galleryCurrentColor);

    // Add event listeners for color options
    colorOptionButtons.forEach(button => {
        button.addEventListener('click', function() { // Use function to access 'this' if needed, or keep arrow
            console.log('Color button clicked:', this.dataset.color); // DEBUG: Log click
            const selectedColor = this.dataset.color;

            if (selectedColor && selectedColor !== galleryCurrentColor && productGalleryImages[selectedColor]?.length > 0) {
                console.log(`Valid color change selected: ${selectedColor}`); // DEBUG: Log valid change
                galleryCurrentColor = selectedColor;
                galleryCurrentImageIndex = 0; // Reset index when color changes
                updateGalleryForColor(selectedColor);
                updateGalleryColorSelection(selectedColor); // Update active button styling
            } else {
                 console.warn(`Invalid color selected ('${selectedColor}'), or no images for it, or already active.`); // DEBUG: Log invalid change
            }
        });
    });

    // Add event listeners for navigation buttons
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => navigateGallery('prev'));
        nextButton.addEventListener('click', () => navigateGallery('next'));
        console.log('Navigation buttons listeners added.');
    } else {
         console.warn('Gallery navigation buttons not found.');
    }

    // Initialize zoom functionality
    initGalleryZoom();

    console.log('Product Gallery Initialized successfully.');
}

// --- Core Update Functions ---

/**
 * Updates the main image, thumbnails, counter, and nav buttons for the selected color.
 * @param {string} color - The selected color key (e.g., 'black').
 */
function updateGalleryForColor(color) {
    console.log(`Updating gallery for color: ${color}`); // DEBUG
    const images = productGalleryImages[color] || [];
    const totalImages = images.length;

    if (totalImages === 0) {
        console.warn(`No images found for color: ${color}. Displaying placeholder.`);
        // Optionally: Display a placeholder or hide gallery elements
        if(mainImageElement) {
            mainImageElement.src = 'Public/images/placeholder.jpg'; // Example placeholder
            mainImageElement.alt = 'لا توجد صور متاحة';
        }
        if(thumbnailsContainer) thumbnailsContainer.innerHTML = ''; // Clear thumbnails
        updateGalleryCounter(0, 0);
        updateNavButtonVisibility(0);
        return;
    }

    // Reset index if it's out of bounds for the new color
    if (galleryCurrentImageIndex >= totalImages) {
        console.log(`Resetting image index from ${galleryCurrentImageIndex} to 0 for color ${color}`);
        galleryCurrentImageIndex = 0;
    }

    updateGalleryMainImage(color, galleryCurrentImageIndex);
    updateGalleryThumbnails(color, galleryCurrentImageIndex);
    updateGalleryCounter(galleryCurrentImageIndex + 1, totalImages);
    updateNavButtonVisibility(totalImages);
}

/**
 * Updates the main gallery image.
 * @param {string} color - The current color.
 * @param {number} index - The index of the image to display.
 */
function updateGalleryMainImage(color, index) {
    console.log(`Attempting to update main image. Color: ${color}, Index: ${index}`); // DEBUG
    if (!mainImageElement) {
        console.error('Main image element not available.');
        return;
    }

    const images = productGalleryImages[color] || [];
    if (!images[index]) {
        console.error(`Image URL not found for color ${color} at index ${index}`);
        mainImageElement.src = 'Public/images/placeholder.jpg'; // Fallback
        mainImageElement.alt = 'خطأ في تحميل الصورة';
        return;
    }

    const imageUrl = images[index];
    const imageAltText = `طقم HELDEN ${getColorName(color)} - صورة ${index + 1}`;

    console.log(`Updating main image src to: ${imageUrl}`); // DEBUG

    // Add loading effect (optional, requires CSS)
    mainImageContainer?.classList.add('loading');

    // Preload image to avoid flicker and handle errors
    const tempImage = new Image();
    tempImage.onload = () => {
        mainImageElement.src = imageUrl;
        mainImageElement.alt = imageAltText;
        mainImageContainer?.classList.remove('loading');
        console.log(`Main image successfully loaded: ${imageUrl}`); // DEBUG
        // Update zoom modal source if it's open
        const zoomedImage = document.getElementById('zoomed-image');
        if (zoomedImage && document.getElementById('image-zoom-modal')?.style.display === 'flex') {
            zoomedImage.src = imageUrl;
        }
    };
    tempImage.onerror = () => {
        console.error(`Failed to load main image: ${imageUrl}`); // DEBUG
        mainImageElement.src = 'Public/images/placeholder.jpg'; // Fallback on error
        mainImageElement.alt = 'خطأ في تحميل الصورة';
        mainImageContainer?.classList.remove('loading');
    };
    tempImage.src = imageUrl; // Start loading
}

/**
 * Updates the gallery thumbnails.
 * @param {string} color - The current color.
 * @param {number} activeIndex - The index of the currently active image.
 */
function updateGalleryThumbnails(color, activeIndex) {
    console.log(`Updating thumbnails for color: ${color}, Active index: ${activeIndex}`); // DEBUG
    if (!thumbnailsContainer) {
        console.error('Thumbnails container not available.');
        return;
    }

    const images = productGalleryImages[color] || [];
    thumbnailsContainer.innerHTML = ''; // Clear existing thumbnails

    if (images.length <= 1) {
        console.log('Hiding thumbnails as there is only one image.'); // DEBUG
        thumbnailsContainer.style.display = 'none'; // Hide if only one image
        return;
    }

    thumbnailsContainer.style.display = ''; // Show if multiple images
    console.log(`Generating ${images.length} thumbnails.`); // DEBUG

    images.forEach((imgSrc, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `gallery-thumbnail ${index === activeIndex ? 'active' : ''}`;
        thumbnail.dataset.index = index;

        const img = new Image();
        img.src = imgSrc;
        img.alt = `صورة مصغرة ${index + 1} - ${getColorName(color)}`;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';

        // Add click listener to change main image
        thumbnail.addEventListener('click', () => {
             if (index !== galleryCurrentImageIndex) {
                console.log(`Thumbnail ${index} clicked.`); // DEBUG
                galleryCurrentImageIndex = index;
                updateGalleryMainImage(color, index);
                updateGalleryThumbnailSelection(index); // Update active thumbnail style
                updateGalleryCounter(index + 1, images.length);
             }
        });

        thumbnail.appendChild(img);
        thumbnailsContainer.appendChild(thumbnail);
    });
}

/**
 * Updates the active state styling for color selection buttons.
 * @param {string} activeColor - The color code of the active color.
 */
function updateGalleryColorSelection(activeColor) {
    console.log(`Updating active color button styling. Active: ${activeColor}`); // DEBUG
    if (!colorOptionButtons) return;
    colorOptionButtons.forEach(button => {
        if (button.dataset.color === activeColor) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

/**
 * Updates the active state styling for thumbnails.
 * @param {number} activeIndex - The index of the active thumbnail.
 */
function updateGalleryThumbnailSelection(activeIndex) {
    console.log(`Updating active thumbnail styling. Active index: ${activeIndex}`); // DEBUG
    if (!thumbnailsContainer) return;
    const thumbnails = thumbnailsContainer.querySelectorAll('.gallery-thumbnail');
    thumbnails.forEach((thumbnail) => {
        // Use dataset.index which we should have added
        const thumbIndex = parseInt(thumbnail.dataset.index, 10);
        if (thumbIndex === activeIndex) {
            thumbnail.classList.add('active');
        } else {
            thumbnail.classList.remove('active');
        }
    });
}

/**
 * Updates the image counter display (e.g., "1 / 3").
 * @param {number} current - The current image number (1-based).
 * @param {number} total - The total number of images for the current color.
 */
function updateGalleryCounter(current, total) {
    // console.log(`Updating counter: ${current}/${total}`); // DEBUG (can be verbose)
    if (currentImageCounter && totalImageCounter && galleryCounterElement) {
        if (total > 0) {
            currentImageCounter.textContent = current;
            totalImageCounter.textContent = total;
            galleryCounterElement.style.display = ''; // Show counter
        } else {
             galleryCounterElement.style.display = 'none'; // Hide if no images
        }
    }
}

/**
 * Updates the visibility of the previous/next navigation buttons.
 * @param {number} totalImages - Total number of images for the current color.
 */
function updateNavButtonVisibility(totalImages) {
    // console.log(`Updating nav visibility. Total images: ${totalImages}`); // DEBUG (can be verbose)
    if (prevButton && nextButton) {
        if (totalImages <= 1) {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        } else {
            prevButton.style.display = '';
            nextButton.style.display = '';
        }
    }
}

// --- Navigation ---

/**
 * Handles navigation to the previous or next image.
 * @param {'prev' | 'next'} direction - The direction to navigate.
 */
function navigateGallery(direction) {
    console.log(`Navigate gallery called: ${direction}`); // DEBUG
    const images = productGalleryImages[galleryCurrentColor] || [];
    const totalImages = images.length;

    if (totalImages <= 1) {
        console.log('Navigation ignored: only one image.'); // DEBUG
        return; // No navigation needed
    }

    let newIndex;
    if (direction === 'prev') {
        newIndex = (galleryCurrentImageIndex - 1 + totalImages) % totalImages;
    } else { // 'next'
        newIndex = (galleryCurrentImageIndex + 1) % totalImages;
    }

    if (newIndex !== galleryCurrentImageIndex) {
        console.log(`Navigating from index ${galleryCurrentImageIndex} to ${newIndex}`); // DEBUG
        galleryCurrentImageIndex = newIndex;
        // Update everything based on the new index
        updateGalleryMainImage(galleryCurrentColor, newIndex);
        updateGalleryThumbnailSelection(newIndex);
        updateGalleryCounter(newIndex + 1, totalImages);
    }
}

// --- Zoom Functionality ---

/**
 * Initializes the image zoom modal functionality.
 */
function initGalleryZoom() {
    console.log('Initializing zoom functionality...'); // DEBUG
    const zoomButton = gallerySection?.querySelector('.zoom-button');
    const modal = document.getElementById('image-zoom-modal');
    const closeButton = modal?.querySelector('.close-zoom');
    const zoomedImage = modal?.querySelector('#zoomed-image');

    if (!zoomButton || !modal || !closeButton || !zoomedImage) {
        console.warn('Zoom elements not found, zoom functionality disabled.');
        return;
    }

    zoomButton.addEventListener('click', () => {
        console.log('Zoom button clicked'); // DEBUG
        const currentMainSrc = mainImageElement?.src;
        const currentMainAlt = mainImageElement?.alt;
        if (currentMainSrc && !currentMainSrc.includes('placeholder.jpg')) { // Don't zoom placeholder/error
            console.log('Opening zoom modal for:', currentMainSrc); // DEBUG
            zoomedImage.src = currentMainSrc;
            zoomedImage.alt = currentMainAlt || 'صورة مكبرة';
            modal.style.display = 'flex'; // Show modal
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        } else {
            console.log('Zoom prevented for placeholder/error image.'); // DEBUG
        }
    });

    closeButton.addEventListener('click', closeZoomModal);
    modal.addEventListener('click', (event) => {
        // Close if clicking on the modal background, not the content
        if (event.target === modal) {
            console.log('Closing zoom modal due to background click.'); // DEBUG
            closeZoomModal();
        }
    });
    console.log('Zoom functionality initialized.'); // DEBUG
}

/** Closes the zoom modal */
function closeZoomModal() {
     console.log('Closing zoom modal.'); // DEBUG
     const modal = document.getElementById('image-zoom-modal');
     if(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore background scroll
     }
}


// --- Helper Functions ---

/**
 * Gets the Arabic display name for a color code.
 * @param {string} colorCode - The color code (e.g., 'black').
 * @returns {string} - The Arabic display name.
 */
function getColorName(colorCode) {
    switch (colorCode) {
        case 'black': return 'أسود';
        case 'white': return 'أبيض'; // Included for completeness, though not used currently
        case 'silver': return 'فضي';
        case 'beige': return 'بيج';
        default: return colorCode; // Fallback to the code itself
    }
}

})(); // End IIFE 