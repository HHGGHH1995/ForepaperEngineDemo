// 采用IIFE实现模块封装
const ConfigManager = (() => {
  // 私有变量
  let _settings = {
    scale: 0.2,
    alpha: 0.1,
    modulePath: null,
  };

    document.body.addEventListener("keydown", async (event) => {
        // await loadAssets();
        // assetsMap['table'].sprite.rotation += 0.1;
        // Manually draw the next frame
        let needUpdate = false;

        switch (event.key) {
            case "ArrowUp": {
                _settings.scale += 0.1;
                MainCanvasManager.changeScale();
                MainCanvasManager.render();
                break;
            }
            case "ArrowDown": {
                _settings.scale -= 0.1;
                MainCanvasManager.changeScale();
                MainCanvasManager.render();
                break;
            }
            case "ArrowLeft": {
                _settings.alpha -= 0.1;
                MainCanvasManager.changeAlpha();
                MainCanvasManager.render();
                break;
            }
            case "ArrowRight": {
                _settings.alpha += 0.1;
                MainCanvasManager.changeAlpha();
                MainCanvasManager.render();
                break;
            }
        }
    });

  // 公开方法
  return {
    /**
     * 获取配置值
     * @param {string} key - 配置项键名
     * @returns {*} 配置值
     */
    get(key) {
      return _settings[key];
    },
  };
})();
