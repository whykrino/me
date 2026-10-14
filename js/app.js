(function () {

    Render.renderAll(SITE_DATA);

    const { $, $$ } = Render;
    const html = document.documentElement;
    const STORAGE_KEY = 'krino-theme';

    function initTheme() {
        const toggle = $('#themeToggle');
        const icon = toggle.querySelector('i');

        if (html.getAttribute('data-theme') === 'dark') {
            icon.classList.replace('fa-moon', 'fa-sun');
        }

        toggle.addEventListener('click', () => {
            const isDark = html.getAttribute('data-theme') === 'dark';
            if (isDark) {
                html.removeAttribute('data-theme');
                icon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem(STORAGE_KEY, 'light');
            } else {
                html.setAttribute('data-theme', 'dark');
                icon.classList.replace('fa-moon', 'fa-sun');
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
    initSmoothScroll();

})();