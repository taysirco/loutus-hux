/**
 * ملف مخصص لتتبع التحويلات وتغيير الرابط عند تأكيد الطلب - نسخة محسنة
 * هذا الملف يساعد في تتبع التحويلات عبر بيكسل فيسبوك وتيك توك
 */

// تنفيذ الكود فورًا بعد تحميل الملف
console.log('تحميل نظام تتبع التحويلات المحسن...');

// دالة لتغيير الرابط وإرسال أحداث التحويل
function setupSuccessModalTracking() {
    // البحث عن الدالة الأصلية بطريقة أكثر مباشرة
    try {
        // تأخير قليل للتأكد من تحميل جميع الملفات الأخرى أولاً
        setTimeout(function() {
            // الاستماع مباشرة لحدث إظهار نافذة النجاح
            const successModal = document.getElementById('successModal');
            if (successModal) {
                console.log('تم العثور على modal النجاح، جاري إعداد المراقبة...');
                
                // مراقبة التغييرات في خصائص modal النجاح
                const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.attributeName === 'class' && 
                            successModal.classList.contains('show')) {
                            
                            console.log('تم فتح نافذة النجاح، جاري تغيير الرابط...');
                            
                            // الحصول على رقم الطلب
                            const orderNumber = document.getElementById('orderNumber').textContent;
                            
                            // تغيير الرابط في المتصفح دون إعادة تحميل الصفحة
                            const newUrl = window.location.origin + window.location.pathname + 
                                          '?confirm_order=' + orderNumber;
                            window.history.pushState({ path: newUrl }, '', newUrl);
                            
                            console.log('تم تغيير الرابط إلى:', newUrl);
                            
                            // إرسال حدث التحويل إلى فيسبوك وتيك توك
                            triggerConversionEvents(orderNumber);
                        }
                    });
                });
                
                // بدء المراقبة
                observer.observe(successModal, { attributes: true });
                console.log('تم تفعيل مراقبة نافذة النجاح');
                
                // أيضًا مراقبة زر الإغلاق لإعادة الرابط عند الإغلاق
                const closeButtons = document.querySelectorAll('.close-modal, .close-modal-btn');
                closeButtons.forEach(function(button) {
                    button.addEventListener('click', function() {
                        // إعادة الرابط إلى الأصل إذا كان يحتوي على معلمة تأكيد
                        if (window.location.search.includes('confirm_order')) {
                            const originalUrl = window.location.origin + window.location.pathname;
                            window.history.pushState({ path: originalUrl }, '', originalUrl);
                            console.log('تمت إعادة الرابط إلى الحالة الأصلية');
                        }
                    });
                });
            }
        }, 1000); // تأخير 1 ثانية للتأكد من تحميل باقي الملفات
    } catch (error) {
        console.error('حدث خطأ أثناء إعداد تتبع التحويلات:', error);
    }
}

/**
 * إرسال أحداث التحويل إلى فيسبوك وتيك توك
 * @param {string} orderNumber - رقم الطلب
 */
function triggerConversionEvents(orderNumber) {
    try {
        // تنفيذ بيكسل فيسبوك إذا كان متاحًا
        if (typeof fbq === 'function') {
            console.log('إرسال حدث تحويل إلى فيسبوك');
            
            // محاولة الحصول على السعر الإجمالي
            let totalPrice = 0;
            const totalPriceElement = document.getElementById('totalPrice');
            if (totalPriceElement) {
                // استخراج الرقم من النص (مثال: "749 ج.م" -> 749)
                totalPrice = parseFloat(totalPriceElement.textContent.replace(/[^0-9.-]+/g, ''));
            }
            
            // إرسال حدث شراء إلى فيسبوك مع بيانات الطلب
            fbq('track', 'Purchase', {
                order_id: orderNumber,
                value: totalPrice || 749, // استخدام قيمة افتراضية إذا لم يتم العثور على السعر
                currency: 'EGP'
            });
            
            console.log('تم إرسال حدث Purchase إلى فيسبوك');
        } else {
            console.warn('fbq غير معرّف، لا يمكن إرسال حدث التحويل إلى فيسبوك');
        }
        
        // تنفيذ بيكسل تيك توك إذا كان متاحًا
        if (typeof ttq === 'object' && typeof ttq.track === 'function') {
            console.log('إرسال حدث تحويل إلى تيك توك');
            
            // إرسال حدث شراء إلى تيك توك مع بيانات الطلب
            ttq.track('CompletePayment', {
                content_id: orderNumber,
                value: parseFloat(document.getElementById('totalPrice').textContent.replace(/[^0-9.-]+/g, '')) || 749,
                currency: 'EGP'
            });
            
            console.log('تم إرسال حدث CompletePayment إلى تيك توك');
        }
    } catch (error) {
        console.error('حدث خطأ أثناء إرسال أحداث التحويل:', error);
    }
}

// تنفيذ الإعداد عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', setupSuccessModalTracking);

// محاولة التنفيذ فورًا إذا كان المستند محملاً بالفعل
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setupSuccessModalTracking();
}
