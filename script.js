class LotteryTicket {
    constructor(numbers) {
        // If numbers are provided, use them; otherwise, initialize an empty array
        this.numbers = numbers || [];
    }

    // Method to generate unique lottery numbers using AJAX
    generateUniqueNumbers(callback) {
        const xhr = new XMLHttpRequest();
        // Use a CORS proxy to bypass CORS issues
        xhr.open('GET', 'https://corsproxy.io/?http://www.randomnumberapi.com/api/v1.0/random?min=1&max=49&count=7', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Parse the JSON response and sort the numbers
                const numbers = JSON.parse(xhr.responseText);
                callback(numbers.sort((a, b) => a - b));
            } else if (xhr.readyState === 4) {
                console.error('There was a problem with the fetch operation.');
            }
        };
        xhr.send();
    }
}

// Array to store generated lottery tickets
const tickets = [];

// Event listener for the "Generate" button
document.getElementById('generateBtn').addEventListener('click', () => {
    const ticket = new LotteryTicket();
    // Generate unique numbers and add the new ticket
    ticket.generateUniqueNumbers((numbers) => {
        ticket.numbers = numbers;
        addNewTicket(ticket);
    });
});

// Function to add a new ticket to the tickets array and update the table
function addNewTicket(ticket) {
    tickets.push(ticket);
    addTicketToTable(ticket, tickets.length - 1);
}

// Function to update the entire tickets table (used after deletion)
function updateTicketsTable() {
    const table = document.getElementById('ticketsTable');
    table.innerHTML = ''; // Clear existing table content
    tickets.forEach((ticket, index) => {
        addTicketToTable(ticket, index);
    });
}

// Function to delete a ticket from the tickets array and update the table
function deleteTicket(index) {
    tickets.splice(index, 1); // Remove the ticket at the given index
    updateTicketsTable();
}

// Function to add a single ticket to the table
function addTicketToTable(ticket, index) {
    const table = document.getElementById('ticketsTable');
    const row = document.createElement('tr');

    // Create and populate the cell for the ticket number
    const ticketNumberCell = document.createElement('td');
    ticketNumberCell.className = 'py-2 text-center';
    ticketNumberCell.innerText = index + 1;

    // Create and populate the cell for the lottery numbers
    const numbersCell = document.createElement('td');
    numbersCell.className = 'py-2 text-center';
    numbersCell.innerText = ticket.numbers.join(', ');

    // Create and populate the cell for the delete button
    const deleteButtonCell = document.createElement('td');
    deleteButtonCell.className = 'py-2 text-center';
    const deleteButton = document.createElement('button');
    deleteButton.className = 'bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded';
    deleteButton.innerText = 'X';
    deleteButton.addEventListener('click', () => {
        deleteTicket(index);
    });
    deleteButtonCell.appendChild(deleteButton);

    // Append all cells to the row and the row to the table
    row.appendChild(ticketNumberCell);
    row.appendChild(numbersCell);
    row.appendChild(deleteButtonCell);
    table.appendChild(row);
}
