const LotteryTicket = require('../LotteryTicket'); 

describe('LotteryTicket', () => {
    test('should create an empty numbers array if no numbers are provided', () => {
        const ticket = new LotteryTicket();
        expect(ticket.numbers).toEqual([]);
    });

    test('should use provided numbers', () => {
        const numbers = [1, 2, 3, 4, 5, 6, 7];
        const ticket = new LotteryTicket(numbers);
        expect(ticket.numbers).toEqual(numbers);
    });

    test('should generate unique numbers', (done) => {
        const ticket = new LotteryTicket();
        ticket.generateUniqueNumbers((numbers) => {
            expect(numbers).toHaveLength(7);
            const uniqueNumbers = new Set(numbers);
            expect(uniqueNumbers.size).toBe(7);
            done();
        });
    });
});

// Mocking the DOM
describe('DOM manipulation', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <button id="generateBtn">Generate</button>
            <table id="ticketsTable"></table>
        `;
    });

    test('should add a new ticket to the table', (done) => {
        const ticket = new LotteryTicket([1, 2, 3, 4, 5, 6, 7]);
        addNewTicket(ticket);
        const table = document.getElementById('ticketsTable');
        expect(table.children.length).toBe(1);
        done();
    });

    test('should delete a ticket from the table', (done) => {
        const ticket = new LotteryTicket([1, 2, 3, 4, 5, 6, 7]);
        addNewTicket(ticket);
        deleteTicket(0);
        const table = document.getElementById('ticketsTable');
        expect(table.children.length).toBe(0);
        done();
    });
});
