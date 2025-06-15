document.addEventListener('DOMContentLoaded', function() {

    // تهيئة المكونات عند تحميل صفحة DOM
    console.log('تم تحميل DOM، جاري تهيئة المكونات...');
    
    // Initialize hero slider
    initHeroSlider();
    
    // تهيئة عرض الألوان المميز في قسم الألوان
    initColorShowcase();
    
    // Initialize size selection
    initSizeSelection();
    
    // Initialize search functionality
    initProductSearch();
    
    // Initialize smooth scroll for navigation links
    initSmoothScroll();
    
    // Initialize order form functionality
    initOrderForm();
    
    // Initialize mobile menu functionality
    initMobileMenu();
    
    // Initialize header scroll effect
    initHeaderScrollEffect();
    
    // تهيئة معرض تفاصيل المنتج
    const gallerySection = document.querySelector('.product-details-gallery-section');
    if (gallerySection) {
        console.log('تم العثور على قسم المعرض، جاري التهيئة...');
        initProductGallery();
    } else {
        console.log('لم يتم العثور على قسم المعرض في الصفحة.');
    }
    
    // إضافة مستمعات أحداث إضافية
    addExtraEventListeners();
    
    // Initialize testimonials slider
    initTestimonialsSlider();
    
    // Initialize Enhanced Testimonials Section
    initEnhancedTestimonials();
    
    // تهيئة قسم التقييمات
    initReviewsGallery();
});

// دالة لإضافة مستمعات أحداث إضافية لعناصر الصفحة
function addExtraEventListeners() {
    console.log('إضافة مستمعات أحداث إضافية...');
    
    // استدعاء تهيئة الصور المصغرة للمنتج إذا كانت موجودة
    const thumbnailsContainer = document.getElementById('product-thumbnails');
    if (thumbnailsContainer) {
        console.log('تهيئة الصور المصغرة للمنتج...');
        initProductThumbnails();
    }
    
    // تهيئة اختيار لون المنتج إذا كانت الخيارات موجودة
    const colorOptions = document.querySelectorAll('.product-color-option');
    if (colorOptions.length > 0) {
        console.log('تهيئة اختيار لون المنتج...');
        initProductColorSelection();
    }
    
    // تهيئة أزرار التنقل بين صور المنتج إذا كانت موجودة
    const navButtons = document.querySelectorAll('.image-nav-btn');
    if (navButtons.length > 0) {
        console.log('تهيئة أزرار التنقل بين صور المنتج...');
        initProductImageNavigation();
    }
    
    // تهيئة اختيار اللون للموبايل إذا كانت الخيارات موجودة
    const mobileColorOptions = document.querySelectorAll('.mobile-color-option');
    if (mobileColorOptions.length > 0) {
        console.log('تهيئة اختيار اللون للموبايل...');
        initMobileColorSelection();
    }
    
    // تهيئة أزرار التنقل في معرض الصور
    const galleryNavButtons = document.querySelectorAll('.gallery-nav-button');
    if (galleryNavButtons.length > 0) {
        console.log('تهيئة أزرار التنقل في معرض الصور...');
        galleryNavButtons.forEach(button => {
            button.addEventListener('click', () => {
                const direction = button.classList.contains('prev') ? 'prev' : 'next';
                console.log(`تم النقر على زر ${direction} في المعرض`);
                navigateGallery(direction);
            });
        });
    }
    
    // تهيئة أزرار الألوان في معرض الصور
    const galleryColorOptions = document.querySelectorAll('.gallery-color-option');
    if (galleryColorOptions.length > 0) {
        console.log('تهيئة أزرار الألوان في معرض الصور...');
        galleryColorOptions.forEach(option => {
            option.addEventListener('click', () => {
                const color = option.dataset.color;
                console.log(`تم اختيار اللون ${color} في المعرض`);
                
                if (color && color !== galleryCurrentColor) {
                    galleryCurrentColor = color;
                    galleryCurrentImageIndex = 0;
                    
                    // تحديث واجهة المستخدم
                    updateGalleryColorSelection(color);
                    updateGalleryThumbnails(color);
                    updateGalleryMainImage(color, galleryCurrentImageIndex);
                    updateGalleryCounter(galleryCurrentImageIndex + 1, productGalleryImages[color].length);
                }
            });
        });
    }
}

// تسجيل حدث تحميل النافذة للتأكد من تحميل جميع الموارد (الصور)
window.addEventListener('load', function() {
    console.log('تم تحميل جميع موارد الصفحة بنجاح (بما في ذلك الصور)');
    
    // إعادة تهيئة معرض تفاصيل المنتج بعد تحميل جميع الموارد
    const gallerySection = document.querySelector('.product-details-gallery-section');
    if (gallerySection) {
        console.log('إعادة تهيئة المعرض بعد تحميل جميع الموارد...');
        
        // تحديث الصور المصغرة مرة أخرى للتأكد من تحميلها
        updateGalleryThumbnails(galleryCurrentColor);
        
        // إعادة تطبيق اللون الحالي
        updateGalleryColorSelection(galleryCurrentColor);
        
        // التأكد من تحديث الصورة الرئيسية
        updateGalleryMainImage(galleryCurrentColor, galleryCurrentImageIndex);
        
        // التأكد من تحديث العداد
        updateGalleryCounter(galleryCurrentImageIndex + 1, productGalleryImages[galleryCurrentColor].length);
    }
    
    // التأكد من تهيئة الصور المصغرة في قسم المنتج
    const productThumbnails = document.getElementById('product-thumbnails');
    if (productThumbnails) {
        const activeColorOption = document.querySelector('.product-color-option.active');
        if (activeColorOption) {
            const colorClass = activeColorOption.getAttribute('data-color');
            if (colorClass) {
                console.log('تحديث الصور المصغرة للمنتج بعد التحميل، اللون: ' + colorClass);
                updateProductThumbnails(colorClass);
            }
        }
    }
});

/**
 * تهيئة هيرو سلايدر متطور
 */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const prevBtn = document.querySelector('.prev-slide');
  const nextBtn = document.querySelector('.next-slide');
  const progressFill = document.querySelector('.progress-fill');
  
  let currentSlide = 0;
  const totalSlides = slides.length;
  let slideInterval;
  const autoPlayDelay = 6000; // تغيير الشريحة كل 6 ثوان
  
  if (totalSlides === 0) {
    console.warn('لم يتم العثور على شرائح في السلايدر!');
    return;
  }
  
  // تهيئة مؤشر التقدم
  updateProgress(currentSlide);
  
  // التأكد من تحميل الصور
  ensureImagesLoaded();
  
  // تفعيل التنقل بين الشرائح
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      resetInterval();
    });
    
    nextBtn.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      resetInterval();
    });
  } else {
    console.warn('لم يتم العثور على أزرار التنقل للسلايدر!');
  }
  
  // بدء التشغيل التلقائي
  startAutoPlay();
  
  // إيقاف التشغيل التلقائي عند التحويم على السلايدر
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', () => {
      clearInterval(slideInterval);
    });
    
    heroSection.addEventListener('mouseleave', () => {
      startAutoPlay();
    });
  }
  
  // التأكد من تحميل الصور
  function ensureImagesLoaded() {
    slides.forEach((slide, index) => {
      const imageLayer = slide.querySelector('.image-layer');
      if (imageLayer) {
        const bgImage = imageLayer.style.backgroundImage || '';
        if (bgImage) {
          const imageUrl = bgImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
          if (imageUrl) {
            const img = new Image();
            img.onload = function() {
              console.log(`تم تحميل الصورة ${index + 1} بنجاح`);
            };
            img.onerror = function() {
              console.error(`فشل في تحميل الصورة ${index + 1}: ${imageUrl}`);
            };
            img.src = imageUrl;
          }
        }
      }
    });
  }
  
  // الانتقال إلى الشريحة المحددة
  function goToSlide(index) {
    // التعامل مع حالات تجاوز الحدود
    if (index < 0) {
      index = totalSlides - 1;
    } else if (index >= totalSlides) {
      index = 0;
    }
    
    // إزالة التنشيط من الشريحة الحالية
    slides[currentSlide].setAttribute('data-slide-index', '');
    
    // تنشيط الشريحة الجديدة
    currentSlide = index;
    slides[currentSlide].setAttribute('data-slide-index', '0');
    
    // تحديث مؤشر التقدم
    updateProgress(currentSlide);
  }
  
  // تحديث مؤشر التقدم
  function updateProgress(index) {
    if (progressFill) {
      const percentage = ((index + 1) / totalSlides) * 100;
      progressFill.style.width = `${percentage}%`;
    }
  }
  
  // بدء التشغيل التلقائي
  function startAutoPlay() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, autoPlayDelay);
  }
  
  // إعادة ضبط الفاصل الزمني
  function resetInterval() {
    clearInterval(slideInterval);
    startAutoPlay();
  }
  
  // تفعيل خيارات الألوان
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      // بإمكانك هنا تنفيذ أي إجراء عند اختيار لون معين
      console.log('تم اختيار اللون:', this.getAttribute('data-color'));
    });
  });
  
  // تفعيل أزرار المميزات ومخطط المقاسات
  const featuresBtn = document.querySelector('.features-btn');
  const sizeChartBtn = document.querySelector('.size-chart-btn');
  
  if (featuresBtn) {
    featuresBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('onclick')?.match(/scrollToSection\('(.+?)'\)/)?.[1] || 'texture-features';
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  
  if (sizeChartBtn) {
    sizeChartBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (typeof openSizeChart === 'function') {
        openSizeChart();
      } else {
        console.warn('وظيفة openSizeChart غير معرفة');
      }
    });
  }
  
  // تفعيل زر الدعوة للعمل
  const ctaButtons = document.querySelectorAll('.hero-cta-button');
  ctaButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(href);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/**
 * تهيئة عرض الألوان المميز في قسم الألوان
 */
