class ParticleSystem {
    constructor() {
        this.container = document.getElementById('particle-bg');
        this.particles = [];
        this.maxParticles = 50;
        this.isActive = true;
        this.animationId = null;
        this.init();
    }

    init() {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.isActive = false;
            return;
        }

        this.createInitialParticles();
        this.startParticleGeneration();
        this.bindEvents();
    }

    bindEvents() {
        // Pause/resume based on page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });

        // Listen for reduced motion changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            if (e.matches) {
                this.destroy();
            } else {
                this.init();
            }
        });
    }

    createInitialParticles() {
        const initialCount = Math.min(20, this.maxParticles);
        for (let i = 0; i < initialCount; i++) {
            setTimeout(() => this.createParticle(), i * 100);
        }
    }

    startParticleGeneration() {
        if (!this.isActive) return;

        const generateParticle = () => {
            if (this.particles.length < this.maxParticles) {
                this.createParticle();
            }

            if (this.isActive) {
                const delay = Math.random() * 3000 + 1000; // 1-4 seconds
                this.animationId = setTimeout(generateParticle, delay);
            }
        };

        generateParticle();
    }

    createParticle() {
        if (!this.isActive || !this.container) return;

        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random properties
        const size = Math.random() * 3 + 1; // 1-4px
        const startX = Math.random() * 100;
        const endX = startX + (Math.random() * 200 - 100); // Drift left or right
        const duration = Math.random() * 15 + 10; // 10-25 seconds
        const delay = Math.random() * 2;
        const opacity = Math.random() * 0.3 + 0.05; // 0.05-0.35

        // Apply styles
        particle.style.cssText = `
            left: ${startX}%;
            width: ${size}px;
            height: ${size}px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            opacity: ${opacity};
            --end-x: ${endX}px;
        `;

        // Add custom animation for this particle
        particle.style.setProperty('--random-x', `${Math.random() * 200 - 100}px`);

        this.container.appendChild(particle);
        this.particles.push(particle);

        // Remove particle after animation
        setTimeout(() => {
            this.removeParticle(particle);
        }, (duration + delay) * 1000 + 1000);
    }

    removeParticle(particle) {
        if (particle && particle.parentNode) {
            particle.parentNode.removeChild(particle);
            const index = this.particles.indexOf(particle);
            if (index > -1) {
                this.particles.splice(index, 1);
            }
        }
    }

    pause() {
        this.isActive = false;
        if (this.animationId) {
            clearTimeout(this.animationId);
            this.animationId = null;
        }

        // Pause CSS animations
        this.particles.forEach(particle => {
            particle.style.animationPlayState = 'paused';
        });
    }

    resume() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        this.isActive = true;
        this.startParticleGeneration();

        // Resume CSS animations
        this.particles.forEach(particle => {
            particle.style.animationPlayState = 'running';
        });
    }

    destroy() {
        this.isActive = false;
        if (this.animationId) {
            clearTimeout(this.animationId);
            this.animationId = null;
        }

        // Remove all particles
        this.particles.forEach(particle => {
            this.removeParticle(particle);
        });
        this.particles = [];
    }

    updateParticleCount(count) {
        this.maxParticles = Math.max(0, Math.min(count, 100)); // Limit between 0-100

        // If we have too many particles, remove extras
        while (this.particles.length > this.maxParticles) {
            const particle = this.particles.pop();
            this.removeParticle(particle);
        }
    }

    getParticleCount() {
        return this.particles.length;
    }

    getMaxParticles() {
        return this.maxParticles;
    }
}
