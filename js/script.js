// 预加载动画处理
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 800);
    }
});

// AOS Animation Init
if (typeof AOS !== 'undefined') {
    AOS.init({
        offset: 100,
        duration: 800,
        easing: 'ease-out-cubic',
        once: true
    });
}

// Simple Nav Scroll Effect
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (nav) {
        if (window.scrollY > 50) {
            nav.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        } else {
            nav.style.boxShadow = 'none';
        }
    }
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only run if it's an anchor on the same page
        if (href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Social Media Navigation
function navigateToSocial(platform) {
    let url = '';
    switch(platform) {
        case 'bilibili':
            url = 'https://space.bilibili.com/1438315583?spm_id_from=333.1007.0.0'; 
            break;
        case 'github':
            url = 'https://github.com/RedJuiceeee/';
            break;
        case 'xiaoheihe':
            url = 'https://www.xiaoheihe.cn/app/user/profile/64266507'; 
            break;
        default:
            return;
    }
    window.open(url, '_blank');
}

// Image Fallback Handler
function handleImageError(img) {
    img.onerror = null; // Prevent infinite loop
    const originalSrc = img.getAttribute('data-src-online');
    if (originalSrc && img.src !== originalSrc) {
        console.log(`Loading local image failed for ${img.alt}, falling back to online source.`);
        img.src = originalSrc;
    }
}
