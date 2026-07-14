// 采用IIFE实现模块封装
const ConfigManager = (() => {
    // 私有变量
    let _settings = {};
    let _configData = null;
    let _isReady = false;

    // DOM元素缓存
    const _elements = {
        panel: null,
        content: null
    };

    // 默认配置
    const _defaults = {
        configFileName: 'Setting.json',
        supportedLangs: ['zh', 'en', 'ja', 'fr', 'es', 'ko', 'pl', 'pt', 'ru', 'de'],
        defaultLang: 'en',
        currentLang: navigator.language.split('-')[0],
        configFileVersion: null,
        cssPrefix: 'cm-',
        onReady: null,
        onUpdate: null,
        onSave: (config) => console.log('需要实现保存逻辑:', config)
    };

    let usedLang = _defaults.defaultLang;
    let configFilePath = _defaults.configFileName;

    // 初始化模块
    async function init(options = {}) {
        const config = { ..._defaults, ...options };
        _defaults.onSave = config.onSave;
        _defaults.onUpdate = config.onUpdate;

        try {
            if (config.supportedLangs.includes(config.currentLang)) {
                usedLang = config.currentLang;
            }

            if (config.configFileVersion) {
                configFilePath = `${usedLang}/${config.configFileVersion}/${config.configFileName}`;
            }
            else {
                configFilePath = `${usedLang}/${config.configFileName}`;
            }

            let _jsonStr = ForepaperEngineReadConfigFile(configFilePath);
            _configData = JSON.parse(_jsonStr);

            // 初始化设置
            _initSettings();

            // 生成UI
            _initUI(config.cssPrefix);

            // 绑定事件
            _bindEvents(config);

            _isReady = true;
            config.onReady?.();
        } catch (error) {
            console.error('配置管理器初始化失败:', error);
        }
    }

    // 初始化设置值
    function _initSettings() {
        _configData.SettingItems.forEach(item => {
            _settings[item.ItemKeyName] = _convertValue(
                item.ItemCurrentValue,
                item.ItemInputType
            );
        });
    }

    // 值类型转换
    function _convertValue(value, type) {
        switch (type) {
            case 'number':
            case 'range': return parseFloat(value);
            case 'checkbox':
            case 'radio': return value === '1';
            default: return value;
        }
    }

    // 生成设置面板
    function _initUI(prefix) {
        // 创建面板容器
        _elements.panel = document.createElement('div');
        _elements.panel.className = `${prefix}panel`;
        _elements.panel.innerHTML = `
        <div class="${prefix}content-wrapper">
            <div class="${prefix}content"></div>
        </div>
        <button class="${prefix}close-btn">OK</button>
    `;

        // 添加到body
        document.body.appendChild(_elements.panel);
        _elements.content = _elements.panel.querySelector(`.${prefix}content`);
        _elements.contentWrapper = _elements.panel.querySelector(`.${prefix}content-wrapper`);

        // 生成配置项
        _configData.SettingItems.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = `${prefix}item`;
            itemEl.innerHTML = _generateItemHTML(item, prefix);
            _elements.content.appendChild(itemEl);
        });

        // 应用默认样式
        _injectStyles(prefix);
    }

    // 生成单个配置项HTML
    function _generateItemHTML(item, prefix) {
        let inputHTML = '';
        const attrs = [];

        // 通用属性
        if (item.ItemInputType === 'number' || item.ItemInputType === 'range') {
            attrs.push(
                `min="${item.ItemInputMinNum}"`,
                `max="${item.ItemInputMaxNum}"`,
                `step="${item.ItemStep || '1'}"`  // 添加 step 属性，默认值为 1
            );
        }
        if (item.ItemInputType === 'text') {
            attrs.push(`maxlength="${item.ItemInputMaxNum}"`);
        }

        // 特殊类型处理
        switch (item.ItemInputType) {
            case 'checkbox':
            case 'radio':
                inputHTML = `
                <input type="${item.ItemInputType}" 
                       id="${item.ItemKeyName}" 
                       ${item.ItemCurrentValue === '1' ? 'checked' : ''}>
                <label for="${item.ItemKeyName}">${item.ItemCaptionText}</label>
            `;
                break;
            case 'range':
                inputHTML = `
                <label class="${prefix}label">${item.ItemCaptionText}</label>
                <div class="${prefix}range-container">
                    <input type="range" 
                           id="${item.ItemKeyName}" 
                           value="${item.ItemCurrentValue}"
                           ${attrs.join(' ')}>
                    <span class="${prefix}range-value">${item.ItemCurrentValue}</span>
                </div>
            `;
                break;
            default:
                inputHTML = `
                <label class="${prefix}label">${item.ItemCaptionText}</label>
                <input type="${item.ItemInputType}" 
                       id="${item.ItemKeyName}" 
                       value="${item.ItemCurrentValue}"
                       ${attrs.join(' ')}>
            `;
        }

        return inputHTML;
    }

    // 事件绑定
    function _bindEvents(config) {
        // 输入变更监听
        _configData.SettingItems.forEach(item => {
            const input = document.getElementById(item.ItemKeyName);
            if (item.ItemInputType === 'number') {
                // 监听 input 事件
                input.addEventListener('input', (e) => {
                    const value = parseFloat(e.target.value);
                    const min = parseFloat(item.ItemInputMinNum);
                    const max = parseFloat(item.ItemInputMaxNum);

                    // 如果输入值超出范围，自动修正
                    if (value < min) {
                        e.target.value = min;
                    } else if (value > max) {
                        e.target.value = max;
                    }
                });

                // 监听 blur 事件（失去焦点时修正）
                input.addEventListener('blur', (e) => {
                    const value = parseFloat(e.target.value);
                    const min = parseFloat(item.ItemInputMinNum);
                    const max = parseFloat(item.ItemInputMaxNum);

                    // 如果输入值超出范围，自动修正
                    if (value < min) {
                        e.target.value = min;
                    } else if (value > max) {
                        e.target.value = max;
                    }
                });
            }
            if (item.ItemInputType === 'range') {
                // 获取显示数值的元素
                const valueDisplay = input.parentElement.querySelector(`.${config.cssPrefix}range-value`);

                // 监听 input 事件
                input.addEventListener('input', (e) => {
                    // 更新显示数值
                    valueDisplay.textContent = e.target.value;
                });

                // 初始化显示数值
                valueDisplay.textContent = input.value;
            }
            if (item.ItemInputType === 'text') {
                if ('ItemSubInputType' in item && item.ItemSubInputType === 'folder') {
                    input.addEventListener('click', e => {
                        e.target.value = ForepaperEngineOpenDirectorySelectWindow(item.Title);
                        _handleInputChange(item, e.target);
                    });
                }
                if ('ItemSubInputType' in item && item.ItemSubInputType === 'file') {
                    let options = {
                        Title: item.Title,
                        FolderPath: item.FolderPath,
                        Filter: item.Filter
                    };
                    input.addEventListener('click', e => {
                        e.target.value = ForepaperEngineOpenFileSelectWindow(options);
                        _handleInputChange(item, e.target);
                    });
                }
            }

            // 绑定输入变更事件
            input.addEventListener('input', e => _handleInputChange(item, e.target));
        });

        // 关闭按钮
        _elements.panel.querySelector(`.${config.cssPrefix}close-btn`)
            .addEventListener('click', () => _saveConfig(config));
    }

    function showSettingPanel() {
        _elements.panel.style.display = 'block';
    }

    // 处理输入变更
    function _handleInputChange(item, target) {
        let value;
        switch (item.ItemInputType) {
            case 'checkbox':
            case 'radio':
                value = target.checked ? '1' : '0';
                break;
            default:
                value = target.value;
        }

        // 更新私有设置
        _settings[item.ItemKeyName] = _convertValue(value, item.ItemInputType);

        // 触发更新事件
        _defaults.onUpdate?.({
            key: item.ItemKeyName,
            value: _settings[item.ItemKeyName]
        });
    }

    // 保存配置
    function _saveConfig(config) {
        const newConfig = { SettingItems: [] };

        _configData.SettingItems.forEach(item => {
            const input = document.getElementById(item.ItemKeyName);
            newConfig.SettingItems.push({
                ...item,
                ItemCurrentValue: _getCurrentValue(input, item.ItemInputType)
            });
        });

        const configJSON = JSON.stringify(newConfig, null, 2);

        ForepaperEngineChangeMousePierce(true);
        ForepaperEngineCloseForepaperSettings();
        ForepaperEngineSaveConfigFile(configFilePath, configJSON);

        config.onSave(configJSON);
        _elements.panel.style.display = 'none';
    }

    // 获取当前值
    function _getCurrentValue(input, type) {
        switch (type) {
            case 'checkbox':
            case 'radio': return input.checked ? '1' : '0';
            default: return input.value;
        }
    }

    // 注入样式
    function _injectStyles(prefix) {
        const style = document.createElement('style');
        style.textContent = `
            .${prefix}panel {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(255, 255, 255, 0.5); /* 更透明的背景 */
                    padding: 25px; /* 增加内边距 */
                    border-radius: 12px; /* 更大的圆角 */
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); /* 更柔和的阴影 */
                    display: none;
                    z-index: 1000;
                    width: 250px; /* 固定宽度 */
                    max-width: 90%; /* 响应式宽度 */
                    font-family: Arial, sans-serif; /* 统一字体 */
                }
                /* 内容区域容器 */
                .${prefix}content-wrapper {
                    max-height: 70vh; /* 最大高度为窗口高度的 70% */
                    overflow-y: auto; /* 显示垂直滚动条 */
                    padding-right: 10px; /* 避免滚动条遮挡内容 */
                    scrollbar-width: thin;
                    scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
                }

                /* 内容区域 */
                .${prefix}content {
                    padding-bottom: 20px; /* 增加底部内边距 */
                }
            .${prefix}item {
                    margin: 20px 0; /* 增加上下间距 */
                }
            .${prefix}label {
                    display: block;
                    margin-bottom: 8px; /* 增加标签与输入框的间距 */
                    font-size: 14px; /* 稍大的字体 */
                    font-weight: 600; /* 加粗字体 */
                    color: #333; /* 深灰色 */
                }
                .${prefix}item input[type="text"],
                .${prefix}item input[type="number"],
                .${prefix}item input[type="range"],
                .${prefix}item input[type="color"] {
                    margin: 1px;
                }
                .${prefix}item input[type="text"]:focus,
                .${prefix}item input[type="number"]:focus,
                .${prefix}item input[type="range"]:focus,
                .${prefix}item input[type="color"]:focus {
                    border-color: #007bff; /* 聚焦时边框颜色 */
                    outline: none; /* 移除默认聚焦轮廓 */
                }

                /* 复选框和单选框样式 */
                .${prefix}item input[type="checkbox"],
                .${prefix}item input[type="radio"] {
                    margin-right: 8px; /* 增加与标签的间距 */
                }

                .${prefix}item input[type="checkbox"] + label,
                .${prefix}item input[type="radio"] + label {
                    font-size: 14px;
                    color: #333;
                }

                /* 范围输入框样式 */
                .${prefix}item input[type="range"] {
                    padding: 0; /* 移除内边距 */
                    background: transparent; /* 透明背景 */
                }

                /* 颜色选择器样式 */
                .${prefix}item input[type="color"] {
                    padding: 5px; /* 调整内边距 */
                    height: 40px; /* 固定高度 */
                }

                /* 关闭按钮样式 */
                .${prefix}close-btn {
                    display: block;
                    width: 100%;
                    padding: 12px;
                    margin-top: 20px; /* 增加与上方元素的间距 */
                    background-color: #007bff; /* 蓝色背景 */
                    color: white; /* 白色文字 */
                    border: none;
                    border-radius: 6px; /* 圆角 */
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.3s ease; /* 背景颜色过渡效果 */
                }

                .${prefix}close-btn:hover {
                    background-color: #0056b3; /* 悬停时深蓝色 */
                }
                /* range 容器 */
                .${prefix}range-container {
                    display: flex;
                    align-items: center;
                    gap: 10px; /* 输入框和数值之间的间距 */
                }

                /* range 数值显示 */
                .${prefix}range-value {
                    font-size: 14px;
                    font-weight: 600;
                    color: #333;
                }
            /* 更多样式... */
        `;
        document.head.appendChild(style);
    }

    // 公开方法
    return {
        /**
         * 初始化配置管理器
         * @param {Object} options - 配置选项
         * @param {string} [options.configFileName='./Setting.json'] - 配置文件路径
         * @param {Function} [options.onReady] - 配置加载完成回调
         * @param {Function} [options.onUpdate] - 配置项更新回调
         * @param {Function} [options.onSave] - 保存配置回调
         */
        init,

        /**
         * 获取配置值
         * @param {string} key - 配置项键名
         * @returns {*} 配置值
         */
        get(key) {
            if (!_isReady) throw new Error('配置未初始化');
            return _settings[key];
        },

        /**
         * 获取所有配置
         * @returns {Object} 所有配置的副本
         */
        getAll() {
            return { ..._settings };
        },

        /**
         * 显示设置面板
         */
        showSettingPanel
    };
})();