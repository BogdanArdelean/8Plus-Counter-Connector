const _8PLUS_WS_SERVER = 'ws://localhost:8001';

// Create WebSocket connection.
let socket;

function isSellPage() {
    const url = document.URL;
    return url.indexOf('vanzare.php') > -1;
}

function notifyBackgroundOfData(data) {
    chrome.runtime.sendMessage(data);
}

function updatePage(data) {
    const currencySelect = document.querySelector('#primitmoneda');
    console.log(currencySelect);
    currencySelect.focus();
    currencySelect.value = data.currency;
    currencySelect.dispatchEvent(new KeyboardEvent('keydown', {keyCode: 9}));
    console.log('here');

    const sumInput = document.querySelector('#sumaprimita');
    console.log(sumInput);
    sumInput.value = parseInt(data.total);
    sumInput.dispatchEvent(new KeyboardEvent('keydown', {keyCode: 9}));
}

function processBills({data}) {
    notifyBackgroundOfData(data);
    
    if (isSellPage()) {
        return;
    }

    updatePage(JSON.parse(data));
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

chrome.runtime.onMessage.addListener(
    function(data, sender, sendResponse) {
        if (isSellPage()) return;

        updatePage(JSON.parse(data));
    }
);

connectToServer();