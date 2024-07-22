const mongoose = require('mongoose');

const QuotationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    date: { type: Date, default: Date.now },
    pdfUrl: { type: String },
});

module.exports = mongoose.model('Quotation', QuotationSchema);
