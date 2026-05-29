document.querySelectorAll('.style-buttons button').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
    });
});

function toGoAI() {
    const target = document.querySelector('.type-select');
    const top = target.getBoundingClientRect().top + window.scrollY - 100; // 100px 더 위로
    window.scrollTo({ top: top, behavior: 'smooth' });
}