//Prepare Loading settings ----------------------------------------------------
var optionFormTheme = "optionThemeDefault";
var startupOptionFormTheme = "optionThemeDefault";

var optionThemeFull = "optionFormFullFalse";

async function onError(error) {
    //console.log(`Error: ${error}`);
    //not needed in release
    optionFormTheme = "errorLoading";
}

async function onError2(error) {
    //console.log(`Error: ${error}`);
    //not needed in release
}
async function onGot(item) {
    if (item.optionFormTheme) {
        optionFormTheme = item.optionFormTheme;
        startupOptionFormTheme = item.optionFormTheme;
    }
}

async function onGot2(item) {
    if (item.optionThemeFull) {
        optionThemeFull = item.optionThemeFull;
    }
}

var getSetting = browser.storage.sync.get("optionFormTheme");
getSetting.then(onGot, onError);

var getSetting2 = browser.storage.sync.get("optionThemeFull");
getSetting2.then(onGot2, onError2);

//---------------------------------------------------------------------
//Reload settings

async function onGotReload(item) {
    if (item.optionFormTheme) {
        optionFormTheme = item.optionFormTheme;
    }
}

async function onGotReload2(item) {
    if (item.optionThemeFull) {
        optionThemeFull = item.optionThemeFull;
    }
}

async function reloadSettings() {
    getSetting = await browser.storage.sync.get("optionFormTheme").then(onGotReload, onError);
    getSetting2 = await browser.storage.sync.get("optionThemeFull").then(onGotReload2, onError2);
}

//---------------------------------------------------------------------

var platformOS = "unknown";

//"mac" "win" "linux" "openbsd" "cros" "android" 
browser.runtime.getPlatformInfo().then((info) => {platformOS = info.os;});

//---------------------------------------------------------------------

var alreadyTurnedRed = false;
var themeImportedSet = false;
var tmpThemeImportedSet = false;
var themeSetbyMe = false;

var themeRed = {
    "colors": {
        //Full theme list
        "accentcolor": null,
        "bookmark_text": null,
        "button_background_active": null,
        "button_background_hover": null,
        "frame": null,
        "frame_inactive": null,
        "icons": null,
        "icons_attention": null,
        "ntp_background": null,
        "ntp_text": null,
        "popup": null,
        "popup_border": null,
        "popup_highlight": null,
        "popup_highlight_text": null,
        "popup_text": null,
        "sidebar": null,
        "sidebar_highlight": null,
        "sidebar_highlight_text": null,
        "sidebar_text": null,
        "tab_background_separator": null,
        "tab_background_text": null,
        "tab_line": null,
        "tab_loading": null,
        "tab_selected": null,
        "tab_text": null,
        "textcolor": null,
        "toolbar": null,
        "toolbar_bottom_separator": null,
        "toolbar_field_border": null,
        "toolbar_field_border_focus": null,
        "toolbar_field_focus": null,
        "toolbar_field_separator": null,
        "toolbar_field_text_focus": null,
        "toolbar_text": null,
        "toolbar_top_separator": null,
        "toolbar_vertical_separator": null,
        //Red patch 
        "toolbar_field": "#df5151",
        "toolbar_field_text": "#ffffff"
    }
}

var themeRedFull = {
    "colors": {
        "accentcolor": "#a71423",
        "textcolor": "#ffffff",
        "toolbar": "#ff0000",
        "toolbar_field_text": "#ffffff",
        "toolbar_field": "#df5151"
    }
}

var themeImported = {
    "colors": {}
}

var tmpThemeImported = {
    "colors": {
        "toolbar_field_text": null,
        "toolbar_field": null
    }
}

