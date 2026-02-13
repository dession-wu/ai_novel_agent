// Navigation Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        }
    });
});

// Scroll Reveal Animation
function handleScrollReveal() {
    const elements = document.querySelectorAll('.scroll-reveal');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight * 0.85) {
            element.classList.add('active');
        }
    });
}

// Initial check
window.addEventListener('load', handleScrollReveal);
// Check on scroll
window.addEventListener('scroll', handleScrollReveal);

// AI Demo Functionality
const demoGenerateBtn = document.getElementById('demo-generate');
const demoInput = document.getElementById('demo-input');
const demoOutput = document.getElementById('demo-output');
const demoStyle = document.getElementById('demo-style');

if (demoGenerateBtn && demoInput && demoOutput) {
    demoGenerateBtn.addEventListener('click', () => {
        const inputText = demoInput.value.trim();
        const style = demoStyle ? demoStyle.value : 'fantasy';
        
        if (!inputText) {
            demoOutput.innerHTML = `
                <h4>AI续写结果：</h4>
                <p>请输入故事片段进行续写...</p>
            `;
            return;
        }
        
        // Show loading state
        demoGenerateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 生成中...';
        demoGenerateBtn.disabled = true;
        
        // Simulate AI generation (replace with actual API call)
        setTimeout(() => {
            let generatedContent = '';
            
            // Based on selected style
            switch (style) {
                case 'fantasy':
                    generatedContent = `古老的森林在他们周围苏醒过来，树木低语着只有风能理解的秘密。当他们深入其中，空气变得浓稠如魔法，远处的灯光在树干间闪烁，像顽皮的精灵。突然，一个身影从阴影中走出——一个高大的精灵，眼睛像星光，手持一根顶端镶有发光水晶的法杖。"你们踏入了圣地，"他们说，声音如树叶间的风声，"是什么风把凡人吹到了野林的心脏？"`;
                    break;
                
                case 'scifi':
                    generatedContent = `星舰进入小行星带时剧烈震动，警报声响彻整个舰桥。雷诺兹舰长紧握着控制台，指节发白。"全力反向推进！"她下令，但已经太晚了。一颗巨大的小行星擦过左机翼，使飞船进入死亡螺旋。就在所有希望似乎都破灭时，一道耀眼的光芒包围了飞船。当光芒散去，他们发现自己置身于一个巨大的外星结构中心，其表面脉动着超凡的能量。"欢迎，旅行者们，"一个声音通过通讯系统隆隆响起，"我们一直在等你们。"`;
                    break;
                
                case 'romance':
                    generatedContent = `雨水轻轻敲打着咖啡馆的窗户，创造出与她心跳相匹配的柔和节奏。桌对面，他微笑着，眼睛在 corners 皱起，那是她喜欢的样子。"你知道吗，"他说，伸手越过桌子轻触她的手，"我一直想告诉你这件事很久了。"她屏住呼吸，听他继续说："和你在一起的每一刻都像魔法。你把我平凡的生活变成了非凡的旅程，我无法想象没有你的未来。"`;
                    break;
                
                case 'mystery':
                    generatedContent = `古老的宅邸耸立在他们面前，窗户被木板封住，但阁楼透出微弱的光线。摩根侦探紧握着手电筒，她的搭档琼斯紧跟在身后。"你确定证人是在这里看到他的？"琼斯问道，声音因紧张而紧绷。摩根点头："所有线索都指向这里。"当他们跨过门槛时，门在他们身后砰地关上，发出震耳欲聋的响声。当他们转身时，门不见了——取而代之的是一堵实心墙。"我们不是一个人，"摩根低语，手伸向她的配枪。一阵低沉的笑声在空荡的大厅中回荡："欢迎，侦探们。我一直在等你们。"`;
                    break;
                
                default:
                    generatedContent = `当他们迈出最后一步时，周围的世界发生了变化，空气中闪烁着未被发掘的潜力。他们长途跋涉，面对无数挑战，现在站在了非凡事物的门槛上。接下来发生的事情将改变一切，不仅对他们，而且对整个领域。未来在他们面前展开，充满可能性，很久以来，他们第一次感到真正的活着。`;
            }
            
            demoOutput.innerHTML = `
                <h4>AI续写结果：</h4>
                <p>${generatedContent}</p>
            `;
            
            // Reset button
            demoGenerateBtn.innerHTML = '<i class="fas fa-magic"></i> 生成';
            demoGenerateBtn.disabled = false;
        }, 1500);
    });
}

