const container = document.getElementById('container');
const chars = []; // 存储当前显示的字符

window.addEventListener('keydown', (event) => {
    if (ConfigInit == 1) {
        if (event.key.trim() == '') {
            createChar(event.code);
        }
        else {
            createChar(event.key);
        }
    }
});

function getRandomFloat(min, max) {
    if (min >= max) {
        return min;
    }
    return Math.random() * (max - min) + min;
}

function createChar(char) {
    if (chars.length >= ConfigManager.get('maxCharNum')) {
        const oldestChar = chars.shift(); // 移除最早的字符
        container.removeChild(oldestChar.element);
    }

    const charElement = document.createElement('div');
    charElement.className = 'char';
    charElement.textContent = char;

    // 随机大小
    const randomSize = getRandomFloat(ConfigManager.get('fontSizeRandomMin'), ConfigManager.get('fontSizeRandomMax'));
    charElement.style.fontSize = `${randomSize}px`;
    //随机旋转
    if (ConfigManager.get('randomRotate') == "1") {
        charElement.style.transform = `rotate(${Math.random()}turn)`;
    }

    // 随机颜色
    const randomColor = `hsla(${Math.random() * 360}, 70%, 60%,${ConfigManager.get('opacity')})`; // 随机 HSL 颜色
    charElement.style.color = randomColor;

    charElement.style.left = `${Math.random() * window.innerWidth}px`; // 随机水平位置
    charElement.style.top = `${window.innerHeight * ConfigManager.get('fontFromTop')}px`; // 从底部开始
    container.appendChild(charElement);

    const charData = {
        element: charElement,
        x: parseFloat(charElement.style.left),
        y: parseFloat(charElement.style.top),
        vx: (Math.random() - 0.5) * ConfigManager.get('randomHorizontalSpeedBase'), // 随机水平速度
        vy: -Math.random() * ConfigManager.get('randomVerticalSpeedBase'), // 随机垂直速度（向上）
        lastTime: performance.now() // 为每个字符单独记录时间
    };

    chars.push(charData);
    animateChar(charData);
}

function animateChar(charData) {
    let currentTime = performance.now();
    let deltaTime = currentTime - charData.lastTime;
    let speed = deltaTime / (1000 / 60); // 计算速度因子，基于60FPS为标准
    
    // 如果时间间隔过长（比如页面切换后回来），限制最大速度因子
    if (speed > 2) speed = 1;
    
    charData.lastTime = currentTime;

    const { element, x, y, vx, vy } = charData;

    // 更新速度（重力影响）- 应用speed因子
    charData.vy += ConfigManager.get('gravity') * speed;

    // 更新水平速度（衰减）- 应用speed因子
    // 注意：摩擦力的应用需要特殊处理，确保帧率不影响衰减效果
    charData.vx *= Math.pow(ConfigManager.get('friction'), speed);

    // 更新位置 - 应用speed因子
    charData.x += vx * speed;
    charData.y += vy * speed;

    // 边界检测（左右）
    if (charData.x < 0 || charData.x + element.offsetWidth > window.innerWidth) {
        charData.vx *= -1; // 反转水平速度
        // 确保字符不会卡在边界外
        if (charData.x < 0) charData.x = 0;
        if (charData.x + element.offsetWidth > window.innerWidth) {
            charData.x = window.innerWidth - element.offsetWidth;
        }
    }

    // 边界检测（底部）
    if (charData.y + element.offsetHeight > window.innerHeight) {
        charData.y = window.innerHeight - element.offsetHeight; // 固定在底部
        charData.vy *= -ConfigManager.get('bounceFactor'); // 反弹

        // 如果速度很小，停止动画
        if (Math.abs(charData.vy) < 4 * speed && Math.abs(charData.vx) < 0.1 * speed) {
            charData.vy = 0;
            charData.vx = 0;
            return;
        }
    }

    // 更新元素位置
    element.style.left = `${charData.x}px`;
    element.style.top = `${charData.y}px`;

    // 继续动画
    requestAnimationFrame(() => animateChar(charData));
}