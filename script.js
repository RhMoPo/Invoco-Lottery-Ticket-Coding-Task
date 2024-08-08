class LotteryTicket {
    constructor() {
        this.numbers = this.generateUniqueNumbers();
    }

    generateUniqueNumbers() {
        const numbers = new Set();
        while (numbers.size < 7) {
            numbers.add(Math.floor(Math.random() * 49) + 1);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }
}

document.getElementById('generateBtn').addEventListener('click', () => {
    const ticket = new LotteryTicket();
    addTicketToTable(ticket);
});

function addTicketToTable(ticket) {
    const table = document.getElementById('ticketsTable');
    const row = document.createElement('tr');

    const ticketNumberCell = document.createElement('td');
    ticketNumberCell.className = 'py-2 text-center';
    ticketNumberCell.innerText = table.rows.length + 1;

    const numbersCell = document.createElement('td');
    numbersCell.className = 'py-2 text-center';
    numbersCell.innerText = ticket.numbers.join(', ');

    row.appendChild(ticketNumberCell);
    row.appendChild(numbersCell);
    table.appendChild(row);
}