//id: "firefox-compact-dark@mozilla.org"
var defaultThemeDark = { 
    "colors": {
        //https://searchfox.org/mozilla-central/source/browser/components/nsBrowserGlue.js
        //"id": "firefox-compact-dark@mozilla.org",
        //"name": gBrowserBundle.GetStringFromName("darkTheme.name"),
        //"description": gBrowserBundle.GetStringFromName("darkTheme.description"),
        //"iconURL": "resource:///chrome/browser/content/browser/defaultthemes/dark.icon.svg",
        //"author": vendorShortName,
        //"sidebar_border": "rgba(255, 255, 255, 0.1)",     //sidebar_border    //Does not exist in this api
        "toolbar": "hsl(240, 1%, 20%)",                     //toolbarColor      //Does not exist in this api
        "textcolor": "rgb(249, 249, 250)",
        "icons": "rgb(249, 249, 250, 0.7)",
        "accentcolor": "hsl(240, 5%, 5%)",
        "popup": "#4a4a4f",
        "popup_text": "rgb(249, 249, 250)",
        "popup_border": "#27272b",
        "tab_line": "#0a84ff",
        "toolbar_bottom_separator": "hsl(240, 5%, 5%)", 
        "toolbar_field_border": "rgba(249, 249, 250, 0.2)",
        "toolbar_field_separator": "#5F6670",
        "ntp_background": "#2A2A2E",
        "ntp_text": "rgb(249, 249, 250)",
        "sidebar": "#38383D",
        "sidebar_text": "rgb(249, 249, 250)",
        "toolbar_field": "rgb(71, 71, 73)",
        "toolbar_field_text": "rgb(249, 249, 250)"
    }
}

// id: "firefox-compact-light@mozilla.org"
var defaultThemeLight = { 
    "colors": {
        //https://searchfox.org/mozilla-central/source/browser/components/nsBrowserGlue.js
        //"id: "firefox-compact-light@mozilla.org",
        //"name": gBrowserBundle.GetStringFromName("lightTheme.name"),
        //"description": gBrowserBundle.GetStringFromName("lightTheme.description"),
        //"iconURL": "resource:///chrome/browser/content/browser/defaultthemes/light.icon.svg",
        //"author": vendorShortName,
        "textcolor": "rgb(24, 25, 26)",
        "icons": "rgb(24, 25, 26, 0.7)",    //icon_color //Does not exist in this api
        "accentcolor": "#E3E4E6",
        "popup": "#fff",
        "popup_text": "#0c0c0d",
        "popup_border": "#ccc",
        "tab_line": "#0a84ff",
        "toolbar": "#f5f6f7",               //toolbarColor //Does not exist in this api
        "toolbar_bottom_separator": "#ccc",
        "toolbar_field_border": "#ccc",
        "toolbar_field": "#fff",
        "toolbar_field_text": null
    }
}

// id: "default-theme@mozilla.org"
//https://searchfox.org/mozilla-central/source/browser/themes/osx/browser.css
//https://searchfox.org/mozilla-central/source/browser/themes/linux/browser.css
//https://searchfox.org/mozilla-central/source/browser/themes/windows/browser.css
//https://searchfox.org/mozilla-central/source/browser/themes/shared/browser.inc.css
var defaultThemeDefault = {
    //Can not or hardly be retreived
    //Collected 3 platform themes
    "colors": {
    }
}

// id: "default-theme@mozilla.org" Windows
//https://addons.mozilla.org/en-US/firefox/addon/normal-theme/
var defaultThemeDefaultWin = {
    "colors": {
        "accentcolor": "rgba(20, 21, 59, 0.93)",
        "textcolor": "rgba(255, 255, 255, 1)",
        "toolbar": "rgba(227, 227, 227, 1)",
        "toolbar_text": "rgba(0, 0, 0, 1)",
        "toolbar_field_text": "rgba(0, 0, 0, 1)"
    }
}

// id: "default-theme@mozilla.org" Mac
// https://addons.mozilla.org/en-US/firefox/addon/macos-sierra-dark/
var defaultThemeDefaultMac = {
    "colors": {
        "accentcolor": "#bababa",
        "textcolor": "#f7f4f4",
        "icons": "#18191b",
        "toolbar": "#19191b",
        "toolbar_field_text": "#ffffff",
        "toolbar_field": "#18191a"
    }
}

