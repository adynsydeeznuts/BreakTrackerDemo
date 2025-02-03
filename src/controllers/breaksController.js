const excelService = require('../services/excelService');

const getBreaks = async (req, res) => {
    try {
        const data = await excelService.readBreaks();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addBreak = async (req, res) => {
    const { initial, firstTen, thirty, secondTen, colour } = req.body;
    try {
        await excelService.addBreak(initial, firstTen, thirty, secondTen, colour);
        res.status(201).send('Break added');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const removeBreak = async (req, res) => {
    const {rowNumber} = req.body;
    try {
        await excelService.removeBreak(rowNumber);
        res.status(200).send('Break deleted');
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

module.exports = { getBreaks, addBreak, removeBreak };
