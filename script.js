// Invoice Generator JavaScript
let itemCount = 0;

// Initialize the form
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('invoiceDate').value = today;
    
    // Add initial item
    addItem();
    
    // Event listeners
    document.getElementById('addItem').addEventListener('click', addItem);
    document.getElementById('generateInvoice').addEventListener('click', generateInvoice);
    document.getElementById('downloadPDF').addEventListener('click', downloadPDF);
    document.getElementById('subCompanyNameInput').addEventListener('change', updateCompanyNames);
    document.getElementById('parentCompanyNameInput').addEventListener('input', updateCompanyNames);
    
    // Initial generation
    generateInvoice();
    
    // Initialize company names
    updateCompanyNames();
});

function addItem() {
    itemCount++;
    const itemsContainer = document.getElementById('itemsList');
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';
    itemDiv.innerHTML = `
        <input type="text" placeholder="Item description" class="item-description" required>
        <input type="number" placeholder="Qty" class="item-quantity" min="1" value="1" required>
        <input type="number" placeholder="Price" class="item-price" min="0" step="0.01" required>
        <button type="button" class="remove-item" onclick="removeItem(this)">Remove</button>
    `;
    
    itemsContainer.appendChild(itemDiv);
    
    // Add event listeners for real-time calculation
    itemDiv.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', calculateTotals);
    });
}

function updateCompanyNames() {
    const subCompanyNameInput = document.getElementById('subCompanyNameInput').value;
    const parentCompanyNameInput = document.getElementById('parentCompanyNameInput').value;
    
    // Update sub company name in title area (reduce font weight handled in CSS)
    const subCompanyTitleElement = document.querySelector('#subcompanyname');
    if (subCompanyTitleElement) {
        subCompanyTitleElement.textContent = subCompanyNameInput || 'ZIZI AESTHETICS';
    }
    
    // Update parent company name in title area
    const parentCompanyTitleElement = document.querySelector('#parentcompanyname');
    if (parentCompanyTitleElement) {
        parentCompanyTitleElement.textContent = parentCompanyNameInput || 'ZIZICUOGIA GLOBAL';
    }
    
    // Update sub company name in footer area (preserve styling)
    const subCompanyFooterElements = document.querySelectorAll('#subcompanyname strong');
    subCompanyFooterElements.forEach(element => {
        element.textContent = subCompanyNameInput || 'ZIZI AESTHETICS';
    });
    
    // Update parent company name in footer area (preserve styling)
    const parentCompanyFooterElements = document.querySelectorAll('#parentcompanyname strong');
    parentCompanyFooterElements.forEach(element => {
        element.textContent = parentCompanyNameInput || 'ZIZICUOGIA GLOBAL';
    });
}

function removeItem(button) {
    if (document.querySelectorAll('.item').length > 1) {
        button.parentElement.remove();
        calculateTotals();
    }
}

function generateInvoice() {
    // Get form data
    const invoiceNumber = document.getElementById('invoiceNumber').value;
    const invoiceDate = document.getElementById('invoiceDate').value;
    const clientName = document.getElementById('clientName').value;
    const clientAddress = document.getElementById('clientAddress').value;
    const clientPhone = document.getElementById('clientPhone').value;
    const notes = document.getElementById('notes').value;
    
    // Update invoice display
    document.getElementById('displayInvoiceNumber').textContent = invoiceNumber;
    document.getElementById('displayDate').textContent = formatDate(invoiceDate);
    document.getElementById('displayClientName').textContent = clientName || '<SHIPPING TO NAME>';
    document.getElementById('displayClientAddress').textContent = clientAddress || '<SHIPPING TO ADDRESS>';
    document.getElementById('displayClientPhone').textContent = clientPhone || '<SHIPPING TO PHONE NUMBER>';
    
    // Update notes with default bank details if empty
    const defaultNotes = `Account details:<br>0094714592<br>Sterling Bank<br><span style="font-weight:bold;">ZIZICUOGIA GLOBAL SERVICES</span>`;
    if (notes.trim()) {
        document.getElementById('displayNotes').innerHTML = notes.replace(/\n/g, '<br>') + '<br><br>' + defaultNotes;
    } else {
        document.getElementById('displayNotes').innerHTML = defaultNotes;
    }
    
    // Generate items table and calculate totals
    generateItemsTable();
    calculateTotals();
}