function initColorShowcase() {
    
    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', function(event) {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(event.target) && 
            !mobileMenuToggle.contains(event.target)) {
            
            mobileMenu.classList.remove('active');
            mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
            body.style.overflow = ''; // إعادة التمرير
        }
    });
    
    // منع إغلاق القائمة عند النقر داخلها
    mobileMenu.addEventListener('click', function(event) {
        event.stopPropagation();
    });
}

// Header Scroll Effect
function initHeaderScrollEffect() {
    const header = document.querySelector('.main-header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow and shrink effect on scroll
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide header on scroll down, show on scroll up
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Order Button Click Event
document.querySelectorAll('.header-order-btn, .mobile-order-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const orderSection = document.querySelector('#order-form');
        if (orderSection) {
            orderSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/**
 * مصفوفات الصور لكل لون
 * تحتوي على مسارات الصور لكل لون من ألوان المنتج
 */
const productGalleryImages = {
    black: [
        'public/images/black/full-black.jpg',
        'public/images/black/black-tshirt.jpg'
    ],
    white: [
        // Directory 'public/images/white' does not exist, so this is empty
    ],
    silver: [
        'public/images/silver/silver-tshirt.jpg',
        'public/images/silver/full-silver.jpg'
    ],
    beige: [
        'public/images/beige/full.jpg',
        'public/images/beige/beige-tshirt.jpg'
    ]
};

// متغيرات عالمية لتتبع حالة المعرض
let galleryCurrentColor = 'black';
let galleryCurrentImageIndex = 0;

/**
 * تهيئة معرض صور المنتج
 * تقوم هذه الدالة بإعداد معرض الصور وتسجيل كل مستمعي الأحداث اللازمة
 */
function initProductGallery() {
    console.log('تهيئة معرض صور المنتج...');

    const gallerySection = document.querySelector('.product-details-gallery-section');
    if (!gallerySection) {
        console.error('لم يتم العثور على قسم معرض الصور!');
        return;
    }

    // Get available colors from the image data
    const availableColors = Object.keys(productGalleryImages).filter(color => productGalleryImages[color] && productGalleryImages[color].length > 0);

    // Set default color to the first available one if the initial default ('black') has no images or isn't available
    if (!productGalleryImages[galleryCurrentColor] || productGalleryImages[galleryCurrentColor].length === 0) {
        if (availableColors.length > 0) {
            const oldDefault = galleryCurrentColor;
            galleryCurrentColor = availableColors[0];
            galleryCurrentImageIndex = 0;
            console.log(`اللون الافتراضي '${oldDefault}' لا يحتوي على صور أو غير صالح، تم التغيير إلى أول لون متاح: ${galleryCurrentColor}`);
        } else {
            console.error('لا توجد ألوان مع صور متاحة في productGalleryImages! إخفاء المعرض.');
            // Hide the entire gallery section if no images are available at all
            gallerySection.style.display = 'none';
            return;
        }
    }

    // تحديث واجهة المستخدم للون الافتراضي/المعدل
    updateGalleryColorSelection(galleryCurrentColor);
    updateGalleryThumbnails(galleryCurrentColor);
    updateGalleryMainImage(galleryCurrentColor, galleryCurrentImageIndex);
    updateGalleryCounter(galleryCurrentImageIndex + 1, productGalleryImages[galleryCurrentColor] ? productGalleryImages[galleryCurrentColor].length : 0);


    // إضافة مستمعي الأحداث لأزرار التنقل
    const prevButton = gallerySection.querySelector('.gallery-nav-button.prev');
    const nextButton = gallerySection.querySelector('.gallery-nav-button.next');

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            // console.log('تم النقر على زر السابق');
            navigateGallery('prev');
        });

        nextButton.addEventListener('click', () => {
            // console.log('تم النقر على زر التالي');
            navigateGallery('next');
        });

         // Update visibility based on the *current* color's image count
        const currentImages = productGalleryImages[galleryCurrentColor] || [];
        if (currentImages.length <= 1) {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        } else {
            prevButton.style.display = '';
            nextButton.style.display = '';
        }

    } else {
        console.warn('لم يتم العثور على أزرار التنقل في المعرض!');
    }

    // إضافة مستمعي الأحداث لأزرار الألوان
    const colorOptions = gallerySection.querySelectorAll('.gallery-color-option');
    if (colorOptions.length) {
        colorOptions.forEach(option => {
            const color = option.dataset.color;
            // Hide color option if no images are available for it or color key doesn't exist
            if (!productGalleryImages[color] || productGalleryImages[color].length === 0) {
                option.style.display = 'none'; // Hide the option itself
                console.log(`إخفاء خيار اللون ${color} لعدم وجود صور.`);
            } else {
                 option.style.display = ''; // Ensure it's visible if images exist
            }

            option.addEventListener('click', () => {
                const selectedColor = option.dataset.color;
                // console.log(`تم اختيار اللون ${selectedColor} في المعرض`);

                // Only proceed if the color exists in our image data and has images, and is different
                if (productGalleryImages[selectedColor] && productGalleryImages[selectedColor].length > 0 && selectedColor !== galleryCurrentColor) {
                    galleryCurrentColor = selectedColor;
                    galleryCurrentImageIndex = 0;

                    // تحديث واجهة المستخدم
                    updateGalleryColorSelection(selectedColor);
                    updateGalleryThumbnails(selectedColor);
                    updateGalleryMainImage(selectedColor, galleryCurrentImageIndex);
                    const currentImages = productGalleryImages[selectedColor];
                    updateGalleryCounter(galleryCurrentImageIndex + 1, currentImages.length);

                     // Update visibility of navigation buttons for the new color
                    if (prevButton && nextButton) {
                        if (currentImages.length <= 1) {
                            prevButton.style.display = 'none';
                            nextButton.style.display = 'none';
                        } else {
                            prevButton.style.display = '';
                            nextButton.style.display = '';
                        }
                    }
                } else if (!productGalleryImages[selectedColor] || productGalleryImages[selectedColor].length === 0) {
                    console.warn(`تم النقر على لون (${selectedColor}) لا يحتوي على صور.`);
                }
            });
        });
        // Update the initial active color selection based on the potentially adjusted galleryCurrentColor
        updateGalleryColorSelection(galleryCurrentColor);
    } else {
        console.warn('لم يتم العثور على خيارات الألوان في المعرض!');
    }

    // إضافة وظيفة تكبير الصورة
    initGalleryZoom(); // Ensure this function exists and works as intended

    console.log('اكتملت تهيئة معرض الصور');
}

/**
 * تحديث الصور المصغرة في المعرض
 * @param {string} color - اللون المحدد
 */
function updateGalleryThumbnails(color) {
    // console.log(`تحديث الصور المصغرة للون: ${color}`);

    const thumbnailsContainer = document.getElementById('gallery-thumbnails');
    if (!thumbnailsContainer) {
        console.error('لم يتم العثور على حاوية الصور المصغرة!');
        return;
    }

    // تفريغ حاوية الصور المصغرة
    thumbnailsContainer.innerHTML = '';

    // التأكد من وجود مصفوفة صور للون المحدد وأنها تحتوي على عناصر
    const imagesForColor = productGalleryImages[color];
    if (!imagesForColor || imagesForColor.length === 0) {
        console.warn(`لا توجد صور متاحة للون: ${color}. إخفاء حاوية الصور المصغرة.`);
        thumbnailsContainer.style.display = 'none'; // Hide container if no images
        return;
    }

    // Hide thumbnails container if only one image exists for the color
    if (imagesForColor.length <= 1) {
         thumbnailsContainer.style.display = 'none';
         console.log(`إخفاء الصور المصغرة لوجود صورة واحدة فقط للون ${color}.`);
         return; // No need to generate thumbnails if there's only one image
    }


    thumbnailsContainer.style.display = ''; // Show container if more than one image exists
    thumbnailsContainer.classList.add('loading'); // Add loading state

    // تأخير بسيط قبل إضافة الصور لضمان تهيئة DOM
    setTimeout(() => {
        // إنشاء عنصر لكل صورة مصغرة
        imagesForColor.forEach((imgSrc, index) => {
            try {
                const thumbnail = document.createElement('div');
                thumbnail.className = `gallery-thumbnail ${index === galleryCurrentImageIndex ? 'active' : ''}`;
                // Simplified styles - rely on CSS for appearance
                thumbnail.dataset.index = index; // Store index for easier access

                const img = new Image();
                img.src = imgSrc;
                // Rely on CSS for img styling: .gallery-thumbnail img { width: 100%; height: 100%; object-fit: cover; }
                img.alt = `طقم ${getColorName(color)} - صورة مصغرة ${index + 1}`; // Use dynamic name

                const loader = document.createElement('div');
                loader.className = 'thumbnail-loader'; // Add loader (spinner)
                loader.innerHTML = '<div class="spinner"></div>'; // Spinner CSS needed
                thumbnail.appendChild(loader);

                img.onload = function() {
                    if (loader && loader.parentNode === thumbnail) {
                        thumbnail.removeChild(loader);
                    }
                    thumbnail.appendChild(img); // Add image after loader is removed
                    thumbnail.classList.add('loaded'); // Mark as loaded
                };

                img.onerror = function() {
                    console.error(`فشل في تحميل الصورة المصغرة: ${imgSrc}`);
                    if (loader && loader.parentNode === thumbnail) {
                        thumbnail.removeChild(loader);
                    }
                    thumbnail.classList.add('error'); // Mark as error
                    // Display error indication (e.g., background color or icon) via CSS
                    // Do NOT add the placeholder fallback
                };

                thumbnail.addEventListener('click', () => {
                    const clickedIndex = parseInt(thumbnail.dataset.index, 10);
                    // console.log(`تم النقر على الصورة المصغرة رقم: ${clickedIndex + 1}`);

                    if (clickedIndex !== galleryCurrentImageIndex) {
                        galleryCurrentImageIndex = clickedIndex;
                        updateGalleryMainImage(galleryCurrentColor, galleryCurrentImageIndex);
                        updateGalleryThumbnailSelection(galleryCurrentImageIndex); // Update active state
                        updateGalleryCounter(galleryCurrentImageIndex + 1, imagesForColor.length);
                    }
                });

                thumbnailsContainer.appendChild(thumbnail);

            } catch (error) {
                console.error(`حدث خطأ أثناء إنشاء الصورة المصغرة رقم ${index + 1}:`, error);
            }
        });

        thumbnailsContainer.classList.remove('loading'); // Remove loading state after loop
        // console.log(`تم إضافة ${imagesForColor.length} صورة مصغرة للون ${color}.`);

    }, 50); // Short delay

}

/**
 * تحديث الصورة الرئيسية في المعرض
 * @param {string} color - اللون المحدد
 * @param {number} index - فهرس الصورة المراد عرضها
 */
function updateGalleryMainImage(color, index) {
    // console.log(`تحديث الصورة الرئيسية: اللون=${color}، الفهرس=${index}`);

    const mainImage = document.getElementById('current-main-image');
    const mainImageContainer = document.querySelector('.main-image-container');
    // Assuming a title/caption element exists (optional)
    const imageCaptionElement = document.getElementById('main-image-caption');

    if (!mainImage || !mainImageContainer) {
        console.error('لم يتم العثور على عنصر الصورة الرئيسية (#current-main-image) أو حاويتها (.main-image-container)!');
        return;
    }

    const imagesForColor = productGalleryImages[color];

    // Clear previous states
    mainImageContainer.classList.remove('loading', 'no-image', 'error');
    mainImage.style.opacity = '0'; // Start fade out/transition

    // Check if the color exists and has images
    if (!imagesForColor || imagesForColor.length === 0) {
        console.warn(`لا توجد صور للون ${color}. إخفاء الصورة الرئيسية.`);
        mainImage.src = ''; // Clear current image
        mainImage.alt = 'لا توجد صورة متاحة';
        mainImageContainer.classList.add('no-image'); // Add class to indicate no image
        if (imageCaptionElement) {
             imageCaptionElement.textContent = `طقم ${getColorName(color)} - لا توجد صور`;
        }
        return;
    }

    // Check if the index is valid, default to 0 if not
    if (index < 0 || index >= imagesForColor.length) {
        console.warn(`فهرس الصورة (${index}) غير صالح للون ${color}. عدد الصور: ${imagesForColor.length}. العودة إلى الفهرس 0.`);
        index = 0;
        galleryCurrentImageIndex = 0; // Reset index if invalid
    }

    const imageUrl = imagesForColor[index];
    const imageAltText = `طقم ${getColorName(color)} - صورة ${index + 1}`;

    // Add loading effect *before* changing the image src
    mainImageContainer.classList.add('loading');

    // Use a temporary image for preloading to handle load/error events correctly
    const tempImage = new Image();

    tempImage.onload = function() {
        // console.log(`تم تحميل الصورة الرئيسية بنجاح: ${imageUrl}`);
        mainImage.src = imageUrl;
        mainImage.alt = imageAltText;
        mainImageContainer.classList.remove('loading'); // Remove loading effect
        mainImage.style.opacity = '1'; // Fade in new image

        // Update caption (optional)
        if (imageCaptionElement) {
             imageCaptionElement.textContent = `طقم ${getColorName(color)} - (${index + 1}/${imagesForColor.length})`;
        }
    };

    tempImage.onerror = function() {
        console.error(`فشل تحميل الصورة الرئيسية: ${imageUrl}`);
        mainImageContainer.classList.remove('loading');
        mainImage.src = ''; // Clear src on error
        mainImage.alt = `فشل تحميل الصورة: ${imageUrl}`;
        mainImageContainer.classList.add('error'); // Add error class for styling
        mainImage.style.opacity = '1'; // Show error state immediately

         // Update caption (optional)
        if (imageCaptionElement) {
             imageCaptionElement.textContent = `طقم ${getColorName(color)} - خطأ في تحميل الصورة`;
        }
    };

    // Start loading the new image *after* setting up handlers
    tempImage.src = imageUrl;
}

/**
 * تحديث تحديد الصورة المصغرة النشطة
 * @param {number} activeIndex - فهرس الصورة المصغرة النشطة
 */
function updateGalleryThumbnailSelection(activeIndex) {
    const thumbnails = document.querySelectorAll('#gallery-thumbnails .gallery-thumbnail');
    // console.log(`تحديث تحديد المصغرة، الفهرس النشط: ${activeIndex}, عدد المصغرات: ${thumbnails.length}`);
    thumbnails.forEach((thumb) => {
        // Use dataset.index which we added earlier
        const thumbIndex = parseInt(thumb.dataset.index, 10);
        if (thumbIndex === activeIndex) {
            thumb.classList.add('active');
             // Optional: Scroll into view
             // thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        } else {
            thumb.classList.remove('active');
        }
    });
}

/**
 * تحديث تحديد اللون النشط في المعرض
 * @param {string} activeColor - اللون النشط
 */
function updateGalleryColorSelection(activeColor) {
    const colorOptions = document.querySelectorAll('.gallery-color-option');
    // console.log(`تحديث تحديد اللون، اللون النشط: ${activeColor}, عدد الخيارات: ${colorOptions.length}`);
    colorOptions.forEach(option => {
        // Check if the color option should be visible (has images) before marking active
        const color = option.dataset.color;
        if (productGalleryImages[color] && productGalleryImages[color].length > 0) {
             option.style.display = ''; // Make sure it's visible
            if (color === activeColor) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        } else {
            option.style.display = 'none';
            option.classList.remove('active');
        }
    });
}


/**
 * التنقل بين الصور في المعرض
 * @param {string} direction - 'prev' أو 'next'
 */
function navigateGallery(direction) {
    const imagesForCurrentColor = productGalleryImages[galleryCurrentColor];
    if (!imagesForCurrentColor || imagesForCurrentColor.length <= 1) {
        return; // No navigation needed for single or no images
    }

    const totalImages = imagesForCurrentColor.length;
    let newIndex;

    if (direction === 'prev') {
        newIndex = (galleryCurrentImageIndex - 1 + totalImages) % totalImages;
    } else {
        newIndex = (galleryCurrentImageIndex + 1) % totalImages;
    }

    if (newIndex !== galleryCurrentImageIndex) {
        galleryCurrentImageIndex = newIndex;
        updateGalleryMainImage(galleryCurrentColor, galleryCurrentImageIndex);
        updateGalleryThumbnailSelection(galleryCurrentImageIndex);
        updateGalleryCounter(galleryCurrentImageIndex + 1, totalImages);
    }
}


/**
 * تحديث عداد الصور في المعرض
 * @param {number} current - رقم الصورة الحالية
 * @param {number} total - إجمالي عدد الصور
 */
function updateGalleryCounter(current, total) {
    const counterElement = document.getElementById('gallery-counter');
    if (!counterElement) {
        console.warn('لم يتم العثور على عنصر عداد المعرض (#gallery-counter)!');
        return;
    }
    if (total > 1) {
        counterElement.textContent = `${current} / ${total}`;
        counterElement.style.display = '';
    } else {
        counterElement.style.display = 'none';
    }
}


/**
 * تهيئة وظيفة تكبير الصورة
 */
function initGalleryZoom() {
    console.log('تهيئة وظيفة تكبير الصورة...');
    const zoomButton = document.querySelector('.zoom-button');
    const modal = document.getElementById('image-zoom-modal');
    const zoomedImage = document.getElementById('zoomed-image');
    const closeButton = document.querySelector('.close-zoom');

    if (!zoomButton) {
        console.error('زر التكبير غير موجود!');
        return;
    }
    if (!modal || !zoomedImage || !closeButton) {
        console.error('عناصر نافذة التكبير غير مكتملة!');
        return;
    }

    zoomButton.addEventListener('click', () => {
        console.log('تم النقر على زر التكبير');
        const currentImage = document.getElementById('current-main-image');
        if (currentImage) {
            zoomedImage.src = currentImage.src;
            zoomedImage.alt = currentImage.alt;
            modal.style.display = 'flex';
        }
    });

    closeButton.addEventListener('click', () => {
        console.log('تم النقر على زر إغلاق التكبير');
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            console.log('تم النقر على خلفية النافذة المنبثقة');
            modal.style.display = 'none';
        }
    });
}


