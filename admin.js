function displayOrders(orders) {
    const tableBody = document.getElementById('orderTableBody');
    tableBody.innerHTML = '';

    orders.forEach(order => {
        const row = document.createElement('tr');
        
        // Format date
        const orderDate = new Date(order.timestamp);
        const formattedDate = orderDate.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
        
        // Calculate total amount
        const totalAmount = parseInt(order.orderData.totalPrice || 0);
        
        // Get number of products
        const numProducts = order.orderData.items ? order.orderData.items.length : 0;
        
        row.innerHTML = `
            <td>
                <button class="export-single-btn" title="تصدير هذا الطلب إلى Excel" onclick="exportSingleOrder('${order.id}')">
                    <i class="fas fa-file-excel text-success"></i>
                </button>
                ${order.id}
            </td>
            <td>${order.orderData.name || 'غير متوفر'}</td>
            <td>${order.orderData.mobile || 'غير متوفر'}</td>
            <td>${formattedDate}</td>
            <td>${numProducts}</td>
            <td>${totalAmount} ج.م</td>
            <td>
                <select class="status-select" data-order-id="${order.id}">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>قيد الانتظار</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>قيد المعالجة</option>
                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>تم الشحن</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>تم التسليم</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>ملغي</option>
                </select>
            </td>
            <td>
                <button class="view-btn" data-order-id="${order.id}">عرض التفاصيل</button>
                <button class="delete-btn" data-order-id="${order.id}">حذف</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners for status selects
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', function() {
            const orderId = this.getAttribute('data-order-id');
            const newStatus = this.value;
            updateOrderStatus(orderId, newStatus);
        });
    });
    
    // Add event listeners for view buttons
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            const order = orders.find(order => order.id === orderId);
            showOrderDetails(order);
        });
    });
    
    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            if (confirm('هل أنت متأكد من رغبتك في حذف هذا الطلب؟')) {
                deleteOrder(orderId);
            }
        });
    });
}

// Export filtered orders to Excel
function exportOrdersToExcel() {
    const filteredOrders = getFilteredOrders();
    if (filteredOrders.length === 0) {
        alert('لا توجد طلبات للتصدير');
        return;
    }
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([]);
    
    // Add headers
    XLSX.utils.sheet_add_aoa(worksheet, [['رقم الطلب', 'اسم العميل', 'رقم الهاتف', 'المحافظة', 'العنوان التفصيلي', 'المنتجات', 'الكمية', 'السعر الإجمالي', 'تاريخ الطلب', 'الحالة']], { origin: 'A1' });
    
    // Add order data
    let rowIndex = 2;
    filteredOrders.forEach(order => {
        const formattedDate = new Date(order.timestamp).toLocaleDateString('ar-EG');
        const productsInfo = order.orderData.items ? order.orderData.items.map(item => 
            `${item.name || 'منتج'} (${item.color || 'لون'}, ${item.size || 'حجم'})`
        ).join('\n') : '';
        
        const quantityInfo = order.orderData.items ? order.orderData.items.map(item => 
            item.quantity || '1'
        ).join('\n') : '';
        
        XLSX.utils.sheet_add_aoa(worksheet, [[
            order.id,
            order.orderData.name || '',
            order.orderData.mobile || '',
            order.orderData.governorate || '',
            order.orderData.address || '',
            productsInfo,
            quantityInfo,
            order.orderData.totalPrice || '0',
            formattedDate,
            getStatusInArabic(order.status)
        ]], { origin: `A${rowIndex}` });
        
        rowIndex++;
    });
    
    // Auto-size columns
    const cols = [];
    for (let i = 0; i < 10; i++) {
        cols.push({ wch: 20 });
    }
    worksheet['!cols'] = cols;
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'طلبات');
    XLSX.writeFile(workbook, `طلبات_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// Export a single order to Excel
function exportSingleOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        alert('الطلب غير موجود');
        return;
    }
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([]);
    
    // Add headers
    XLSX.utils.sheet_add_aoa(worksheet, [['رقم الطلب', 'اسم العميل', 'رقم الهاتف', 'المحافظة', 'العنوان التفصيلي', 'المنتجات', 'الكمية', 'السعر الإجمالي', 'تاريخ الطلب', 'الحالة']], { origin: 'A1' });
    
    // Add order data
    const formattedDate = new Date(order.timestamp).toLocaleDateString('ar-EG');
    const productsInfo = order.orderData.items ? order.orderData.items.map(item => 
        `${item.name || 'منتج'} (${item.color || 'لون'}, ${item.size || 'حجم'})`
    ).join('\n') : '';
    
    const quantityInfo = order.orderData.items ? order.orderData.items.map(item => 
        item.quantity || '1'
    ).join('\n') : '';
    
    XLSX.utils.sheet_add_aoa(worksheet, [[
        order.id,
        order.orderData.name || '',
        order.orderData.mobile || '',
        order.orderData.governorate || '',
        order.orderData.address || '',
        productsInfo,
        quantityInfo,
        order.orderData.totalPrice || '0',
        formattedDate,
        getStatusInArabic(order.status)
    ]], { origin: 'A2' });
    
    // Auto-size columns
    const cols = [];
    for (let i = 0; i < 10; i++) {
        cols.push({ wch: 20 });
    }
    worksheet['!cols'] = cols;
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'تفاصيل الطلب');
    XLSX.writeFile(workbook, `طلب_${order.id}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// Helper function to get status in Arabic
function getStatusInArabic(status) {
    switch(status) {
        case 'pending': return 'قيد الانتظار';
        case 'processing': return 'قيد المعالجة';
        case 'shipped': return 'تم الشحن';
        case 'delivered': return 'تم التسليم';
        case 'cancelled': return 'ملغي';
        default: return status;
    }
}

// Function to get filtered orders based on current filter settings
function getFilteredOrders() {
    let filteredOrders = [...orders];
    
    // Apply status filter
    const statusFilter = document.getElementById('statusFilter').value;
    if (statusFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }
    
    // Apply date filter
    const dateFilter = document.getElementById('dateFilter').value;
    if (dateFilter) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (dateFilter === 'today') {
            filteredOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.timestamp);
                orderDate.setHours(0, 0, 0, 0);
                return orderDate.getTime() === today.getTime();
            });
        } else if (dateFilter === 'yesterday') {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);
            
            filteredOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.timestamp);
                orderDate.setHours(0, 0, 0, 0);
                return orderDate.getTime() === yesterday.getTime();
            });
        } else if (dateFilter === 'last7days') {
            const last7Days = new Date();
            last7Days.setDate(last7Days.getDate() - 7);
            
            filteredOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.timestamp);
                return orderDate >= last7Days;
            });
        } else if (dateFilter === 'last30days') {
            const last30Days = new Date();
            last30Days.setDate(last30Days.getDate() - 30);
            
            filteredOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.timestamp);
                return orderDate >= last30Days;
            });
        }
    }
    
    // Apply search filter
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    if (searchTerm) {
        filteredOrders = filteredOrders.filter(order => {
            return (
                (order.id && order.id.toLowerCase().includes(searchTerm)) ||
                (order.orderData.name && order.orderData.name.toLowerCase().includes(searchTerm)) ||
                (order.orderData.mobile && order.orderData.mobile.toLowerCase().includes(searchTerm)) ||
                (order.orderData.address && order.orderData.address.toLowerCase().includes(searchTerm))
            );
        });
    }
    
    return filteredOrders;
}

// Apply filters and display filtered orders
function applyFilters() {
    const filteredOrders = getFilteredOrders();
    displayOrders(filteredOrders);
    updateOrdersCount(filteredOrders.length);
}

// Event listeners for filter controls
document.addEventListener('DOMContentLoaded', function() {
    // Load orders initially
    fetchOrders();
    
    // Add event listeners for filters
    document.getElementById('statusFilter').addEventListener('change', applyFilters);
    document.getElementById('dateFilter').addEventListener('change', applyFilters);
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    
    // Add event listener for export button
    document.getElementById('exportBtn').addEventListener('click', exportOrdersToExcel);
});

// Update counters for order counts
function updateOrdersCount(count) {
    document.getElementById('ordersCount').textContent = count;
} 