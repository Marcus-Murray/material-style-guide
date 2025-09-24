class AnimationController {
    constructor() {
        this.initScrollReveal();
        this.initRippleEffect();
    }

    initScrollReveal() {
        this.revealOnScroll = this.revealOnScroll.bind(this);
        window.addEventListener('scroll', this.revealOnScroll);
        window.addEventListener('load', this.revealOnScroll);
        this.revealOnScroll();
    }

    revealOnScroll() {
        const reveals = document.querySelectorAll('.reveal');

        reveals.forEach(reveal => {
            const windowHeight = window.innerHeight;
            const elementTop = reveal.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    }

    initRippleEffect() {
        // Wait for DOM to be ready, then add event listeners
        setTimeout(() => {
            const interactiveElements = document.querySelectorAll('.material-card, .font-card, .color-item');

            interactiveElements.forEach(element => {
                element.addEventListener('click', this.createRipple.bind(this));
            });
        }, 100);
    }

    createRipple(e) {
        const ripple = document.createElement('div');
        const rect = e.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(106, 80, 164, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            z-index: 1;
        `;

        e.currentTarget.style.position = 'relative';
        e.currentTarget.style.overflow = 'hidden';
        e.currentTarget.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}