/**
 * الحصول على اسم اللون بالعربية
 * @param {string} color - كود اللون (black, white, silver, beige)
 * @returns {string} - اسم اللون بالعربية
 */
function getColorName(color) {
    const colorNames = {
        black: 'الأسود',
        white: 'الأبيض', // Keep white here in case it's used elsewhere, though UI is removed
        silver: 'الفضي',
        beige: 'البيج'
    };
    return colorNames[color] || color; // Return mapped name or the code itself as fallback
}


/**
 * تهيئة سلايدر التقييمات
 */
function initTestimonialsSlider() {
    const carousel = document.querySelector('.testimonials-carousel');
    if (!carousel) return;

    const testimonials = carousel.querySelectorAll('.testimonial');
    const prevButton = document.querySelector('.prev-testimonial');
    const nextButton = document.querySelector('.next-testimonial');
    let currentIndex = 0;

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });
        currentIndex = index;
    }

    showTestimonial(0);

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            showTestimonial(currentIndex);
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(currentIndex);
        });
    }

    // Auto-play
    setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }, 5000);
}


/**
 * تهيئة قسم التقييمات المحسن
 */
function initEnhancedTestimonials() {
    console.log('تهيئة قسم التقييمات المحسن...');
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    if (!testimonialsSlider) {
        console.log('لم يتم العثور على عنصر slider للتقييمات');
        return;
    }

    const testimonialCards = testimonialsSlider.querySelectorAll('.testimonial-card');
    if (testimonialCards.length === 0) {
        console.log('لم يتم العثور على بطاقات تقييمات');
        return;
    }

    const navPrev = document.querySelector('.prev-testimonial');
    const navNext = document.querySelector('.next-testimonial');
    let currentSlide = 0;
    let autoSlideTimer;
    const autoSlideInterval = 8000; // 8 seconds

    function showTestimonial(index) {
        testimonialCards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    function startAutoSlide() {
        clearInterval(autoSlideTimer);
        autoSlideTimer = setInterval(() => {
            showTestimonial((currentSlide + 1) % testimonialCards.length);
        }, autoSlideInterval);
    }

    function resetAutoSlideTimer() {
        clearInterval(autoSlideTimer);
        startAutoSlide();
    }

    showTestimonial(0);

    if (navPrev) {
        navPrev.addEventListener('click', () => {
            showTestimonial((currentSlide - 1 + testimonialCards.length) % testimonialCards.length);
            resetAutoSlideTimer();
        });
    }

    if (navNext) {
        navNext.addEventListener('click', () => {
            showTestimonial((currentSlide + 1) % testimonialCards.length);
            resetAutoSlideTimer();
        });
    }

    startAutoSlide();

    // Pause on hover
    testimonialsSlider.addEventListener('mouseenter', () => {
        clearInterval(autoSlideTimer);
    });

    testimonialsSlider.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
}


/**
 * تهيئة قسم تقييمات العملاء المصريين
 */
function initEgyptianReviews() {
    const reviewsGallery = document.querySelector('.reviews-gallery');
    const seeMoreButton = document.querySelector('.see-more-button');

    if (!reviewsGallery || !seeMoreButton) return;

    const reviewItems = reviewsGallery.querySelectorAll('.review-gallery-item');
    let visibleCount = 6;

    // Hide items beyond the initial visible count
    reviewItems.forEach((item, index) => {
        if (index >= visibleCount) {
            item.style.display = 'none';
        }
    });

    seeMoreButton.addEventListener('click', function(e) {
        e.preventDefault();

        if (visibleCount >= reviewItems.length) {
            // Collapse
            visibleCount = 6;
            seeMoreButton.innerHTML = 'عرض المزيد من التقييمات <i class="fas fa-chevron-down"></i>';
            seeMoreButton.classList.remove('expanded');
            // Scroll to top of section
            document.querySelector('.reviews-gallery-section').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            // Expand
            visibleCount = reviewItems.length;
            seeMoreButton.innerHTML = 'عرض أقل <i class="fas fa-chevron-up"></i>';
            seeMoreButton.classList.add('expanded');
        }

        reviewItems.forEach((item, index) => {
            if (index < visibleCount) {
                item.style.display = '';
                if (index >= 6) { // Apply animation only to newly shown items
                    item.style.animation = 'fadeInUp 0.5s forwards';
                    item.style.animationDelay = `${(index - 6) * 0.1}s`;
                }
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Truncate text on mobile and expand on hover
    reviewItems.forEach(item => {
        const overlay = item.querySelector('.review-gallery-overlay');
        const reviewText = item.querySelector('.review-text');
        if (reviewText) {
            const originalText = reviewText.textContent;
            const truncatedText = truncateText(originalText, 100);
            if (window.innerWidth < 768 && originalText.length > 100) {
                reviewText.textContent = truncatedText;
                item.addEventListener('mouseenter', () => {
                    reviewText.textContent = originalText;
                });
                item.addEventListener('mouseleave', () => {
                    reviewText.textContent = truncatedText;
                });
            }
        }
    });

    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
}


/**
 * تهيئة اللايت بوكس لمعرض التقييمات
 */
function initReviewsGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.review-gallery-item, .main-review-image');
    if (galleryItems.length === 0) return;

    // Create lightbox if it doesn't exist
    if (!document.querySelector('.reviews-lightbox')) {
        const lightbox = document.createElement('div');
        lightbox.className = 'reviews-lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-container">
                <div class="lightbox-content">
                    <img src="" alt="صورة تقييم كبيرة">
                    <div class="lightbox-caption">تجربة العميل مع الطقم</div>
                </div>
                <button class="lightbox-close"><i class="fas fa-times"></i></button>
                <button class="lightbox-nav prev"><i class="fas fa-chevron-right"></i></button>
                <button class="lightbox-nav next"><i class="fas fa-chevron-left"></i></button>
            </div>
        `;
        document.body.appendChild(lightbox);

        const style = document.createElement('style');
        style.textContent = `
            .reviews-lightbox {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 9999;
                display: none;
                direction: rtl;
            }
            .reviews-lightbox.active {
                display: block;
                animation: lightboxFadeIn 0.3s ease forwards;
            }
            @keyframes lightboxFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .lightbox-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0,0,0,0.92);
                animation: overlayFadeIn 0.4s ease;
            }
            @keyframes overlayFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .lightbox-container {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.95);
                max-width: 90%;
                max-height: 90%;
                animation: containerZoomIn 0.4s ease forwards;
            }
            @keyframes containerZoomIn {
                from { transform: translate(-50%, -50%) scale(0.9); opacity: 0; }
                to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
            .lightbox-content {
                position: relative;
                width: 100%;
                height: 100%;
                text-align: center;
            }
            .lightbox-content img {
                max-width: 100%;
                max-height: 85vh;
                display: block;
                margin: 0 auto;
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
                border-radius: 5px;
                transition: opacity 0.3s ease;
            }
            .lightbox-caption {
                color: white;
                text-align: center;
                padding: 15px;
                font-size: 18px;
                font-weight: 500;
            }
            .lightbox-close {
                position: absolute;
                top: -50px;
                right: 0;
                background: none;
                border: none;
                color: white;
                font-size: 28px;
                cursor: pointer;
                opacity: 0.8;
                transition: all 0.3s ease;
            }
            .lightbox-close:hover {
                opacity: 1;
                transform: scale(1.1);
            }
            .lightbox-nav {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(255,255,255,0.1);
                color: white;
                border: none;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                opacity: 0.7;
                transition: all 0.3s ease;
            }
            .lightbox-nav:hover {
                background: rgba(255,255,255,0.3);
                opacity: 1;
                transform: translateY(-50%) scale(1.1);
            }
            .lightbox-nav.prev {
                right: -80px;
            }
            .lightbox-nav.next {
                left: -80px;
            }
            .lightbox-nav i {
                font-size: 20px;
            }
            @media (max-width: 992px) {
                .lightbox-nav.prev { right: -60px; }
                .lightbox-nav.next { left: -60px; }
            }
            @media (max-width: 768px) {
                .lightbox-nav.prev { right: 10px; }
                .lightbox-nav.next { left: 10px; }
                .lightbox-nav {
                    width: 40px;
                    height: 40px;
                    background: rgba(0,0,0,0.5);
                }
                .lightbox-close {
                    top: 10px;
                    right: 10px;
                    background: rgba(0,0,0,0.5);
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(style);
    }

    const lightbox = document.querySelector('.reviews-lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-content img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-nav.prev');
    const nextBtn = lightbox.querySelector('.lightbox-nav.next');

    let galleryImages = [];
    let galleryAltTexts = [];
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            galleryImages.push(img.src);
            galleryAltTexts.push(img.alt || 'صورة تقييم العميل');
        }
    });

    let currentImageIndex = 0;

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                lightboxImg.style.opacity = '0';
                lightboxImg.src = img.src;
                currentImageIndex = galleryImages.indexOf(img.src);
                lightboxCaption.textContent = img.alt || 'صورة تقييم العميل';
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
                setTimeout(() => {
                    lightboxImg.style.opacity = '1';
                }, 100);
            }
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateLightboxImage();
    }

    function updateLightboxImage() {
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = galleryImages[currentImageIndex];
            lightboxImg.style.opacity = '1';
        }, 200);
    }

    lightboxImg.style.transition = 'opacity 0.3s ease';

    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);

    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else {
                showNextImage();
            }
        }
    });
}


