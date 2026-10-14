(function () {

    Render.renderAll(SITE_DATA);

    const { $, $$ } = Render;
    const html = document.documentElement;
    const STORAGE_KEY = 'krino-theme';
    const SNOW_KEY = 'krino-snow';

    function initTheme() {
        const toggle = $('#themeToggle');
        const icon = toggle.querySelector('i');

        if (html.getAttribute('data-theme') === 'dark') {
            icon.classList.replace('fa-moon', 'fa-sun');
            toggle.classList.add('is-on');
        }

        toggle.addEventListener('click', () => {
            const isDark = html.getAttribute('data-theme') === 'dark';
            if (isDark) {
                html.removeAttribute('data-theme');
                icon.classList.replace('fa-sun', 'fa-moon');
                toggle.classList.remove('is-on');
                localStorage.setItem(STORAGE_KEY, 'light');
            } else {
                html.setAttribute('data-theme', 'dark');
                icon.classList.replace('fa-moon', 'fa-sun');
                toggle.classList.add('is-on');
                localStorage.setItem(STORAGE_KEY, 'dark');
            }
        });
    }

    function typeCommand(el, text, speed) {
        return new Promise(resolve => {
            let i = 0;

            const tick = () => {
                if (i >= text.length) {
                    resolve();
                    return;
                }

                const ch = text[i];
                const span = document.createElement('span');
                span.className = 'smooth-char';
                span.textContent = ch === ' ' ? '\u00A0' : ch;
                el.appendChild(span);

                i++;

                const jitter = 0.85 + Math.random() * 0.35;
                setTimeout(tick, speed * jitter);
            };

            tick();
        });
    }

    function initTerminalLoader() {
        const preloader = $('#preloader');
        const body = $('#terminalBody');
        const term = SITE_DATA.terminal;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const speedFactor = reduced ? 0.3 : 0.6;

        const runSequence = async () => {
            for (const c of term.commands) {
                const line = document.createElement('div');
                line.className = 'terminal-line';
                if (c.muted) line.classList.add('muted');
                if (c.info) line.classList.add('info');
                if (c.success) line.classList.add('success');

                const prompt = document.createElement('span');
                prompt.className = 'terminal-prompt';
                prompt.textContent = `${term.user}:~$`;

                const cmd = document.createElement('span');
                cmd.className = 'terminal-cmd';

                line.appendChild(prompt);
                line.appendChild(cmd);
                body.appendChild(line);

                await typeCommand(cmd, c.cmd, c.duration * speedFactor);
                await new Promise(r => setTimeout(r, c.delay * 0.9));
            }

            const cursor = document.createElement('div');
            cursor.className = 'terminal-line';
            cursor.innerHTML = `<span class="terminal-prompt">${term.user}:~$</span><span class="terminal-cursor"></span>`;
            body.appendChild(cursor);

            await new Promise(r => setTimeout(r, 600));

            preloader.classList.add('hidden');
            document.body.classList.add('loaded');

            setTimeout(() => preloader.remove(), 900);
        };

        runSequence();
    }

    function initSnow() {
        const canvas = $('#snowCanvas');
        const ctx = canvas.getContext('2d');
        const toggle = $('#snowToggle');

        let W = 0, H = 0;
        const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
        const isMobile = window.matchMedia('(max-width: 700px)').matches;

        function resize() {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W * DPR;
            canvas.height = H * DPR;
            canvas.style.width = W + 'px';
            canvas.style.height = H + 'px';
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        }
        resize();
        window.addEventListener('resize', resize);

        const COUNT = isMobile ? 30 : 55;
        const flakes = [];
        let running = false;
        let rafId = null;

        function isDark() {
            return document.documentElement.getAttribute('data-theme') === 'dark';
        }

        function createFlake(randomY) {
            return {
                x: Math.random() * W,
                y: randomY ? Math.random() * H : -10,
                r: 0.8 + Math.random() * 1.8,
                vy: 0.25 + Math.random() * 0.55,
                vx: (Math.random() - 0.5) * 0.35,
                phase: Math.random() * Math.PI * 2,
                phaseSpeed: 0.008 + Math.random() * 0.012,
                alpha: 0.35 + Math.random() * 0.5
            };
        }

        for (let i = 0; i < COUNT; i++) flakes.push(createFlake(true));

        function loop() {
            ctx.clearRect(0, 0, W, H);

            const dark = isDark();
            const fill = dark ? 'rgba(220, 235, 255,' : 'rgba(90, 140, 200,';

            for (let i = 0; i < flakes.length; i++) {
                const f = flakes[i];

                f.phase += f.phaseSpeed;
                f.x += f.vx + Math.sin(f.phase) * 0.35;
                f.y += f.vy;

                if (f.y > H + 8) {
                    f.y = -8;
                    f.x = Math.random() * W;
                }
                if (f.x < -10) f.x = W + 10;
                else if (f.x > W + 10) f.x = -10;

                ctx.beginPath();
                ctx.arc(f.x, f.y, f.r, 0, 6.2832);
                ctx.fillStyle = fill + f.alpha + ')';
                ctx.fill();
            }

            rafId = requestAnimationFrame(loop);
        }

        function start() {
            if (running) return;
            running = true;
            canvas.classList.add('active');
            toggle.classList.add('is-on');
            loop();
        }

        function stop() {
            if (!running) return;
            running = false;
            if (rafId) cancelAnimationFrame(rafId);
            ctx.clearRect(0, 0, W, H);
            canvas.classList.remove('active');
            toggle.classList.remove('is-on');
        }

        if (localStorage.getItem(SNOW_KEY) === 'on') {
            start();
        }

        toggle.addEventListener('click', () => {
            if (running) {
                stop();
                localStorage.setItem(SNOW_KEY, 'off');
            } else {
                start();
                localStorage.setItem(SNOW_KEY, 'on');
            }
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = null;
            } else if (running && !rafId) {
                loop();
            }
        });
    }

    function initSmoothScroll() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    initTheme();
    initTerminalLoader();
    initSnow();
    initSmoothScroll();

})();