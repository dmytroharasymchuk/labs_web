function handleSystemInfo() {
    const info = navigator.userAgent;

    localStorage.setItem('system_data', info);

    const footer = document.querySelector('footer');

    if (footer) {
        const storedInfo = localStorage.getItem('system_data');
        footer.textContent = "Системна інформація: " + storedInfo;
    }
}

document.addEventListener('DOMContentLoaded', handleSystemInfo);

async function loadEmployerComments() {
    const variant = 6; 
    const url = `https://jsonplaceholder.typicode.com/posts/${variant}/comments`;

    try {
        const response = await fetch(url);
        
        const comments = await response.json();

        const container = document.getElementById('comments-container');
        
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
        document.getElementById('comments-container').innerText = "Не вдалося завантажити відгуки.";
    }
}

loadEmployerComments();


document.addEventListener('DOMContentLoaded', () => {
    
    setTimeout(() => {
        const overlay = document.getElementById('modal-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }, 60000);

    const closeBtn = document.getElementById('close-modal');
    const overlay = document.getElementById('modal-overlay');

    if (closeBtn && overlay) {
        closeBtn.addEventListener('click', () => {
            overlay.style.display = 'none';
        });
    }
});


function checkAutoTheme() {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 7 && currentHour < 21) {
        document.body.classList.remove('night-mode');
    } else {
        document.body.classList.add('night-mode');
    }
}

const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('night-mode');
    });
}

checkAutoTheme();