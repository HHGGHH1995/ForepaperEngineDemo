var AnimationNamespace = AnimationNamespace || {};
AnimationNamespace.AudioVisualizer = class {
    constructor() {
        this.canvas = document.getElementById('visualizer');
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.particles = [];
        this.initCanvas();
        this.initParticles();
        this.animate();
    }

    initCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initParticles() {
        const particleCount = 100;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                speed: Math.random() * 2 + 1
            });
        }
    }

    draw(spectrum) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const scaleFactor = ConfigManager.get('scaleFactor');
        const opacity = ConfigManager.get('opacity');
        const colorChangeSpeed = ConfigManager.get('colorChangeSpeed');

        this.particles.forEach((particle, i) => {
            const spectrumValue = spectrum[i % spectrum.length];

            // 更新粒子位置
            particle.y -= particle.speed;
            if (particle.y < 0) {
                particle.y = this.canvas.height;
            }

            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, (spectrumValue || 0.1) * scaleFactor, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${Date.now() * particle.speed * colorChangeSpeed % 360}, 100%, 50%, ${opacity})`,
            this.ctx.fill();
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