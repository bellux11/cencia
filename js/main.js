// ============================================
// TRATTORIA SORA CENCIA v4 — JavaScript
// Carosello, Lightbox, Reveal Animazioni Extra, NO Musica
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // GOOGLE ANALYTICS 4 + EVENT TRACKING
    // ============================================
    const GA_MEASUREMENT_ID = 'G-NFGVK05K1N';

    // Carica gtag.js
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
        'send_page_view': true,
        'anonymize_ip': true,
        'allow_google_signals': true
    });

    // Funzione tracking eventi
    function trackEvent(eventName, params) {
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
        }
    }

    // 1. Click WhatsApp
    document.querySelectorAll('.whatsapp-float, a[href*="wa.me"], a[href*="whatsapp"]').forEach(el => {
        el.addEventListener('click', () => {
            trackEvent('click_whatsapp', {
                event_category: 'engagement',
                event_label: 'whatsapp_button',
                page_location: window.location.href
            });
        });
    });

    // 2. Click Telefono
    document.querySelectorAll('a[href^="tel:"]').forEach(el => {
        el.addEventListener('click', () => {
            trackEvent('click_phone', {
                event_category: 'engagement',
                event_label: el.textContent.trim(),
                page_location: window.location.href
            });
        });
    });

    // 3. Click Email
    document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
        el.addEventListener('click', () => {
            trackEvent('click_email', {
                event_category: 'engagement',
                event_label: 'contact_email',
                page_location: window.location.href
            });
        });
    });

    // 4. Click Indicazioni Stradali
    document.querySelectorAll('a[href*="google.com/maps/dir"]').forEach(el => {
        el.addEventListener('click', () => {
            trackEvent('click_directions', {
                event_category: 'engagement',
                event_label: 'google_maps_directions',
                page_location: window.location.href
            });
        });
    });

    // 5. Click Prenotazione TheFork
    document.querySelectorAll('a[href*="thefork"], .btn-reserve').forEach(el => {
        el.addEventListener('click', () => {
            trackEvent('click_reservation', {
                event_category: 'conversion',
                event_label: 'thefork_reservation',
                page_location: window.location.href
            });
        });
    });

    // 6. Scroll Tracking
    let scroll50 = false, scroll90 = false;
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent > 50 && !scroll50) {
            scroll50 = true;
            trackEvent('scroll_50', { event_category: 'engagement', page_location: window.location.href });
        }
        if (scrollPercent > 90 && !scroll90) {
            scroll90 = true;
            trackEvent('scroll_90', { event_category: 'engagement', page_location: window.location.href });
        }
    });

    // 7. Time on Page
    const startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        trackEvent('time_on_page', {
            event_category: 'engagement',
            value: Math.round((Date.now() - startTime) / 1000),
            page_location: window.location.href
        });
    });

    // 8. Lightbox open tracking
    const originalGalleryItems = document.querySelectorAll('.gallery-item, .gallery-masonry-item');
    originalGalleryItems.forEach(item => {
        const originalClick = item.onclick;
        item.addEventListener('click', () => {
            trackEvent('gallery_lightbox_open', {
                event_category: 'engagement',
                event_label: item.querySelector('img')?.alt || 'gallery_image'
            });
        });
    });



    // --- Navbar scroll ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // --- Mobile menu ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle?.classList.remove('active');
            navLinks?.classList.remove('active');
        });
    });

    // --- Active nav link ---
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 100) {
                current = section.getAttribute('id');
            }
        });
        navItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('href') === '#' + current);
        });
    });

    // ============================================
    // REVEAL ANIMATIONS (Intersection Observer)
    // ============================================
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-spin, .reveal-bounce');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Smooth scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ============================================
    // CAROSELLO
    // ============================================
    const carousel = document.querySelector('.carousel-wrapper');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.parentElement.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.parentElement.querySelector('.carousel-btn.next');
        const dots = carousel.parentElement.querySelectorAll('.carousel-dot');

        let currentSlide = 0;
        const totalSlides = slides.length;
        let autoplayInterval;

        function goToSlide(index) {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            currentSlide = index;
            track.style.transform = `translateX(-${currentSlide * 100}%)`;

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }

        function nextSlide() { goToSlide(currentSlide + 1); }
        function prevSlide() { goToSlide(currentSlide - 1); }

        prevBtn?.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });

        nextBtn?.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetAutoplay();
            });
        });

        function startAutoplay() {
            autoplayInterval = setInterval(nextSlide, 5000);
        }

        function resetAutoplay() {
            clearInterval(autoplayInterval);
            startAutoplay();
        }

        // Touch support
        let touchStartX = 0;
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carousel.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) { nextSlide(); resetAutoplay(); }
            else if (touchEndX - touchStartX > 50) { prevSlide(); resetAutoplay(); }
        });

        startAutoplay();
    }

    // ============================================
    // LIGHTBOX
    // ============================================
    const galleryItems = document.querySelectorAll('.gallery-item, .gallery-masonry-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (!img) return;

            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <img src="${img.src}" alt="${img.alt}">
                <span class="lightbox-close">&times;</span>
            `;
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';

            requestAnimationFrame(() => lightbox.classList.add('active'));

            const closeLightbox = () => {
                lightbox.classList.remove('active');
                setTimeout(() => {
                    lightbox.remove();
                    document.body.style.overflow = '';
                }, 300);
            };

            lightbox.addEventListener('click', closeLightbox);
            lightbox.querySelector('.lightbox-close').addEventListener('click', (e) => {
                e.stopPropagation();
                closeLightbox();
            });

            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    closeLightbox();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        });
    });

    // ============================================
    // PARALLAX EFFECT
    // ============================================
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            hero.style.backgroundPositionY = `${rate}px`;
        });
    }

    // ============================================
    // CURRENT YEAR
    // ============================================
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // ============================================
    // ENTRANCE ANIMATIONS ON LOAD
    // ============================================
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(40px)';
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }

    // ============================================
    // STAGGERED ANIMATION FOR LISTS
    // ============================================
    const staggerContainers = document.querySelectorAll('.menu-categories, .specials-grid, .wines-grid');
    staggerContainers.forEach(container => {
        const children = container.children;
        Array.from(children).forEach((child, i) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(30px)';
            setTimeout(() => {
                child.style.transition = `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`;
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            }, 200);
        });
    });

});