//像下面这种配置方式，假如当前语言为zh且在支持语言集合中，那么最终使用的配置文件的相对路径为：“zh\v1\Setting.json”，如果不在受支持语言集合中，则为：“en\v1\Setting.json”。假如为初次读取配置文件，那么上述的相对路径是相当于index.html文件的路径，当你进行过第一次保存操作后，配置文件会被复制到以下路径：“C:\Users\{LoginUserName}\AppData\Roaming\ForepaperEngine\PaperConfig”，下次读取时也会从该文件夹的相对路径读取配置文件，而不再是index.html文件的相对路径。
let ConfigInit = 0;
ConfigManager.init({
    //配置文件名称
    configFileName: 'Setting.json',
    //配置文件支持的语言，采用ISO 639-1语言代码
    supportedLangs: ['zh', 'en', 'ja', 'fr', 'es', 'ko', 'pl', 'pt', 'ru', 'de'],
    //如果当前系统语言不在支持的语言列表中，则使用默认语言
    defaultLang: 'en',
    //当前系统语言的ISO 639-1语言代码
    currentLang: navigator.language.split('-')[0],
    //使用哪一个版本的配置文件，因为版本号会参与到文件路径中，所以不要包含特殊符号，注意：如果您在发布新作品，则默认赋值为“v1”即可，如果您是在更新作品，如果本次更新可以兼容旧版本的配置文件，那么您就不要修改此版本号，反之，如果无法兼容旧版本配置文件，或者您给配置文件新增了配置项，则需要修改此版本号，修改后，用户更新了您的作品会直接使用您新版本的默认配置文件，而不是过去用户已保存的配置文件。
    configFileVersion: 'v1',
    onReady: () => {
        ConfigInit = 1;
        //如果您需要在配置管理器初始化完成之后才执行动画，您可以监测ConfigInit的值来判断配置管理器是否初始化完成，或者直接在这里执行代码。
        StartAnimation();
    },
    onUpdate: ({ key, value }) => {
    },
    onSave: (configJSON) => {
    }
});
function ForepaperEngineShowSetting() {
    ForepaperEngineChangeMousePierce(false);
    ConfigManager.showSettingPanel();
    return true;
}
function StartAnimation() {
    AnimationNamespace.Start();
}