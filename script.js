// ===== HAMBURGER MENU =====
var hamburger = document.getElementById('hamburger');
var navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ===== NAVBAR SCROLL =====
var navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== SCROLL TO TOP =====
var scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== FADE IN ON SCROLL =====
var fadeElements = document.querySelectorAll('.fade-in');

if (fadeElements.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    fadeElements.forEach(function (el) {
        observer.observe(el);
    });
}

// ===== IMAGE SLIDER =====
(function () {
    var track = document.querySelector('.slider-track');
    var slides = document.querySelectorAll('.slide');
    var prevBtn = document.querySelector('.slider-btn.prev');
    var nextBtn = document.querySelector('.slider-btn.next');
    var dotsContainer = document.querySelector('.slider-dots');

    if (!track || !slides.length) return;

    var current = 0;
    var total = slides.length;
    var autoSlide;

    // Create dots
    if (dotsContainer) {
        slides.forEach(function (_, i) {
            var dot = document.createElement('button');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
            dot.addEventListener('click', function () { goTo(i); });
            dotsContainer.appendChild(dot);
        });
    }

    function goTo(index) {
        current = index;
        if (current < 0) current = total - 1;
        if (current >= total) current = 0;
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        updateDots();
    }

    function updateDots() {
        if (!dotsContainer) return;
        var dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach(function (d, i) {
            d.classList.toggle('active', i === current);
        });
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); resetAuto(); });

    function startAuto() { autoSlide = setInterval(function () { goTo(current + 1); }, 4000); }
    function resetAuto() { clearInterval(autoSlide); startAuto(); }
    if (total > 1) startAuto();
})();

// ===== SEARCH BAR =====
(function () {
    var searchInput = document.getElementById('searchInput');
    var searchBtn = document.getElementById('searchBtn');
    var overlay = document.getElementById('searchOverlay');
    var resultsDiv = document.getElementById('searchResults');
    var closeBtn = document.getElementById('closeSearch');

    if (!searchInput || !searchBtn || !overlay || !resultsDiv) return;

    var pages = [
        { title: 'Home', url: 'index.html', desc: 'Cloud Computing overview and intro' },
        { title: 'About', url: 'about.html', desc: 'Learn about our mission and team' },
        { title: 'Services', url: 'services.html', desc: 'IaaS, PaaS, SaaS cloud services' },
        { title: 'Resources', url: 'resources.html', desc: 'Learning resources, platforms & real-life examples' },
        { title: 'Contact', url: 'contact.html', desc: 'Get in touch with us' },
    ];

    function performSearch(query) {
        var q = query.toLowerCase().trim();
        if (!q) { resultsDiv.innerHTML = '<p class="no-results">Type something to search</p>'; return; }

        var results = pages.filter(function (p) {
            return p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
        });

        if (!results.length) {
            resultsDiv.innerHTML = '<p class="no-results">No results found for "' + query + '"</p>';
            return;
        }

        var html = '<h3>Search Results <button class="close-search" id="closeResults">&times;</button></h3>';
        results.forEach(function (r) {
            html += '<div class="search-result-item"><a href="' + r.url + '">' + r.title + '</a><span>' + r.desc + '</span></div>';
        });
        resultsDiv.innerHTML = html;

        var closeResults = document.getElementById('closeResults');
        if (closeResults) closeResults.addEventListener('click', closeSearch);
    }

    function openSearch() {
        overlay.classList.add('open');
        resultsDiv.style.display = 'block';
        performSearch(searchInput.value);
    }

    function closeSearch() {
        overlay.classList.remove('open');
        resultsDiv.style.display = 'none';
    }

    searchBtn.addEventListener('click', openSearch);
    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') openSearch();
    });
    if (closeBtn) closeBtn.addEventListener('click', closeSearch);
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeSearch();
    });
})();

// ===== FORM VALIDATION + LOCAL STORAGE =====
(function () {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var fields = {
        name: { el: document.getElementById('formName'), error: document.getElementById('nameError'), valid: false },
        email: { el: document.getElementById('formEmail'), error: document.getElementById('emailError'), valid: false },
        phone: { el: document.getElementById('formPhone'), error: document.getElementById('phoneError'), valid: false },
        service: { el: document.getElementById('formService'), error: document.getElementById('serviceError'), valid: false },
        message: { el: document.getElementById('formMessage'), error: document.getElementById('msgError'), valid: false },
    };

    var successDiv = document.getElementById('formSuccess');

    // Load from local storage
    var saved = localStorage.getItem('contactFormData');
    if (saved) {
        try {
            var data = JSON.parse(saved);
            Object.keys(fields).forEach(function (key) {
                if (fields[key].el && data[key]) {
                    fields[key].el.value = data[key];
                }
            });
        } catch (e) { /* ignore */ }
    }

    function saveToLocal() {
        var data = {};
        Object.keys(fields).forEach(function (key) {
            if (fields[key].el) data[key] = fields[key].el.value;
        });
        localStorage.setItem('contactFormData', JSON.stringify(data));
    }

    // Auto-save on input
    Object.keys(fields).forEach(function (key) {
        var f = fields[key];
        if (f.el) {
            f.el.addEventListener('input', function () { saveToLocal(); });
            f.el.addEventListener('blur', function () { validateField(key, true); });
        }
    });

    function validateField(key, showValidation) {
        var f = fields[key];
        if (!f || !f.el) return true;
        var val = f.el.value.trim();
        var group = f.el.closest('.form-group');
        var isValid = true;

        switch (key) {
            case 'name':
                isValid = val.length >= 2;
                break;
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
                break;
            case 'phone':
                isValid = /^[6-9]\d{9}$/.test(val);
                break;
            case 'service':
                isValid = val !== '';
                break;
            case 'message':
                isValid = val.length >= 10;
                break;
        }

        f.valid = isValid;
        if (group && showValidation) {
            group.classList.remove('invalid', 'valid');
            group.classList.add(isValid ? 'valid' : 'invalid');
        }
        return isValid;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var allValid = true;
        Object.keys(fields).forEach(function (key) {
            var isValid = validateField(key, false);
            if (!isValid) allValid = false;
            var group = fields[key].el ? fields[key].el.closest('.form-group') : null;
            if (group) {
                if (isValid) {
                    group.classList.remove('invalid');
                } else {
                    group.classList.add('invalid');
                    group.classList.remove('valid');
                }
            }
        });

        if (allValid) {
            localStorage.removeItem('contactFormData');
            form.style.display = 'none';
            if (successDiv) successDiv.classList.add('show');
        } else {
            var firstInvalid = document.querySelector('.form-group.invalid');
            if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
})();

// ===== LIGHTBOX =====
(function () {
    var items = document.querySelectorAll('.gallery-item');
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxCaption = document.getElementById('lightboxCaption');
    var lightboxClose = document.getElementById('lightboxClose');

    if (!items.length || !lightbox) return;

    items.forEach(function (item) {
        item.addEventListener('click', function () {
            var img = item.querySelector('img');
            var overlay = item.querySelector('.overlay h4');
            if (!img) return;
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            if (lightboxCaption) lightboxCaption.textContent = overlay ? overlay.textContent : '';
            lightbox.classList.add('open');
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('open');
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeLightbox();
    });
})();
