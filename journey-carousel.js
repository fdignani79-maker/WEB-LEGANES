/**
 * Carrusel de fotos — sección "Jugadores que ya iniciaron su camino"
 */
document.addEventListener('DOMContentLoaded', function () {
    var root = document.querySelector('[data-journey-carousel]');
    if (!root) return;

    var track = root.querySelector('[data-journey-track]');
    var slides = track ? track.querySelectorAll('.journey-carousel__slide') : [];
    var prev = root.querySelector('[data-journey-prev]');
    var next = root.querySelector('[data-journey-next]');
    var dotsContainer = root.querySelector('[data-journey-dots]');
    var viewport = root.querySelector('[data-journey-viewport]') || root.querySelector('.journey-carousel__viewport');
    if (!track || !slides.length || !prev || !next || !dotsContainer) return;

    var index = 0;
    var n = slides.length;
    var autoplayMs = 6000;
    var timer = null;
    var resizeTimer = null;

    function updateViewportHeight() {
        if (!viewport) return;
        var slide = slides[index];
        var img = slide && slide.querySelector('img');
        if (!img) return;

        function apply() {
            var h = img.offsetHeight;
            if (h > 0) {
                viewport.style.height = h + 'px';
            } else {
                requestAnimationFrame(function () {
                    h = img.offsetHeight;
                    if (h > 0) viewport.style.height = h + 'px';
                });
            }
        }

        if (img.complete && (img.naturalWidth > 0 || img.naturalHeight > 0)) {
            apply();
        } else {
            img.addEventListener('load', apply, { once: true });
            img.addEventListener('error', apply, { once: true });
        }
    }

    function go(i) {
        index = ((i % n) + n) % n;
        track.style.transform = 'translateX(-' + index * 100 + '%)';
        slides.forEach(function (s, j) {
            s.setAttribute('aria-hidden', j !== index ? 'true' : 'false');
        });
        var dotBtns = dotsContainer.querySelectorAll('button');
        dotBtns.forEach(function (b, j) {
            b.classList.toggle('is-active', j === index);
            b.setAttribute('aria-selected', j === index ? 'true' : 'false');
        });
        requestAnimationFrame(function () {
            updateViewportHeight();
        });
    }

    function startAutoplay() {
        stopAutoplay();
        timer = setInterval(function () {
            go(index + 1);
        }, autoplayMs);
    }

    function stopAutoplay() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    for (var d = 0; d < n; d++) {
        (function (slideIndex) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.setAttribute('role', 'tab');
            btn.setAttribute('aria-label', (document.documentElement.lang === 'en' ? 'Go to image ' : 'Ir a imagen ') + (slideIndex + 1));
            btn.addEventListener('click', function () {
                go(slideIndex);
                startAutoplay();
            });
            dotsContainer.appendChild(btn);
        })(d);
    }

    prev.addEventListener('click', function () {
        go(index - 1);
        startAutoplay();
    });
    next.addEventListener('click', function () {
        go(index + 1);
        startAutoplay();
    });

    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);
    root.addEventListener('focusin', stopAutoplay);
    root.addEventListener('focusout', function (e) {
        if (!root.contains(e.relatedTarget)) startAutoplay();
    });

    go(0);
    startAutoplay();

    window.addEventListener('resize', function () {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            updateViewportHeight();
        }, 100);
    });
});
