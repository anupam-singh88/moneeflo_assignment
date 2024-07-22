const puppeteer = require('puppeteer');

const generatePDF = async (html) => {
    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' }); // Wait until network is idle
        const pdf = await page.pdf({ format: 'A4', timeout: 60000 }); // Increase timeout to 60 seconds
        await browser.close();
        return pdf;
    } catch (error) {
        console.error('Error generating PDF:', error.message);
        throw new Error('PDF Generation Failed');
    }
};

const generateImage = async (html) => {
    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' }); // Wait until network is idle
        const screenshot = await page.screenshot({ type: 'png', fullPage: true, timeout: 60000 }); // Increase timeout to 60 seconds
        await browser.close();
        return screenshot;
    } catch (error) {
        console.error('Error generating Image:', error.message);
        throw new Error('Image Generation Failed');
    }
};

module.exports = {
    generatePDF,
    generateImage
};
