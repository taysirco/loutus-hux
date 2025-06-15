/**
 * ملف منفصل لإصلاح وظائف جدول المقاسات
 * هذا الملف يعمل بشكل مستقل عن script.js لتجنب التداخل
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('تهيئة وظائف جدول المقاسات المعزولة...');
    initSizeChartFunctions();
});

// وظيفة رئيسية لتهيئة جدول المقاسات
function initSizeChartFunctions() {
    // الحصول على عناصر أشرطة التمرير
    const heightSliderInline = document.getElementById('heightSliderInline');
    const weightSliderInline = document.getElementById('weightSliderInline');
    const heightValueInline = document.getElementById('heightValueInline');
    const weightValueInline = document.getElementById('weightValueInline');
    
    // التحقق من وجود العناصر
    if (!heightSliderInline || !weightSliderInline) {
        console.log('لم يتم العثور على أشرطة التمرير في جدول المقاسات');
        return;
    }
    
    console.log('تم العثور على أشرطة التمرير في جدول المقاسات');
    
    // تهيئة القيم الأولية
    updateSliderBubble(heightSliderInline, heightValueInline);
    updateSliderBubble(weightSliderInline, weightValueInline);
    updateRecommendedSizeInline();
    
    // إضافة مستمعي الأحداث لأشرطة التمرير
    heightSliderInline.addEventListener('input', function() {
        console.log('تغيير قيمة الطول');
        updateSliderBubble(this, heightValueInline);
        updateRecommendedSizeInline();
    });
    
    weightSliderInline.addEventListener('input', function() {
        console.log('تغيير قيمة الوزن');
        updateSliderBubble(this, weightValueInline);
        updateRecommendedSizeInline();
    });
    
    // تهيئة أزرار تبديل وحدات القياس
    const unitButtons = document.querySelectorAll('.unit-btn');
    unitButtons.forEach(button => {
        button.addEventListener('click', function() {
            const unitType = this.getAttribute('data-unit');
            console.log('تغيير وحدة القياس إلى:', unitType);
            
            // إزالة الفئة النشطة من جميع الأزرار
            unitButtons.forEach(btn => btn.classList.remove('active'));
            
            // إضافة الفئة النشطة للزر المحدد
            this.classList.add('active');
            
            // تحديث وحدات القياس
            updateMeasurementUnits(unitType);
        });
    });
    
    // تهيئة تبويبات جدول المقاسات
    const sizeChartTabs = document.querySelectorAll('.size-chart-tab-inline');
    sizeChartTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            console.log('تغيير تبويب جدول المقاسات إلى:', tabId);
            
            // إزالة الفئة النشطة من جميع التبويبات
            sizeChartTabs.forEach(t => t.classList.remove('active'));
            
            // إزالة الفئة النشطة من جميع المحتويات
            document.querySelectorAll('.tab-pane-inline').forEach(p => p.classList.remove('active'));
            
            // إضافة الفئة النشطة للتبويب المحدد
            this.classList.add('active');
            
            // إضافة الفئة النشطة للمحتوى المرتبط
            const targetPane = document.getElementById(tabId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

// وظيفة لتحديث فقاعة قيمة شريط التمرير
function updateSliderBubble(slider, valueElement) {
    if (!slider || !valueElement) return;
    
    const val = slider.value;
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const percentage = ((val - min) / (max - min)) * 100;
    
    // تحديث النص وموضع الفقاعة
    valueElement.textContent = val;
    
    // الحصول على العنصر الأب (فقاعة القيمة)
    const bubble = valueElement.closest('.slider-bubble');
    if (bubble) {
        bubble.style.left = `calc(${percentage}% - ${bubble.offsetWidth / 2}px)`;
    }
}

// وظيفة لتحديث المقاس الموصى به
function updateRecommendedSizeInline() {
    const heightSlider = document.getElementById('heightSliderInline');
    const weightSlider = document.getElementById('weightSliderInline');
    const recommendedSizeElement = document.getElementById('recommendedSizeInline');
    
    if (!heightSlider || !weightSlider || !recommendedSizeElement) {
        console.log('عناصر حاسبة المقاس غير موجودة');
        return;
    }
    
    // الحصول على قيم الطول والوزن
    let height = parseInt(heightSlider.value);
    let weight = parseInt(weightSlider.value);
    
    // تحويل القيم إذا كانت بالنظام الإمبريالي
    const activeUnit = document.querySelector('.unit-btn.active')?.getAttribute('data-unit') || 'metric';
    
    if (activeUnit === 'imperial') {
        // تحويل من إنش إلى سم
        height = Math.round(height * 2.54);
        // تحويل من رطل إلى كجم
        weight = Math.round(weight / 2.205);
    }
    
    // حساب المقاس المناسب بناءً على الطول والوزن
    const size = calculateSize(height, weight);
    
    // تطبيق تأثير حركي عند تغيير المقاس
    if (recommendedSizeElement.textContent !== size) {
        recommendedSizeElement.classList.add('updating');
        setTimeout(() => {
            recommendedSizeElement.textContent = size;
            recommendedSizeElement.classList.remove('updating');
        }, 300);
    } else {
        recommendedSizeElement.textContent = size;
    }
}

// حساب المقاس المناسب بناءً على الوزن
function calculateSize(height, weight) {
    let size = '';
    
    if (weight >= 65 && weight <= 75) {
        size = 'M';
    } else if (weight > 75 && weight <= 85) {
        size = 'L';
    } else if (weight > 85 && weight <= 98) {
        size = 'XL';
    } else if (weight > 98) {
        size = '2XL';
    } else {
        size = 'M'; // Default to M for weights below 65
    }
    
    return size;
}

// وظيفة لتحديث وحدات القياس
function updateMeasurementUnits(unit) {
    const heightSlider = document.getElementById('heightSliderInline');
    const weightSlider = document.getElementById('weightSliderInline');
    const heightValue = document.getElementById('heightValueInline');
    const weightValue = document.getElementById('weightValueInline');
    
    if (!heightSlider || !weightSlider || !heightValue || !weightValue) return;
    
    // تحديث علامات المقياس للنظام المتري
    updateSliderMarks('height', [150, 160, 170, 180, 190, 200, 210]);
    updateSliderMarks('weight', [60, 80, 100, 120, 140, 160]);

    // تحديث فقاعات القيم
    updateSliderBubble(heightSlider, heightValue);
    updateSliderBubble(weightSlider, weightValue);
    
    // تحديث المقاس الموصى به
    updateRecommendedSizeInline();
}

// وظيفة لتحديث علامات المقياس
function updateSliderMarks(type, marks) {
    const marksContainer = document.querySelector(`.${type}-marks`);
    if (!marksContainer) return;
    
    // مسح العلامات الحالية
    marksContainer.innerHTML = '';
    
    // إضافة العلامات الجديدة
    marks.forEach(mark => {
        const span = document.createElement('span');
        span.textContent = mark;
        marksContainer.appendChild(span);
    });
}