function generateItemsTable() {
    const items = document.querySelectorAll('.item');
    const tableBody = document.getElementById('invoiceItemsTable');
    tableBody.innerHTML = '';
    
    items.forEach((item, index) => {
        const description = item.querySelector('.item-description').value || '<PRODUCT NAME>';
        const quantity = parseFloat(item.querySelector('.item-quantity').value) || 0;
        const price = parseFloat(item.querySelector('.item-price').value) || 0;
        const total = quantity * price;
        
        // Create table row with original styling
        const row = document.createElement('tr');
        row.style.height = '23px';
        
        // Determine styling classes based on row index (alternating pattern from original)
        const isEven = index % 2 === 0;
        const descClass = isEven ? 's38' : 's41';
        const qtyClass = isEven ? 's39' : 's42';
        const priceClass = isEven ? 's40' : 's43';
        
        // Add bottom border to last row
        const isLastRow = index === items.length - 1;
        const bottomBorderClass = isLastRow ? ' bottom-border' : '';
        
        row.innerHTML = `
            <td class="s37${bottomBorderClass}"></td>
            <td class="${descClass}${bottomBorderClass}" colspan="3">${description}</td>
            <td class="${qtyClass}${bottomBorderClass}">${quantity}</td>
            <td class="${priceClass}${bottomBorderClass}">₦${price.toFixed(2)}</td>
            <td class="${priceClass}${bottomBorderClass}">₦${total.toFixed(2)}</td>
            <td class="s32${bottomBorderClass}"></td>
        `;
        
        tableBody.appendChild(row);
    });
}

function calculateTotals() {
    const items = document.querySelectorAll('.item');
    let subtotal = 0;
    
    items.forEach(item => {
        const quantity = parseFloat(item.querySelector('.item-quantity').value) || 0;
        const price = parseFloat(item.querySelector('.item-price').value) || 0;
        subtotal += quantity * price;
    });
    
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const shipping = parseFloat(document.getElementById('shipping').value) || 0;
    
    const subtotalLessDiscount = subtotal - discount;
    const totalTax = subtotalLessDiscount * (taxRate / 100);
    const balanceDue = subtotalLessDiscount + totalTax + shipping;
    
    // Update display
    document.getElementById('displaySubtotal').textContent = `₦${subtotal.toFixed(2)}`;
    document.getElementById('displayDiscount').textContent = `₦${discount.toFixed(2)}`;
    document.getElementById('displaySubtotalLessDiscount').textContent = `₦${subtotalLessDiscount.toFixed(2)}`;
    document.getElementById('displayTaxRate').textContent = `${taxRate}%`;
    document.getElementById('displayTotalTax').textContent = `₦${totalTax.toFixed(2)}`;
    document.getElementById('displayShipping').textContent = `₦${shipping.toFixed(2)}`;
    document.getElementById('displayTotal').textContent = `₦${balanceDue.toFixed(2)}`;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function downloadPDF() {
    const element = document.getElementById('invoicePreview');
    
    // Add PDF export class for better styling
    element.classList.add('pdf-export');
    
    const opt = {
        margin: [0.3, 0.3, 0.3, 0.3],
        filename: `invoice-${document.getElementById('invoiceNumber').value}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 3,
            useCORS: true,
            logging: false,
            width: 816, // 8.5in * 96dpi
            height: 1056, // 11in * 96dpi
            scrollX: 0,
            scrollY: 0
        },
        jsPDF: { 
            unit: 'in', 
            format: 'a4', 
            orientation: 'portrait',
            putOnlyUsedFonts: true,
            floatPrecision: 16
        }
    };
    
    // Hide form temporarily
    const formSection = document.querySelector('.form-section');
    const originalDisplay = formSection.style.display;
    formSection.style.display = 'none';
    
    html2pdf().set(opt).from(element).save().then(() => {
        // Restore form and remove PDF class
        formSection.style.display = originalDisplay;
        element.classList.remove('pdf-export');
    }).catch((error) => {
        console.error('PDF generation failed:', error);
        formSection.style.display = originalDisplay;
        element.classList.remove('pdf-export');
    });
}

// Print functionality
window.print = function() {
    const formSection = document.querySelector('.form-section');
    const originalDisplay = formSection.style.display;
    formSection.style.display = 'none';
    
    window.print();
    
    setTimeout(() => {
        formSection.style.display = originalDisplay;
    }, 1000);
};
