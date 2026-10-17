const Render = (function () {
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => root.querySelectorAll(sel);
    let currentLang = 'ru';

    function icon(type, name) {
        return `<i class="${type} ${name}"></i>`;
    }

    function setLang(lang) {
        currentLang = lang;
    }

    function getLang() {
        return currentLang;
    }

    function buildNav(items) {
        $('#navMenu').innerHTML = items
            .map(i => `<a href="#${i.id}">${i[currentLang]}</a>`)
            .join('');
    }

    function buildInfo(info) {
        const paragraphs = (currentLang === 'en' ? info.paragraphsEn : info.paragraphsRu)
            .map(p => `<p>${p}</p>`)
            .join('');
        const contacts = info.contactItems.map((c, idx) => {
            const text = c.text || (currentLang === 'en' ? c.textEn : c.textRu);
            const copyable = c.copy ? ' copyable' : '';
            const tabindex = c.copy ? ' tabindex="0" role="button"' : '';
            return `<div class="contact-item${copyable}" data-contact-idx="${idx}"${tabindex}>
                ${icon(c.type, c.icon)}
                <span>${text}</span>
            </div>`;
        }).join('');
        const contactsTitle = currentLang === 'en' ? info.contactsEn : info.contactsRu;
        const btnText = currentLang === 'en' ? info.contactBtnEn : info.contactBtnRu;
        return `
            <section class="card reveal" id="info">
                <div class="card-header reveal-child">
                    ${icon('fas', info.icon)}
                    <h2>${currentLang === 'en' ? info.titleEn : info.titleRu}</h2>
                </div>
                <div class="info-grid">
                    <div class="info-text reveal-child">${paragraphs}</div>
                    <div class="info-contacts reveal-child">
                        <h3>${contactsTitle}</h3>
                        ${contacts}
                        <button type="button" class="contact-btn" id="contactToggle">
                            <i class="fas fa-paper-plane"></i>
                            <span>${btnText}</span>
                        </button>
                    </div>
                </div>
            </section>
        `;
    }

    function buildStack(data) {
        const items = data.items.map(s => `
            <div class="stack-item ${s.cls || ''}">
                ${icon(s.type || 'fas', s.icon)}
                <span>${s.name}</span>
            </div>
        `).join('');
        return `
            <section class="card reveal" id="stack">
                <div class="card-header reveal-child">
                    ${icon('fas', data.icon)}
                    <h2>${currentLang === 'en' ? data.titleEn : data.titleRu}</h2>
                </div>
                <div class="stack-grid">${items}</div>
            </section>
        `;
    }

    function buildProjects(data) {
        const items = data.items.map(p => {
            const img = p.image
                ? `<img class="project-icon-img" src="${p.image}" alt="${p.title}" loading="lazy" decoding="async">`
                : icon('fas', p.icon);
            return `
                <div class="project-item reveal-child" data-slug="${p.slug || ''}" data-title="${p.title}" tabindex="0" role="button" aria-label="Copy link to ${p.title}">
                    <h3>
                        <span class="item-icon-wrap">${img}</span>
                        <span class="item-title">${p.title}</span>
                    </h3>
                    <div class="project-desc">${currentLang === 'en' ? p.descEn : p.descRu}</div>
                    <div class="tech-tags">
                        ${p.tags.map(t => `<span>${t}</span>`).join('')}
                    </div>
                    <a href="${p.link.href}" class="project-link">
                        ${icon(p.link.type, p.link.icon)} <span class="link-text">${currentLang === 'en' ? p.link.textEn : p.link.textRu}</span> →
                    </a>
                </div>
            `;
        }).join('');
        return `
            <section class="card reveal" id="projects">
                <div class="card-header reveal-child">
                    ${icon('fas', data.icon)}
                    <h2>${currentLang === 'en' ? data.titleEn : data.titleRu}</h2>
                </div>
                <div class="projects-grid">${items}</div>
            </section>
        `;
    }

    function buildGames(data) {
        const items = data.items.map(g => {
            const meta = g.meta.map(m => {
                const text = m.text || (currentLang === 'en' ? m.textEn : m.textRu);
                return `<span>${icon('fas', m.icon)} ${text}</span>`;
            }).join('');
            const external = g.link.href && g.link.href.startsWith('http');
            const extAttrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
            const img = g.image
                ? `<div class="game-image"><img src="${g.image}" alt="${g.title}" loading="lazy" decoding="async"></div>`
                : '';
            const source = g.source ? `
                <a href="${g.source.href}" class="game-link source-link" target="_blank" rel="noopener noreferrer">
                    ${icon(g.source.type, g.source.icon)} <span class="source-text">${currentLang === 'en' ? g.source.textEn : g.source.textRu}</span> →
                </a>
            ` : '';
            return `
                <div class="game-item reveal-child">
                    ${img}
                    <h3>${icon('fas', g.icon)} ${g.title}</h3>
                    <div class="game-meta">${meta}</div>
                    <div class="game-desc">${currentLang === 'en' ? g.descEn : g.descRu}</div>
                    <div class="game-links">
                        <a href="${g.link.href}" class="game-link"${extAttrs}>
                            ${icon(g.link.type, g.link.icon)} <span class="link-text">${currentLang === 'en' ? g.link.textEn : g.link.textRu}</span> →
                        </a>
                        ${source}
                    </div>
                </div>
            `;
        }).join('');
        return `
            <section class="card reveal" id="games">
                <div class="card-header reveal-child">
                    ${icon('fas', data.icon)}
                    <h2>${currentLang === 'en' ? data.titleEn : data.titleRu}</h2>
                </div>
                <div class="games-grid">${items}</div>
            </section>
        `;
    }

    function buildFooter(text) {
        return `
            <div class="glow-line"></div>
            <footer class="footer">${text}</footer>
        `;
    }

    function renderAll(data, lang) {
        if (lang) currentLang = lang;
        buildNav(data.nav);
        const footer = currentLang === 'en' ? data.footerEn : data.footerRu;
        $('#resumeContainer').innerHTML =
            buildInfo(data.info) +
            buildProjects(data.projects) +
            buildGames(data.games) +
            buildStack(data.stack) +
            buildFooter(footer);
    }

    function renderModal() {
        if ($('#contactModal')) return;
        const m = currentLang === 'en' ? SITE_DATA.modal.en : SITE_DATA.modal.ru;
        const wrapper = document.createElement('div');
        wrapper.className = 'modal';
        wrapper.id = 'contactModal';
        wrapper.setAttribute('aria-hidden', 'true');
        wrapper.innerHTML = `
            <div class="modal-backdrop" data-close></div>
            <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="contactTitle">
                <div class="modal-header">
                    <h2 id="contactTitle" data-i18n="modalTitle">${m.modalTitle}</h2>
                    <button class="modal-close" type="button" aria-label="Закрыть" data-close>
                        <i class="fas fa-xmark"></i>
                    </button>
                </div>
                <form class="contact-form" id="contactForm" novalidate>
                    <label class="field">
                        <span class="field-label" data-i18n="fieldName">${m.fieldName}</span>
                        <input type="text" name="name" id="cfName" placeholder="${m.phName}" data-i18n-ph="phName" required maxlength="80">
                    </label>
                    <label class="field">
                        <span class="field-label" data-i18n="fieldEmail">${m.fieldEmail}</span>
                        <input type="email" name="email" id="cfEmail" placeholder="you@example.com" required maxlength="120">
                    </label>
                    <div class="field">
                        <span class="field-label" data-i18n="fieldTopic">${m.fieldTopic}</span>
                        <div class="topic-select" id="topicSelect">
                            <button type="button" class="topic-trigger" id="topicTrigger" aria-haspopup="listbox" aria-expanded="false">
                                <span class="topic-value placeholder" id="topicValue" data-i18n="topicPlaceholder">${m.topicPlaceholder}</span>
                                <i class="fas fa-chevron-down topic-arrow"></i>
                            </button>
                            <ul class="topic-list" id="topicList" role="listbox">
                                <li class="topic-option" role="option" tabindex="-1" data-value="project" data-i18n="topicProject">
                                    <i class="fas fa-rocket"></i>
                                    <span>${m.topicProject}</span>
                                </li>
                                <li class="topic-option" role="option" tabindex="-1" data-value="collab" data-i18n="topicCollab">
                                    <i class="fas fa-handshake"></i>
                                    <span>${m.topicCollab}</span>
                                </li>
                                <li class="topic-option" role="option" tabindex="-1" data-value="feedback" data-i18n="topicFeedback">
                                    <i class="fas fa-lightbulb"></i>
                                    <span>${m.topicFeedback}</span>
                                </li>
                                <li class="topic-option" role="option" tabindex="-1" data-value="other" data-i18n="topicOther">
                                    <i class="fas fa-ellipsis"></i>
                                    <span>${m.topicOther}</span>
                                </li>
                            </ul>
                        </div>
                        <input type="hidden" name="topic" id="cfTopic" required>
                    </div>
                    <label class="field">
                        <span class="field-label" data-i18n="fieldMessage">${m.fieldMessage}</span>
                        <textarea name="message" id="cfMessage" rows="3" placeholder="${m.phMessage}" data-i18n-ph="phMessage" required maxlength="2000"></textarea>
                    </label>
                    <div class="field">
                        <span class="field-label" data-i18n="fieldFiles">${m.fieldFiles}</span>
                        <label class="file-drop" id="fileDrop">
                            <input type="file" id="cfFiles" multiple hidden>
                            <i class="fas fa-paperclip"></i>
                            <span data-i18n="fileDropText">${m.fileDropText}</span>
                        </label>
                        <ul class="file-list" id="fileList"></ul>
                    </div>
                    <div class="form-footer">
                        <span class="form-status" id="formStatus"></span>
                        <button type="submit" class="submit-btn">
                            <i class="fas fa-paper-plane"></i> <span data-i18n="submitBtn">${m.submitBtn}</span>
                        </button>
                    </div>
                </form>
                <div class="modal-success" id="modalSuccess" hidden>
                    <i class="fas fa-circle-check"></i>
                    <h3 data-i18n="successTitle">${m.successTitle}</h3>
                    <p data-i18n="successText">${m.successText}</p>
                    <button type="button" class="submit-btn" data-close data-i18n="closeBtn">${m.closeBtn}</button>
                </div>
            </div>
        `;
        document.body.appendChild(wrapper);
    }

    function applyStaticTranslations(dict) {
        $$('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (dict[key]) el.textContent = dict[key];
        });
        $$('[data-i18n-ph]').forEach(el => {
            const key = el.dataset.i18nPh;
            if (dict[key]) el.placeholder = dict[key];
        });
    }

    function buildWordSpans(text) {
        const words = text.split(' ');
        const result = [];
        words.forEach((word, wi) => {
            if (word.length === 0) {
                result.push({ type: 'space' });
                return;
            }
            const wordEl = document.createElement('span');
            wordEl.className = 'word';
            const chars = [];
            for (let i = 0; i < word.length; i++) {
                const ch = word[i];
                const span = document.createElement('span');
                span.textContent = ch;
                wordEl.appendChild(span);
                chars.push(span);
            }
            result.push({ type: 'word', el: wordEl, chars: chars });
            if (wi < words.length - 1) {
                result.push({ type: 'space' });
            }
        });
        return result;
    }

    function typeText(el, newText, reverse, totalDuration) {
        return new Promise(resolve => {
            if (!el) {
                resolve();
                return;
            }
            const oldText = el.textContent || '';
            if (oldText === newText) {
                resolve();
                return;
            }
            const oldStructure = buildWordSpans(oldText);
            const newStructure = buildWordSpans(newText);
            el.innerHTML = '';
            const oldNodes = [];
            oldStructure.forEach(item => {
                if (item.type === 'space') {
                    const space = document.createTextNode(' ');
                    el.appendChild(space);
                    oldNodes.push({ kind: 'space', el: space });
                } else {
                    el.appendChild(item.el);
                    item.chars.forEach(ch => oldNodes.push({ kind: 'char', el: ch }));
                }
            });
            const totalOldChars = oldNodes.filter(n => n.kind === 'char').length;
            const totalNewChars = newStructure.reduce((sum, item) => {
                if (item.type === 'word') return sum + item.chars.length;
                return sum;
            }, 0);
            const delDur = totalDuration * 0.32;
            const addDur = totalDuration * 0.58;
            const delStep = totalOldChars > 0 ? delDur / totalOldChars : 0;
            const addStep = totalNewChars > 0 ? addDur / totalNewChars : 0;
            let i = 0;
            const delTick = () => {
                if (i >= oldNodes.length) {
                    el.innerHTML = '';
                    setTimeout(addTick, 20);
                    return;
                }
                const idx = reverse ? (oldNodes.length - 1 - i) : i;
                const node = oldNodes[idx];
                if (node.kind === 'char') {
                    node.el.classList.add('char-out');
                    setTimeout(() => {
                        if (node.el.parentNode) node.el.parentNode.removeChild(node.el);
                    }, 180);
                    i++;
                    setTimeout(delTick, delStep);
                } else {
                    i++;
                    delTick();
                }
            };
            let j = 0;
            const addTick = () => {
                if (j >= newStructure.length) {
                    setTimeout(() => {
                        el.textContent = newText;
                        resolve();
                    }, 180);
                    return;
                }
                const item = newStructure[j];
                if (item.type === 'space') {
                    el.appendChild(document.createTextNode(' '));
                    j++;
                    setTimeout(addTick, 8);
                    return;
                }
                el.appendChild(item.el);
                let k = 0;
                const addChar = () => {
                    if (k >= item.chars.length) {
                        j++;
                        setTimeout(addTick, 6);
                        return;
                    }
                    item.chars[k].classList.add('smooth-char');
                    k++;
                    setTimeout(addChar, addStep);
                };
                addChar();
            };
            delTick();
        });
    }

    function processTextElement(el, newText, reverse, duration) {
        return typeText(el, newText, reverse, duration || 700);
    }

    function applyCardText(card, lang, reverse, totalDuration) {
        const promises = [];
        const dur = totalDuration || 900;
        if (card.id === 'info') {
            const info = SITE_DATA.info;
            const title = card.querySelector('.card-header h2');
            if (title) {
                const text = lang === 'en' ? info.titleEn : info.titleRu;
                promises.push(processTextElement(title, text, reverse, dur * 0.5));
            }
            const paragraphs = card.querySelectorAll('.info-text p');
            const pSrc = lang === 'en' ? info.paragraphsEn : info.paragraphsRu;
            paragraphs.forEach((p, i) => {
                if (!pSrc[i]) return;
                const tmp = document.createElement('div');
                tmp.innerHTML = pSrc[i];
                const plain = tmp.textContent || '';
                promises.push(new Promise(res => {
                    setTimeout(() => {
                        processTextElement(p, plain, reverse, dur * 1.2).then(() => {
                            p.innerHTML = pSrc[i];
                            res();
                        });
                    }, i * 60);
                }));
            });
            const contactsTitle = card.querySelector('.info-contacts h3');
            if (contactsTitle) {
                const text = lang === 'en' ? info.contactsEn : info.contactsRu;
                promises.push(processTextElement(contactsTitle, text, reverse, dur * 0.5));
            }
            const items = card.querySelectorAll('.contact-item span');
            info.contactItems.forEach((c, i) => {
                const el = items[i];
                if (!el) return;
                const text = c.text || (lang === 'en' ? c.textEn : c.textRu);
                promises.push(processTextElement(el, text, reverse, dur * 0.6));
            });
            const btn = card.querySelector('.contact-btn span');
            if (btn) {
                const text = lang === 'en' ? info.contactBtnEn : info.contactBtnRu;
                promises.push(processTextElement(btn, text, reverse, dur * 0.5));
            }
        }
        if (card.id === 'stack') {
            const stack = SITE_DATA.stack;
            const title = card.querySelector('.card-header h2');
            if (title) {
                const text = lang === 'en' ? stack.titleEn : stack.titleRu;
                promises.push(processTextElement(title, text, reverse, dur * 0.5));
            }
        }
        if (card.id === 'projects') {
            const title = card.querySelector('.card-header h2');
            if (title) {
                const text = lang === 'en' ? SITE_DATA.projects.titleEn : SITE_DATA.projects.titleRu;
                promises.push(processTextElement(title, text, reverse, dur * 0.5));
            }
            const items = card.querySelectorAll('.project-item');
            SITE_DATA.projects.items.forEach((p, i) => {
                const el = items[i];
                if (!el) return;
                const desc = el.querySelector('.project-desc');
                if (desc) {
                    const text = lang === 'en' ? p.descEn : p.descRu;
                    promises.push(processTextElement(desc, text, reverse, dur * 1.4));
                }
                const linkSpan = el.querySelector('.link-text');
                if (linkSpan) {
                    const text = lang === 'en' ? p.link.textEn : p.link.textRu;
                    promises.push(processTextElement(linkSpan, text, reverse, dur * 0.5));
                }
            });
        }
        if (card.id === 'games') {
            const title = card.querySelector('.card-header h2');
            if (title) {
                const text = lang === 'en' ? SITE_DATA.games.titleEn : SITE_DATA.games.titleRu;
                promises.push(processTextElement(title, text, reverse, dur * 0.5));
            }
            const items = card.querySelectorAll('.game-item');
            SITE_DATA.games.items.forEach((g, i) => {
                const el = items[i];
                if (!el) return;
                const desc = el.querySelector('.game-desc');
                if (desc) {
                    const text = lang === 'en' ? g.descEn : g.descRu;
                    promises.push(processTextElement(desc, text, reverse, dur * 1.4));
                }
                const metas = el.querySelectorAll('.game-meta span');
                g.meta.forEach((m, k) => {
                    const span = metas[k];
                    if (!span) return;
                    const text = m.text || (lang === 'en' ? m.textEn : m.textRu);
                    const iconEl = span.querySelector('i');
                    const iconHTML = iconEl ? iconEl.outerHTML + ' ' : '';
                    span.innerHTML = iconHTML;
                    const holder = document.createElement('span');
                    span.appendChild(holder);
                    promises.push(processTextElement(holder, text, reverse, dur * 0.5));
                });
                const linkSpan = el.querySelector('.link-text');
                if (linkSpan) {
                    const text = lang === 'en' ? g.link.textEn : g.link.textRu;
                    promises.push(processTextElement(linkSpan, text, reverse, dur * 0.5));
                }
                const sourceSpan = el.querySelector('.source-text');
                if (sourceSpan && g.source) {
                    const text = lang === 'en' ? g.source.textEn : g.source.textRu;
                    promises.push(processTextElement(sourceSpan, text, reverse, dur * 0.5));
                }
            });
        }
        return Promise.all(promises);
    }

    function applyFooterText(lang, reverse, duration) {
        const footer = document.querySelector('.footer');
        if (!footer) return Promise.resolve();
        const text = lang === 'en' ? SITE_DATA.footerEn : SITE_DATA.footerRu;
        return processTextElement(footer, text, reverse, duration || 500);
    }

    function applyNavText(lang, reverse, duration) {
        const links = $$('#navMenu a');
        const dur = duration || 400;
        const promises = [];
        SITE_DATA.nav.forEach((item, i) => {
            const el = links[i];
            if (!el) return;
            const text = item[lang];
            promises.push(new Promise(res => {
                setTimeout(() => {
                    processTextElement(el, text, reverse, dur).then(res);
                }, i * 30);
            }));
        });
        return Promise.all(promises);
    }

    return {
        renderAll,
        renderModal,
        applyStaticTranslations,
        applyCardText,
        applyFooterText,
        applyNavText,
        setLang,
        getLang,
        $,
        $$,
        icon
    };
})();
