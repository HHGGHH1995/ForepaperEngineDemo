var AnimationNamespace = AnimationNamespace || {};
AnimationNamespace.AudioVisualizer = class {
    constructor() {
        this.charUpdateInterval = 20; // 字符刷新间隔（帧数）
        this.frameCount = 0; // 帧计数器

        // 初始化Canvas
        this.canvas = document.getElementById('visualizer');
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.initCanvas();

        // 初始化字符流
        this.chars = 'ForepaperEngine';
        this.drops = Array(Math.floor(window.innerWidth / 20)).fill(0);


        // 启动动画循环
        this.animate();
    }

    getRandomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }

    initCanvas() {
        // 设置Canvas尺寸
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.drops = Array(Math.floor(window.innerWidth / 20)).fill(0); // 重置字符流
        });
    }

    draw(spectrum) {
        // 清空画布（使用完全透明背景）
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const fontSize = ConfigManager.get('fontSize');
        // 设置字体样式
        this.ctx.font = `${fontSize}px monospace`;
        this.ctx.textAlign = 'center';

        this.chars = ConfigManager.get('chars') || 'ForepaperEngine';

        this.charUpdateInterval = ConfigManager.get('charUpdateInterval');

        // 更新字符（每隔charUpdateInterval帧刷新一次）
        if (this.frameCount % this.charUpdateInterval === 0) {
            this.currentChars = this.drops.map(() => this.getRandomChar());
        }
        this.frameCount++;

        const opacity = ConfigManager.get('opacity');
        const dynamicRange = ConfigManager.get('dynamicRange');
        const colorChangeSpeed = ConfigManager.get('colorChangeSpeed');
        const baseDropSpeed = ConfigManager.get('baseDropSpeed');
        const dyDropSpeed = ConfigManager.get('dyDropSpeed');

        // 绘制字符流
        this.drops.forEach((drop, i) => {
            const thisSpectrum = spectrum[i % spectrum.length];
            const x = i * fontSize + thisSpectrum * dynamicRange;
            const y = drop % this.canvas.height;

            this.ctx.fillStyle = `hsla(${((i * 10) + Date.now() * colorChangeSpeed) % 360}, 100%, 50%, ${opacity})`;

            // 绘制字符
            this.ctx.fillText(this.currentChars[i], x, y);

            // 更新字符位置
            this.drops[i] = drop + baseDropSpeed + thisSpectrum * dyDropSpeed;
        });
    }

    animate() {
        const spectrum = ForepaperEngineGetRealTimeSpectrum30();
        this.draw(spectrum);
        requestAnimationFrame(() => this.animate());
    }
}
AnimationNamespace.Start = function () {
    const visualizer = new AnimationNamespace.AudioVisualizer();
}