var AnimationNamespace = AnimationNamespace || {};
AnimationNamespace.WaveformVisualizer = class {
    constructor() {
        this.canvas = document.getElementById('visualizer');
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.points = [];
        this.initCanvas();
        this.animate();
    }

    initCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    draw(spectrum) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.beginPath();

        const pointCount = spectrum.length;
        const stepX = this.canvas.width / (pointCount - 1);

        let isFirstPoint = true;
        spectrum.forEach((value, i) => {
            const x = (i) * stepX;
            const y = this.canvas.height - (value * this.canvas.height * ConfigManager.get('dynamicRange'));
            if (isFirstPoint) {
                this.ctx.moveTo(x, y);
                isFirstPoint = false;
            } else {
                this.ctx.lineTo(x, y);
            }
        });

        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        const hue = (Date.now() * ConfigManager.get('colorChangeSpeed')) % 360;
        gradient.addColorStop(0, `hsla(${hue}, 100%, 50%, ${ConfigManager.get('opacity')})`);
        gradient.addColorStop(1, `hsla(${(hue+90) % 360}, 100%, 50%, ${ConfigManager.get('opacity')})`);
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = ConfigManager.get('lineWidth');
        this.ctx.stroke();
    }

    animate() {
        const spectrum = ForepaperEngineGetRealTimeSpectrum30();
        this.draw(spectrum);
        requestAnimationFrame(() => this.animate());
    }
}
AnimationNamespace.Start = function () {
    const visualizer = new AnimationNamespace.WaveformVisualizer();
}