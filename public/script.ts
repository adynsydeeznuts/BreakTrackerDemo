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
        displayBreaks(); // Refresh breaks list
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
        displayBreaks(); // Refresh breaks list
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

document.addEventListener('DOMContentLoaded', displayBreaks);

document.getElementById('break-form')?.addEventListener('submit', addBreak);