"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fetchBreaks = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch('/api/breaks');
    const breaks = yield response.json();
    return breaks;
});
const addBreak = (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const initial = document.getElementById('repInitial').value;
    const firstTen = document.getElementById('firstTen').value;
    const thirty = document.getElementById('thirty').value;
    const secondTen = document.getElementById('secondTen').value;
    const response = yield fetch('/api/breaks/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initial, firstTen, thirty, secondTen }),
    });
    if (response.ok) {
        console.log('Break added successfully!');
        displayBreaks();
    }
    else {
        console.error('Failed to add break');
    }
});
const removeBreak = (rowNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch('/api/breaks/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rowNumber }),
    });
    if (response.ok) {
        console.log('Break deleted successfully!');
        displayBreaks();
    }
    else {
        console.error('Failed to delete break');
    }
});
const displayBreaks = () => __awaiter(void 0, void 0, void 0, function* () {
    const breaksTable = document.getElementById('breaksTable');
    const breaksTableBody = document.createElement('tbody');
    const breaks = yield fetchBreaks();
    const data = breaks.slice(0);
    const oldTbody = breaksTable.querySelector('tbody');
    if (oldTbody) {
        breaksTable.removeChild(oldTbody);
    }
    data.forEach((element, index) => {
        const row = document.createElement('tr');
        const cell1 = document.createElement('td');
        cell1.textContent = element[1];
        const cell2 = document.createElement('td');
        cell2.textContent = element[2].toString().slice(11);
        const cell3 = document.createElement('td');
        cell3.textContent = element[3].toString().slice(11);
        const cell4 = document.createElement('td');
        cell4.textContent = element[4].toString().slice(11);
        const cell5 = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.className = "btn btn-danger";
        deleteButton.textContent = 'X';
        deleteButton.addEventListener('mouseup', () => {
            removeBreak(index + 1);
        });
        cell5.appendChild(deleteButton);
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);
        row.appendChild(cell5);
        breaksTableBody.appendChild(row);
    });
    breaksTable === null || breaksTable === void 0 ? void 0 : breaksTable.appendChild(breaksTableBody);
});
const displayTimeline = () => __awaiter(void 0, void 0, void 0, function* () {
    const timeline = document.getElementById('timelineBody');
    const timelineHeader = document.getElementById('timelineHeader');
    const startTime = 11;
    const endTime = 24.5;
    const tenIntervals = (endTime - startTime) * 60 / 10;
    const totalMinutes = (endTime - startTime) * 60;
    // for(let i=0; i < tenIntervals; i++) {
    //     const col = document.createElement('div');
    //     col.className = "timelineColumn";
    //     timeline?.appendChild(col);
    // }
    for (let time = startTime; time < endTime; time += 0.5) {
        const colHead = document.createElement('div');
        colHead.className = "timelineColHead";
        const hours = Math.floor(time);
        const minutes = time % 1 === 0.5 ? 30 : 0;
        const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")}${hours >= 12 ? "PM" : "AM"}`;
        colHead.textContent = formattedTime;
        timelineHeader === null || timelineHeader === void 0 ? void 0 : timelineHeader.appendChild(colHead);
    }
    const breaks = yield fetchBreaks();
    let cumulativeWidth = 0;
    breaks.forEach((breakData) => {
        const addBreakToTimeline = (startTimeStr, duration) => {
            const startTime = new Date(startTimeStr);
            const timelineStartHour = 11;
            const minutesFromStart = (startTime.getHours() - timelineStartHour) * 60 +
                startTime.getMinutes();
            const breakWidth = (duration / totalMinutes) * 100;
            const block = document.createElement('div');
            block.className = 'breakBlock';
            block.style.left = `${(minutesFromStart / totalMinutes) * 100 - cumulativeWidth}%`;
            cumulativeWidth += breakWidth;
            block.style.width = `${breakWidth}%`;
            block.textContent = `${breakData[1]} - ${duration}`;
            timeline === null || timeline === void 0 ? void 0 : timeline.appendChild(block);
        };
        // Add each break
        if (breakData[2])
            addBreakToTimeline(breakData[2], 10);
        if (breakData[3])
            addBreakToTimeline(breakData[3], 30);
        if (breakData[4])
            addBreakToTimeline(breakData[4], 10);
    });
});
document.addEventListener('DOMContentLoaded', () => {
    var _a;
    displayBreaks();
    displayTimeline();
    (_a = document.getElementById('breakForm')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', addBreak);
});
