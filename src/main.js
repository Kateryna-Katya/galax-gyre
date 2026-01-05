/**
 * Galax Gyre 2026 — Core Engine
 * Концепция: Bento Grid Menu & Smooth Experience
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ПЛАВНЫЙ СКРОЛЛ (Lenis) ---
    const initLenis = () => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Синхронизация AOS с Lenis
        lenis.on('scroll', () => {
            if (window.AOS) AOS.refresh();
        });
    };

    // --- 2. НОВОЕ BENTO-МЕНЮ (Раскрытие клипом) ---
    const initBentoMenu = () => {
        const menuBtn = document.getElementById('menuToggle');
        const bentoMenu = document.getElementById('bentoMenu');
        const html = document.documentElement;
        const navLinks = document.querySelectorAll('.mobile-nav__link');

        if (!menuBtn || !bentoMenu) return;

        const toggleMenu = (forceState) => {
            const isOpening = forceState !== undefined ? forceState : !bentoMenu.classList.contains('is-active');
            
            bentoMenu.classList.toggle('is-active', isOpening);
            html.classList.toggle('menu-is-open', isOpening);
            
            // Фиксация скролла
            html.style.overflow = isOpening ? 'hidden' : '';

            // Анимация элементов внутри Bento (если есть GSAP)
            if (isOpening && window.gsap) {
                gsap.fromTo('.bento-menu__item', 
                    { y: 30, opacity: 0 }, 
                    { y: 0, opacity: 1, stagger: 0.05, duration: 0.5, delay: 0.4, ease: "power2.out" }
                );
            }
        };

        menuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMenu();
        });

        // Закрытие по клику на ссылки
        navLinks.forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });

        // Закрытие по Esc
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') toggleMenu(false);
        });
    };

    // --- 3. АНИМАЦИЯ HERO (Без разрыва слов) ---
    const initHeroTypography = () => {
        if (!window.gsap || !window.SplitType) return;

        // Разбиваем только на слова, чтобы не рвать буквы на мобилках
        const heroTitle = new SplitType('.hero__title', { 
            types: 'words', 
            wordClass: 'word' 
        });

        const tl = gsap.timeline({ delay: 0.5 });

        tl.from(heroTitle.words, {
            opacity: 0,
            y: 50,
            stagger: 0.08,
            duration: 1.2,
            ease: "expo.out"
        })
        .from('.hero__text', {
            opacity: 0,
            y: 30,
            duration: 0.8
        }, "-=0.8")
        .from('.hero__btns', {
            opacity: 0,
            y: 20,
            duration: 0.8
        }, "-=0.6");
    };

    // --- 4. КОНТАКТНАЯ ФОРМА И КАПЧА ---
    const initFormHandler = () => {
        const form = document.getElementById('careerForm');
        if (!form) return;

        const phoneInput = document.getElementById('phoneInput');
        const captchaLabel = document.getElementById('captchaLabel');
        const captchaInput = document.getElementById('captchaInput');
        const formMessage = document.getElementById('formMessage');

        // Капча
        let val1, val2;
        const setCaptcha = () => {
            val1 = Math.floor(Math.random() * 10) + 1;
            val2 = Math.floor(Math.random() * 5) + 1;
            if(captchaLabel) captchaLabel.textContent = `Для отправки: ${val1} + ${val2} = ?`;
        };
        setCaptcha();

        // Валидация телефона (только цифры и +)
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^\d+]/g, '');
            });
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (parseInt(captchaInput.value) !== (val1 + val2)) {
                formMessage.textContent = "Неверно решен пример!";
                formMessage.style.color = "#ff4d4d";
                setCaptcha();
                return;
            }

            const btn = form.querySelector('button');
            btn.disabled = true;
            btn.textContent = "Минутку...";

            // Имитация отправки
            setTimeout(() => {
                form.reset();
                formMessage.textContent = "Ваш запрос успешно отправлен!";
                formMessage.style.color = "#BEF264";
                btn.disabled = false;
                btn.textContent = "Отправить запрос";
                setCaptcha();
                
                setTimeout(() => { formMessage.textContent = ""; }, 5000);
            }, 1500);
        });
    };

    // --- 5. COOKIE POPUP ---
    const initCookieAlert = () => {
        const popup = document.getElementById('cookiePopup');
        const btn = document.getElementById('cookieAccept');

        if (!popup || !btn) return;

        if (!localStorage.getItem('galax_v2_cookies')) {
            setTimeout(() => {
                popup.style.display = 'block';
                if (window.gsap) gsap.from(popup, { y: 100, opacity: 0, duration: 0.6 });
            }, 3000);
        }

        btn.addEventListener('click', () => {
            localStorage.setItem('galax_v2_cookies', 'true');
            if (window.gsap) {
                gsap.to(popup, { y: 100, opacity: 0, duration: 0.5, onComplete: () => popup.style.display = 'none' });
            } else {
                popup.style.display = 'none';
            }
        });
    };

    // --- 6. ИНИЦИАЛИЗАЦИЯ СТОРОННИХ МОДУЛЕЙ ---
    const initVendors = () => {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100,
                disable: 'mobile'
            });
        }
        if (window.lucide) lucide.createIcons();
    };

    // --- 7. ЭФФЕКТ ХЕДЕРА ---
    const initHeaderStyle = () => {
        const header = document.querySelector('.header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }
        });
    };

    // ЗАПУСК ВСЕХ СИСТЕМ
    initLenis();
    initVendors();
    initHeaderStyle();
    initBentoMenu();
    initHeroTypography();
    initFormHandler();
    initCookieAlert();

    console.log("🚀 Galax Gyre Engine: Activated.");
});