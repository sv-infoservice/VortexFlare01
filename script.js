gsap.registerPlugin(ScrollTrigger);

// 1. ОПТИМИЗИРОВАННЫЙ ПРЕЛОАДЕР (ПООЧЕРЕДНАЯ СМЕНА СТАТУСОВ)
document.body.style.overflow = "hidden";

let progress = { val: 0 };
const statusText = document.getElementById("status-text");
const progressText = document.getElementById("progress-text");
const loaderProgress = document.querySelector(".loader-progress");

gsap.to(progress, {
    val: 100,
    duration: 4.6,
    roundProps: "val",
    ease: "power1.inOut",
    onUpdate: function() {
        progressText.innerText = progress.val + "%";
        loaderProgress.style.width = progress.val + "%";

        if (progress.val < 25) {
            statusText.innerText = "подгружаем стили...";
        } else if (progress.val >= 25 && progress.val < 50) {
            statusText.innerText = "загружаем сайт...";
        } else if (progress.val >= 50 && progress.val < 75) {
            statusText.innerText = "отрисовываем шрифты...";
        } else {
            statusText.innerText = "подключаем анимации...";
        }
    }
});

setTimeout(() => {
    gsap.to(".preloader", {
        y: "-100%",
        duration: 1.2,
        ease: "power4.inOut",
        onComplete: () => {
            document.querySelector(".preloader").style.display = "none";
            document.body.style.overflow = "auto";
            initAnimations();
        }
    });
}, 5000);

// 2. УЛЬТРА-ПЛАВНЫЙ КУРСОР
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.08, ease: "power2.out" });
});

const hoverElements = document.querySelectorAll('a, button, .filter-btn, .glass-card');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 2.3, background: "transparent", border: "1px solid #6366f1", duration: 0.25 });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, background: "rgba(99, 102, 241, 0.8)", border: "none", duration: 0.25 });
    });
});

// 3. ИНТЕРАКТИВНАЯ СМЕНА ТЕМЫ (Мягкое переключение)
const themeBtn = document.getElementById('theme-btn');
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    themeBtn.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    gsap.fromTo(document.body, { filter: "brightness(1.2)" }, { filter: "brightness(1)", duration: 0.4 });
});

// 4. НЕПРЕРЫВНЫЙ АВТО-ДРЕЙФ СФЕР (Покачивание фона)
gsap.to(".drift-1", { x: "+=60", y: "-=40", duration: 9, repeat: -1, yoyo: true, ease: "sine.inOut" });
gsap.to(".drift-2", { x: "-=50", y: "+=70", duration: 11, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.5 });
gsap.to(".drift-3", { x: "+=40", y: "+=40", duration: 13, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.2 });

// 5. УЛЬТРА-ПЛАВНЫЙ ЭФФЕКТ ПОДЛЁТА КАРТОЧЕК + ОБЪЕМНОЕ ПОКАЧИВАНИЕ (3D Tilt)
const cards = document.querySelectorAll('.glass-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            y: -18,
            scale: 1.025,
            boxShadow: "var(--card-hover-shadow)",
            borderColor: "rgba(99, 102, 241, 0.4)",
            duration: 0.4,
            ease: "power3.out"
        });
    });

    // --- ДОБАВЛЕНО: Объемное покачивание (3D Tilt) ---
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Сила наклона по оси X (можно менять)
        const rotateY = ((x - centerX) / centerX) * 10;  // Сила наклона по оси Y

        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            transformPerspective: 1200,
            duration: 0.4,
            ease: "power2.out"
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            y: 0,
            scale: 1,
            rotateX: 0, // Сброс 3D-наклона
            rotateY: 0,
            boxShadow: "var(--card-shadow)",
            borderColor: "var(--card-border)",
            duration: 0.5,
            ease: "power2.out"
        });
    });
});

// 6. ФИЛЬТР ТАРИФОВ
const filterBtns = document.querySelectorAll('.filter-btn');
const priceCards = document.querySelectorAll('.price-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        priceCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
                card.style.display = 'flex';
                gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
            } else {
                card.style.display = 'none';
            }
        });
        ScrollTrigger.refresh();
    });
});

// 7. ЗАПУСК ОСНОВНЫХ АНИМАЦИЙ ПОСЛЕ ЗАГРУЗКИ
function initAnimations() {
    gsap.from(".hero-title", { y: 60, opacity: 0, duration: 1.4, ease: "power4.out" });
    gsap.from(".hero-subtitle", { y: 40, opacity: 0, duration: 1.2, delay: 0.2, ease: "power3.out" });
    gsap.from(".hero-buttons", { y: 20, opacity: 0, duration: 1, delay: 0.4, ease: "power2.out" });
    gsap.from(".sidebar", { x: -100, opacity: 0, duration: 1.2, ease: "back.out(1.5)", delay: 0.5 });

    const fadeElements = gsap.utils.toArray('.section-header, .cards-grid, .pricing-grid, .cta');
    fadeElements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Интерактивный параллакс сфер от мыши + ОБЩИЙ МИКРО-ПАРАЛЛАКС
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) * 0.025;
        const y = (window.innerHeight / 2 - e.pageY) * 0.025;

        // Параллакс сфер (остался как был)
        gsap.to(".orb-1", { x: x, y: y, duration: 1.2, ease: "power1.out" });
        gsap.to(".orb-2", { x: -x, y: -y, duration: 1.6, ease: "power1.out" });
        gsap.to(".orb-3", { x: x * 1.2, y: y * 1.2, duration: 2, ease: "power1.out" });

        // --- ДОБАВЛЕНО: Общий микро-параллакс контента ---
        const wrapperX = (window.innerWidth / 2 - e.pageX) * 0.008; // Коэффициент 0.008 делает его легким
        const wrapperY = (window.innerHeight / 2 - e.pageY) * 0.008;
        gsap.to(".main-wrapper", { x: wrapperX, y: wrapperY, duration: 1.5, ease: "power2.out" });
    });

    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        ScrollTrigger.create({
            trigger: counter,
            start: "top 90%",
            once: true,
            onEnter: () => {
                let target = +counter.getAttribute('data-target');
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 2.5,
                    snap: { innerHTML: 1 },
                    ease: "power3.out"
                });
            }
        });
    });
}
