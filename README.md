# Professional Invoice Generator

A modern, web-based invoice generator with a clean interface, dynamic form editing, and PDF export capabilities. Built with vanilla HTML, CSS, and JavaScript for maximum compatibility and performance.

## Features

### 🎨 Modern Design
- Clean, professional invoice layout
- Responsive design that works on all devices
- Beautiful typography using Inter font
- Elegant color scheme with subtle shadows and gradients
- Print-optimized styling

### 📝 Dynamic Invoice Editing
- Live form editor with real-time preview
- Add, remove, and edit invoice items dynamically
- Automatic calculations for subtotals, discounts, taxes, and totals
- Form validation and error handling

### 🧮 Smart Calculations
- Automatic subtotal calculation
- Percentage-based discount system
- Configurable tax rates (VAT/Sales Tax)
- Shipping and handling costs
- Real-time total updates

### 📄 Export Options
- **Print Invoice**: Browser-based printing with optimized print styles
- **Download PDF**: High-quality PDF generation using html2pdf.js
- **Export Data**: Save invoice data as JSON for backup/import
- **Import Data**: Load previously saved invoice configurations

### 🎯 Professional Features
- Company branding section with parent/subsidiary structure
- Client billing and shipping information
- Detailed line items with descriptions, quantities, and pricing
- Payment instructions and account details
- Professional footer with corporate structure notes

### ⌨️ Keyboard Shortcuts
- `Ctrl/Cmd + P`: Print invoice
- `Ctrl/Cmd + E`: Toggle edit mode
- `Escape`: Close edit form

## Quick Start

1. **Open the Application**
   ```bash
   # Open index.html in your web browser
   open index.html
   # Or serve with a local server (recommended)
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

2. **Edit Invoice Details**
   - Click "Edit Invoice" to open the form editor
   - Fill in your company information, client details, and invoice items
   - Click "Save & Preview" to update the invoice

3. **Export Your Invoice**
   - Click "Print" to print directly from browser
   - Click "Download PDF" to save as PDF file
   - Use keyboard shortcuts for quick access

## File Structure

```
invoice-gen/
├── index.html          # Main application file
├── styles.css          # Modern CSS styling
├── script.js           # JavaScript functionality
├── README.md           # This documentation
└── template/           # Original template files
    ├── Template.html   # Google Sheets export
    ├── sheet.css       # Original styling
    └── TEMPLATE FINAL - Template.pdf
```

## Customization

### Styling
Edit `styles.css` to customize:
- Colors and branding
- Typography and spacing
- Layout and responsiveness
- Print styles

### Functionality
Modify `script.js` to add:
- Additional form fields
- Custom calculations
- New export formats
- Integration with APIs

### Default Data
Update the default values in the `InvoiceGenerator` constructor:
```javascript
this.items = [
    { description: 'Your Service', quantity: 1, price: 100.00 }
];
```

## Browser Compatibility

- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (limited support)

## Dependencies

### External Libraries
- **html2pdf.js**: PDF generation (loaded via CDN)
- **Google Fonts**: Inter font family
- **No other frameworks required!**

### Local Dependencies
- None - fully self-contained application

## PDF Export Notes

The PDF export feature uses html2pdf.js which:
- Generates high-quality PDFs in the browser
- Preserves styling and layout
- Works entirely client-side (no server required)
- Supports custom page sizes and margins

For best PDF results:
1. Ensure all content fits properly on the invoice
2. Use the preview mode before exporting
3. Check that images and fonts load completely

## Development

### Local Development
```bash
# Serve with Python
python -m http.server 8000

# Or with Node.js
npx serve .

# Or with PHP
php -S localhost:8000
```

### Adding Features
1. Update HTML structure in `index.html`
2. Add corresponding styles in `styles.css`
3. Implement functionality in `script.js`
4. Test across different browsers and devices

### Print Optimization
The application includes print-specific CSS:
```css
@media print {
    /* Hide navigation and edit forms */
    /* Optimize colors for printing */
    /* Adjust margins and spacing */
}
```

## Troubleshooting

### PDF Generation Issues
- Ensure stable internet connection (for CDN)
- Check browser console for errors
- Try disabling browser extensions
- Use Chrome/Chromium for best results

### Print Quality
- Use "Print Preview" to check layout
- Adjust browser zoom if content is cut off
- Select appropriate paper size (Letter/A4)
- Check print margins in browser settings

### Form Data Loss
- Use the export feature to backup your data
- Browser may clear form data on refresh
- Consider implementing localStorage for persistence

## License

This project is open source and available under the MIT License.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Test in different browsers
4. Create an issue with detailed information

---

**Built with ❤️ for professional invoice generation**