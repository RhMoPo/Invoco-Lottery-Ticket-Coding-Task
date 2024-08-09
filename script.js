class LotteryTicket {
    constructor(numbers) {
        // Initialize the lottery ticket with an array of numbers, or an empty array if none are provided
        this.numbers = numbers || [];
    }

    // Method to generate unique lottery numbers using AJAX, with retry and fallback mechanisms
    generateUniqueNumbers(callback, retries = 5) {
        // Create a new XMLHttpRequest object to fetch random numbers from the API
        const xhr = new XMLHttpRequest();
        
        // Set up the AJAX request to get 7 random numbers between 1 and 49
        xhr.open('GET', 'https://corsproxy.io/?http://www.randomnumberapi.com/api/v1.0/random?min=1&max=49&count=7', true);
        
        // Define what happens when the AJAX request's state changes
        xhr.onreadystatechange = () => {
            // Proceed only when the request is complete
            if (xhr.readyState === 4) {
                // If the request was successful (HTTP status 200)
                if (xhr.status === 200) {
                    // Parse the JSON response to get the array of numbers
                    const numbers = JSON.parse(xhr.responseText);
                    
                    // Create a sorted array of unique numbers from the response
                    let uniqueNumbers = [...new Set(numbers)].sort((a, b) => a - b);

                    // If we have exactly 7 unique numbers, pass them to the callback
                    if (uniqueNumbers.length === 7) {
                        callback(uniqueNumbers);
                    } 
                    // If not enough unique numbers were generated, retry the process
                    else if (retries > 0) {
                        console.warn('Retrying due to insufficient unique numbers');
                        this.generateUniqueNumbers(callback, retries - 1);
                    } 
                    // If all retries fail, use the fallback mechanism to generate the remaining numbers locally
                    else {
                        console.warn('Falling back to local generation due to repeated failures');
                        uniqueNumbers = this.generateFallbackNumbers(uniqueNumbers);
                        callback(uniqueNumbers);
                    }
                } 
                // Log an error if the request fails for any reason
                else {
                    console.error('There was a problem with the fetch operation.');
                }
            }
        };
        
        // Send the AJAX request
        xhr.send();
    }

    // Fallback mechanism to generate the remaining unique numbers locally if the API fails
    generateFallbackNumbers(existingNumbers) {
        // Convert the existing numbers to a Set to ensure uniqueness
        const uniqueNumbers = new Set(existingNumbers);
        
        // Generate and add random numbers until we have 7 unique numbers
        while (uniqueNumbers.size < 7) {
            uniqueNumbers.add(Math.floor(Math.random() * 49) + 1);
        }
        
        // Convert the Set back to a sorted array and return it
        return [...uniqueNumbers].sort((a, b) => a - b);
    }
}

// Array to store all generated lottery tickets
const tickets = [];

// Event listener for the "Generate" button to create a new lottery ticket
document.getElementById('generateBtn').addEventListener('click', () => {
    const ticket = new LotteryTicket();
    
    // Generate unique lottery numbers and update the ticket with them
    ticket.generateUniqueNumbers((numbers) => {
        ticket.numbers = numbers;
        addNewTicket(ticket);
    });
});

// Function to add a new ticket to the tickets array and update the table display
function addNewTicket(ticket) {
    // Add the new ticket to the array
    tickets.push(ticket);
    
    // Add the ticket's details to the table in the UI
    addTicketToTable(ticket, tickets.length - 1);
}

// Function to update the entire tickets table, typically used after a ticket is deleted
function updateTicketsTable() {
    const table = document.getElementById('ticketsTable');
    
    // Clear the current table content
    table.innerHTML = '';
    
    // Re-add all tickets in the array to the table
    tickets.forEach((ticket, index) => {
        addTicketToTable(ticket, index);
    });
}

// Function to delete a ticket from the tickets array and update the table display
function deleteTicket(index) {
    // Remove the ticket from the array based on its index
    tickets.splice(index, 1);
    
    // Update the table to reflect the deletion
    updateTicketsTable();
}

// Function to add a single ticket to the table
function addTicketToTable(ticket, index) {
    const table = document.getElementById('ticketsTable');
    
    // Create a new row for the ticket
    const row = document.createElement('tr');

    // Create and populate the cell showing the ticket number
    const ticketNumberCell = document.createElement('td');
    ticketNumberCell.className = 'py-2 text-center';
    ticketNumberCell.innerText = index + 1;

    // Create and populate the cell showing the lottery numbers
    const numbersCell = document.createElement('td');
    numbersCell.className = 'py-2 text-center';
    numbersCell.innerText = ticket.numbers.join(', ');

    // Create and populate the cell containing the delete button
    const deleteButtonCell = document.createElement('td');
    deleteButtonCell.className = 'py-2 text-center';
    const deleteButton = document.createElement('button');
    deleteButton.className = 'bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded';
    deleteButton.innerText = 'X';
    
    // Set up the delete button to remove the ticket when clicked
    deleteButton.addEventListener('click', () => {
        deleteTicket(index);
    });
    
    // Add the delete button to its cell
    deleteButtonCell.appendChild(deleteButton);

    // Append all cells to the row, and the row to the table
    row.appendChild(ticketNumberCell);
    row.appendChild(numbersCell);
    row.appendChild(deleteButtonCell);
    table.appendChild(row);
}
