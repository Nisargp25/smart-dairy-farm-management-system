const Animal = require('../models/Animal');
const MilkProduction = require('../models/MilkProduction');
const Vaccination = require('../models/Vaccination');
const Expense = require('../models/Expense');
const Income = require('../models/Income');
const PdfPrinter = require('pdfmake');
const path = require('path');
const fs = require('fs');

const fonts = {
  Roboto: {
    normal: path.join(__dirname, '../../node_modules/pdfmake/build/vfs_fonts.js'),
    bold: path.join(__dirname, '../../node_modules/pdfmake/build/vfs_fonts.js'),
    italics: path.join(__dirname, '../../node_modules/pdfmake/build/vfs_fonts.js'),
    bolditalics: path.join(__dirname, '../../node_modules/pdfmake/build/vfs_fonts.js'),
  },
};

const buildTableBody = (headers, rows) => {
  const body = [headers.map(h => ({ text: h, style: 'tableHeader' }))];
  rows.forEach(row => body.push(row.map(cell => ({ text: String(cell ?? ''), style: 'tableRow' }))));
  return body;
};

// @GET /api/reports/:type
const generateReport = async (req, res, next) => {
  try {
    const { type } = req.params;
    const { startDate, endDate } = req.query;
    const ownerId = req.user._id;
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    const dateQuery = Object.keys(dateFilter).length ? { date: dateFilter } : {};

    const currentDate = new Date().toLocaleDateString('en-IN');
    let docDefinition;

    const headerStyle = { fontSize: 18, bold: true, color: '#166534', margin: [0, 0, 0, 10] };
    const subHeaderStyle = { fontSize: 13, bold: true, color: '#15803d', margin: [0, 10, 0, 5] };

    const styles = {
      tableHeader: { bold: true, fillColor: '#166534', color: 'white', fontSize: 10, margin: [2, 4, 2, 4] },
      tableRow: { fontSize: 9, margin: [2, 3, 2, 3] },
    };

    if (type === 'milk') {
      const records = await MilkProduction.find({ owner: ownerId, ...dateQuery }).populate('animal', 'name animalId').sort({ date: -1 });
      const totalMilk = records.reduce((s, r) => s + r.totalAmount, 0);
      const rows = records.map(r => [
        new Date(r.date).toLocaleDateString('en-IN'),
        r.animal?.name || '-',
        r.animal?.animalId || '-',
        `${r.morningAmount} L`,
        `${r.eveningAmount} L`,
        `${r.totalAmount} L`,
      ]);

      docDefinition = {
        content: [
          { text: 'Smart Dairy Farm Management System', style: headerStyle },
          { text: 'Milk Production Report', style: subHeaderStyle },
          { text: `Generated: ${currentDate}`, fontSize: 9, color: '#6b7280', margin: [0, 0, 0, 15] },
          { text: `Total Milk Produced: ${totalMilk.toFixed(2)} Litres`, bold: true, margin: [0, 0, 0, 10], color: '#166534' },
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
              body: buildTableBody(['Date', 'Animal', 'ID', 'Morning', 'Evening', 'Total'], rows),
            },
          },
        ],
        styles,
      };
    } else if (type === 'financial') {
      const expenses = await Expense.find({ owner: ownerId, ...dateQuery }).sort({ date: -1 });
      const incomes = await Income.find({ owner: ownerId, ...dateQuery }).sort({ date: -1 });
      const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
      const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);

      docDefinition = {
        content: [
          { text: 'Smart Dairy Farm Management System', style: headerStyle },
          { text: 'Financial Report', style: subHeaderStyle },
          { text: `Generated: ${currentDate}`, fontSize: 9, color: '#6b7280', margin: [0, 0, 0, 10] },
          { text: `Total Income: ₹${totalIncome.toFixed(2)}   |   Total Expenses: ₹${totalExpense.toFixed(2)}   |   Net Profit: ₹${(totalIncome - totalExpense).toFixed(2)}`, bold: true, margin: [0, 0, 0, 15], color: '#166534' },
          { text: 'Income Records', style: subHeaderStyle },
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', 'auto', 'auto'],
              body: buildTableBody(['Date', 'Description', 'Category', 'Amount (₹)'], incomes.map(i => [new Date(i.date).toLocaleDateString('en-IN'), i.description, i.category, i.amount.toFixed(2)])),
            },
            margin: [0, 0, 0, 15],
          },
          { text: 'Expense Records', style: subHeaderStyle },
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', 'auto', 'auto'],
              body: buildTableBody(['Date', 'Description', 'Category', 'Amount (₹)'], expenses.map(e => [new Date(e.date).toLocaleDateString('en-IN'), e.description, e.category, e.amount.toFixed(2)])),
            },
          },
        ],
        styles,
      };
    } else if (type === 'health') {
      const animals = await Animal.find({ owner: ownerId });
      const vaccinations = await Vaccination.find({ owner: ownerId, ...dateQuery }).populate('animal', 'name animalId').sort({ date: -1 });

      docDefinition = {
        content: [
          { text: 'Smart Dairy Farm Management System', style: headerStyle },
          { text: 'Animal Health Report', style: subHeaderStyle },
          { text: `Generated: ${currentDate}`, fontSize: 9, color: '#6b7280', margin: [0, 0, 0, 10] },
          { text: 'Animal Status Summary', style: subHeaderStyle },
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', 'auto', 'auto', 'auto'],
              body: buildTableBody(['ID', 'Name', 'Breed', 'Age', 'Health Status'], animals.map(a => [a.animalId, a.name, a.breed, `${a.age} yrs`, a.healthStatus])),
            },
            margin: [0, 0, 0, 15],
          },
          { text: 'Vaccination Records', style: subHeaderStyle },
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', '*', 'auto', 'auto'],
              body: buildTableBody(['Date', 'Animal', 'Vaccine', 'Administered By', 'Next Due'], vaccinations.map(v => [new Date(v.date).toLocaleDateString('en-IN'), v.animal?.name || '-', v.vaccineName, v.administeredBy || '-', v.nextDueDate ? new Date(v.nextDueDate).toLocaleDateString('en-IN') : '-'])),
            },
          },
        ],
        styles,
      };
    } else {
      return res.status(400).json({ success: false, message: 'Invalid report type. Use: milk, financial, or health' });
    }

    const printer = new PdfPrinter(fonts);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${type}-report-${Date.now()}.pdf"`);
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (err) { next(err); }
};

module.exports = { generateReport };
