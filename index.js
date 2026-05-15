function toggleMenu() {
    document.querySelector('.header').classList.toggle('active');
}

const header = document.querySelector('.header');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const reveals = document.querySelectorAll('.reveal');
const statNumbers = document.querySelectorAll('.stat-number');
const typingEl = document.querySelector('.typing-text');

let counted = false;
let typeIndex = 0;
let charIndex = 0;
let isDeleting = false;

const phrases = [
    'All You Dream Of is Here!',
    'Fast Food, Faster Delivery!',
    'Taste the Speed!',
    'Fresh. Fast. Delicious.'
];

header.querySelector('.hamburger').addEventListener('click', toggleMenu);

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        header.classList.remove('active');
    });
});

function handleScroll() {
    header.classList.toggle('scrolled', window.scrollY > 50);

    let current = 'home';
    sections.forEach(section => {
        const top = section.offsetTop - 150;
        if (window.scrollY >= top) current = section.id;
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

reveals.forEach(el => observer.observe(el));

function animateCounters() {
    if (counted) return;
    const statsSection = document.querySelector('.stats-grid');
    if (!statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top > window.innerHeight) return;

    counted = true;
    statNumbers.forEach(counter => {
        const target = parseFloat(counter.dataset.target);
        const isFloat = target % 1 !== 0;
        const duration = 2000;
        const step = Math.max(target / 60, isFloat ? 0.05 : 1);
        let current = 0;

        const update = () => {
            current += step;
            if (current >= target) {
                counter.textContent = isFloat ? target.toFixed(1) : Math.floor(target);
                return;
            }
            counter.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
            requestAnimationFrame(update);
        };
        update();
    });
}

function typeEffect() {
    const currentPhrase = phrases[typeIndex];
    const speed = isDeleting ? 40 : 80;

    if (!isDeleting) {
        charIndex++;
        typingEl.textContent = currentPhrase.substring(0, charIndex);

        if (charIndex === currentPhrase.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2000);
            return;
        }
    } else {
        charIndex--;
        typingEl.textContent = currentPhrase.substring(0, charIndex);

        if (charIndex === 0) {
            isDeleting = false;
            typeIndex = (typeIndex + 1) % phrases.length;
            setTimeout(typeEffect, 500);
            return;
        }
    }

    setTimeout(typeEffect, speed);
}

const cards = document.querySelectorAll('[data-tilt]');

cards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -8;
        const rotateY = (x - centerX) / centerX * 8;

        card.style.transform =
            `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

window.addEventListener('scroll', () => {
    handleScroll();
    animateCounters();
});

window.addEventListener('load', () => {
    handleScroll();
    animateCounters();
    if (typingEl) typeEffect();
});
