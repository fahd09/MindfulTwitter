// Generic error handling
function onError(error) {
    console.log('error')
}

// Default settings
var defaultSettings = {
    lastShown: -1,                  // last timestamp the message was shown
    delay: 2*60*1000,                 // how long before the message is shown again (in ms)
    duration:60*1000                // duration of the message (in ms)
};

// Check if settings already saved, otherwise save them
function checkStoredSettings(storedSettings) {
    if (!storedSettings.lastShown | !storedSettings.delay | !storedSettings.duration) {
        browser.storage.local.set(defaultSettings);
    } 
}
let gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(checkStoredSettings, onError);  

// show the overlay
gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(showOverlay, onError);    


function showOverlay(settings) {
    console.log('ShowOverlay')

    var firstTime = settings.lastShown == -1;
    var afterDelay= (Date.now() - settings.lastShown) > settings.delay;
    
    console.log('firstTime: ' + firstTime)
    console.log('afterDelay: ' + afterDelay)

    // let overlay = '';
    
    if ((firstTime === true) | (firstTime === false & afterDelay === true)){

        const message = `
        Take a moment to reflect on whether you should open Twitter now.
        This will disappear in 60 seconds.
        `
        
        const overlayCss = 'position:fixed;display:block;width:100%;height:100%;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,0.90);z-index:10;'
        const textCss = "position: absolute;top: 50%;left: 50%;font-size: 50px;color: white;transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);";

        const overlay = document.createElement('div');
        overlay.setAttribute('style', overlayCss);
        const overlayTextDiv = document.createElement('div');
        overlayTextDiv.setAttribute('style', textCss);
        const overlayText = document.createTextNode(message);
        overlayTextDiv.appendChild(overlayText);  
        overlay.appendChild(overlayTextDiv);  

        document.body.insertBefore(overlay, document.body.children[0]); 
        
        setTimeout(function(){ 
            browser.storage.local.set({lastShown: Date.now()});
            location.reload();        
        }, settings.duration);    
    } 
}