/**
 * تهيئة معرض التقييمات
 */
function initReviewsGallery() {
    const reviewItems = document.querySelectorAll('.review-gallery-item');
    const seeMoreButton = document.querySelector('.see-more-button');

    // For mobile, use a different interaction model
    if (window.innerWidth <= 768) {
        setupMobileReviewsInteraction(reviewItems);
    }

    // Hide "See More" button by default on desktop, as all are shown
    if (seeMoreButton) {
        seeMoreButton.style.display = 'none';
    }
    reviewItems.forEach(item => {
        item.style.display = '';
        item.style.opacity = '1';
    });

    // Add hover effect for text truncation on desktop
    reviewItems.forEach(item => {
        const reviewText = item.querySelector('.review-text');
        if (reviewText && reviewText.textContent.length > 120 && window.innerWidth > 768) {
            const fullText = reviewText.textContent;
            reviewText.setAttribute('data-full-text', fullText);
            item.addEventListener('mouseenter', () => {
                reviewText.textContent = fullText;
            });
            item.addEventListener('mouseleave', () => {
                reviewText.textContent = fullText.substring(0, 120) + '...';
            });
            // Set initial truncated state
            setTimeout(() => {
                reviewText.textContent = fullText.substring(0, 120) + '...';
            }, 100);
        }
    });
}