// Feature Card Hover Effects
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Tech Card Hover Effects
const techCards = document.querySelectorAll('.tech-card');
techCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Step Card Hover Effects
const stepCards = document.querySelectorAll('.step-card');
stepCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Hero Card Animation
const heroCards = document.querySelectorAll('.hero-card');
heroCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
});

// Button Click Effects
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple effect styles
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Mobile Menu Close on Outside Click
document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('active')) {
        const target = e.target;
        if (!target.closest('.navbar')) {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    }
});

// Dynamic Typing Effect for Hero Title
function typingEffect() {
    const titles = [
        '改变你的写作方式',
        '创作精彩的小说',
        '释放你的创造力',
        '借助AI辅助写作'
    ];
    
    let currentIndex = 0;
    let currentTitle = titles[currentIndex];
    let currentCharIndex = 0;
    let isDeleting = false;
    
    const typingElement = document.createElement('span');
    typingElement.className = 'typing-effect';
    typingElement.style.color = '#1E40AF';
    typingElement.style.fontWeight = '600';
    
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        heroSubtitle.appendChild(typingElement);
    }
    
    function type() {
        if (isDeleting) {
            if (currentCharIndex > 0) {
                typingElement.textContent = currentTitle.substring(0, currentCharIndex - 1);
                currentCharIndex--;
            } else {
                isDeleting = false;
                currentIndex = (currentIndex + 1) % titles.length;
                currentTitle = titles[currentIndex];
            }
        } else {
            if (currentCharIndex < currentTitle.length) {
                typingElement.textContent = currentTitle.substring(0, currentCharIndex + 1);
                currentCharIndex++;
            } else {
                isDeleting = true;
            }
        }
        
        const typingSpeed = isDeleting ? 50 : 100;
        const delayAfterTitle = isDeleting ? 500 : 1500;
        
        if (!isDeleting && currentCharIndex === currentTitle.length) {
            setTimeout(type, delayAfterTitle);
        } else {
            setTimeout(type, typingSpeed);
        }
    }
    
    type();
}

// Initialize typing effect after page load
window.addEventListener('load', typingEffect);

// Smooth Cursor Effect
function initSmoothCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'smooth-cursor';
    document.body.appendChild(cursor);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    function updateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        
        requestAnimationFrame(updateCursor);
    }
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    updateCursor();
}

// Add smooth cursor styles
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .smooth-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(30, 64, 175, 0.6) 0%, rgba(124, 58, 237, 0.4) 100%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        backdrop-filter: blur(2px);
        transition: width 0.3s, height 0.3s;
    }
    
    .smooth-cursor:hover {
        width: 30px;
        height: 30px;
    }
    
    @media (max-width: 768px) {
        .smooth-cursor {
            display: none;
        }
    }
`;
document.head.appendChild(cursorStyle);

// Initialize smooth cursor
window.addEventListener('load', initSmoothCursor);

// Preload Images
function preloadImages() {
    const images = [
        // Add paths to any images you want to preload
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Preload images
window.addEventListener('load', preloadImages);

// Performance Optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Replace scroll event with debounced version
const debouncedScrollReveal = debounce(handleScrollReveal, 100);
window.removeEventListener('scroll', handleScrollReveal);
window.addEventListener('scroll', debouncedScrollReveal);

console.log('NOVA GitHub Pages - 交互式功能已加载！');