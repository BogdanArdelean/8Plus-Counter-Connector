function isBuyTab(tab) {
    if (!tab) return false;

    return tab.url.indexOf('cumparare.php') > -1;
}

async function getAnyBuyTab() {
    const tabs = await chrome.tabs.query({title: 'Exchange CRM'});

    let length = tabs ? tabs.length : 0;
    for (let i = 0; i < length; ++i) {
        const tab = tabs[i];

        if (isBuyTab(tab)) {
            return tab;
        }
    }

    return null;
}

async function navigateToBuy(tab) {
    const resultTab = await chrome.tabs.update(tab.id, {
        highlighted: true, 
        url: tab.url.replace('vanzare.php', 'cumparare.php')
    });

    return resultTab;
}

async function select(tab) {
    const resultTab = await chrome.tabs.update(tab.id, {
        highlighted: true, 
    });

    return resultTab;
}

async function getActiveTab() {
    return await chrome.tabs.query({active: true});
}

let theOnlyOneSellTab = null;
let preservedData = null;

chrome.runtime.onMessage.addListener(
     async function(data, sender, sendResponse) {
        const buyTab = await getAnyBuyTab();
        const activeTab = await getActiveTab();
        
        if (buyTab) {
            if (!isBuyTab(activeTab)) {
                await select(buyTab);
            }
        }

        theOnlyOneSellTab = sender.tab;
        preservedData = data;
        await navigateToBuy(sender.tab);
    }
);

chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    if (tab?.id == theOnlyOneSellTab?.id && changeInfo.status == 'complete') {
        await chrome.tabs.sendMessage(tab.id, preservedData);
    }
});