/**
 * تهيئة تفاعل التقييمات على الموبايل (التمرير)
 */
function setupMobileReviewsInteraction(reviewItems) {
    if (!reviewItems.length) return;

    const gallery = document.querySelector('.reviews-gallery');
    let startX, startScrollLeft;
    let isDragging = false;

    const indicator = document.createElement('div');
    indicator.className = 'review-scroll-indicator';

    reviewItems.forEach((item, index) => {
        // Add counter
        const counter = document.createElement('div');
        counter.className = 'review-counter';
        counter.textContent = `${index + 1}/${reviewItems.length}`;
        item.appendChild(counter);

        // Add "Read More" button for long text
        const reviewText = item.querySelector('.review-text');
        if (reviewText) {
            const fullText = reviewText.textContent;
            if (fullText.length > 120) {
                const truncatedText = fullText.substring(0, 120) + '...';
                reviewText.textContent = truncatedText;
                reviewText.setAttribute('data-full-text', fullText);

                const readMoreBtn = document.createElement('button');
                readMoreBtn.className = 'read-more-btn';
                readMoreBtn.textContent = 'قراءة المزيد';
                item.querySelector('.review-content').appendChild(readMoreBtn);

                readMoreBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (reviewText.textContent.includes('...')) {
                        reviewText.textContent = fullText;
                        readMoreBtn.textContent = 'عرض أقل';
                    } else {
                        reviewText.textContent = truncatedText;
                        readMoreBtn.textContent = 'قراءة المزيد';
                    }
                });
            }
        }
    });

    if (gallery) {
        gallery.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX;
            startScrollLeft = gallery.scrollLeft;
            gallery.style.cursor = 'grabbing';
        });
        gallery.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX;
            startScrollLeft = gallery.scrollLeft;
        });

        gallery.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX;
            const distance = x - startX;
            gallery.scrollLeft = startScrollLeft - distance;
        });
        gallery.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX;
            const distance = x - startX;
            gallery.scrollLeft = startScrollLeft - distance;
        });

        gallery.addEventListener('mouseup', () => {
            isDragging = false;
            gallery.style.cursor = 'grab';
        });
        gallery.addEventListener('mouseleave', () => {
            isDragging = false;
            gallery.style.cursor = 'grab';
        });
        gallery.addEventListener('touchend', () => {
            isDragging = false;
        });

        gallery.addEventListener('scroll', () => {
            const scrollLeft = gallery.scrollLeft;
            const itemWidth = reviewItems[0].offsetWidth + 20; // item width + gap
            const currentIndex = Math.round(scrollLeft / itemWidth);
            reviewItems.forEach((item, index) => {
                if (index === currentIndex) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        });
    }

    // Fullscreen on click for mobile
    reviewItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                if (!document.fullscreenElement) {
                    if (item.requestFullscreen) {
                        item.requestFullscreen();
                    } else if (item.webkitRequestFullscreen) { /* Safari */
                        item.webkitRequestFullscreen();
                    } else if (item.msRequestFullscreen) { /* IE11 */
                        item.msRequestFullscreen();
                    }
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) { /* Safari */
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) { /* IE11 */
                        document.msExitFullscreen();
                    }
                }
            }
        });
    });
}


/**
 * تحويل الأرقام العربية إلى إنجليزية
 * @param {string} str - السلسلة التي تحتوي على أرقام
 * @returns {string} - السلسلة بعد تحويل الأرقام
 */
function convertArabicToEnglishNumbers(str) {
    if (!str) return '';
    const arabicToEnglish = {
        '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
        '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
    };
    return str.replace(/[٠١٢٣٤٥٦٧٨٩]/g, match => arabicToEnglish[match]);
}

// تحويل الأرقام في حقل رقم الموبايل
document.addEventListener('DOMContentLoaded', function() {
    const mobileField = document.getElementById('mobileNumber');
    if (mobileField) {
        mobileField.addEventListener('input', function() {
            const cursorPosition = this.selectionStart;
            const originalLength = this.value.length;
            this.value = convertArabicToEnglishNumbers(this.value);
            if (this.value.length !== originalLength) {
                this.setSelectionRange(cursorPosition, cursorPosition);
            }
        });
    }
});


/**
 * تهيئة التمرير السلس للروابط الداخلية
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * تهيئة تأثيرات التمرير
 */
function initScrollEffects() {
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// استدعاء الدوال عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    initHeroSlider();
    initColorShowcase();
    initSizeSelection();
    initProductSearch();
    initMobileMenu();
    initSmoothScroll();
    initScrollEffects();
});


/**
 * فتح نافذة جدول المقاسات
 */
function openSizeChart() {
    console.log('التمرير إلى قسم المقاسات التفاعلي...');
    const sizeChartSection = document.querySelector('.size-chart-section');
    if (sizeChartSection) {
        sizeChartSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Ensure the calculator tab is active
        const calculatorTab = document.querySelector('.size-chart-tab-inline[data-tab="chart-calculator"]');
        const calculatorPane = document.getElementById('chart-calculator');
        if (calculatorTab && !calculatorTab.classList.contains('active')) {
            document.querySelectorAll('.size-chart-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            calculatorTab.classList.add('active');
            if (calculatorPane) {
                calculatorPane.classList.add('active');
            }
        }
        
        // Add a temporary highlight effect
        sizeChartSection.classList.add('highlight-section');
        setTimeout(() => {
            sizeChartSection.classList.remove('highlight-section');
        }, 1500);
    } else {
        console.error('لم يتم العثور على قسم جدول المقاسات!');
    }
}


/**
 * تهيئة نافذة جدول المقاسات
 */
function initSizeChartModal() {
    const sizeChartModal = document.getElementById('sizeChartModal');
    if (!sizeChartModal) return;

    const closeBtn = sizeChartModal.querySelector('.close-size-chart');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            sizeChartModal.classList.remove('show');
            document.body.style.overflow = '';
        });
    }

    sizeChartModal.addEventListener('click', function(e) {
        if (e.target === sizeChartModal) {
            sizeChartModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    const tabs = document.querySelectorAll('.size-chart-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            if (targetId) {
                const targetPane = document.getElementById(targetId);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            }
        });
    });

    const sizeChartButtons = document.querySelectorAll('.size-chart-button, .view-size-chart-btn, .check-size-btn');
    sizeChartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openSizeChart();
        });
    });
}


/**
 * تهيئة حاسبة المقاسات
 */
function initSizeCalculator() {
    const inlineTabs = document.querySelectorAll('.size-chart-tab-inline');
    if (inlineTabs && inlineTabs.length > 0) {
        inlineTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.size-chart-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                this.classList.add('active');
                const tabId = this.getAttribute('data-tab');
                if (tabId) {
                    const targetPane = document.getElementById(tabId);
                    if (targetPane) {
                        targetPane.classList.add('active');
                    }
                }
            });
        });
    }

    initSlider('heightSlider', 'heightValue', updateRecommendedSize);
    initSlider('weightSlider', 'weightValue', updateRecommendedSize);
    initSlider('heightSliderInline', 'heightValueInline', updateRecommendedSizeInline);
    initSlider('weightSliderInline', 'weightValueInline', updateRecommendedSizeInline);

    initUnitToggle('.unit-btn', changeUnits);
    initUnitToggle('.unit-toggle', toggleChartUnits);

    const inlineUnitToggles = document.querySelectorAll('.size-units-toggle .unit-toggle');
    if (inlineUnitToggles && inlineUnitToggles.length > 0) {
        inlineUnitToggles.forEach(button => {
            button.addEventListener('click', function() {
                document.querySelectorAll('.size-units-toggle .unit-toggle').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const unit = this.getAttribute('data-unit');
                if (unit === 'metric') {
                    document.getElementById('metric-table').style.display = 'table';
                    document.getElementById('imperial-table').style.display = 'none';
                } else if (unit === 'imperial') {
                    document.getElementById('metric-table').style.display = 'none';
                    document.getElementById('imperial-table').style.display = 'table';
                }
            });
        });
    }

    updateRecommendedSize();
    updateRecommendedSizeInline();
}

function initSlider(sliderId, valueId, updateCallback) {
    const slider = document.getElementById(sliderId);
    const valueElement = document.getElementById(valueId);
    if (slider && valueElement) {
        updateSliderBubble(slider, valueElement);
        slider.addEventListener('input', () => {
            updateSliderBubble(slider, valueElement);
            if (typeof updateCallback === 'function') {
                updateCallback();
            }
        });
    }
}

function initUnitToggle(selector, changeCallback) {
    const buttons = document.querySelectorAll(selector);
    if (buttons && buttons.length > 0) {
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const unit = button.getAttribute('data-unit');
                if (typeof changeCallback === 'function') {
                    changeCallback(unit);
                }
            });
        });
    }
}

