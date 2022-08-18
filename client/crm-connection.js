const _8PLUS_WS_SERVER = 'ws://localhost:8001';

// Create WebSocket connection.
let socket;

function isSellPage() {
    const url = document.URL;
    return url.indexOf('vanzare.php') > -1;
}

function updateBuying(data) {
    const currencySelect = document.querySelector('#primitmoneda');
    currencySelect.focus();
    currencySelect.value = data.currency;
    currencySelect.dispatchEvent(new Event('change'));

    const sumInput = document.querySelector('#sumaprimita');
    sumInput.value = parseInt(data.total);
    sumInput.dispatchEvent(new KeyboardEvent('keydown', {keyCode: 9}));
}

function updateSelling(data) {
    const currencySelect = document.querySelector('#predatmoneda');
    currencySelect.focus();
    currencySelect.value = data.currency;
    currencySelect.dispatchEvent(new Event('change'));

    const sumInput = document.querySelector('#sumapredata');
    sumInput.value = parseInt(data.total);
    sumInput.dispatchEvent(new KeyboardEvent('keydown', {keyCode: 9}));
}

function processBills({data}) {
    const parsedData = JSON.parse(data);

    if (isSellPage()) {
        updateSelling(parsedData)
    } else {
        updateBuying(parsedData);
    }
} 

function connectToServer() {
    socket = new WebSocket(_8PLUS_WS_SERVER);
    socket.onclose = () => {
        console.log('Connection closed! Retrying...');
        setTimeout(connectToServer, 10 * 1000);
    };
    socket.onopen = () => {
        console.log('Connection open!');
    };

    socket.onmessage = (event) => {
        processBills(event);
    }
}

connectToServer();
