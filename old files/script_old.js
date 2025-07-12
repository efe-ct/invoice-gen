// Invoice Generator JavaScript
class InvoiceGenerator {
    constructor() {
        this.items = [
            { description: 'Professional Consulting Services', quantity: 10, price: 150.00 },
            { description: 'Software Development', quantity: 40, price: 125.00 },
            { description: 'Project Management', quantity: 20, price: 100.00 }
        ];
        
        this.initializeEventListeners();
        this.setCurrentDate();
        this.renderItems();
        this.updateInvoiceDisplay();
        this.calculateTotals();
    }

    initializeEventListeners() {
        // Navigation buttons
        document.getElementById('editBtn').addEventListener('click', () => this.toggleEditForm());
        document.getElementById('printBtn').addEventListener('click', () => this.printInvoice());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadPDF());
        
        // Form buttons
        document.getElementById('saveBtn').addEventListener('click', () => this.saveAndPreview());
        document.getElementById('cancelBtn').addEventListener('click', () => this.cancelEdit());
        document.getElementById('addItemBtn').addEventListener('click', () => this.addItem());
        
        // Form inputs for real-time calculation
        document.getElementById('discountRate').addEventListener('input', () => this.calculateTotals());
        document.getElementById('taxRate').addEventListener('input', () => this.calculateTotals());
        document.getElementById('shippingCost').addEventListener('input', () => this.calculateTotals());
    }

    setCurrentDate() {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        document.getElementById('invoiceDate').value = formattedDate;
        this.updateDisplayDate(formattedDate);
    }

    updateDisplayDate(dateString) {
        const date = new Date(dateString + 'T00:00:00'); // Prevent timezone issues
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        document.getElementById('display-invoiceDate').textContent = formattedDate;
    }

    toggleEditForm() {
        const editForm = document.getElementById('editForm');
        const isHidden = editForm.classList.contains('hidden');
        
        if (isHidden) {
            editForm.classList.remove('hidden');
            editForm.classList.add('fade-in');
            document.getElementById('editBtn').textContent = 'Hide Editor';
            // Populate form with current values
            this.populateForm();
        } else {
            editForm.classList.add('hidden');
            document.getElementById('editBtn').textContent = 'Edit Invoice';
        }
    }

    populateForm() {
        // Populate form fields with current display values
        this.renderFormItems();
    }

    renderItems() {
        this.renderFormItems();
        this.renderDisplayItems();
    }

    renderFormItems() {
        const container = document.getElementById('itemsContainer');
        container.innerHTML = '';
        
        this.items.forEach((item, index) => {
            const itemRow = this.createItemRow(item, index);
            container.appendChild(itemRow);
        });
    }

    createItemRow(item, index) {
        const row = document.createElement('div');
        row.className = 'item-row';
        row.innerHTML = `
            <div class="form-group">
                <label>Description</label>
                <input type="text" data-field="description" data-index="${index}" value="${item.description}" />
            </div>
            <div class="form-group">
                <label>Quantity</label>
                <input type="number" data-field="quantity" data-index="${index}" value="${item.quantity}" min="0" step="0.01" />
            </div>
            <div class="form-group">
                <label>Unit Price</label>
                <input type="number" data-field="price" data-index="${index}" value="${item.price}" min="0" step="0.01" />
            </div>
            <div class="form-group">
                <label>Total</label>
                <input type="text" value="$${(item.quantity * item.price).toFixed(2)}" readonly style="background: #f3f4f6;" />
            </div>
            <button type="button" class="remove-item" onclick="invoiceGen.removeItem(${index})">×</button>
        `;
        
        // Add event listeners for real-time updates
        const inputs = row.querySelectorAll('input[data-field]');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => this.updateItem(e));
        });
        
        return row;
    }

    updateItem(event) {
        const index = parseInt(event.target.dataset.index);
        const field = event.target.dataset.field;
        const value = field === 'description' ? event.target.value : parseFloat(event.target.value) || 0;
        
        this.items[index][field] = value;
        
        // Update the total for this item
        const row = event.target.closest('.item-row');
        const totalInput = row.querySelector('input[readonly]');
        const quantity = this.items[index].quantity;
        const price = this.items[index].price;
        totalInput.value = `$${(quantity * price).toFixed(2)}`;
        
        this.calculateTotals();
    }

    addItem() {
        this.items.push({
            description: 'New Item',
            quantity: 1,
            price: 0
        });
        this.renderFormItems();
        this.calculateTotals();
    }

    removeItem(index) {
        this.items.splice(index, 1);
        this.renderFormItems();
        this.calculateTotals();
    }

    renderDisplayItems() {
        const tbody = document.getElementById('itemsTableBody');
        tbody.innerHTML = '';
        
        this.items.forEach(item => {
            const row = document.createElement('tr');
            const total = item.quantity * item.price;
            
            row.innerHTML = `
                <td class="description">${item.description}</td>
                <td class="qty">${item.quantity}</td>
                <td class="price">$${item.price.toFixed(2)}</td>
                <td class="total">$${total.toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        });
    }

    calculateTotals() {
        const subtotal = this.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const discountRate = parseFloat(document.getElementById('discountRate')?.value || 0) / 100;
        const taxRate = parseFloat(document.getElementById('taxRate')?.value || 0) / 100;
        const shippingCost = parseFloat(document.getElementById('shippingCost')?.value || 0);
        
        const discountAmount = subtotal * discountRate;
        const subtotalLessDiscount = subtotal - discountAmount;
        const taxAmount = subtotalLessDiscount * taxRate;
        const grandTotal = subtotalLessDiscount + taxAmount + shippingCost;
        
        // Update display
        document.getElementById('display-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('display-discount').textContent = `$${discountAmount.toFixed(2)}`;
        document.getElementById('display-subtotalLessDiscount').textContent = `$${subtotalLessDiscount.toFixed(2)}`;
        document.getElementById('display-taxRateDisplay').textContent = `${(taxRate * 100).toFixed(2)}%`;
        document.getElementById('display-totalTax').textContent = `$${taxAmount.toFixed(2)}`;
        document.getElementById('display-shippingCost').textContent = `$${shippingCost.toFixed(2)}`;
        document.getElementById('display-grandTotal').textContent = `$${grandTotal.toFixed(2)}`;
    }

    updateInvoiceDisplay() {
        // Map form fields to display elements
        const fieldMappings = {
            'parentCompany': ['display-parentCompany', 'display-parentCompany-footer'],
            'subsidiaryCompany': ['display-subsidiaryCompany', 'display-subsidiaryCompany-footer'],
            'companyAddress': ['display-companyAddress'],
            'companyPhone': ['display-companyPhone'],
            'invoiceNumber': ['display-invoiceNumber'],
            'clientName': ['display-clientName'],
            'clientAddress': ['display-clientAddress'],
            'clientPhone': ['display-clientPhone'],
            'paymentInstructions': ['display-paymentInstructions']
        };

        Object.entries(fieldMappings).forEach(([fieldId, displayIds]) => {
            const inputElement = document.getElementById(fieldId);
            if (inputElement) {
                const value = inputElement.value;
                displayIds.forEach(displayId => {
                    const displayElement = document.getElementById(displayId);
                    if (displayElement) {
                        if (fieldId === 'companyAddress' || fieldId === 'clientAddress' || fieldId === 'paymentInstructions') {
                            displayElement.innerHTML = value.replace(/\n/g, '<br>');
                        } else {
                            displayElement.textContent = value;
                        }
                    }
                });
            }
        });

        // Update date display
        const dateInput = document.getElementById('invoiceDate');
        if (dateInput && dateInput.value) {
            this.updateDisplayDate(dateInput.value);
        }
    }

    saveAndPreview() {
        this.updateInvoiceDisplay();
        this.renderDisplayItems();
        this.calculateTotals();
        this.toggleEditForm();
        
        // Show success message
        this.showNotification('Invoice updated successfully!', 'success');
    }

    cancelEdit() {
        this.toggleEditForm();
    }

    printInvoice() {
        window.print();
    }

    async downloadPDF() {
        const element = document.querySelector('.invoice');
        const opt = {
            margin: 0.5,
            filename: `invoice-${document.getElementById('display-invoiceNumber').textContent}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                logging: false
            },
            jsPDF: { 
                unit: 'in', 
                format: 'letter', 
                orientation: 'portrait' 
            }
        };

        try {
            this.showNotification('Generating PDF...', 'info');
            await html2pdf().set(opt).from(element).save();
            this.showNotification('PDF downloaded successfully!', 'success');
        } catch (error) {
            console.error('PDF generation error:', error);
            this.showNotification('Error generating PDF. Please try again.', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            font-weight: 500;
            max-width: 300px;
            word-wrap: break-word;
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);

        // Add slide-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                notification.remove();
                style.remove();
            }, 300);
        }, 3000);
    }

    // Generate a random invoice number
    generateInvoiceNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `INV-${year}-${month}-${random}`;
    }

    // Reset invoice to default values
    resetInvoice() {
        if (confirm('Are you sure you want to reset the invoice? This will clear all current data.')) {
            // Reset items
            this.items = [
                { description: 'Professional Consulting Services', quantity: 10, price: 150.00 },
                { description: 'Software Development', quantity: 40, price: 125.00 },
                { description: 'Project Management', quantity: 20, price: 100.00 }
            ];

            // Reset form fields
            document.getElementById('parentCompany').value = 'ACME CORPORATION';
            document.getElementById('subsidiaryCompany').value = 'ACME SERVICES LLC';
            document.getElementById('companyAddress').value = '123 Business Street\nSuite 100\nNew York, NY 10001';
            document.getElementById('companyPhone').value = '+1 (555) 123-4567';
            document.getElementById('invoiceNumber').value = this.generateInvoiceNumber();
            document.getElementById('clientName').value = 'CLIENT COMPANY NAME';
            document.getElementById('clientAddress').value = '456 Client Avenue\nBuilding 2\nLos Angeles, CA 90210';
            document.getElementById('clientPhone').value = '+1 (555) 987-6543';
            document.getElementById('discountRate').value = '0';
            document.getElementById('taxRate').value = '8.25';
            document.getElementById('shippingCost').value = '0';
            document.getElementById('paymentInstructions').value = 'Account details:\nAccount Number: 0094714592\nBank: Sterling Bank\nAccount Name: ACME GLOBAL SERVICES';

            this.setCurrentDate();
            this.renderItems();
            this.updateInvoiceDisplay();
            this.calculateTotals();
            
            this.showNotification('Invoice reset successfully!', 'success');
        }
    }

    // Export invoice data as JSON
    exportData() {
        const data = {
            companyInfo: {
                parentCompany: document.getElementById('parentCompany').value,
                subsidiaryCompany: document.getElementById('subsidiaryCompany').value,
                address: document.getElementById('companyAddress').value,
                phone: document.getElementById('companyPhone').value
            },
            invoiceDetails: {
                date: document.getElementById('invoiceDate').value,
                number: document.getElementById('invoiceNumber').value
            },
            clientInfo: {
                name: document.getElementById('clientName').value,
                address: document.getElementById('clientAddress').value,
                phone: document.getElementById('clientPhone').value
            },
            items: this.items,
            settings: {
                discountRate: parseFloat(document.getElementById('discountRate').value),
                taxRate: parseFloat(document.getElementById('taxRate').value),
                shippingCost: parseFloat(document.getElementById('shippingCost').value)
            },
            paymentInstructions: document.getElementById('paymentInstructions').value
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice-data-${document.getElementById('display-invoiceNumber').textContent}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Invoice data exported successfully!', 'success');
    }

    // Import invoice data from JSON
    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                // Populate form fields
                document.getElementById('parentCompany').value = data.companyInfo.parentCompany || '';
                document.getElementById('subsidiaryCompany').value = data.companyInfo.subsidiaryCompany || '';
                document.getElementById('companyAddress').value = data.companyInfo.address || '';
                document.getElementById('companyPhone').value = data.companyInfo.phone || '';
                document.getElementById('invoiceDate').value = data.invoiceDetails.date || '';
                document.getElementById('invoiceNumber').value = data.invoiceDetails.number || '';
                document.getElementById('clientName').value = data.clientInfo.name || '';
                document.getElementById('clientAddress').value = data.clientInfo.address || '';
                document.getElementById('clientPhone').value = data.clientInfo.phone || '';
                document.getElementById('discountRate').value = data.settings.discountRate || 0;
                document.getElementById('taxRate').value = data.settings.taxRate || 0;
                document.getElementById('shippingCost').value = data.settings.shippingCost || 0;
                document.getElementById('paymentInstructions').value = data.paymentInstructions || '';
                
                // Update items
                this.items = data.items || [];
                
                this.renderItems();
                this.updateInvoiceDisplay();
                this.calculateTotals();
                
                this.showNotification('Invoice data imported successfully!', 'success');
            } catch (error) {
                console.error('Import error:', error);
                this.showNotification('Error importing data. Please check the file format.', 'error');
            }
        };
        
        reader.readAsText(file);
    }
}

// Initialize the invoice generator when the DOM is loaded
let invoiceGen;
document.addEventListener('DOMContentLoaded', function() {
    invoiceGen = new InvoiceGenerator();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + P for print
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            invoiceGen.printInvoice();
        }
        
        // Ctrl/Cmd + E for edit
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            invoiceGen.toggleEditForm();
        }
        
        // Escape to close edit form
        if (e.key === 'Escape') {
            const editForm = document.getElementById('editForm');
            if (!editForm.classList.contains('hidden')) {
                invoiceGen.toggleEditForm();
            }
        }
    });
});

// Make functions globally available for inline event handlers
window.invoiceGen = invoiceGen;