// id: "default-theme@mozilla.org" Linux
// Captured
var defaultThemeDefaultLin = {
    "colors": {
        "accentcolor": "#31363b",
        "textcolor": "#eff0f1",
        "toolbar": "#4f5358",
        "toolbar_field_text": "#e2e3e4",
        "toolbar_field": "#232629",
        "popup": "#232629",
        "popup_text": "#eff0f1",
        "popup_border": "#616569",
        
        //Imported from dark
        "icons": "rgb(249, 249, 250, 0.7)", //"icons": "#d7d8da", //Captured
        "tab_line": "#0a84ff",
        "toolbar_field_separator": "#5F6670",
        "toolbar_bottom_separator": "hsl(240, 5%, 5%)", 
        "toolbar_field_border": "rgba(249, 249, 250, 0.2)",
        "sidebar": "#38383D",
        "sidebar_text": "rgb(249, 249, 250)",
        "ntp_background": "#2A2A2E",        //real default is white... but...
        "ntp_text": "rgb(249, 249, 250)"    //...
        
        //From black theme
        //"textcolor": "rgb(249, 249, 250)",
    }
}

async function getStyle(themeInfo) 
{
 
    var settingsChanged = false;
    
    //Relead settings
    await reloadSettings();
    
    if (optionFormTheme != startupOptionFormTheme) {
        settingsChanged = true;
        startupOptionFormTheme = optionFormTheme;
    }
    
    //TODO CASE when settings changed then other theme applied 
    if (((themeInfo.colors) && (settingsChanged == false)) || ((themeInfo.colors) && (optionFormTheme == "optionThemeOther"))) 
    {
        //Case custom non integrated theme 
        //console.log(themeInfo.colors);
        //console.log(optionFormTheme);
        
        // Backup real custom theme
        if (themeInfo.colors.toolbar_field != "#df5151") {
            themeImported.colors = themeInfo.colors;
            themeImportedSet = true;
        }
        
        // Backup real custom theme played field
        if (themeInfo.colors.toolbar_field != "#df5151") {
            tmpThemeImported.colors.toolbar_field = themeInfo.colors.toolbar_field;
            tmpThemeImportedSet = true;
        } 
        
        // Backup real custom theme played field
        if (themeInfo.colors.toolbar_field_text != "#ffffff") {
            tmpThemeImported.colors.toolbar_field_text = themeInfo.colors.toolbar_field_text;
            tmpThemeImportedSet = true;
        }
        
        //Pointeur assignement have to copy field by field
        themeRed.colors = themeInfo.colors;
        themeRed.colors.toolbar_field_text = "#ffffff";
        themeRed.colors.toolbar_field = "#df5151";       

    } 
    else {
        //Case custom 3 integrated theme fu**ing with different inaccessible api (probably wontfix) 
        //https://bugzilla.mozilla.org/show_bug.cgi?id=1414512
        //https://bugzilla.mozilla.org/show_bug.cgi?id=1386004
                
        //Reser settings
        //themeRed.colors = themeRedFull.colors;
        
        //console.log(themeInfo.colors);
        //console.log(optionFormTheme);

        if (optionFormTheme == "optionThemeDefault") {  //default-theme@mozilla.org
            
            if ((platformOS == "linux") || (platformOS == "openbsd") || (platformOS == "cros")) {
                themeRed.colors = defaultThemeDefaultLin.colors;
                themeImported.colors = defaultThemeDefaultLin.colors;
                tmpThemeImported.colors.toolbar_field = defaultThemeDefaultLin.colors.toolbar_field;
                tmpThemeImported.colors.toolbar_field_text = defaultThemeDefaultLin.colors.toolbar_field_text;
                themeRed.colors.toolbar_field_text = "#ffffff";
                themeRed.colors.toolbar_field = "#df5151";
            }

            if (platformOS == "mac") {
                themeRed.colors = defaultThemeDefaultMac.colors;
                themeImported.colors = defaultThemeDefaultMac.colors;
                tmpThemeImported.colors.toolbar_field = defaultThemeDefaultMac.colors.toolbar_field;
                tmpThemeImported.colors.toolbar_field_text = defaultThemeDefaultMac.colors.toolbar_field_text;
                themeRed.colors.toolbar_field_text = "#ffffff";
                themeRed.colors.toolbar_field = "#df5151";
            }

            if (platformOS == "win") {
                themeRed.colors = defaultThemeDefaultWin.colors;
                themeImported.colors = defaultThemeDefaultWin.colors;
                tmpThemeImported.colors.toolbar_field = defaultThemeDefaultWin.colors.toolbar_field;
                tmpThemeImported.colors.toolbar_field_text = defaultThemeDefaultWin.colors.toolbar_field_text;
                themeRed.colors.toolbar_field_text = "#ffffff";
                themeRed.colors.toolbar_field = "#df5151";
            }     
            
            if (platformOS == "android") {
                //Handled as full red
                optionFormTheme = "errorLoading";
            }
            
            if (platformOS == "unknown") {
                //Handled as full red
                optionFormTheme = "errorLoading";
            }
            
            //No need to set themeImported
            //No need to set tmpThemeImported
            //They are null here and thus theme will be reset :) to cking default :1
        }
        
        if (optionFormTheme == "errorLoading") {
            themeRed.colors = themeRedFull.colors;
        }
        
        if (optionFormTheme == "optionThemeLight") {    //firefox-compact-light@mozilla.org
            themeRed.colors = defaultThemeLight.colors;
            themeImported.colors = defaultThemeLight.colors;
            tmpThemeImported.colors.toolbar_field = defaultThemeLight.colors.toolbar_field;
            tmpThemeImported.colors.toolbar_field_text = defaultThemeLight.colors.toolbar_field_text;
            themeRed.colors.toolbar_field_text = "#ffffff";
            themeRed.colors.toolbar_field = "#df5151";
            tmpThemeImportedSet = true;
            themeImportedSet = true;
        }
        
        if (optionFormTheme == "optionThemeDark") {     //firefox-compact-dark@mozilla.org
            themeRed.colors = defaultThemeDark.colors;
            themeImported.colors = defaultThemeDark.colors;
            tmpThemeImported.colors.toolbar_field = defaultThemeDark.colors.toolbar_field;
            tmpThemeImported.colors.toolbar_field_text = defaultThemeDark.colors.toolbar_field_text;
            themeRed.colors.toolbar_field_text = "#ffffff";
            themeRed.colors.toolbar_field = "#df5151";
            tmpThemeImportedSet = true;
            themeImportedSet = true;
        }
        
    }
    
    if (optionThemeFull == "optionFormFullTrue") {
        themeRed.colors = themeRedFull.colors;
    }
}

