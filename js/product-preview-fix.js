// تصحيح مشكلة عرض صورة اللون الأبيض
document.addEventListener('DOMContentLoaded', function() {
    // البحث عن جميع خيارات الألوان وإضافة مستمعي الأحداث
    const colorOptions = document.querySelectorAll('.product-color-option');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const productItem = this.closest('.product-item');
            const color = this.getAttribute('data-color');
            
            // استخدام الدالة المحسنة لتحديث معاينة المنتج
            updateProductPreviewFixed(productItem, color);
        });
    });
});

// دالة محسنة لتحديث معاينة المنتج مع صور صحيحة
function updateProductPreviewFixed(productItem, color) {
    if (!productItem || !color) return;
    
    // تحديث صورة المنتج
    const previewImg = productItem.querySelector('.product-preview-img');
    if (previewImg) {
        // تغيير الصورة حسب اللون المحدد
        let imagePath = '';
        switch (color) {
            case 'black':
                imagePath = 'public/images/black/black-tshirt.jpg';
                break;
            case 'beige':
                imagePath = 'public/images/beige/beige-tshirt.jpg';
                break;
            case 'silver':
                imagePath = 'public/images/silver/silver-tshirt.jpg';
                break;
            case 'blue':
                imagePath = 'public/images/black/black-tshirt.jpg'; // استخدام صورة سوداء مؤقتًا للأزرق
                break;
            default:
                imagePath = 'public/images/black/black-tshirt.jpg';
        }
        
        previewImg.src = imagePath;
    }
    
    // تحديث نص اللون المحدد
    const previewColor = productItem.querySelector('.product-preview-color');
    if (previewColor) {
        let colorName = '';
        
        switch(color) {
            case 'black':
                colorName = 'أسود';
                break;
            case 'beige':
                colorName = 'بيج';
                break;
            case 'silver':
                colorName = 'فضي';
                break;
            default:
                colorName = 'أسود';
        }
        
        previewColor.textContent = `اللون: ${colorName}`;
    }
}
