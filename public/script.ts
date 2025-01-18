const fetchBreaks = async () => {
    const response= await fetch('/api/breaks');
    const breaks = await response.json();
    return breaks;
};

const addBreak = async (event: Event) => {
    event.preventDefault();
    const initial = (document.getElementById('repInitial') as HTMLInputElement).value;
    const firstTen = (document.getElementById('firstTen') as HTMLInputElement).value;
    const thirty = (document.getElementById('thirty') as HTMLInputElement).value;
    const secondTen = (document.getElementById('secondTen') as HTMLInputElement).value;

    const response = await fetch('/api/breaks/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({initial, firstTen, thirty, secondTen }),
    });

    if (response.ok) {
        console.log('Break added successfully!');
        displayBreaks();
        displayTimeline();
    } else {
        console.error('Failed to add break');
    }
};

const removeBreak = async (rowNumber : number) => {
    const response = await fetch('/api/breaks/delete', {
        method: 'DELETE',
        headers:  { 'Content-Type': 'application/json' },
        body: JSON.stringify({rowNumber}),
    });

    if (response.ok) {
        console.log('Break deleted successfully!');
        displayBreaks();
        displayTimeline();
    } else {
        console.error('Failed to delete break');
    }
}

const displayBreaks = async () => {
    const breaksTable = document.getElementById('breaksTable') as  HTMLTableElement; 
    const breaksTableBody = document.createElement('tbody');

    const breaks = await fetchBreaks();
    const data: string[] = breaks.slice(0);

    const oldTbody = breaksTable.querySelector('tbody');
    if (oldTbody) {
        breaksTable.removeChild(oldTbody);
    }

    data.forEach((element: any, index : number) => {
        const row = document.createElement('tr')

        const cell1 = document.createElement('td');
        cell1.textContent = element[1];

        const cell2 = document.createElement('td');
        cell2.textContent = element[2].toString().slice(11);

        const cell3 = document.createElement('td');
        cell3.textContent = element[3].toString().slice(11);

        const cell4 = document.createElement('td');
        cell4.textContent = element[4].toString().slice(11);

        const cell5 = document.createElement('td');
        const deleteButton : any = document.createElement('button');
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
}

const displayTimeline = async () => {
    const timeline = document.getElementById('timelineBody');
    const timelineHeader = document.getElementById('timelineHeader');
    const startTime = 11; const endTime = 24.5;
    const tenIntervals = (endTime - startTime) * 60 / 10;
    const totalMinutes = (endTime - startTime) * 60;

    for (let i = timeline!.children.length - 1; i >= 0; i--) {
        timeline?.removeChild(timeline.children[i]);
    }

    for (let i = timelineHeader!.children.length - 1; i >= 0; i--) {
        timelineHeader?.removeChild(timelineHeader.children[i]);
    }

    // for(let i=0; i < tenIntervals; i++) {
    //     const col = document.createElement('div');
    //     col.className = "timelineColumn";
    //     timeline?.appendChild(col);
    // }

    for(let time = startTime; time < endTime; time += 0.5) {
        const colHead = document.createElement('div');
        const colHeadTxt = document.createElement('div');
        colHead.className = "timelineColHead";
        const hours = Math.floor(time);
        const minutes = time % 1 === 0.5 ? 30 : 0;
        const suffix = (hours < 12 || hours >= 24) ? "AM" : "PM";
        const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")}${suffix}`
        colHeadTxt.textContent = formattedTime;
        colHeadTxt.className = 'timeHeading';
        colHead.appendChild(colHeadTxt);
        timelineHeader?.appendChild(colHead);
    }

    const breaks = await fetchBreaks();
    let cumulativeWidth = 0;
    breaks.forEach((breakData: any, index: number) => {
        const addBreakToTimeline = (startTimeStr: string, duration: number) => {
            const minutesFromStart = calculateMinutesFromStart(startTimeStr);                
            const breakWidth = (duration / totalMinutes) * 100;

            const block = document.createElement('div');
            block.className = 'breakBlock';

            block.style.left = `${(minutesFromStart / totalMinutes) * 100 - cumulativeWidth}%`
            cumulativeWidth += breakWidth;

            block.style.width = `${breakWidth}%`;
            block.style.top = `${65 * index}px`;
            block.textContent = `${breakData[1]} - ${duration}`;



            timeline?.appendChild(block);
        };

        // Add each break
        if (breakData[2]) addBreakToTimeline(breakData[2], 10);
        if (breakData[3]) addBreakToTimeline(breakData[3], 30);
        if (breakData[4]) addBreakToTimeline(breakData[4], 10);
    });
    
}

const calculateMinutesFromStart = (startTimeStr: string) => {
    const startTime = new Date(startTimeStr);
    const timelineStartHour = 11;
    const minutesFromStart = (startTime.getHours() != 0) ? 
    (startTime.getHours() - timelineStartHour) * 60 +
        startTime.getMinutes()
    : (24 - timelineStartHour) * 60 + startTime.getMinutes();
    
    return minutesFromStart;
}

document.addEventListener('DOMContentLoaded', () => {
    displayBreaks();
    displayTimeline();
    document.getElementById('breakForm')?.addEventListener('submit', addBreak);
});