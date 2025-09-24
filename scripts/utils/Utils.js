class Utils {
    static createElement(tag, className = '', content = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (content) element.textContent = content;
        return element;
    }

    static createElementWithHTML(tag, className = '', html = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (html) element.innerHTML = html;
        return element;
    }
}
