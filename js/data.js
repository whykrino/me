const SITE_DATA = {
    nav: [
        { id: 'info', ru: 'Информация', en: 'About' },
        { id: 'projects', ru: 'Проекты', en: 'Projects' },
        { id: 'games', ru: 'Игры', en: 'Games' },
        { id: 'stack', ru: 'Стек', en: 'Stack' }
    ],
    terminal: {
        user: 'krino@server',
        commands: [
            { cmd: 'ssh krino@dev.space', delay: 60, duration: 22 },
            { cmd: 'password: ********', delay: 80, duration: 16, muted: true },
            { cmd: 'welcome to krino.dev - mySite', delay: 80, duration: 12, info: true },
            { cmd: 'loading modules...', delay: 60, duration: 16 },
            { cmd: 'mounting info - projects - games - stack', delay: 60, duration: 16 },
            { cmd: 'starting render pipeline', delay: 60, duration: 12 },
            { cmd: 'status: ready', delay: 80, duration: 12, success: true }
        ]
    },
    info: {
        icon: 'fa-user-astronaut',
        titleRu: 'информация',
        titleEn: 'about',
        paragraphsRu: [
            'Привет, я <span class="highlight krino">Арсений Патрушев</span>, в узких кругах известен как <span class="highlight krino">krino</span>.',
            'Пишу в основном на <span class="highlight lang-js">JavaScript</span> и <span class="highlight lang-ts">TypeScript</span>. Сейчас осваиваю <span class="highlight lang-csharp">C#</span> с <span class="highlight lang-unity">Unity</span>.',
            'Если есть предложения по проектам - пишите. Готов поработать даже за идею - мне важнее опыт, чем условия на старте.'
        ],
        paragraphsEn: [
            'Hi, I am <span class="highlight krino">Arseny Patrushev</span>, known as <span class="highlight krino">krino</span> in narrow circles.',
            'I mostly write in <span class="highlight lang-js">JavaScript</span> and <span class="highlight lang-ts">TypeScript</span>. Currently learning <span class="highlight lang-csharp">C#</span> with <span class="highlight lang-unity">Unity</span>.',
            'If you have project offers - write to me. I am ready to work even for an idea - experience matters more to me than conditions at the start.'
        ],
        contactsRu: 'контакты',
        contactsEn: 'contacts',
        contactItems: [
            { icon: 'fa-envelope', text: 'whykrino@gmail.com', type: 'fas', copy: true, toastRu: 'Почта скопирована', toastEn: 'Email copied' },
            { icon: 'fa-github', text: 'github.com/whykrino', type: 'fab', copy: true, copyValue: 'https://github.com/whykrino', toastRu: 'Ссылка на GitHub скопирована', toastEn: 'GitHub link copied' },
            { icon: 'fa-telegram', text: '@whykrino', type: 'fab', copy: true, copyValue: 'https://t.me/whykrino', toastRu: 'Ссылка на Telegram скопирована', toastEn: 'Telegram link copied' },
            { icon: 'fa-map-pin', textRu: 'Москва / Remote', textEn: 'Moscow / Remote', type: 'fas' }
        ],
        contactBtnRu: 'Связаться',
        contactBtnEn: 'Contact me'
    },
    stack: {
        icon: 'fa-layer-group',
        titleRu: 'стек',
        titleEn: 'stack',
        items: [
            { icon: 'fa-js', name: 'JavaScript', cls: 'stack-js', type: 'fab' },
            { icon: 'fa-code', name: 'TypeScript', cls: 'stack-ts', type: 'fas' },
            { icon: 'fa-node-js', name: 'Node.js', cls: 'stack-node', type: 'fab' },
            { icon: 'fa-react', name: 'React', cls: 'stack-react', type: 'fab' },
            { icon: 'fa-html5', name: 'HTML5', cls: '', type: 'fab' },
            { icon: 'fa-css3-alt', name: 'CSS3', cls: '', type: 'fab' },
            { icon: 'fa-hashtag', name: 'C#', cls: 'stack-csharp' },
            { icon: 'fa-cube', name: 'Unity', cls: 'stack-unity' },
            { icon: 'fa-git-alt', name: 'Git', cls: '', type: 'fab' }
        ]
    },
    projects: {
        icon: 'fa-code',
        titleRu: 'проекты',
        titleEn: 'projects',
        items: [
            {
                slug: 'fami-projects',
                icon: 'fa-cube',
                title: 'FAMI Projects',
                image: 'img/famiLogo.png',
                descRu: 'Команда энтузиастов, превращающая идеи в качественные игры на Unity. Мы уделяем внимание каждой детали геймплея, создавая проекты, которые находят отклик в сердцах игроков.',
                descEn: 'A team of enthusiasts turning ideas into quality Unity games. We care about every gameplay detail, creating projects that resonate with players.',
                tags: ['Unity', 'C#', 'Game Design'],
                link: { href: '#', icon: 'fa-github', type: 'fab', textRu: 'Coming soon...', textEn: 'Coming soon...' }
            }
        ]
    },
    games: {
        icon: 'fa-gamepad',
        titleRu: 'игры',
        titleEn: 'games',
        items: [
            {
                icon: 'fa-wind',
                title: 'Shadow Striker',
                image: 'img/shadowStriker.svg',
                meta: [
                    { icon: 'fa-tag', textRu: 'Слэшер / 2D', textEn: 'Slash / 2D' },
                    { icon: 'fa-calendar', text: '2026' }
                ],
                descRu: 'Shadow Strike — атмосферный 2D-слэшер про ниндзя. Рассекай орды монстров мечом, уклоняйся рывком, качай таланты и следи за здоровьем в бою. Тёмная минималистичная графика, плавная анимация, объёмная музыка и живые звуки.',
                descEn: 'Shadow Strike is an atmospheric 2D ninja slasher. Cut through hordes of monsters with your blade, dodge with a dash, upgrade talents and watch your health in combat. Dark minimalist graphics, smooth animation, deep music and lively sound.',
                link: { href: 'https://whykrino.github.io/shadowStriker/', icon: 'fa-arrow-up-right-from-square', type: 'fas', textRu: 'Играть', textEn: 'Play' },
                source: {
                    href: 'https://github.com/whykrino/shadowStriker',
                    icon: 'fa-github',
                    type: 'fab',
                    textRu: 'Исходный код',
                    textEn: 'Source code'
                }
            },
            {
                icon: 'fa-skull',
                title: 'Curse Of Death',
                image: 'img/curseOfDeath.png',
                meta: [
                    { icon: 'fa-tag', textRu: 'Хоррор / Экшен', textEn: 'Horror / Action' },
                    { icon: 'fa-calendar', text: '2023' }
                ],
                descRu: 'Мрачный хоррор, где каждое проклятие приближает тебя к неизбежному. Сражаясь в одиночку с тьмой, ты должен разорвать смертельный круг, пока он не поглотил тебя целиком.',
                descEn: 'A dark horror where every curse brings you closer to the inevitable. Fighting the darkness alone, you must break the deadly circle before it consumes you.',
                link: { href: '#', icon: 'fa-steam', type: 'fab', textRu: 'Coming soon...', textEn: 'Coming soon...' }
            }
        ]
    },
    footerRu: 'krino - 2026',
    footerEn: 'krino - 2026',
    tooltips: {
        ru: {
            lang: 'Сменить язык',
            langOn: 'Переключить на русский',
            snow: 'Включить снег',
            snowOff: 'Выключить снег',
            theme: 'Тёмная тема',
            themeOff: 'Светлая тема',
            toTop: 'Наверх'
        },
        en: {
            lang: 'Change language',
            langOn: 'Switch to Russian',
            snow: 'Enable snow',
            snowOff: 'Disable snow',
            theme: 'Dark theme',
            themeOff: 'Light theme',
            toTop: 'Back to top'
        }
    },
    toast: {
        ru: {
            copied: 'Скопировано в буфер',
            linkCopied: 'Ссылка на проект скопирована',
            copyFailed: 'Не удалось скопировать'
        },
        en: {
            copied: 'Copied to clipboard',
            linkCopied: 'Project link copied',
            copyFailed: 'Failed to copy'
        }
    },
    modal: {
        ru: {
            modalTitle: 'Связаться',
            fieldName: 'Ваше имя',
            fieldEmail: 'Email для связи',
            fieldTopic: 'Тема обращения',
            fieldMessage: 'Описание',
            fieldFiles: 'Прикрепить файлы',
            phName: 'Как к вам обращаться',
            phMessage: 'Опишите ваш вопрос или задачу',
            topicPlaceholder: 'Выберите тему',
            topicProject: 'Новый проект',
            topicCollab: 'Сотрудничество',
            topicFeedback: 'Отзыв или идея',
            topicOther: 'Другое',
            fileDropText: 'Перетащите файлы или нажмите, чтобы выбрать',
            submitBtn: 'Отправить',
            successTitle: 'Сообщение отправлено',
            successText: 'Спасибо! Я свяжусь с вами в ближайшее время.',
            closeBtn: 'Закрыть',
            errFill: 'Заполните все обязательные поля',
            errEmail: 'Проверьте правильность email',
            errFilesMax: 'Максимум 5 файлов',
            errFileSize: 'слишком большой (макс. 5 МБ)'
        },
        en: {
            modalTitle: 'Contact me',
            fieldName: 'Your name',
            fieldEmail: 'Email for reply',
            fieldTopic: 'Subject',
            fieldMessage: 'Message',
            fieldFiles: 'Attach files',
            phName: 'How should I address you',
            phMessage: 'Describe your question or task',
            topicPlaceholder: 'Choose a topic',
            topicProject: 'New project',
            topicCollab: 'Collaboration',
            topicFeedback: 'Feedback or idea',
            topicOther: 'Other',
            fileDropText: 'Drag files here or click to choose',
            submitBtn: 'Send',
            successTitle: 'Message sent',
            successText: 'Thank you! I will get back to you soon.',
            closeBtn: 'Close',
            errFill: 'Please fill in all required fields',
            errEmail: 'Please check your email',
            errFilesMax: 'Maximum 5 files',
            errFileSize: 'is too large (max 5 MB)'
        }
    }
};
