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
    const { startTime, endTime } = req.body;
    try {
        await excelService.addBreak(startTime, endTime);
        res.status(201).send('Break added');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getBreaks, addBreak };
