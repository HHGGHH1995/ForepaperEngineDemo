var AnimationNamespace = AnimationNamespace || {};
AnimationNamespace.AudioVisualizer = class {
    constructor() {
        this.canvas = document.getElementById('visualizer');
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.bars = [];
        this.initCanvas();
        this.initBars();
        this.animate();
        window.addEventListener('resize', () => this.initCanvas());
    }

    initCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initBars() {
        const barCount = 30;
        const spacing = 2;
        const totalWidth = this.canvas.width - (barCount - 1) * spacing;
        const barWidth = totalWidth / barCount;

        this.bars = new Array(barCount).fill().map((_, i) => ({
            x: i * (barWidth + spacing),
            width: barWidth,
            height: 0,
            targetHeight: 0
        }));
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const colorChangeSpeed = ConfigManager.get('colorChangeSpeed');
        const opacity = ConfigManager.get('opacity');
        const barWidth = ConfigManager.get('barWidth');

        this.bars.forEach((bar, i) => {
            bar.height += (bar.targetHeight - bar.height) * 0.2;
            const hue = (i * 12 + Date.now() * colorChangeSpeed) % 360;
            this.ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${opacity})`;
            this.ctx.fillRect(
                bar.x,
                this.canvas.height - bar.height * this.canvas.height,
                bar.width * barWidth,
                bar.height * this.canvas.height
            );
        });
    }

    animate() {
        const spectrumData = ForepaperEngineGetRealTimeSpectrum30();
        const dynamicRange = ConfigManager.get('dynamicRange');
        this.bars.forEach((bar, i) => {
            bar.targetHeight = (spectrumData[i] || 0) * dynamicRange;
        });
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}
AnimationNamespace.Start = function () {
    const visualizer = new AnimationNamespace.AudioVisualizer();
}