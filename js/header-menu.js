/**
 * ملف خاص بتفعيل وتحسين القائمة في الهيدر
 */
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('تهيئة القائمة الرئيسية...');
        initializeHeaderMenu();
    });

    /**
     * تهيئة القائمة الرئيسية وعناصرها
     */
    function initializeHeaderMenu() {
        // العناصر الأساسية
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const navLinks = document.querySelectorAll('.mobile-nav-link');
        const header = document.querySelector('.main-header');
        
        // التحقق من وجود العناصر
        if (!menuToggle || !mobileMenu) {
            console.error('لم يتم العثور على عناصر القائمة الأساسية!');
            return;
        }
        
        // إضافة فئة للإشارة إلى تهيئة القائمة
        document.body.classList.add('menu-initialized');
        
        // تفعيل زر فتح/إغلاق القائمة
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            // تبديل حالة القائمة
            toggleMenu();
        });
        
        // إغلاق القائمة عند النقر على أي رابط داخلها
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                // إغلاق القائمة
                closeMenu();
                
                // تمرير قليل للأسفل لتجنب تداخل الهيدر مع العنصر المستهدف
                setTimeout(() => {
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const headerHeight = header.offsetHeight;
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                        
                        window.scrollTo({
                            top: targetPosition - headerHeight,
                            behavior: 'smooth'
                        });
                    }
                }, 300);
            });
        });
        
        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', function(e) {
            if (mobileMenu.classList.contains('active') && 
                !mobileMenu.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                closeMenu();
            }
        });
        
        // إغلاق القائمة عند التمرير
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // إضافة فئة للهيدر عند التمرير للأسفل
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // إغلاق القائمة عند التمرير لمسافة معينة
            if (Math.abs(scrollTop - lastScrollTop) > 50 && mobileMenu.classList.contains('active')) {
                closeMenu();
            }
            
            lastScrollTop = scrollTop;
        });
        
        // تحديث حالة الروابط النشطة أثناء التمرير
        window.addEventListener('scroll', function() {
            updateActiveNavLink();
        });
        
        console.log('تم تهيئة القائمة الرئيسية بنجاح!');
    }
    
    /**
     * تبديل حالة القائمة بين الفتح والإغلاق
     */
    function toggleMenu() {
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    /**
     * فتح القائمة
     */
    function openMenu() {
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        // إضافة فئة للجسم لمنع التمرير
        document.body.classList.add('menu-open');
        
        // تغيير أيقونة الزر
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
        
        // إظهار القائمة
        mobileMenu.classList.add('active');
        
        // إضافة تأثير دخول العناصر تدريجياً
        const navItems = mobileMenu.querySelectorAll('.mobile-nav-item');
        navItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animated');
            }, 100 * index);
        });
    }
    
    /**
     * إغلاق القائمة
     */
    function closeMenu() {
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        // إزالة فئة من الجسم
        document.body.classList.remove('menu-open');
        
        // تغيير أيقونة الزر
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
        
        // إخفاء القائمة
        mobileMenu.classList.remove('active');
        
        // إعادة تعيين حالة العناصر
        const navItems = mobileMenu.querySelectorAll('.mobile-nav-item');
        navItems.forEach(item => {
            item.classList.remove('animated');
        });
    }
    
    /**
     * تحديث الرابط النشط في القائمة بناءً على موضع التمرير
     */
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 150; // إضافة هامش للمساعدة في تحديد القسم الحالي
        const navLinks = document.querySelectorAll('.mobile-nav-link');
        
        navLinks.forEach(link => {
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const sectionTop = targetSection.offsetTop;
                const sectionBottom = sectionTop + targetSection.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    // إزالة الفئة النشطة من جميع الروابط
                    navLinks.forEach(l => l.classList.remove('active'));
                    
                    // إضافة الفئة النشطة للرابط الحالي
                    link.classList.add('active');
                }
            }
        });
    }
})();