function updateRecommendedSizeInline() {
    const heightSlider = document.getElementById('heightSliderInline');
    const heightValue = document.getElementById('heightValueInline');
    const weightSlider = document.getElementById('weightSliderInline');
    const weightValue = document.getElementById('weightValueInline');

    if (!heightSlider || !weightSlider || !heightValue || !weightValue) return;

    let height = parseInt(heightSlider.value);
    let weight = parseInt(weightSlider.value);

    if (heightSlider.getAttribute('data-unit') === 'imperial') {
        height = Math.round(height * 2.54);
    }
    if (weightSlider.getAttribute('data-unit') === 'imperial') {
        weight = Math.round(weight / 2.205);
    }

    const size = calculateSize(height, weight);
    document.getElementById('recommendedSizeInline').textContent = size;
}

function calculateSize(height, weight) {
    let size = '';
    if (height <= 165) {
        if (weight <= 65) {
            size = 'M';
        } else if (weight <= 80) {
            size = 'L';
        } else {
            size = 'XL';
        }
    } else if (height <= 175) {
        if (weight <= 60) {
            size = 'M';
        } else if (weight <= 80) {
            size = 'L';
        } else if (weight <= 100) {
            size = 'XL';
        } else {
            size = '2XL';
        }
    } else if (height <= 185) {
        if (weight <= 70) {
            size = 'L';
        } else if (weight <= 90) {
            size = 'XL';
        } else if (weight <= 110) {
            size = '2XL';
        } else {
            size = '2XL';
        }
    } else {
        if (weight <= 80) {
            size = 'XL';
        } else if (weight <= 100) {
            size = '2XL';
        } else {
            size = '2XL';
        }
    }
    return size;
}

function updateSliderBubble(slider, valueElement) {
    if (!slider || !valueElement) return;
    const val = slider.value;
    const min = slider.min;
    const max = slider.max;
    const percentage = (val - min) * 100 / (max - min);
    valueElement.textContent = val;
    valueElement.style.left = `calc(${percentage}%)`;
    valueElement.classList.add('updating');
    setTimeout(() => {
        valueElement.classList.remove('updating');
    }, 200);
}

function updateSliderMarks(slider, marksContainer) {
    if (!slider || !marksContainer) return;
    const min = parseInt(slider.min) || 0;
    const max = parseInt(slider.max) || 100;
    const step = (max - min) / 6;
    marksContainer.innerHTML = '';
    for (let i = 0; i <= 6; i++) {
        const mark = document.createElement('span');
        mark.textContent = Math.round(min + (step * i));
        marksContainer.appendChild(mark);
    }
}

function changeUnits(unit) {
    const heightSlider = document.getElementById('heightSlider');
    const weightSlider = document.getElementById('weightSlider');
    const heightLabel = document.querySelector('.height-field label');
    const weightLabel = document.querySelector('.weight-field label');

    if (unit === 'metric') {
        if (heightSlider) {
            heightSlider.min = '150';
            heightSlider.max = '210';
            if (heightSlider.getAttribute('data-unit') === 'imperial') {
                heightSlider.value = Math.round(heightSlider.value * 2.54);
            }
            heightSlider.setAttribute('data-unit', 'metric');
            updateSliderBubble(heightSlider, document.getElementById('heightValue'));
            const heightUnit = document.getElementById('heightValue').nextElementSibling;
            if (heightUnit) heightUnit.textContent = 'سم';
            updateSliderMarks(heightSlider, document.querySelector('.height-marks'));
        }
        if (weightSlider) {
            weightSlider.min = '40';
            weightSlider.max = '160';
            if (weightSlider.getAttribute('data-unit') === 'imperial') {
                weightSlider.value = Math.round(weightSlider.value / 2.205);
            }
            weightSlider.setAttribute('data-unit', 'metric');
            updateSliderBubble(weightSlider, document.getElementById('weightValue'));
            const weightUnit = document.getElementById('weightValue').nextElementSibling;
            if (weightUnit) weightUnit.textContent = 'كجم';
            updateSliderMarks(weightSlider, document.querySelector('.weight-marks'));
        }
    } else if (unit === 'imperial') {
        if (heightSlider) {
            heightSlider.min = '59';
            heightSlider.max = '83';
            if (heightSlider.getAttribute('data-unit') === 'metric') {
                heightSlider.value = Math.round(heightSlider.value / 2.54);
            }
            heightSlider.setAttribute('data-unit', 'imperial');
            updateSliderBubble(heightSlider, document.getElementById('heightValue'));
            const heightUnit = document.getElementById('heightValue').nextElementSibling;
            if (heightUnit) heightUnit.textContent = 'إنش';
            updateSliderMarks(heightSlider, document.querySelector('.height-marks'));
        }
        if (weightSlider) {
            weightSlider.min = '88';
            weightSlider.max = '352';
            if (weightSlider.getAttribute('data-unit') === 'metric') {
                weightSlider.value = Math.round(weightSlider.value * 2.205);
            }
            weightSlider.setAttribute('data-unit', 'imperial');
            updateSliderBubble(weightSlider, document.getElementById('weightValue'));
            const weightUnit = document.getElementById('weightValue').nextElementSibling;
            if (weightUnit) weightUnit.textContent = 'رطل';
            updateSliderMarks(weightSlider, document.querySelector('.weight-marks'));
        }
    }
    updateRecommendedSize();
}

function toggleChartUnits(unit) {
    const metricTable = document.getElementById('metric-table');
    const imperialTable = document.getElementById('imperial-table');
    if (unit === 'metric' && metricTable && imperialTable) {
        metricTable.style.display = 'table';
        imperialTable.style.display = 'none';
    } else if (unit === 'imperial' && metricTable && imperialTable) {
        metricTable.style.display = 'none';
        imperialTable.style.display = 'table';
    }
}

function updateRecommendedSize() {
    const heightSlider = document.getElementById('heightSlider');
    const weightSlider = document.getElementById('weightSlider');
    const recommendedSize = document.getElementById('recommendedSize');

    if (!heightSlider || !weightSlider || !recommendedSize) return;

    let height = parseInt(heightSlider.value);
    let weight = parseInt(weightSlider.value);
    let unit = document.querySelector('.unit-btn.active')?.getAttribute('data-unit') || 'metric';
    let size = '';

    if (unit === 'metric') {
        if (height <= 160) {
            if (weight <= 60) { size = 'S'; }
            else if (weight <= 75) { size = 'M'; }
            else if (weight <= 90) { size = 'L'; }
            else if (weight <= 105) { size = 'XL'; }
            else { size = '2XL'; }
        } else if (height <= 170) {
            if (weight <= 55) { size = 'S'; }
            else if (weight <= 70) { size = 'M'; }
            else if (weight <= 85) { size = 'L'; }
            else if (weight <= 100) { size = 'XL'; }
            else if (weight <= 115) { size = '2XL'; }
            else { size = '2XL'; }
        } else if (height <= 180) {
            if (weight <= 65) { size = 'M'; }
            else if (weight <= 80) { size = 'L'; }
            else if (weight <= 95) { size = 'XL'; }
            else if (weight <= 110) { size = '2XL'; }
            else { size = '2XL'; }
        } else if (height <= 190) {
            if (weight <= 75) { size = 'L'; }
            else if (weight <= 90) { size = 'XL'; }
            else if (weight <= 105) { size = '2XL'; }
            else { size = '2XL'; }
        } else {
            if (weight <= 85) { size = 'XL'; }
            else if (weight <= 100) { size = '2XL'; }
            else { size = '2XL'; }
        }
    } else { // Imperial
        if (height <= 63) {
            if (weight <= 132) { size = 'S'; }
            else if (weight <= 165) { size = 'M'; }
            else if (weight <= 198) { size = 'L'; }
            else if (weight <= 231) { size = 'XL'; }
            else { size = '2XL'; }
        } else if (height <= 67) {
            if (weight <= 121) { size = 'S'; }
            else if (weight <= 154) { size = 'M'; }
            else if (weight <= 187) { size = 'L'; }
            else if (weight <= 220) { size = 'XL'; }
            else if (weight <= 253) { size = '2XL'; }
            else { size = '2XL'; }
        } else if (height <= 71) {
            if (weight <= 143) { size = 'M'; }
            else if (weight <= 176) { size = 'L'; }
            else if (weight <= 209) { size = 'XL'; }
            else if (weight <= 242) { size = '2XL'; }
            else { size = '2XL'; }
        } else if (height <= 75) {
            if (weight <= 165) { size = 'L'; }
            else if (weight <= 198) { size = 'XL'; }
            else if (weight <= 231) { size = '2XL'; }
            else { size = '2XL'; }
        } else {
            if (weight <= 187) { size = 'XL'; }
            else if (weight <= 220) { size = '2XL'; }
            else { size = '2XL'; }
        }
    }

    recommendedSize.textContent = size;
    recommendedSize.classList.add('size-updated');
    setTimeout(() => {
        recommendedSize.classList.remove('size-updated');
    }, 500);
}


/**
 * تهيئة وظيفة تكبير الصورة
 */
