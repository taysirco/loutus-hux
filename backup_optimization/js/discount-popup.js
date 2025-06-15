/**
 * ملف مخصص لإدارة إشعارات الخصم المنبثقة
 * يظهر إشعار عند الضغط على أزرار إضافة طقم جديد ويختفي تلقائيًا بعد ثانيتين
 */

// انتظار تحميل المستند
document.addEventListener('DOMContentLoaded', function() {
    console.log('تهيئة نظام إشعارات الخصم المنبثقة...');
    
    // عناصر DOM
    const discountPopup = document.getElementById('discountPopup');
    const discountPercentage = document.querySelector('.discount-popup-percentage');
    const addOutfitDiscountBtn = document.getElementById('addOutfitDiscountBtn');
    const addThirdOutfitBtn = document.getElementById('addThirdOutfitBtn');
    
    // التأكد من وجود العناصر المطلوبة
    if (!discountPopup || !discountPercentage || !addOutfitDiscountBtn) {
        console.error('لم يتم العثور على أحد عناصر DOM المطلوبة لإشعارات الخصم');
        return;
    }
    
    // دالة لإظهار الإشعار المنبثق
    function showDiscountPopup(percentage) {
        // تعيين نسبة الخصم في الإشعار
        discountPercentage.textContent = percentage + '%';
        
        // إظهار الإشعار
        discountPopup.classList.add('show');
        
        // إخفاء الإشعار بعد ثانيتين
        setTimeout(function() {
            discountPopup.classList.remove('show');
        }, 2000); // 2000 مللي ثانية = 2 ثانية
    }
    
    // إضافة مستمع حدث للضغط على زر إضافة طقم آخر (خصم 10%)
    addOutfitDiscountBtn.addEventListener('click', function() {
        console.log('تم الضغط على زر إضافة طقم آخر (خصم 10%)');
        showDiscountPopup(10);
    });
    
    // إضافة مستمع حدث للضغط على زر إضافة طقم ثالث (خصم 15%) إذا كان موجودًا
    if (addThirdOutfitBtn) {
        addThirdOutfitBtn.addEventListener('click', function() {
            console.log('تم الضغط على زر إضافة الطقم الثالث (خصم 15%)');
            showDiscountPopup(15);
        });
    }
    
    // الاستماع أيضًا لحدث إضافة منتج من خلال الزر العادي (للتوافق مع الوظيفة الحالية)
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            const currentItems = document.querySelectorAll('.product-item').length;
            if (currentItems === 1) {
                // إذا كان هناك منتج واحد وتمت إضافة منتج جديد، فهذا يعني تفعيل خصم 10%
                showDiscountPopup(10);
            } else if (currentItems === 2) {
                // إذا كان هناك منتجان وتمت إضافة منتج جديد، فهذا يعني تفعيل خصم 15%
                showDiscountPopup(15);
            }
        });
    }
    
    console.log('تم تهيئة نظام إشعارات الخصم المنبثقة بنجاح');
});
