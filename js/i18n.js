const translations = {
    'zh': {
        'nav_home': '首页',
        'nav_flavors': '特色',
        'nav_menu': '作品',
        'nav_contact': '联系',
        'hero_tag': '2026 全新季',
        'hero_title': '挤出每一天的<br>创造力。',
        'hero_desc': '像鲜榨果汁一样纯粹的设计，为您带来最清新的数字体验。每一滴灵感都来自 100% 的热情。',
        'btn_view_menu': '查看作品',
        'btn_watch_video': '观看视频',
        'flavors_title': '我们的<span>新鲜</span>特色',
        'flavors_desc': '我们提供多种口味的数字服务，满足您的不同需求。',
        'flavor_game_title': '合成大西瓜',
        'flavor_game_desc': '经典合成西瓜小游戏，点击此处在线游玩，尽享欢乐时光！',
        'game_timer_label': '时间',
        'game_next': '下三个',
        'game_score_label': '分数',
        'btn_game_reset': '重置游戏',
        'btn_game_start': '开始游戏',
        'flavor_web_title': 'Web 开发',
        'flavor_web_desc': '清洁高效的代码结构，保证网站运行如同冰镇果汁般流畅爽滑。',
        'flavor_photo_title': '摄影',
        'flavor_photo_desc': '捕捉光影的瞬间，保留最真实鲜活的色彩，为您呈现高保真的视觉盛宴。',
        'flavor_run_title': '熊大快跑',
        'flavor_run_desc': '刺激的跑酷游戏，化身熊大躲避障碍，收集金币，看看你能跑多远！',
        'run_game_time': '生存时间',
        'run_game_score': '分数',
        'menu_title': '当季<span>作品</span>',
        'menu_desc': '查看我们要最新鲜出炉的作品。',
        'menu_work1': '原神',
        'menu_app': '开放世界冒险RPG',
        'menu_work2': '崩坏：星穹铁道',
        'menu_brand': '银河冒险策略游戏',
        'menu_work3': '绝区零',
        'menu_illu': '全新动作游戏',
        'menu_work4': '鸣潮',
        'menu_mc_desc': '开放世界动作游戏',
        'news_title': '保持新鲜 & 获取更新',
        'news_desc': '订阅我们的周报，获取最新的设计趋势和果汁配方。',
        'placeholder_email': '输入您的邮箱...',
        'btn_subscribe': '立即订阅',
        'footer_rights': '&copy; 2026 Juiceeee Design. 不保留所有权利。',
        'preloader_txt': '正在鲜榨...'
    },
    'en': {
        'nav_home': 'Home',
        'nav_flavors': 'Flavors',
        'nav_menu': 'Menu',
        'nav_contact': 'Contact',
        'hero_tag': 'New Season 2026',
        'hero_title': 'Squeeze the Day<br>With Creativity.',
        'hero_desc': 'Pure design like fresh juice, bringing you the freshest digital experience. Every drop of inspiration comes from 100% passion.',
        'btn_view_menu': 'View Menu',
        'btn_watch_video': 'Watch Video',
        'flavors_title': 'Our <span>Fresh</span> Flavors',
        'flavors_desc': 'We offer a variety of digital service flavors to meet your needs.',
        'flavor_game_title': 'Merge Watermelon',
        'flavor_game_desc': 'The classic merge game. Click here to play online and enjoy happy moments!',
        'game_timer_label': 'Time',
        'game_next': 'Next',
        'game_score_label': 'Score',
        'btn_game_reset': 'Reset',
        'btn_game_start': 'Start',
        'flavor_web_title': 'Web Dev',
        'flavor_web_desc': 'Clean and efficient code, ensuring your website runs as smooth as iced juice.',
        'flavor_photo_title': 'Photography',
        'flavor_photo_desc': 'Capturing light and shadow to retain the truest vivid colors for a visual feast.',
        'flavor_run_title': 'Xiong Da Run',
        'flavor_run_desc': 'Exciting parkour game! Play as Xiong Da, dodge obstacles, collect coins, and see how far you can run!',
        'run_game_time': 'Time',
        'run_game_score': 'Score',
        'menu_title': 'Seasonal <span>Menu</span>',
        'menu_desc': 'Check out our freshly squeezed works.',
        'menu_work1': 'Genshin Impact',
        'menu_app': 'Open-World Action RPG',
        'menu_work2': 'Honkai: Star Rail',
        'menu_brand': 'Space Fantasy RPG',
        'menu_work3': 'Zenless Zone Zero',
        'menu_illu': 'Urban Fantasy ARPG',
        'menu_work4': 'Wuthering Waves',
        'menu_mc_desc': 'Open-World Action RPG',
        'news_title': 'Stay Fresh & Updated',
        'news_desc': 'Subscribe to our newsletter for the latest design trends and juice recipes.',
        'placeholder_email': 'Enter your email...',
        'btn_subscribe': 'Subscribe Now',
        'footer_rights': '&copy; 2026 Juiceeee Design. No rights reserved.',
        'preloader_txt': 'Squeezing...'
    }
};

function getLanguage() {
    let lang = localStorage.getItem("site_lang");
    if (!lang) {
        lang = navigator.language.toLowerCase().startsWith("en") ? "en" : "zh";
        localStorage.setItem("site_lang", lang);
    }
    return 'zh'; // 强制默认中文
}

function setLang(lang) {
    localStorage.setItem("site_lang", lang);
    applyLanguage(lang);
}

function applyLanguage(lang) {
    const dict = translations[lang] || translations["zh"];
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (dict[key]) {
            if (el.tagName === "INPUT") {
                el.placeholder = dict[key];
            } else {
                el.innerHTML = dict[key];
            }
        }
    });

    document.querySelectorAll("[data-i18n-alert]").forEach(el => {
        const key = el.getAttribute("data-i18n-alert");
        if (dict[key]) {
            el.setAttribute("onsubmit", `event.preventDefault(); alert('${dict[key]}');`);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    applyLanguage(getLanguage());

    const langSwitcher = document.querySelector('.lang-switcher');
    if (langSwitcher) {
        langSwitcher.addEventListener('click', (e) => {
            langSwitcher.classList.toggle('active');
            e.stopPropagation();
        });
        
        document.addEventListener('click', () => {
            langSwitcher.classList.remove('active');
        });
    }
});
