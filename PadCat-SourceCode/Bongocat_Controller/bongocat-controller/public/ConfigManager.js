// 采用IIFE实现模块封装
const ConfigManager = (() => {
  // 私有变量
  let _settings = {
    scale: 0.2,
    alpha: 0.1,
    modulePath: null,
    leftStickDeadzone: "0.1",
    rightStickDeadzone: "0.1",
    isLimitFps: "1",
    limitFps: "60",
  };

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
