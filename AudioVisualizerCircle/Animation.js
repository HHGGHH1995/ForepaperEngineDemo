var AnimationNamespace = AnimationNamespace || {};
AnimationNamespace.AudioVisualizer = class {
    constructor() {
        this.canvas = document.getElementById('visualizer');
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.initCanvas();
        this.animate();
    }

    initCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    animate() {
        const spectrum = ForepaperEngineGetRealTimeSpectrum30();
        this.draw(spectrum);
        requestAnimationFrame(() => this.animate());
    }

    draw(spectrum) {
        const time = Date.now() * 0.001;
        this.ctx.globalCompositeOperation = 'lighter';
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const particleSize = ConfigManager.get('particleSize');
        const trajectoryNumber = ConfigManager.get('trajectory');
        const amplitude = ConfigManager.get('amplitude');
        const innerDiameter = ConfigManager.get('innerDiameter');
        const colorChangeSpeed = ConfigManager.get('colorChangeSpeed');
        const opacity = ConfigManager.get('opacity');

        for (let i = 0; i < 1000; i++) {
            const angle = Math.PI * 2 * i / trajectoryNumber;
            const warp = spectrum[i % 30] * amplitude;

            // 时空曲率计算
            const x = this.canvas.width / 2 + (innerDiameter + warp) * Math.cos(angle + time);
            const y = this.canvas.height / 2 + (innerDiameter + warp) * Math.sin(angle * 0.5 + time);

            // 多普勒着色
            const hue = ((Math.atan2(y - this.canvas.height / 2, x - this.canvas.width / 2) * 180 / Math.PI + 360)+(Date.now() * colorChangeSpeed)) % 360;
            this.ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${(spectrum[i % 30] < 0.1 ? 0.1 : 1) * opacity})`;
            this.ctx.fillRect(x, y, particleSize, particleSize);
        }
    }
}
AnimationNamespace.Start = function () {
    const visualizer = new AnimationNamespace.AudioVisualizer();
}