function initGalleryZoom() {
    console.log('تهيئة وظيفة تكبير الصورة...');
    const zoomButton = document.querySelector('.zoom-button');
    const modal = document.getElementById('image-zoom-modal');
    const zoomedImage = document.getElementById('zoomed-image');
    const closeButton = document.querySelector('.close-zoom');

    if (!zoomButton) {
        console.error('زر التكبير غير موجود!');
        return;
    }
    if (!modal || !zoomedImage || !closeButton) {
        console.error('عناصر نافذة التكبير غير مكتملة!');
        return;
    }

    zoomButton.addEventListener('click', () => {
        console.log('تم النقر على زر التكبير');
        const currentImage = document.getElementById('current-main-image');
        if (currentImage) {
            zoomedImage.src = currentImage.src;
            zoomedImage.alt = currentImage.alt;
            modal.style.display = 'flex';
        }
    });

    closeButton.addEventListener('click', () => {
        console.log('تم النقر على زر إغلاق التكبير');
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            console.log('تم النقر على خلفية النافذة المنبثقة');
            modal.style.display = 'none';
        }
    });
}


/**
 * دالة مساعدة للتأكد من أن DOM جاهز
 * @param {function} fn - الدالة التي سيتم تنفيذها
 */
function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function() {
    initHeroSlider();
    initColorShowcase();
    initHeaderScrollEffect();
    initProductGallery();
    initEnhancedTestimonials();
    initEgyptianReviews();
    initReviewsGalleryLightbox();
    initReviewsGallery();
    initSmoothScroll();
    initScrollEffects();
    enhanceIconsInteractivity();
    addCSSAnimations();
    initSizeChartModal();
    initSizeCalculator();
    initGalleryZoom();
    initSizeChartSection();
    initInlineSizeChart();
});


// ===================================================================================
// ORDER FORM LOGIC
// ===================================================================================

/**
 * تهيئة نموذج الطلب
 */
function initOrderForm() {
    console.log('Inicializando formulario de pedido...');
    initColorSelection();
    initSizeSelection();
    initQuantityControls();
    initProductControls();
    updateTotalPrice();

    const orderForm = document.getElementById('codOrderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitOrder();
        });
    }
}

/**
 * تهيئة اختيار اللون
 */
function initColorSelection() {
    console.log('Inicializando selección de color...');
    const colorOptions = document.querySelectorAll('.product-color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const productItem = this.closest('.product-item');
            const color = this.getAttribute('data-color');
            
            productItem.querySelectorAll('.product-color-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
            
            updateProductPreview(productItem, color);
            console.log(`Color seleccionado: ${color} para el producto ID: ${productItem.getAttribute('data-product-id')}`);
        });
    });
}

/**
 * تهيئة اختيار المقاس
 */
function initSizeSelection() {
    console.log('Inicializando selección de talla...');
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productItem = this.closest('.product-item');
            const size = this.getAttribute('data-size');
            
            productItem.querySelectorAll('.size-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            const previewSize = productItem.querySelector('.product-preview-size');
            if (previewSize) {
                previewSize.textContent = `المقاس: ${size}`;
            }
            console.log(`Talla seleccionada: ${size} para el producto ID: ${productItem.getAttribute('data-product-id')}`);
        });
    });
}

/**
 * تهيئة أزرار التحكم بالكمية
 */
function initQuantityControls() {
    console.log('Inicializando controles de cantidad...');
    const quantityControls = document.querySelectorAll('.quantity-controls');
    quantityControls.forEach(control => {
        const decreaseBtn = control.querySelector('.decrease');
        const increaseBtn = control.querySelector('.increase');
        const qtyInput = control.querySelector('.product-qty');

        if (decreaseBtn && increaseBtn && qtyInput) {
            decreaseBtn.addEventListener('click', function() {
                const currentVal = parseInt(qtyInput.value);
                if (currentVal > 1) {
                    qtyInput.value = currentVal - 1;
                    updateProductQuantity(this.closest('.product-item'));
                }
            });

            increaseBtn.addEventListener('click', function() {
                const currentVal = parseInt(qtyInput.value);
                if (currentVal < 10) {
                    qtyInput.value = currentVal + 1;
                    updateProductQuantity(this.closest('.product-item'));
                }
            });
        }
    });
}

/**
 * تحديث كمية المنتج في ملخص الطلب
 */
function updateProductQuantity(productItem) {
    if (!productItem) return;
    const qtyInput = productItem.querySelector('.product-qty');
    const previewQty = productItem.querySelector('.product-preview-qty');
    if (qtyInput && previewQty) {
        previewQty.textContent = `الكمية: ${qtyInput.value}`;
    }
    updateTotalPrice();
}

/**
 * تحديث معاينة المنتج
 */
function updateProductPreview(productItem, color) {
    if (!productItem || !color) return;

    const previewImg = productItem.querySelector('.product-preview-img');
    if (previewImg) {
        let imagePath = '';
        switch (color) {
            case 'black':
                imagePath = 'public/images/black/black-tshirt.jpg';
                break;
            case 'silver':
                imagePath = 'public/images/silver/silver-tshirt.jpg';
                break;
            case 'beige':
                imagePath = 'public/images/beige/beige-tshirt.jpg';
                break;
            default:
                imagePath = 'public/images/black/black-tshirt.jpg';
        }
        previewImg.src = imagePath;
        previewImg.alt = `طقم HELDEN ${getColorName(color)}`;
    }

    const previewColor = productItem.querySelector('.product-preview-color');
    if (previewColor) {
        previewColor.textContent = `اللون: ${getColorName(color)}`;
    }
}

/**
 * تهيئة أزرار التحكم بالمنتجات (إضافة/إزالة)
 */
function initProductControls() {
    console.log('Inicializando controles de productos...');
    const addProductBtn = document.getElementById('addProductBtn');
    const selectedProductsContainer = document.getElementById('selectedProductsContainer');

    if (addProductBtn && selectedProductsContainer) {
        let productCounter = 1;
        const existingProducts = selectedProductsContainer.querySelectorAll('.product-item');
        productCounter = existingProducts.length;
        if (productCounter > 0) {
            productCounter = Math.max(...Array.from(existingProducts).map(item => parseInt(item.getAttribute('data-product-id')) || 0));
        }

        addProductBtn.addEventListener('click', function() {
            productCounter++;
            addNewProduct(productCounter);
            updateTotalPrice();
        });

        setupRemoveButtons();
        setupDiscountButtons();
    }
}

/**
 * إضافة منتج جديد إلى النموذج
 */
function addNewProduct(productId) {
    const selectedProductsContainer = document.getElementById('selectedProductsContainer');
    if (!selectedProductsContainer) return;

    const newProduct = document.createElement('div');
    newProduct.className = 'product-item';
    newProduct.setAttribute('data-product-id', productId);

    // تحقق من رقم المنتج لتحديد الألوان والمقاسات المتاحة
    const isFirstProduct = productId === 1;
    const colorOptions = isFirstProduct ? `
                    <div class="product-color-option black active" data-color="black">
                        <div class="color-swatch black"></div>
                        <span>أسود</span>
                    </div>
                    <div class="product-color-option beige" data-color="beige">
                        <div class="color-swatch beige"></div>
                        <span>بيج</span>
                    </div>
                    <div class="product-color-option silver" data-color="silver">
                        <div class="color-swatch silver"></div>
                        <span>فضي</span>
                    </div>
                    <div class="product-color-option blue" data-color="blue">
                        <div class="color-swatch blue"></div>
                        <span>أزرق</span>
                    </div>` : `
                    <div class="product-color-option black active" data-color="black">
                        <div class="color-swatch black"></div>
                        <span>أسود</span>
                    </div>
                    <div class="product-color-option beige" data-color="beige">
                        <div class="color-swatch beige"></div>
                        <span>بيج</span>
                    </div>
                    <div class="product-color-option silver" data-color="silver">
                        <div class="color-swatch silver"></div>
                        <span>فضي</span>
                    </div>`;
    
    const sizeOptions = isFirstProduct ? `
                    <button type="button" class="size-btn" data-size="M">M</button>
                    <button type="button" class="size-btn" data-size="L">L</button>
                    <button type="button" class="size-btn active" data-size="XL">XL</button>
                    <button type="button" class="size-btn" data-size="2XL">2XL</button>
                    <button type="button" class="size-btn" data-size="3XL">3XL</button>` : `
                    <button type="button" class="size-btn" data-size="M">M</button>
                    <button type="button" class="size-btn" data-size="L">L</button>
                    <button type="button" class="size-btn active" data-size="XL">XL</button>
                    <button type="button" class="size-btn" data-size="2XL">2XL</button>`;

    newProduct.innerHTML = `
        <div class="product-item-header">
            <h4 class="product-item-title">المنتج #${productId}</h4>
            <button type="button" class="remove-product-btn" data-product-id="${productId}">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <div class="product-item-options">
            <div class="product-color-selection">
                <label class="form-label">اللون:</label>
                <div class="product-color-options">
                    ${colorOptions}
                </div>
            </div>
            
            <div class="product-sizes">
                <label class="field-label">اختر المقاس:</label>
                <div class="size-selection">
                    ${sizeOptions}
                </div>
            </div>
            
            <div class="product-quantity">
                <label class="form-label">الكمية:</label>
                <div class="quantity-controls">
                    <button type="button" class="quantity-btn decrease">-</button>
                    <input type="number" class="product-qty" value="1" min="1" max="10" readonly>
                    <button type="button" class="quantity-btn increase">+</button>
                </div>
            </div>
        </div>
        
        <div class="product-item-summary">
            <div class="product-preview">
                <img src="public/images/black/black-tshirt.jpg" alt="تي شيرت أسود" class="product-preview-img">
                <div class="product-preview-details">
                    <span class="product-preview-color">اللون: أسود</span>
                    <span class="product-preview-size">المقاس: XL</span>
                    <span class="product-preview-qty">الكمية: 1</span>
                </div>
            </div>
            <div class="product-price">
                <span class="item-price">599 ج.م</span>
            </div>
        </div>
    `;

    selectedProductsContainer.appendChild(newProduct);
    initColorSelection();
    initSizeSelection();
    initQuantityControls();
    setupRemoveButtons();
    console.log(`Nuevo producto añadido con ID: ${productId}`);
}

