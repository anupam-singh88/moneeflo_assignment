const Quotation = require('../models/Quotation');
const Product = require('../models/Product');
const { generatePDF } = require('../utils/pdfGenerator');  // Import the generatePDF function

exports.viewQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find({ user: req.user.id }).populate('products');
    const formattedQuotations = quotations.map(quotation => ({
      id: quotation._id,
      date: quotation.date,
      products: quotation.products.map(product => ({
        name: product.name,
        qty: product.qty,
        rate: product.rate,
        gst: product.gst,
      })),
      pdfUrl: `${req.protocol}://${req.get('host')}/api/quotations/pdf/${quotation._id}`
    }));
    res.json(formattedQuotations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.downloadPDF = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id).populate('products');
    if (!quotation) {
      return res.status(404).json({ msg: 'Quotation not found' });
    }

    // Calculate total and GST
    let total = 0;
    quotation.products.forEach(product => {
      total += product.qty * product.rate;
    });
    const gst = total * 0.18;
    const grandTotal = total + gst;

    // Generate PDF
    const html = `
      <html>
        <head>
          <title>Quotation</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { width: 80%; margin: auto; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { margin-top: 20px; text-align: right; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Quotation</h1>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${quotation.products.map(product => `
                  <tr>
                    <td>${product.name}</td>
                    <td>${product.qty}</td>
                    <td>${product.rate}</td>
                    <td>${product.qty * product.rate}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="total">
              <p>Subtotal: ${total.toFixed(2)}</p>
              <p>GST (18%): ${gst.toFixed(2)}</p>
              <p>Grand Total: ${grandTotal.toFixed(2)}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const pdf = await generatePDF(html);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=quotation_${req.params.id}.pdf`);
    res.send(pdf);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
