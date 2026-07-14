let ConfigInit = 0;
ConfigManager.init({
    configFileName: 'Setting.json',

    supportedLangs: ['zh', 'en', 'ja', 'fr', 'es', 'ko', 'pl', 'pt', 'ru', 'de'],

    defaultLang: 'en',

    currentLang: navigator.language.split('-')[0],

    configFileVersion: 'v1',

    onReady: () => {
        ConfigInit = 1;
    },
    onUpdate: ({ key, value }) => {
        if(key === 'scale'){
                MainCanvasManager.changeScale();
                MainCanvasManager.render();
        }
        else if(key === 'alpha'){
                MainCanvasManager.changeAlpha();
                MainCanvasManager.render();
        }
        else if(key === 'modelPath'){
                MainCanvasManager.loadAssets();
                MainCanvasManager.render();
        }
    },
    onSave: (configJSON) => {
    }
});
function ForepaperEngineShowSetting() {
    ForepaperEngineChangeMousePierce(false);
    ConfigManager.showSettingPanel();
    return true;
}