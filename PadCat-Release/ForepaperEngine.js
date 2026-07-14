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
function ForepaperEngineCloseForepaperSettings() {
    return ForepaperEngineBridge.CallForepaperEngine('CloseForepaperSettings', '');
}