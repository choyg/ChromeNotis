const TITLE_ENABLE = "Unblock notifications"
const TITLE_DISABLE = "Block notifications"
const NOTI_SWITCH_KEY = "NOTI_SWITCH_KEY";
const NOTI_SWITCH_ON = 1;
const NOTI_SWITCH_OFF = -1;

/*
	Initialization of storage key/value on install
*/
chrome.runtime.onInstalled.addListener(function(details) {
    var noti = {
        NOTI_SWITCH_KEY: NOTI_SWITCH_ON
    };
    if (details.reason == "install") {
        chrome.storage.local.set(noti);
    }
});

chrome.browserAction.onClicked.addListener(function() {
    switchNotiState();
});

/*
	Handle settings change by calling function to change settings
	and switching the icon (colored and b/w)
*/
chrome.storage.onChanged.addListener(function(changes, areaName) {
    var state = changes.NOTI_SWITCH_KEY.newValue;
    if (state == NOTI_SWITCH_OFF) {
        chrome.browserAction.setIcon({
            path: '/images/disabled19.png'
        });
        chrome.browserAction.setTitle({
            title: TITLE_ENABLE
        });
        setGlobalNotiSetting();
    } else {
        chrome.browserAction.setIcon({
            path: '/images/icon19.png'
        });
        chrome.browserAction.setTitle({
            title: TITLE_DISABLE
        });
        clearSettings();
    }
});

/*
	Changes the notification value in chrome storage
*/
function switchNotiState() {
    chrome.storage.local.get(NOTI_SWITCH_KEY, function(items) {
        var value = items.NOTI_SWITCH_KEY * -1;
        chrome.storage.local.set({
            NOTI_SWITCH_KEY: value
        });
    });
}

function setGlobalNotiSetting() {
    chrome.contentSettings['notifications'].set({
        primaryPattern: '<all_urls>',
        setting: 'block'
    });
}

function clearSettings() {
    chrome.contentSettings['notifications'].clear({
        scope: 'regular'
    });
}
