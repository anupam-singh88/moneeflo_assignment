const Quotation = require('../models/Quotation');
const Product = require('../models/Product');
const { generatePDF, generateImage } = require('../utils/pdfGenerator');
const { validateProduct, checkValidationResult } = require('../utils/validate');

exports.addProducts = [
  ...validateProduct,
  checkValidationResult,
  async (req, res) => {
    const { products, format } = req.body;
    try {
      const productList = products.map(product => ({
        ...product,
        gst: product.rate * 0.18,
      }));

      const savedProducts = await Product.insertMany(productList);
      const productIds = savedProducts.map(product => product._id);

      const quotation = new Quotation({
        user: req.user.id,
        products: productIds,
        date: new Date(),
      });
      await quotation.save();

      // Calculate total, gst, and grand total
      let total = 0;
      savedProducts.forEach(product => {
        total += product.qty * product.rate;
      });
      const gst = total * 0.18;
      const grandTotal = total + gst;

      // Generate HTML for PDF/IMAGE
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
                        .total p { margin: 5px 0; }
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
                                ${savedProducts.map(product => `
                                    <tr>
                                        <td>${product.name}</td>
                                        <td>${product.qty}</td>
                                        <td>${product.rate}</td>
                                        <td>${(product.qty * product.rate).toFixed(2)}</td>
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

      let responseFile;
      if (format === 'pdf') {
        responseFile = await generatePDF(html);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=quotation.pdf');
      } else if (format === 'image') {
        responseFile = await generateImage(html);
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename=quotation.png');
      } else {
        return res.status(400).send('Invalid format requested');
      }

      res.send(responseFile);
    } catch (err) {
      console.error('Generation Error:', err.message);
      res.status(500).send('Server Error');
    }
  }
];
