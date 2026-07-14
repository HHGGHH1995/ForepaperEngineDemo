const ForepaperEngineBridge = window.chrome.webview.hostObjects.sync.ForepaperEngine;
const ForepaperEngineBridgeAsync = window.chrome.webview.hostObjects.ForepaperEngine;
function ForepaperEngineReadConfigFile(path) {
    return ForepaperEngineBridge.CallForepaperEngine('ReadFile', path);
}
function ForepaperEngineSaveConfigFile(path, content) {
    return ForepaperEngineBridge.CallForepaperEngine('SaveFile', `${path};${content}`);
}
function ForepaperEngineGetRealTimeSpectrum30() {
    let result = ForepaperEngineBridge.CallForepaperEngine('GetRealTimeSpectrum30', '');
    return ForepaperEngineParseSpectrum(result, 30);
}
function ForepaperEngineGetRealTimeSpectrum512() {
    let result = ForepaperEngineBridge.CallForepaperEngine('GetRealTimeSpectrum512', '');
    return ForepaperEngineParseSpectrum(result, 512);
}
function ForepaperEngineChangeMousePierce(option) {
    return ForepaperEngineBridge.CallForepaperEngine('ChangeMousePierce', option);
}
function ForepaperEngineParseSpectrum(dataStr,count) {
    if (!dataStr || typeof dataStr !== 'string') {
        console.error('Invalid spectrum data');
        return new Array(count).fill(0);
    }
    return dataStr.split(',').map(Number);
}
async function ForepaperEngineGetRealTimePerformance() {
    return await ForepaperEngineBridgeAsync.CallForepaperEngineAsync('GetHardwareMonitorData', '');
}
function ForepaperEngineDeclareResourceRequirements(resourceName, isNeed) {
    let _isNeed = isNeed ? '1' : '0';
    return ForepaperEngineBridge.CallForepaperEngine(resourceName, _isNeed);
}
function ForepaperEngineOpenDirectorySelectWindow(option) {
    let optionJsonStr = JSON.stringify(option);
    return ForepaperEngineBridge.CallForepaperEngine('OpenDirectorySelectWindow', optionJsonStr);
}
function ForepaperEngineOpenFileSelectWindow(option) {
    let optionJsonStr = JSON.stringify(option);
    return ForepaperEngineBridge.CallForepaperEngine('OpenFileSelectWindow', optionJsonStr);
}
function ForepaperEngineGetGameControllerState(playerIndex) {
    let resultStr = ForepaperEngineBridge.CallForepaperEngine('GetGameControllerState', playerIndex);
    if (!resultStr) {
        return null;
    }
    else {
        return resultStr.split(',');
    }
}
function ForepaperEngineSetGameControllerVibration(playerIndex, leftMotorSpeed, rightMotorSpeed) {
    return ForepaperEngineBridge.CallForepaperEngine('SetGameControllerVibration', `${playerIndex},${leftMotorSpeed},${rightMotorSpeed}`);
}
function ForepaperEngineGetMousePassThroughStatus() {
    return ForepaperEngineBridge.CallForepaperEngine('GetMousePierceStatus', '');
}
function ForepaperEngineGetFilesByPath(option) {
    let optionJsonStr = JSON.stringify(option);
    let resultJsonStr = ForepaperEngineBridge.CallForepaperEngine('GetFilesByPath', optionJsonStr);
    if (!resultJsonStr) {
        return null;
    }
    else {
        return JSON.parse(resultJsonStr);
    }
}
function ForepaperEngineGetDirectoriesByPath(option) {
    let optionJsonStr = JSON.stringify(option);
    let resultJsonStr = ForepaperEngineBridge.CallForepaperEngine('GetDirectoriesByPath', optionJsonStr);
    if (!resultJsonStr) {
        return null;
    }
    else {
        return JSON.parse(resultJsonStr);
    }
}
function ForepaperEngineGetCurrentWorkshopItemInstallPath() {
    return ForepaperEngineBridge.CallForepaperEngine('GetCurrentWorkshopItemInstallPath', '');
}
function ForepaperEngineOpenPathInExplorer(path) {
    return ForepaperEngineBridge.CallForepaperEngine('OpenPathInExplorer', path);
}
function ForepaperEngineOpenFile(option) {
    let optionJsonStr = JSON.stringify(option);
    return ForepaperEngineBridge.CallForepaperEngine('OpenFile', optionJsonStr);
}
function ForepaperEngineLockScreen() {
    return ForepaperEngineBridge.CallForepaperEngine('LockScreen', '');
}
function ForepaperEngineSendKeyboardInput(inputStr) {
    return ForepaperEngineBridge.CallForepaperEngine('SendKeyboardInput', inputStr);
}
function ForepaperEngineSendTextInput(inputStr) {
    return ForepaperEngineBridge.CallForepaperEngine('SendTextInput', inputStr);
}
function ForepaperEngineCheckFileExists(filePath) {
    return ForepaperEngineBridge.CallForepaperEngine('CheckFileExists', filePath) == '1';
}
function ForepaperEngineCheckDirectoryExists(directoryPath) {
    return ForepaperEngineBridge.CallForepaperEngine('CheckDirectoryExists', directoryPath) == '1';
}
function ForepaperEngineGetFileSize(filePath) {
    return ForepaperEngineBridge.CallForepaperEngine('GetFileSize', filePath);
}
function ForepaperEngineGetFocusWindowTitle() {
    return ForepaperEngineBridge.CallForepaperEngine('GetFocusWindowTitle', '');
}
function ForepaperEngineGetFocusProcessName() {
    return ForepaperEngineBridge.CallForepaperEngine('GetFocusProcessName', '');
}
function ForepaperEngineOpenFontSelectWindow() {
    return ForepaperEngineBridge.CallForepaperEngine('OpenFontSelectWindow', '');
}
function ForepaperEngineOpenColorSelectWindow(defaultColorStr) {
    return ForepaperEngineBridge.CallForepaperEngine('OpenColorSelectWindow', defaultColorStr);
}
function ForepaperEngineGetMainFormActivate() {
    return ForepaperEngineBridge.CallForepaperEngine('GetMainFormActivate', '') === '1';
}
function ForepaperEngineSetMainFormActivate() {
    return ForepaperEngineBridge.CallForepaperEngine('SetMainFormActivate', '');
}
function ForepaperEngineGetTopMostMode() {
    return ForepaperEngineBridge.CallForepaperEngine('GetTopMostMode', '') === '1';
}
function ForepaperEngineSetTopMostMode(isTopMost) {
    return ForepaperEngineBridge.CallForepaperEngine('SetTopMostMode', isTopMost ? '1' : '0');
}
function ForepaperEngineCloseForepaperSettings() {
    return ForepaperEngineBridge.CallForepaperEngine('CloseForepaperSettings', '');
}
function ForepaperEngineTryUnlockScreen(password) {
    return ForepaperEngineBridge.CallForepaperEngine('TryUnlockScreen', password) === '1';
}
function ForepaperEngineGetUnlockScreenType() {
    return ForepaperEngineBridge.CallForepaperEngine('GetUnlockScreenType', '');
}