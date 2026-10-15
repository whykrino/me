(function () {
    const LANG_KEY = 'krino-lang';
    const STORAGE_KEY = 'krino-theme';
    const SNOW_KEY = 'krino-snow';
    const storedLang = localStorage.getItem(LANG_KEY);
    if (!storedLang) {
        localStorage.setItem(LANG_KEY, 'en');
    }
    let currentLang = (storedLang || 'en') === 'ru' ? 'ru' : 'en';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    Render.renderAll(SITE_DATA, currentLang);
    Render.renderModal();
    const { $, $$ } = Render;
    const html = document.documentElement;
    html.setAttribute('lang', currentLang);

    function isSnowSeason() {
        const now = new Date();
        const m = now.getMonth() + 1;
        const d = now.getDate();
        if (m > 10) return true;
        if (m < 4) return true;
        if (m === 10 && d >= 15) return true;
        if (m === 4 && d < 1) return false;
        return false;
    }

    const activeTimeouts = new Set();
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function (fn, delay, ...args) {
        const id = originalSetTimeout(fn, delay, ...args);
        activeTimeouts.add(id);
        originalSetTimeout(() => activeTimeouts.delete(id), (delay || 0) + 100);
        return id;
    };

    function pauseAllTimers() {
        activeTimeouts.forEach(id => clearTimeout(id));
        activeTimeouts.clear();
    }

    let toastTimer = null;
    function showToast(text) {
        const toast = $('#toast');
        if (!toast) return;
        toast.innerHTML = `<i class="fas fa-circle-check"></i> ${text}`;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 2200);
    }

    async function copyText(text, successMessage) {
        if (!successMessage) {
            successMessage = SITE_DATA.toast[currentLang].copied;
        }
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                ta.style.pointerEvents = 'none';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }
            showToast(successMessage);
        } catch (e) {
            showToast(SITE_DATA.toast[currentLang].copyFailed);
        }
    }

    function initCopyContacts() {
        const container = $('#info');
        if (!container) return;
        const handle = (item) => {
            const idx = +item.dataset.contactIdx;
            const contact = SITE_DATA.info.contactItems[idx];
            if (!contact || !contact.copy) return;
            const value = contact.copyValue || contact.text;
            const toastText = currentLang === 'en' ? contact.toastEn : contact.toastRu;
            copyText(value, toastText);
        };
        container.addEventListener('click', (e) => {
            const item = e.target.closest('.contact-item.copyable');
            if (item) handle(item);
        });
        container.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            const item = e.target.closest('.contact-item.copyable');
            if (!item) return;
            e.preventDefault();
            handle(item);
        });
    }

    function initCopyProjects() {
        const container = $('#projects');
        if (!container) return;
        const handle = (item) => {
            const slug = item.dataset.slug;
            if (!slug) return;
            const url = `${location.origin}${location.pathname}#${slug}`;
            copyText(url, SITE_DATA.toast[currentLang].linkCopied);
        };
        container.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;
            const item = e.target.closest('.project-item');
            if (item) handle(item);
        });
        container.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            if (e.target.closest('a')) return;
            const item = e.target.closest('.project-item');
            if (!item) return;
            e.preventDefault();
            handle(item);
        });
    }

    function setTheme(dark) {
        if (dark) {
            html.setAttribute('data-theme', 'dark');
        } else {
            html.removeAttribute('data-theme');
        }
    }

    function getThemeTooltip() {
        const t = SITE_DATA.tooltips[currentLang];
        const isDark = html.getAttribute('data-theme') === 'dark';
        return isDark ? t.themeOff : t.theme;
    }

    function getSnowTooltip() {
        const t = SITE_DATA.tooltips[currentLang];
        const toggle = $('#snowToggle');
        const on = toggle && toggle.classList.contains('is-on');
        return on ? t.snowOff : t.snow;
    }

    function getLangTooltip() {
        const t = SITE_DATA.tooltips[currentLang];
        const next = currentLang === 'ru' ? 'en' : 'ru';
        return next === 'ru' ? t.langOn : t.lang;
    }

    function refreshTooltips() {
        const lang = $('#langToggle');
        if (lang) lang.dataset.tooltip = getLangTooltip();
        const snow = $('#snowToggle');
        if (snow) snow.dataset.tooltip = getSnowTooltip();
        const theme = $('#themeToggle');
        if (theme) theme.dataset.tooltip = getThemeTooltip();
        const top = $('#toTop');
        if (top) top.dataset.tooltip = SITE_DATA.tooltips[currentLang].toTop;
    }

    function initTooltips() {
        const tip = $('#tooltip');
        if (!tip) return;
        let showTimer = null;
        let currentTarget = null;
        function positionTip(target) {
            const rect = target.getBoundingClientRect();
            const tipRect = tip.getBoundingClientRect();
            let left = rect.left + rect.width / 2 - tipRect.width / 2;
            let top = rect.top - tipRect.height - 10;
            if (left < 8) left = 8;
            if (left + tipRect.width > window.innerWidth - 8) {
                left = window.innerWidth - tipRect.width - 8;
            }
            if (top < 8) {
                top = rect.bottom + 10;
                tip.classList.add('below');
            } else {
                tip.classList.remove('below');
            }
            tip.style.left = left + 'px';
            tip.style.top = top + 'px';
        }
        function show(target) {
            const text = target.dataset.tooltip;
            if (!text) return;
            currentTarget = target;
            tip.textContent = text;
            tip.setAttribute('aria-hidden', 'false');
            tip.style.left = '-9999px';
            tip.style.top = '0';
            tip.classList.add('show');
            requestAnimationFrame(() => positionTip(target));
        }
        function hide() {
            clearTimeout(showTimer);
            currentTarget = null;
            tip.classList.remove('show');
            tip.setAttribute('aria-hidden', 'true');
        }
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('[data-tooltip]');
            if (!target || target === currentTarget) return;
            clearTimeout(showTimer);
            const delay = currentTarget ? 0 : 350;
            showTimer = setTimeout(() => show(target), delay);
        });
        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest('[data-tooltip]');
            if (!target) return;
            const related = e.relatedTarget && e.relatedTarget.closest('[data-tooltip]');
            if (related === target) return;
            hide();
        });
        document.addEventListener('focusin', (e) => {
            const target = e.target.closest('[data-tooltip]');
            if (target) {
                clearTimeout(showTimer);
                show(target);
            }
        });
        document.addEventListener('focusout', (e) => {
            const target = e.target.closest('[data-tooltip]');
            if (target) hide();
        });
        window.addEventListener('scroll', () => {
            if (currentTarget) positionTip(currentTarget);
        }, { passive: true });
        window.addEventListener('resize', () => {
            if (currentTarget) positionTip(currentTarget);
        });
    }

    function initTheme() {
        const toggle = $('#themeToggle');
        const icon = toggle.querySelector('i');
        const apply = (dark) => {
            if (dark) {
                icon.classList.replace('fa-moon', 'fa-sun');
                toggle.classList.add('is-on');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
                toggle.classList.remove('is-on');
            }
        };
        apply(html.getAttribute('data-theme') === 'dark');
        toggle.addEventListener('click', () => {
            const isDark = html.getAttribute('data-theme') === 'dark';
            const next = !isDark;
            setTheme(next);
            apply(next);
            localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
            toggle.dataset.tooltip = getThemeTooltip();
        });
        const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
        if (mq) {
            const handler = (e) => {
                if (localStorage.getItem(STORAGE_KEY)) return;
                setTheme(e.matches);
                apply(e.matches);
                toggle.dataset.tooltip = getThemeTooltip();
            };
            if (mq.addEventListener) mq.addEventListener('change', handler);
            else if (mq.addListener) mq.addListener(handler);
        }
    }

    async function translateAll(nextLang, reverse) {
        const cards = $$('.card');
        const blockDuration = 800;
        if (reducedMotion) {
            Render.renderAll(SITE_DATA, nextLang);
            Render.renderModal();
            Render.applyStaticTranslations(SITE_DATA.modal[nextLang]);
            initCopyContacts();
            initCopyProjects();
            initModalAutosize();
            const code = $('#langCode');
            if (code) code.textContent = nextLang.toUpperCase();
            currentLang = nextLang;
            Render.setLang(nextLang);
            html.setAttribute('lang', nextLang);
            localStorage.setItem(LANG_KEY, nextLang);
            refreshTooltips();
            return;
        }
        const tasks = [];
        cards.forEach(card => {
            tasks.push(Render.applyCardText(card, nextLang, reverse, blockDuration));
        });
        tasks.push(Render.applyFooterText(nextLang, reverse, 450));
        tasks.push(Render.applyNavText(nextLang, reverse, 350));
        await Promise.all(tasks);
        currentLang = nextLang;
        Render.setLang(nextLang);
        html.setAttribute('lang', nextLang);
        localStorage.setItem(LANG_KEY, nextLang);
        Render.applyStaticTranslations(SITE_DATA.modal[nextLang]);
        const code = $('#langCode');
        if (code) code.textContent = nextLang.toUpperCase();
        refreshTooltips();
    }

    function initLangToggle() {
        const toggle = $('#langToggle');
        const code = $('#langCode');
        if (code) code.textContent = currentLang.toUpperCase();
        if (currentLang === 'en') {
            Render.applyStaticTranslations(SITE_DATA.modal.en);
        }
        toggle.dataset.tooltip = getLangTooltip();
        let busy = false;
        toggle.addEventListener('click', async () => {
            if (busy) return;
            busy = true;
            const next = currentLang === 'ru' ? 'en' : 'ru';
            const reverse = currentLang === 'en';
            try {
                await translateAll(next, reverse);
            } catch (e) {
                console.warn(e);
            }
            busy = false;
        });
    }

    function typeCommand(el, text, speed) {
        return new Promise(resolve => {
            let i = 0;
            const tick = () => {
                if (document.hidden) {
                    setTimeout(tick, 100);
                    return;
                }
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
        const speedFactor = reducedMotion ? 0.05 : 0.6;
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
        if (reducedMotion || !isSnowSeason()) {
            toggle.style.display = 'none';
            return;
        }
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
            if (document.hidden) {
                rafId = null;
                return;
            }
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
            if (rafId) return;
            canvas.classList.add('active');
            toggle.classList.add('is-on');
            toggle.dataset.tooltip = getSnowTooltip();
            loop();
        }
        function stop() {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = null;
            ctx.clearRect(0, 0, W, H);
            canvas.classList.remove('active');
            toggle.classList.remove('is-on');
            toggle.dataset.tooltip = getSnowTooltip();
        }
        if (localStorage.getItem(SNOW_KEY) === 'on') {
            start();
        }
        toggle.addEventListener('click', () => {
            if (rafId) {
                stop();
                localStorage.setItem(SNOW_KEY, 'off');
            } else {
                start();
                localStorage.setItem(SNOW_KEY, 'on');
            }
        });
        window.__snow = {
            start,
            stop,
            isRunning: () => !!rafId,
            resume: () => {
                if (localStorage.getItem(SNOW_KEY) === 'on' && !rafId) start();
            }
        };
    }

    function autosizeTextarea(el) {
        if (!el) return;
        el.style.height = 'auto';
        const maxH = 260;
        const newH = Math.min(el.scrollHeight, maxH);
        el.style.height = newH + 'px';
        el.style.overflowY = el.scrollHeight > maxH ? 'auto' : 'hidden';
    }

    function initModalAutosize() {
        const msg = $('#cfMessage');
        if (!msg) return;
        msg.setAttribute('rows', '3');
        autosizeTextarea(msg);
        msg.addEventListener('input', () => autosizeTextarea(msg));
    }

    function initContactModal() {
        const modal = $('#contactModal');
        const openBtn = $('#contactToggle');
        const form = $('#contactForm');
        const fileInput = $('#cfFiles');
        const fileDrop = $('#fileDrop');
        const fileList = $('#fileList');
        const status = $('#formStatus');
        const success = $('#modalSuccess');
        const topicSelect = $('#topicSelect');
        const topicTrigger = $('#topicTrigger');
        const topicList = $('#topicList');
        const topicValue = $('#topicValue');
        const topicInput = $('#cfTopic');
        const topicOptions = topicList.querySelectorAll('.topic-option');
        if (!openBtn || openBtn.dataset.bound === '1') return;
        openBtn.dataset.bound = '1';
        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        const MAX_FILES = 5;
        let attached = [];
        function txt(key) {
            return SITE_DATA.modal[currentLang][key];
        }
        function open() {
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-lock');
            setTimeout(() => {
                const msg = $('#cfMessage');
                if (msg) autosizeTextarea(msg);
                $('#cfName').focus();
            }, 250);
        }
        function close() {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-lock');
            closeTopic();
        }
        function escapeKey(e) {
            if (e.key !== 'Escape') return;
            if (topicSelect.classList.contains('is-open')) {
                closeTopic();
                topicTrigger.focus();
            } else {
                close();
            }
        }
        function formatSize(bytes) {
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
            return (bytes / 1024 / 1024).toFixed(2) + ' MB';
        }
        function renderFiles() {
            fileList.innerHTML = '';
            attached.forEach((file, idx) => {
                const li = document.createElement('li');
                li.className = 'file-item';
                const name = document.createElement('span');
                name.className = 'file-name';
                name.textContent = file.name;
                const size = document.createElement('span');
                size.className = 'file-size';
                size.textContent = formatSize(file.size);
                const rm = document.createElement('button');
                rm.type = 'button';
                rm.className = 'file-remove';
                rm.setAttribute('aria-label', 'Remove');
                rm.innerHTML = '<i class="fas fa-xmark"></i>';
                rm.addEventListener('click', () => {
                    attached.splice(idx, 1);
                    renderFiles();
                });
                li.appendChild(name);
                li.appendChild(size);
                li.appendChild(rm);
                fileList.appendChild(li);
            });
        }
        function addFiles(list) {
            const incoming = Array.from(list);
            for (const f of incoming) {
                if (attached.length >= MAX_FILES) {
                    status.textContent = txt('errFilesMax');
                    status.className = 'form-status error';
                    break;
                }
                if (f.size > MAX_FILE_SIZE) {
                    status.textContent = `"${f.name}" ${txt('errFileSize')}`;
                    status.className = 'form-status error';
                    continue;
                }
                attached.push(f);
            }
            renderFiles();
        }
        function openTopic() {
            topicSelect.classList.add('is-open');
            topicTrigger.setAttribute('aria-expanded', 'true');
        }
        function closeTopic() {
            topicSelect.classList.remove('is-open');
            topicTrigger.setAttribute('aria-expanded', 'false');
        }
        function selectTopic(opt) {
            const val = opt.dataset.value;
            const key = opt.dataset.i18n;
            const label = key ? SITE_DATA.modal[currentLang][key] : opt.querySelector('span').textContent;
            topicInput.value = val;
            topicValue.textContent = label;
            topicValue.classList.remove('placeholder');
            topicOptions.forEach(o => {
                const on = o === opt;
                o.classList.toggle('is-selected', on);
                o.setAttribute('aria-selected', on ? 'true' : 'false');
            });
            closeTopic();
            topicTrigger.focus();
            status.textContent = '';
            status.className = 'form-status';
        }
        openBtn.addEventListener('click', open);
        modal.addEventListener('click', (e) => {
            if (e.target.closest('[data-close]')) close();
        });
        document.addEventListener('keydown', escapeKey);
        fileInput.addEventListener('change', () => {
            addFiles(fileInput.files);
            fileInput.value = '';
        });
        ['dragenter', 'dragover'].forEach(evt => {
            fileDrop.addEventListener(evt, (e) => {
                e.preventDefault();
                fileDrop.classList.add('is-drag');
            });
        });
        ['dragleave', 'drop'].forEach(evt => {
            fileDrop.addEventListener(evt, (e) => {
                e.preventDefault();
                fileDrop.classList.remove('is-drag');
            });
        });
        fileDrop.addEventListener('drop', (e) => {
            if (e.dataTransfer && e.dataTransfer.files) {
                addFiles(e.dataTransfer.files);
            }
        });
        topicTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (topicSelect.classList.contains('is-open')) {
                closeTopic();
            } else {
                openTopic();
            }
        });
        topicTrigger.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openTopic();
                const first = topicList.querySelector('.topic-option');
                if (first) first.focus();
            }
        });
        topicList.addEventListener('click', (e) => {
            const opt = e.target.closest('.topic-option');
            if (opt) selectTopic(opt);
        });
        topicList.addEventListener('keydown', (e) => {
            const current = document.activeElement.closest('.topic-option');
            if (!current) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const next = current.nextElementSibling || topicOptions[0];
                next.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prev = current.previousElementSibling || topicOptions[topicOptions.length - 1];
                prev.focus();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectTopic(current);
            } else if (e.key === 'Tab') {
                closeTopic();
            }
        });
        document.addEventListener('click', (e) => {
            if (!topicSelect.contains(e.target)) closeTopic();
        });
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = $('#cfName').value.trim();
            const email = $('#cfEmail').value.trim();
            const topic = topicInput.value;
            const message = $('#cfMessage').value.trim();
            if (!name || !email || !topic || !message) {
                status.textContent = txt('errFill');
                status.className = 'form-status error';
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                status.textContent = txt('errEmail');
                status.className = 'form-status error';
                return;
            }
            status.textContent = '...';
            status.className = 'form-status sending';
            setTimeout(() => {
                form.hidden = true;
                success.hidden = false;
            }, 900);
        });
        modal.addEventListener('transitionend', () => {
            if (!modal.classList.contains('is-open')) {
                form.hidden = false;
                success.hidden = true;
                form.reset();
                attached = [];
                renderFiles();
                status.textContent = '';
                status.className = 'form-status';
                topicInput.value = '';
                topicValue.textContent = txt('topicPlaceholder');
                topicValue.classList.add('placeholder');
                topicOptions.forEach(o => {
                    o.classList.remove('is-selected');
                    o.setAttribute('aria-selected', 'false');
                });
                closeTopic();
                const msg = $('#cfMessage');
                if (msg) autosizeTextarea(msg);
            }
        });
    }

    function initReveal() {
        const cards = $$('.card');
        const children = $$('.reveal-child');
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    card.classList.add('reveal-in');
                    const cardChildren = card.querySelectorAll('.reveal-child');
                    cardChildren.forEach((child, idx) => {
                        child.style.transitionDelay = (idx * 90) + 'ms';
                    });
                    cardObserver.unobserve(card);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
        cards.forEach(c => cardObserver.observe(c));
        const childObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-in-child');
                    childObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
        children.forEach(c => childObserver.observe(c));
    }

    function initNavActive() {
        const links = $$('#navMenu a');
        if (!links.length) return;
        const sections = Array.from(links)
            .map(a => document.querySelector(a.getAttribute('href')))
            .filter(Boolean);
        const setActive = (id) => {
            links.forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === '#' + id);
            });
        };
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActive(entry.target.id);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '-30% 0px -55% 0px'
        });
        sections.forEach(s => io.observe(s));
    }

    function initToTop() {
        const btn = $('#toTop');
        if (!btn) return;
        btn.dataset.tooltip = SITE_DATA.tooltips[currentLang].toTop;
        let raf = null;
        function update() {
            raf = null;
            const show = window.scrollY > 400;
            btn.classList.toggle('show', show);
        }
        window.addEventListener('scroll', () => {
            if (!raf) raf = requestAnimationFrame(update);
        }, { passive: true });
        update();
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
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

    function initVisibilityHandler() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                pauseAllTimers();
                if (window.__snow && window.__snow.isRunning()) {
                    window.__snow.stop();
                }
                window.__pausedByVisibility = true;
            } else {
                if (window.__pausedByVisibility) {
                    window.__pausedByVisibility = false;
                    if (window.__snow) {
                        window.__snow.resume();
                    }
                }
            }
        });
    }

    initTheme();
    initTerminalLoader();
    initSnow();
    initLangToggle();
    initContactModal();
    initModalAutosize();
    initCopyContacts();
    initCopyProjects();
    initReveal();
    initNavActive();
    initToTop();
    initSmoothScroll();
    initVisibilityHandler();
    initTooltips();
    refreshTooltips();
})();