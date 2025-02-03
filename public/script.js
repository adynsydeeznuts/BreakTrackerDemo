import { breakBlock } from './breakBlock.js';
//Method to request break list from breaks.xlsx
const fetchBreaks = async () => {
    const response = await fetch('/api/breaks');
    const breaks = await response.json();
    return breaks;
};
//Method to add a row of breaks to breaks.xlsx
const addBreak = async (event) => {
    event.preventDefault();
    const initial = document.getElementById('repInitial').value;
    const firstTen = document.getElementById('firstTen').value;
    const thirty = document.getElementById('thirty').value;
    const secondTen = document.getElementById('secondTen').value;
    const colour = `${document.getElementById('colourDropdown')?.style.backgroundColor}`;
    const response = await fetch('/api/breaks/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initial, firstTen, thirty, secondTen, colour }),
    });
    if (response.ok) {
        console.log('Break added successfully!');
        displayBreaks();
        displayTimeline();
    }
    else {
        console.error('Failed to add break');
    }
};
//Method to remove row of breaks from breaks.xlsx
const removeBreak = async (rowNumber) => {
    const response = await fetch('/api/breaks/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rowNumber }),
    });
    if (response.ok) {
        console.log('Break deleted successfully!');
        displayBreaks();
        displayTimeline();
    }
    else {
        console.error('Failed to delete break');
    }
};
//Method to refresh the breaks table
const displayBreaks = async () => {
    const breaksTable = document.getElementById('breaksTable');
    const breaksTableBody = document.createElement('tbody');
    const breaks = await fetchBreaks();
    const data = breaks.slice(0);
    //clear the DOM elements within the table 
    const oldTbody = breaksTable.querySelector('tbody');
    if (oldTbody) {
        breaksTable.removeChild(oldTbody);
    }
    //then add them again
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
    breaksTable?.appendChild(breaksTableBody);
};
//method to refresh the breaks timeline
const displayTimeline = async () => {
    const timeline = document.getElementById('timelineBody');
    const timelineHeader = document.getElementById('timelineHeader');
    const startTime = 11;
    const endTime = 24.5;
    const tenIntervals = (endTime - startTime) * 60 / 10;
    const totalMinutes = (endTime - startTime) * 60;
    //remove the break blocks and the time headings
    for (let i = timeline.children.length - 1; i >= 0; i--) {
        timeline?.removeChild(timeline.children[i]);
    }
    for (let i = timelineHeader.children.length - 1; i >= 0; i--) {
        timelineHeader?.removeChild(timelineHeader.children[i]);
    }
    //generate the time columns/headings
    for (let time = startTime; time < endTime; time += 0.5) {
        const colHead = document.createElement('div');
        const colHeadTxt = document.createElement('div');
        colHead.className = "timelineColHead";
        const hours = Math.floor(time);
        const minutes = time % 1 === 0.5 ? 30 : 0;
        const suffix = (hours < 12 || hours >= 24) ? "AM" : "PM";
        const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")}${suffix}`;
        colHeadTxt.textContent = formattedTime;
        colHeadTxt.className = 'timeHeading';
        colHead.appendChild(colHeadTxt);
        timelineHeader?.appendChild(colHead);
    }
    const breaks = await fetchBreaks();
    let breaksList = [];
    let cumulativeWidth = 0;
    //generate a block on the timeline for each break
    breaks.forEach((breakData, index) => {
        const addBreakToTimeline = (startTimeStr, duration) => {
            const cxRep = breakData[1];
            const minutesFromStart = calculateMinutesFromStart(startTimeStr);
            const breakWidth = (duration / totalMinutes) * 100;
            const shiftLeft = (minutesFromStart / totalMinutes) * 100 - cumulativeWidth;
            const colour = `${breakData[5]}`;
            const block = new breakBlock(cxRep, minutesFromStart, duration, breakWidth, shiftLeft, 0, colour, false);
            breaksList.forEach(blocki => {
                if (blocki.overlapping == false && (block.minutesFromStart < blocki.minutesFromStart + blocki.duration && block.minutesFromStart + block.duration >= blocki.minutesFromStart)
                    || (block.minutesFromStart + block.duration > blocki.minutesFromStart && block.minutesFromStart <= blocki.minutesFromStart + blocki.duration)) {
                    block.newLayer();
                }
            });
            breaksList.push(block);
            const blockDiv = document.createElement('div');
            blockDiv.className = 'breakBlock';
            blockDiv.draggable = true;
            //position the break blocks based on their time from the start
            //then adjust their poisition again to negate extra space from the DOM layout
            blockDiv.style.left = `${block.xPos}%`;
            cumulativeWidth += block.breakWidth;
            blockDiv.style.width = `${block.breakWidth}%`;
            blockDiv.style.top = `${block.yPos}px`;
            blockDiv.style.backgroundColor = `${block.colour}`;
            blockDiv.textContent = `${block.cxRep} - ${duration}`;
            blockDiv.addEventListener('dragstart', (e) => {
                const eventTarget = e.target;
                dragged = eventTarget;
            });
            blockDiv.addEventListener('drag', (e) => {
                console.log('dragging');
            });
            blockDiv.addEventListener('dragend', (e) => {
            });
            timeline?.appendChild(blockDiv);
        };
        // Add each break
        if (breakData[2])
            addBreakToTimeline(breakData[2], 10);
        if (breakData[3])
            addBreakToTimeline(breakData[3], 30);
        if (breakData[4])
            addBreakToTimeline(breakData[4], 10);
    });
};
const calculateMinutesFromStart = (startTimeStr) => {
    const startTime = new Date(startTimeStr);
    const timelineStartHour = 11;
    const minutesFromStart = (startTime.getHours() != 0) ?
        (startTime.getHours() - timelineStartHour) * 60 +
            startTime.getMinutes()
        : (24 - timelineStartHour) * 60 + startTime.getMinutes();
    return minutesFromStart;
};
const displayColourPicker = () => {
    const colourOptions = [...document.getElementsByClassName('dropdown-item')];
    const colourDropdown = document.getElementById('colourDropdown');
    colourDropdown.style.backgroundColor = '#ff7300';
    colourDropdown.addEventListener('change', (event) => {
        const selectedOption = colourDropdown.options[colourDropdown.selectedIndex];
        const color = selectedOption.getAttribute('data-color');
        if (color) {
            colourDropdown.style.backgroundColor = color;
        }
    });
    colourOptions.forEach(colourOption => {
        colourOption.style.backgroundColor = `${colourOption.getAttribute('data-color')}`;
    });
};
//call the display functions when the page loads
let dragged;
document.addEventListener('DOMContentLoaded', () => {
    const target = document.getElementById('timelineBody');
    target.addEventListener('dragover', (e) => {
        e.preventDefault();
    }, false);
    target.addEventListener('drop', (e) => {
        const eventTarget = e.target;
        eventTarget.appendChild(dragged);
    });
    displayBreaks();
    displayTimeline();
    displayColourPicker();
    document.getElementById('breakForm')?.addEventListener('submit', addBreak);
});
