class NavigationController {
    constructor() {
        this.initScrollToTop();
    }

    initScrollToTop() {
        const scrollBtn = document.getElementById('scroll-to-top-btn');
        scrollBtn.addEventListener('click', this.scrollToTop);
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}
