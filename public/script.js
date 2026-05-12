function handleSystemInfo() {
    const info = navigator.userAgent;
    localStorage.setItem('system_data', info);
    const footer = document.querySelector('footer');
    if (footer) {
        const storedInfo = localStorage.getItem('system_data');
        footer.textContent = "Системна інформація: " + storedInfo;
    }
}

async function loadEmployerComments() {
    const variant = 6; 
    const url = `https://jsonplaceholder.typicode.com/posts/${variant}/comments`;

    try {
        const response = await fetch(url);
        const comments = await response.json();
        const container = document.getElementById('comments-container');
        if (!container) return;
        
        container.innerHTML = '';
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.style.marginBottom = "15px";
            commentElement.style.padding = "10px";
            commentElement.style.borderLeft = "3px solid #2980b9";
            commentElement.style.background = "#fff";

            commentElement.innerHTML = `
                <p><strong>${comment.name}</strong> (<em>${comment.email}</em>)</p>
                <p>${comment.body}</p>
            `;
            container.appendChild(commentElement);
        });
    } catch (error) {
        console.error("Помилка завантаження:", error);
        const container = document.getElementById('comments-container');
        if (container) container.innerText = "Не вдалося завантажити відгуки.";
    }
}

function checkAutoTheme() {
    const currentHour = new Date().getHours();
    if (currentHour >= 7 && currentHour < 21) {
        document.body.classList.remove('night-mode');
    } else {
        document.body.classList.add('night-mode');
    }
}

// Головний блок ініціалізації
document.addEventListener('DOMContentLoaded', () => {
    handleSystemInfo();
    loadEmployerComments();
    checkAutoTheme();

    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('close-modal');
    const contactForm = document.getElementById('contact-form');

    // Поява модального вікна через 1 хв
    setTimeout(() => {
        if (overlay) overlay.style.display = 'flex';
    }, 15000);

    // Закриття модального вікна
    if (closeBtn && overlay) {
        closeBtn.addEventListener('click', () => {
            overlay.style.display = 'none';
        });
    }

    // ТЕ САМЕ ЗАВДАННЯ №2: ВІДПРАВКА ФОРМИ
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                name: contactForm.querySelector('[name="name"]').value,
                email: contactForm.querySelector('[name="email"]').value,
                subject: contactForm.querySelector('[name="subject"]').value,
                message: contactForm.querySelector('[name="message"]').value
            };

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Успіх! ' + result.message);
                    if (overlay) overlay.style.display = 'none';
                    contactForm.reset();
                } else {
                    alert('Помилка: ' + (result.error || 'Невідома помилка'));
                }
            } catch (error) {
                console.error("Помилка відправки:", error);
                alert('Сервер не відповідає. Перевірте консоль node.');
            }
        });
    }

    // Перемикач теми
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('night-mode');
        });
    }
});