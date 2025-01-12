const ExcelJS = require('exceljs');
const path = require('path');

const filePath = path.join(__dirname, '../../data/breaks.xlsx');

const readBreaks = async () => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet('Sheet1');
    const breaks = [];
    worksheet.eachRow((row) => {
        breaks.push(row.values);
    });
    return breaks;
};

const addBreak = async (initial, firstTen, thirty, secondTen) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet('Sheet1');
    worksheet.addRow([initial, firstTen, thirty, secondTen]);
    await workbook.xlsx.writeFile(filePath);
};

const removeBreak = async (rowNumber) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet('Sheet1');
    worksheet.spliceRows(rowNumber, 1);
    await workbook.xlsx.writeFile(filePath);
};

module.exports = { readBreaks, addBreak, removeBreak };
