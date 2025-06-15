/**
 * ملف مخصص لتتبع التحويلات وتغيير الرابط عند تأكيد الطلب
 * هذا الملف يساعد في تتبع التحويلات عبر بيكسل فيسبوك وتيك توك
 */
(function() {
    // انتظر حتى يتم تحميل المستند بالكامل
    document.addEventListener('DOMContentLoaded', function() {
        console.log('تهيئة نظام تتبع التحويلات...');
        
        // تجاوز وظيفة submitOrder الأصلية
        if (typeof window.originalSubmitOrder === 'undefined' && typeof window.submitOrder === 'function') {
            // حفظ الدالة الأصلية
            window.originalSubmitOrder = window.submitOrder;
            
            // استبدال بدالة جديدة تضيف وظيفة تغيير الرابط
            window.submitOrder = function() {
                console.log('تنفيذ دالة تقديم الطلب المحسنة مع تتبع التحويلات');
                
                // استدعاء الدالة الأصلية ومعالجة النتيجة
                const result = window.originalSubmitOrder.apply(this, arguments);
                
                // تأخير قصير للتأكد من ظهور نافذة التأكيد
                setTimeout(function() {
                    const successModal = document.getElementById('successModal');
                    if (successModal && successModal.classList.contains('show')) {
                        // الحصول على رقم الطلب
                        const orderNumber = document.getElementById('orderNumber').textContent;
                        
                        // تغيير الرابط في المتصفح دون إعادة تحميل الصفحة
                        const newUrl = window.location.origin + window.location.pathname + '?confirm_order=' + orderNumber;
                        window.history.pushState({ path: newUrl }, '', newUrl);
                        
                        console.log('تم تغيير الرابط إلى:', newUrl);
                        
                        // إرسال حدث التحويل إلى فيسبوك وتيك توك (إذا كانت متوفرة)
                        triggerConversionEvents(orderNumber);
                    }
                }, 500);
                
                return result;
            };
            
            console.log('تم تجاوز دالة تقديم الطلب بنجاح');
        }
        
        // تجاوز وظيفة closeSuccessModal الأصلية
        if (typeof window.originalCloseSuccessModal === 'undefined' && typeof window.closeSuccessModal === 'function') {
            // حفظ الدالة الأصلية
            window.originalCloseSuccessModal = window.closeSuccessModal;
            
            // استبدال بدالة جديدة
            window.closeSuccessModal = function() {
                console.log('تنفيذ دالة إغلاق النافذة المحسنة');
                
                // استدعاء الدالة الأصلية
                const result = window.originalCloseSuccessModal.apply(this, arguments);
                
                // إعادة الرابط الأصلي إذا كان يحتوي على معلمة التأكيد
                if (window.location.search.includes('confirm_order')) {
                    const newUrl = window.location.origin + window.location.pathname;
                    window.history.pushState({ path: newUrl }, '', newUrl);
                    console.log('تمت إعادة الرابط الأصلي:', newUrl);
                }
                
                return result;
            };
            
            console.log('تم تجاوز دالة إغلاق النافذة بنجاح');
        }
    });
    
    /**
     * إرسال أحداث التحويل إلى فيسبوك وتيك توك
     * @param {string} orderNumber - رقم الطلب
     */
    function triggerConversionEvents(orderNumber) {
        // تنفيذ بيكسل فيسبوك إذا كان متاحًا
        if (typeof fbq === 'function') {
            console.log('إرسال حدث تحويل إلى فيسبوك');
            
            // إرسال حدث شراء إلى فيسبوك مع بيانات الطلب
            fbq('track', 'Purchase', {
                order_id: orderNumber,
                value: parseFloat(document.getElementById('totalPrice').textContent.replace(/[^0-9.-]+/g, '')),
                currency: 'EGP'
            });
        }
        
        // تنفيذ بيكسل تيك توك إذا كان متاحًا
        if (typeof ttq === 'object' && typeof ttq.track === 'function') {
            console.log('إرسال حدث تحويل إلى تيك توك');
            
            // إرسال حدث شراء إلى تيك توك مع بيانات الطلب
            ttq.track('CompletePayment', {
                content_id: orderNumber,
                value: parseFloat(document.getElementById('totalPrice').textContent.replace(/[^0-9.-]+/g, '')),
                currency: 'EGP'
            });
        }
        
        console.log('تم إرسال أحداث التحويل بنجاح');
    }
})();
