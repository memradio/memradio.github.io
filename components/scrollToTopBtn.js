export function renderScrollBtn(container) {
    const getDisplay = () => window.scrollY > 300 ? 'block' : 'none';

    const btn = document.createElement('button');
    btn.id = 'scrollToTopBtn';
    btn.title = 'До початку';
    btn.innerHTML = `<i class="fas fa-arrow-up"></i>`;

    window.addEventListener('scroll', () => {
        btn.style.display = getDisplay();
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    container.appendChild(btn);

}