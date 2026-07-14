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
        changeScreenSaverConfig(key, value);
    },
    onSave: (configJSON) => {
    }
});
function ForepaperEngineShowSetting() {
    ForepaperEngineChangeMousePierce(false);
    ConfigManager.showSettingPanel();
    return true;
}