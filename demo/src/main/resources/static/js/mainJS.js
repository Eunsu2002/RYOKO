document.querySelectorAll('.style-buttons button').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
    });
});