async function getCurrentThemeInfo() 
{
    var themeInfo = await browser.theme.getCurrent();
    await getStyle(themeInfo);
}

async function turnRed() {
    await getCurrentThemeInfo();
    browser.theme.update(themeRed);
    themeSetbyMe = true;
    
    //Reset/Set Variables 
    alreadyTurnedRed = true;
}

async function resetTheme() {
    if (themeImportedSet == true) {
        if (tmpThemeImportedSet == true) {
            themeImported.colors.toolbar_field = tmpThemeImported.colors.toolbar_field;
            themeImported.colors.toolbar_field_text = tmpThemeImported.colors.toolbar_field_text;
        }
        browser.theme.update(themeImported);
        themeSetbyMe = true;
    }
    else {
        //Case default theme default
        browser.theme.reset();
    }
    
    //Reset/Set Variables 
    alreadyTurnedRed = false;
    themeImportedSet = false;
    tmpThemeImportedSet = false;
}

async function decideTheme(url) {
    if(url.protocol === "http:") {
        turnRed();
    }
    else{
        if (alreadyTurnedRed == true) {
            resetTheme();
        }
    }
}

async function handleUpdated(tabId, changeInfo, tab) { 
    if(tab.active){
        const url = new URL(tab.url);
        decideTheme(url);
    }
}

/*async function handleActivated(tabInfo) {
    const tab = await browser.tabs.get(tabInfo.tabId);
    //const window = await browser.windows.get(tabInfo.windowId);
    const url = new URL(tab.url);
    decideTheme(url);
}

async function handleWindowFocusChange(windowId) {
    const window = await browser.windows.get(windowId);
    if (window.focused) {
        const tabs = await browser.tabs.query({ active: true, windowId: windowId });
        const url = new URL(tabs[0].url);
        decideTheme(url);
    }
}*/

browser.tabs.onUpdated.addListener(handleUpdated); 
//browser.tabs.onActivated.addListener(handleActivated); // not needed ? solved with "await getCurrentThemeInfo();" ?
//browser.windows.onFocusChanged.addListener(handleWindowFocusChange); // not needed ? solved with "await getCurrentThemeInfo();" ?
