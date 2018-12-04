async function saveOptions(e) {    //formThem.optionTheme
    e.preventDefault();
    browser.storage.sync.set({optionFormTheme: document.querySelector("#optionFormTheme").optionTheme.value});
    browser.storage.sync.set({optionThemeFull: document.querySelector("#optionFormTheme").optionThemeFull.value});
}

function restoreOptions() {

    function setCurrentChoice(result) {
        document.querySelector("#optionFormTheme").optionTheme.value = result.optionFormTheme || "optionThemeDefault";
    }
    
    function setCurrentChoice2(result) {
        document.querySelector("#optionFormTheme").optionThemeFull.value = result.optionThemeFull || "optionFormFullFalse";
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    var getting = browser.storage.sync.get("optionFormTheme");
    getting.then(setCurrentChoice, onError);
    
    var getting2 = browser.storage.sync.get("optionThemeFull");
    getting2.then(setCurrentChoice2, onError);

}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
