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
var _a;
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
        displayBreaks(); // Refresh breaks list
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
        displayBreaks(); // Refresh breaks list
    }
    else {
        console.error('Failed to delete break');
    }
});
const displayBreaks = () => __awaiter(void 0, void 0, void 0, function* () {
    const breaksTable = document.getElementById('breaksTable');
    const breaksTableBody = document.createElement('tbody');
    const breaks = yield fetchBreaks();
    const data = breaks.slice(1);
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
        deleteButton.textContent = 'X';
        deleteButton.addEventListener('mouseup', () => {
            removeBreak(index);
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
document.addEventListener('DOMContentLoaded', displayBreaks);
(_a = document.getElementById('break-form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', addBreak);
