document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // UTILITY: make a generic slider
    // ==========================================
    function makeSlider({ trackId, prevId, nextId, dotsId, autoInterval, progressBarId, counterId }) {
        const track   = document.getElementById(trackId);
        if (!track) return;

        const slides  = track.querySelectorAll('[class$="-slide"], .v1-slide, .v2-slide, .v3-card-slide');
        let current   = 0;
        let paused    = false;
        let timer     = null;
        const count   = slides.length;

        // Build dots
        const dotsWrap = dotsId ? document.getElementById(dotsId) : null;
        const dots = [];
        if (dotsWrap) {
            for (let i = 0; i < count; i++) {
                const d = document.createElement('div');
                d.className = 'dot' + (i === 0 ? ' active' : '');
                d.addEventListener('click', () => goTo(i));
                dotsWrap.appendChild(d);
                dots.push(d);
            }
        }

        function goTo(index) {
            current = (index + count) % count;
            track.style.transform = `translateX(-${current * 100}%)`;

            // Dots update
            dots.forEach((d, i) => d.classList.toggle('active', i === current));

            // Progress bar
            if (progressBarId) {
                const bar = document.getElementById(progressBarId);
                if (bar) bar.style.width = `${((current + 1) / count) * 100}%`;
            }

            // Counter
            if (counterId) {
                const counter = document.getElementById(counterId);
                if (counter) counter.textContent = `${current + 1} / ${count}`;
            }
        }

        // Nav buttons
        const prevBtn = prevId ? document.getElementById(prevId) : null;
        const nextBtn = nextId ? document.getElementById(nextId) : null;
        if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetTimer(); });

        // Touch swipe
        let touchX = 0;
        track.addEventListener('touchstart', e => { touchX = e.changedTouches[0].screenX; }, { passive: true });
        track.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].screenX - touchX;
            if (Math.abs(dx) > 40) { goTo(current + (dx < 0 ? 1 : -1)); resetTimer(); }
        }, { passive: true });

        // Auto-play
        function startTimer() {
            if (!autoInterval) return;
            timer = setInterval(() => { if (!paused) goTo(current + 1); }, autoInterval);
        }
        function resetTimer() {
            if (!autoInterval) return;
            clearInterval(timer);
            startTimer();
        }

        // Init
        goTo(0);
        startTimer();

        return {
            pause: () => { paused = true; },
            play:  () => { paused = false; }
        };
    }

    // ==========================================
    // VARIANT 1 — Premium Modern
    // ==========================================
    const v1 = makeSlider({
        trackId:   'v1-track',
        prevId:    'v1-prev',
        nextId:    'v1-next',
        dotsId:    'v1-dots',
        autoInterval: 5000,
    });

    // Pause button for V1
    const v1PauseBtn = document.getElementById('v1-pause');
    let v1Playing = true;
    if (v1PauseBtn && v1) {
        v1PauseBtn.addEventListener('click', () => {
            v1Playing = !v1Playing;
            if (v1Playing) {
                v1.play();
                v1PauseBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10 4H6v16h4V4zM18 4h-4v16h4V4z" fill="currentColor"/></svg>`;
            } else {
                v1.pause();
                v1PauseBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 4l14 8-14 8V4z" fill="currentColor"/></svg>`;
            }
        });
    }

    // Rename V1 dots class (they render as .dot, but we need .v1-dot styling):
    const v1DotsWrap = document.getElementById('v1-dots');
    if (v1DotsWrap) {
        v1DotsWrap.querySelectorAll('.dot').forEach(d => {
            d.classList.add('v1-dot');
            d.classList.remove('dot');
        });
        // Re-wire active class
        const observer = new MutationObserver(() => {
            v1DotsWrap.querySelectorAll('.v1-dot').forEach(d => {
                d.classList.toggle('active', d.classList.contains('active'));
            });
        });
    }

    // ==========================================
    // VARIANT 2 — Emotional Focus
    // ==========================================
    const v2Track = document.getElementById('v2-track');
    const v2DotsWrap = document.getElementById('v2-dots');
    if (v2Track && v2DotsWrap) {
        const slides = v2Track.querySelectorAll('.v2-slide');
        const count = slides.length;
        let current = 0;
        let timer;
        const dots = [];

        slides.forEach((_, i) => {
            const d = document.createElement('div');
            d.className = 'v2-dot' + (i === 0 ? ' active' : '');
            d.addEventListener('click', () => { goTo(i); resetTimer(); });
            v2DotsWrap.appendChild(d);
            dots.push(d);
        });

        function goTo(idx) {
            current = (idx + count) % count;
            v2Track.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === current));

            // Animate the blockquote on slide change
            const bq = v2Track.querySelectorAll('.v2-blockquote')[current];
            if (bq) {
                bq.style.animation = 'none';
                requestAnimationFrame(() => { bq.style.animation = 'fadeInUp 0.5s ease'; });
            }
        }

        function startTimer() { timer = setInterval(() => goTo(current + 1), 6000); }
        function resetTimer() { clearInterval(timer); startTimer(); }

        const prevBtn = document.getElementById('v2-prev');
        const nextBtn = document.getElementById('v2-next');
        if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetTimer(); });

        // Swipe
        let touchX = 0;
        v2Track.addEventListener('touchstart', e => { touchX = e.changedTouches[0].screenX; }, { passive: true });
        v2Track.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].screenX - touchX;
            if (Math.abs(dx) > 40) { goTo(current + (dx < 0 ? 1 : -1)); resetTimer(); }
        }, { passive: true });

        goTo(0);
        startTimer();
    }

    // ==========================================
    // VARIANT 3 — Interactive WOW
    // ==========================================
    makeSlider({
        trackId:       'v3-track',
        prevId:        'v3-prev',
        nextId:        'v3-next',
        autoInterval:  5500,
        progressBarId: 'v3-progress-bar',
        counterId:     'v3-counter',
    });

    // Animated counter for V3 stats
    function animateCounter(el, target, suffix) {
        const duration = 1800;
        const start = performance.now();
        function update(now) {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(eased * target) + (suffix || '');
            if (t < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // Trigger counters when V3 section enters viewport
    const v3Section = document.getElementById('v3');
    if (v3Section) {
        const statEls = v3Section.querySelectorAll('.v3-stat-num');
        let counted = false;
        const io = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !counted) {
                counted = true;
                statEls.forEach(el => {
                    const target = parseInt(el.dataset.target);
                    const suffix = el.dataset.target === '200' ? '+' : (el.dataset.target === '7' ? '+' : '.0');
                    animateCounter(el, target, suffix === '.0' ? '' : suffix);
                    if (el.dataset.target === '5') {
                        // Special: show 5.0
                        setTimeout(() => { el.textContent = '5.0'; }, 1850);
                    }
                });
            }
        }, { threshold: 0.3 });
        io.observe(v3Section);
    }

    // Particles for V3
    const particlesContainer = document.getElementById('v3-particles');
    if (particlesContainer) {
        for (let i = 0; i < 14; i++) {
            const p = document.createElement('div');
            p.className = 'v3-particle';
            const size = Math.random() * 120 + 40;
            const delay = Math.random() * 12;
            const duration = Math.random() * 14 + 10;
            const left = Math.random() * 100;
            p.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                opacity: ${Math.random() * 0.3 + 0.05};
            `;
            particlesContainer.appendChild(p);
        }
    }

    // ==========================================
    // VARIANT NAV — active state on scroll
    // ==========================================
    const sections = ['v1', 'v2', 'v3'];
    const navBtns = document.querySelectorAll('.variant-nav__btn');

    const scrollObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navBtns.forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.target === entry.target.id);
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) scrollObs.observe(el);
    });

    // ==========================================
    // FIX: Re-map generic .dot → correct prefix
    // ==========================================
    // V1 dots were generated as .dot by the makeSlider utility —
    // remap them to .v1-dot so CSS applies correctly.
    setTimeout(() => {
        const v1d = document.getElementById('v1-dots');
        if (v1d) {
            v1d.querySelectorAll('.dot').forEach(d => {
                d.classList.add('v1-dot');
                d.classList.remove('dot');
            });
        }
    }, 50);

});
