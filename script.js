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
    
    // Helper function to convert to title case (capitalize each word)
    function toTitleCase(str) {
        return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    }
    
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
    
    // Update sub company name in footer area (preserve styling, force title case)
    const subCompanyFooterElements = document.querySelectorAll('#subcompanyname strong');
    subCompanyFooterElements.forEach(element => {
        const name = subCompanyNameInput || 'ZIZI AESTHETICS';
        element.textContent = toTitleCase(name);
    });
    
    // Update parent company name in footer area (preserve styling, force title case)
    const parentCompanyFooterElements = document.querySelectorAll('#parentcompanyname strong');
    parentCompanyFooterElements.forEach(element => {
        const name = parentCompanyNameInput || 'ZIZICUOGIA GLOBAL';
        element.textContent = toTitleCase(name);
    });
}

function removeItem(button) {
    if (document.querySelectorAll('.item').length > 1) {
        button.parentElement.remove();
        calculateTotals();
    }
}

function formatPhoneNumber(phone) {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as +234 704 387 7574 pattern
    if (cleaned.length === 13 && cleaned.startsWith('234')) {
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
        // Convert 0 prefix to +234
        return `+234 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
        // Assume it's missing the country code
        return `+234 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }
    return phone; // Return original if no pattern matches
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
    
    // Format and display client phone as a clickable link with emoji
    const clientPhoneElement = document.getElementById('displayClientPhone');
    if (clientPhone.trim()) {
        const formattedPhone = formatPhoneNumber(clientPhone);
        const cleanPhone = clientPhone.replace(/\D/g, '');
        let telLink = cleanPhone;
        
        // Ensure proper tel link format
        if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
            telLink = '234' + cleanPhone.slice(1);
        } else if (cleanPhone.length === 10) {
            telLink = '234' + cleanPhone;
        } else if (cleanPhone.length === 13 && cleanPhone.startsWith('234')) {
            telLink = cleanPhone;
        }
        
        clientPhoneElement.innerHTML = `<a href="tel:+${telLink}" class="phone-link">📞 ${formattedPhone}</a>`;
    } else {
        clientPhoneElement.textContent = '<SHIPPING TO PHONE NUMBER>';
    }
    
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
    
    // Hide form temporarily
    const formSection = document.querySelector('.form-section');
    const originalDisplay = formSection.style.display;
    formSection.style.display = 'none';
    
    // Simple, effective PDF settings optimized for letter paper
    const opt = {
        margin: 0.4,
        filename: `invoice-${document.getElementById('invoiceNumber').value}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff',
            logging: false
        },
        jsPDF: { 
            unit: 'in', 
            format: 'letter', 
            orientation: 'portrait' 
        }
    };
    
    html2pdf().set(opt).from(element).save().then(() => {
        // Restore form
        formSection.style.display = originalDisplay;
    }).catch((error) => {
        console.error('PDF generation failed:', error);
        formSection.style.display = originalDisplay;
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