/**
 * إعداد أزرار إزالة المنتجات
 */
function setupRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-product-btn');
    removeButtons.forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        newButton.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const productItem = this.closest('.product-item');
            const allProducts = document.querySelectorAll('.product-item');

            if (allProducts.length > 1) {
                productItem.remove();
                updateTotalPrice();
                console.log(`Producto eliminado con ID: ${productId}`);
            } else {
                alert('يجب أن يكون هناك منتج واحد على الأقل في الطلب.');
            }
        });
    });
}

/**
 * إعداد أزرار الخصم
 */
function setupDiscountButtons() {
    const addOutfitDiscountBtn = document.getElementById('addOutfitDiscountBtn');
    const addThirdOutfitBtn = document.getElementById('addThirdOutfitBtn');

    if (addOutfitDiscountBtn) {
        // إزالة أي مستمعات سابقة
        const newBtn = addOutfitDiscountBtn.cloneNode(true);
        addOutfitDiscountBtn.parentNode.replaceChild(newBtn, addOutfitDiscountBtn);
        
        newBtn.addEventListener('click', function() {
            console.log('تم الضغط على زر إضافة طقم آخر');
            const allProducts = document.querySelectorAll('.product-item');
            if (allProducts.length < 2) {
                const productId = allProducts.length + 1;
                addNewProduct(productId);
                updateTotalPrice();
                console.log('تم إضافة المنتج الثاني مع خصم 10%');
            } else {
                alert('لقد أضفت بالفعل طقمين. استخدم زر "إضافة الطقم الثالث" للاستفادة من خصم إضافي.');
            }
        });
    }

    if (addThirdOutfitBtn) {
        // إزالة أي مستمعات سابقة
        const newBtn = addThirdOutfitBtn.cloneNode(true);
        addThirdOutfitBtn.parentNode.replaceChild(newBtn, addThirdOutfitBtn);
        
        newBtn.addEventListener('click', function() {
            console.log('تم الضغط على زر إضافة الطقم الثالث');
            const allProducts = document.querySelectorAll('.product-item');
            if (allProducts.length < 3) {
                const productId = allProducts.length + 1;
                addNewProduct(productId);
                updateTotalPrice();
                console.log('تم إضافة المنتج الثالث مع خصم 15%');
            } else {
                alert('لقد أضفت بالفعل 3 أطقم، وهو الحد الأقصى لكل طلب.');
            }
        });
    }
}

/**
 * تحديث السعر الإجمالي
 */
function updateTotalPrice() {
    const totalItems = document.querySelectorAll('.product-item').length;
    const totalItemsElement = document.getElementById('totalItems');
    const totalPriceElement = document.getElementById('totalPrice');

    // إظهار أو إخفاء زر إضافة الطقم الثالث
    const addThirdOutfitBtnContainer = document.querySelector('.add-third-outfit');
    if (addThirdOutfitBtnContainer) {
        addThirdOutfitBtnContainer.style.display = (totalItems === 2) ? 'block' : 'none';
    }

    // إظهار أو إخفاء زر إضافة الطقم الثاني
    const addOutfitDiscountBtnContainer = document.querySelector('.add-outfit-discount:not(.add-third-outfit)');
    if (addOutfitDiscountBtnContainer) {
        addOutfitDiscountBtnContainer.style.display = (totalItems === 1) ? 'block' : 'none';
    }

    if (totalItemsElement) {
        totalItemsElement.textContent = totalItems;
    }

    if (totalPriceElement) {
        let basePrice = 599;
        let totalPrice = 0;
        let discountedPrice = basePrice;
        let discountApplied = false;

        if (totalItems === 1) {
            discountedPrice = basePrice;
            totalPrice = basePrice;
        } else if (totalItems === 2) {
            // سعر خاص للطقمين: 1100 جنيه
            discountedPrice = 550;
            totalPrice = 1100;
            discountApplied = true;
        } else if (totalItems === 3) {
            // سعر خاص لثلاث أطقم: 1400 جنيه
            discountedPrice = Math.round(1400 / 3);
            totalPrice = 1400;
            discountApplied = true;
        } else if (totalItems > 3) {
            // للأكثر من 3 أطقم، نحسب بنفس سعر الثلاث أطقم
            discountedPrice = Math.round(1400 / 3);
            totalPrice = discountedPrice * totalItems;
            discountApplied = true;
        }

        totalPriceElement.textContent = `${totalPrice} ج.م`;
        document.querySelectorAll('.product-item .item-price').forEach(priceElement => {
            priceElement.textContent = `${discountedPrice} ج.م`;
        });

        const discountElement = document.querySelector('.discount-value');
        const discountTierElements = document.querySelectorAll('.discount-tier');

        if (discountElement) {
            const originalTotal = basePrice * totalItems;
            const totalDiscount = originalTotal - totalPrice;
            const discountPercentage = Math.round((totalDiscount / originalTotal) * 100);
            if (discountApplied) {
                discountElement.textContent = `${totalDiscount} ج.م (${discountPercentage}%)`;
                discountElement.style.color = 'var(--success-color)';
            } else {
                discountElement.textContent = `0 ج.م (0%)`;
                discountElement.style.color = '';
            }
        }

        if (discountTierElements.length > 0) {
            discountTierElements[0].style.opacity = totalItems === 1 ? '1' : '0.5';
            discountTierElements[1].style.opacity = totalItems <= 2 ? '1' : '0.5';

            if (totalItems === 2) {
                discountTierElements[0].classList.add('active-discount');
                discountTierElements[1].classList.remove('active-discount');
            } else if (totalItems >= 3) {
                discountTierElements[0].classList.remove('active-discount');
                discountTierElements[1].classList.add('active-discount');
            } else {
                discountTierElements.forEach(el => el.classList.remove('active-discount'));
            }
        }

        const originalTotalElement = document.querySelector('.original-total-price');
        if (originalTotalElement) {
            // السعر الأصلي قبل أي خصومات
            originalTotalElement.textContent = `${750 * totalItems} ج.م`;
        }

        const orderSummary = document.querySelector('.order-summary');
        let discountNotification = orderSummary.querySelector('.discount-notification');
        if (discountApplied) {
            if (!discountNotification) {
                discountNotification = document.createElement('div');
                discountNotification.className = 'discount-notification';
                orderSummary.appendChild(discountNotification);
            }
            const discountType = totalItems === 2 ? '10%' : '15%';
            discountNotification.textContent = `🎉 تم تطبيق خصم ${discountType}!`;
            discountNotification.style.display = 'block';
            setTimeout(() => {
                if (discountNotification && discountNotification.style.display !== 'none') {
                    discountNotification.style.display = 'none';
                }
            }, 4000);
        } else {
            if (discountNotification) {
                discountNotification.style.display = 'none';
            }
        }
    }
}

/**
 * إرسال الطلب
 */
function submitOrder() {
    console.log('Procesando envío del pedido...');
    const fullName = document.getElementById('fullName').value;
    const mobileNumber = document.getElementById('mobileNumber').value;
    const governorate = document.getElementById('governorate').value;
    const detailedAddress = document.getElementById('detailedAddress').value;
    const orderNotes = document.getElementById('orderNotes').value;

    if (!fullName || !mobileNumber || !governorate || !detailedAddress) {
        alert('يرجى ملء جميع الحقول المطلوبة قبل إرسال الطلب.');
        return;
    }

    const products = [];
    document.querySelectorAll('.product-item').forEach(item => {
        const productId = item.getAttribute('data-product-id');
        const colorOption = item.querySelector('.product-color-option.active');
        const sizeBtn = item.querySelector('.size-btn.active');
        const qtyInput = item.querySelector('.product-qty');

        const color = colorOption ? colorOption.getAttribute('data-color') : 'black';
        const size = sizeBtn ? sizeBtn.getAttribute('data-size') : 'L';
        const quantity = qtyInput ? qtyInput.value : 1;

        products.push({
            id: productId,
            color: color,
            size: size,
            quantity: quantity
        });
    });

    const orderNumber = 'SO-' + Math.floor(100000 + Math.random() * 900000);
    const orderData = {
        id: orderNumber,
        order_number: orderNumber,
        customer_name: fullName,
        customer_mobile: mobileNumber,
        customer_governorate: governorate,
        customer_address: detailedAddress,
        customer_notes: orderNotes,
        products: products,
        total_items: products.length,
        total_price: document.getElementById('totalPrice').textContent,
        order_date: new Date().toISOString(),
        status: 'pending'
    };

    console.log('Datos del pedido:', orderData);

    const webhookUrl = 'https://hook.eu2.make.com/a57g4b7o4x4f1qzh7wtjpme6tgr42xcl';

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    })
    .then(response => {
        // Make.com might not return JSON, so we'll check the response status
        if (response.ok) {
            console.log('Order submitted successfully');
            // Store order data in localStorage for the confirmation page
            localStorage.setItem('lastOrder', JSON.stringify(orderData));
            // Redirect to confirmation page
            window.location.href = 'confirm.html';
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.');
    });
}

/**
 * إغلاق نافذة النجاح
 */
function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('show');
}

// تهيئة نموذج الطلب عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initOrderForm();
});