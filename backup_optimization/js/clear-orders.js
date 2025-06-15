/**
 * أداة مساعدة لمسح جميع الطلبات الموجودة في Firebase
 * استخدم هذا الملف فقط عندما تحتاج إلى مسح كل البيانات لبدء موسم جديد
 */

// تأكد من تحميل SDK الخاص بـ Firebase
document.addEventListener('DOMContentLoaded', function() {
    // عنصر الحالة لإظهار تقدم العملية
    const statusElement = document.createElement('div');
    statusElement.id = 'clear-status';
    statusElement.style.position = 'fixed';
    statusElement.style.top = '50%';
    statusElement.style.left = '50%';
    statusElement.style.transform = 'translate(-50%, -50%)';
    statusElement.style.padding = '20px';
    statusElement.style.background = 'white';
    statusElement.style.border = '1px solid #ddd';
    statusElement.style.borderRadius = '5px';
    statusElement.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    statusElement.style.zIndex = '10000';
    statusElement.style.direction = 'rtl';
    statusElement.style.textAlign = 'center';
    statusElement.innerHTML = '<h3>جاري الاتصال بقاعدة البيانات...</h3><div id="progress">0%</div>';
    document.body.appendChild(statusElement);

    console.log('بدء عملية مسح الطلبات...');
    
    // تأكد من تهيئة Firebase
    setTimeout(() => {
        if (typeof firebase === 'undefined' || !firebase.firestore) {
            statusElement.innerHTML = '<h3 style="color: red;">خطأ: لم يتم تحميل Firebase بشكل صحيح</h3><p>يرجى التأكد من أنك تستخدم هذا السكريبت على موقع الويب الرئيسي وليس محلياً</p>';
            return;
        }
        
        clearAllOrders();
    }, 1500);
    
    // دالة لمسح جميع الطلبات
    function clearAllOrders() {
        statusElement.innerHTML = '<h3>جاري مسح جميع الطلبات...</h3><div id="progress">0%</div>';
        
        const db = firebase.firestore();
        const ordersRef = db.collection('orders');
        
        // أولاً، نحصل على جميع الطلبات
        ordersRef.get()
            .then((snapshot) => {
                const totalOrders = snapshot.size;
                console.log(`تم العثور على ${totalOrders} طلبًا`);
                
                if (totalOrders === 0) {
                    statusElement.innerHTML = '<h3>لم يتم العثور على أي طلبات! قاعدة البيانات فارغة بالفعل.</h3><button id="close-status" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">إغلاق</button>';
                    document.getElementById('close-status').addEventListener('click', () => {
                        document.body.removeChild(statusElement);
                    });
                    return;
                }
                
                statusElement.innerHTML = `<h3>جاري مسح ${totalOrders} طلب...</h3><div id="progress">0%</div>`;
                
                let deleted = 0;
                let batch = db.batch();
                let batchSize = 0;
                const MAX_BATCH_SIZE = 500; // أقصى حجم للدفعة في Firestore
                
                // إنشاء العمليات لمسح الطلبات
                snapshot.docs.forEach(doc => {
                    batch.delete(doc.ref);
                    batchSize++;
                    
                    // إذا وصلنا إلى الحد الأقصى، نقوم بتعهد هذه الدفعة وإنشاء دفعة جديدة
                    if (batchSize >= MAX_BATCH_SIZE) {
                        commitBatch();
                        batch = db.batch();
                        batchSize = 0;
                    }
                });
                
                // التعهد بالدفعة الأخيرة إذا كان هناك طلبات متبقية
                if (batchSize > 0) {
                    commitBatch();
                }
                
                // دالة لتنفيذ دفعة من عمليات الحذف
                function commitBatch() {
                    batch.commit()
                        .then(() => {
                            deleted += batchSize;
                            const progress = Math.round((deleted / totalOrders) * 100);
                            document.getElementById('progress').textContent = `${progress}%`;
                            
                            console.log(`تم مسح ${deleted} من ${totalOrders} طلبًا`);
                            
                            // عند الانتهاء من مسح جميع الطلبات
                            if (deleted >= totalOrders) {
                                console.log('تم مسح جميع الطلبات بنجاح!');
                                statusElement.innerHTML = '<h3 style="color: green;">تم مسح جميع الطلبات بنجاح!</h3><p>تم مسح قاعدة البيانات وهي جاهزة الآن لاستقبال طلبات جديدة.</p><button id="close-status" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">إغلاق</button>';
                                
                                document.getElementById('close-status').addEventListener('click', () => {
                                    document.body.removeChild(statusElement);
                                });
                            }
                        })
                        .catch(error => {
                            console.error('حدث خطأ أثناء مسح الطلبات:', error);
                            statusElement.innerHTML = `<h3 style="color: red;">حدث خطأ أثناء مسح الطلبات</h3><p>${error.message}</p><button id="retry" style="padding: 8px 16px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">إعادة المحاولة</button><button id="close-status" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">إغلاق</button>`;
                            
                            document.getElementById('close-status').addEventListener('click', () => {
                                document.body.removeChild(statusElement);
                            });
                            
                            document.getElementById('retry').addEventListener('click', () => {
                                clearAllOrders();
                            });
                        });
                }
            })
            .catch(error => {
                console.error('حدث خطأ أثناء الحصول على الطلبات:', error);
                statusElement.innerHTML = `<h3 style="color: red;">حدث خطأ أثناء الاتصال بقاعدة البيانات</h3><p>${error.message}</p><button id="retry" style="padding: 8px 16px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">إعادة المحاولة</button><button id="close-status" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">إغلاق</button>`;
                
                document.getElementById('close-status').addEventListener('click', () => {
                    document.body.removeChild(statusElement);
                });
                
                document.getElementById('retry').addEventListener('click', () => {
                    clearAllOrders();
                });
            });
    }
});
