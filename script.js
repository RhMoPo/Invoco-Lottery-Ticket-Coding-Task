class LotteryTicket {
    constructor(numbers) {
        this.numbers = numbers || [];
    }

    generateUniqueNumbers(callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://corsproxy.io/?http://www.randomnumberapi.com/api/v1.0/random?min=1&max=49&count=7', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const numbers = JSON.parse(xhr.responseText);
                callback(numbers.sort((a, b) => a - b));
            } else if (xhr.readyState === 4) {
                console.error('There was a problem with the fetch operation.');
            }
        };
        xhr.send();
    }
}

const tickets = [];

document.getElementById('generateBtn').addEventListener('click', () => {
    const ticket = new LotteryTicket();
    ticket.generateUniqueNumbers((numbers) => {
        ticket.numbers = numbers;
        addNewTicket(ticket);
    });
});

function addNewTicket(ticket) {
    tickets.push(ticket);
    addTicketToTable(ticket, tickets.length - 1);
}

function updateTicketsTable() {
    const table = document.getElementById('ticketsTable');
    table.innerHTML = ''; // Clear existing table content
    tickets.forEach((ticket, index) => {
        addTicketToTable(ticket, index);
    });
}

function deleteTicket(index) {
    tickets.splice(index, 1);
    updateTicketsTable();
}

function addTicketToTable(ticket, index) {
    const table = document.getElementById('ticketsTable');
    const row = document.createElement('tr');

    const ticketNumberCell = document.createElement('td');
    ticketNumberCell.className = 'py-2 text-center';
    ticketNumberCell.innerText = index + 1;

    const numbersCell = document.createElement('td');
    numbersCell.className = 'py-2 text-center';
    numbersCell.innerText = ticket.numbers.join(', ');

    const deleteButtonCell = document.createElement('td');
    deleteButtonCell.className = 'py-2 text-center';
    const deleteButton = document.createElement('button');
    deleteButton.className = 'bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded';
    deleteButton.innerText = 'X';
    deleteButton.addEventListener('click', () => {
        deleteTicket(index);
    });
    deleteButtonCell.appendChild(deleteButton);

    row.appendChild(ticketNumberCell);
    row.appendChild(numbersCell);
    row.appendChild(deleteButtonCell);
    table.appendChild(row);
}
