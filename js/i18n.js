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
        'flavor_ux_title': 'UI/UX 设计',
        'flavor_ux_desc': '精心调配的界面布局，如同热带水果拼盘般丰富多彩，注重用户体验的每一处细节。',
        'flavor_web_title': 'Web 开发',
        'flavor_web_desc': '清洁高效的代码结构，保证网站运行如同冰镇果汁般流畅爽滑。',
        'flavor_photo_title': '摄影',
        'flavor_photo_desc': '捕捉光影的瞬间，保留最真实鲜活的色彩，为您呈现高保真的视觉盛宴。',
        'flavor_brand_title': '品牌构建',
        'flavor_brand_desc': '从 Logo 到完整的品牌视觉识别，打造独一无二的品牌果香。',
        'menu_title': '当季<span>作品</span>',
        'menu_desc': '查看我们要最新鲜出炉的作品。',
        'menu_work1': '夏日风情',
        'menu_app': 'App 设计',
        'menu_work2': '鲜橙',
        'menu_brand': '品牌设计',
        'menu_work3': '混合浆果',
        'menu_illu': '插画',
        'news_title': '保持新鲜 & 获取更新',
        'news_desc': '订阅我们的周报，获取最新的设计趋势和果汁配方。',
        'placeholder_email': '输入您的邮箱...',
        'btn_subscribe': '立即订阅',
        'footer_rights': '&copy; 2026 Juiceeee Design. 保留所有权利。',
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
        'flavor_ux_title': 'UI/UX Design',
        'flavor_ux_desc': 'Carefully crafted layouts, as rich as a fruit platter, focusing on every UI/UX detail.',
        'flavor_web_title': 'Web Dev',
        'flavor_web_desc': 'Clean and efficient code, ensuring your website runs as smooth as iced juice.',
        'flavor_photo_title': 'Photography',
        'flavor_photo_desc': 'Capturing light and shadow to retain the truest vivid colors for a visual feast.',
        'flavor_brand_title': 'Branding',
        'flavor_brand_desc': 'From logos to complete brand identity, building a unique fruit aroma.',
        'menu_title': 'Seasonal <span>Menu</span>',
        'menu_desc': 'Check out our freshly squeezed works.',
        'menu_work1': 'Summer Vibes',
        'menu_app': 'App Design',
        'menu_work2': 'Fresh Orange',
        'menu_brand': 'Branding',
        'menu_work3': 'Berry Mix',
        'menu_illu': 'Illustration',
        'news_title': 'Stay Fresh & Updated',
        'news_desc': 'Subscribe to our newsletter for the latest design trends and juice recipes.',
        'placeholder_email': 'Enter your email...',
        'btn_subscribe': 'Subscribe Now',
        'footer_rights': '&copy; 2026 Juiceeee Design. All rights reserved.',
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
