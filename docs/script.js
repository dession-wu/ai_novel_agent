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
                <h4>AI Continuation:</h4>
                <p>Please enter a story snippet to continue...</p>
            `;
            return;
        }
        
        // Show loading state
        demoGenerateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        demoGenerateBtn.disabled = true;
        
        // Simulate AI generation (replace with actual API call)
        setTimeout(() => {
            let generatedContent = '';
            
            // Based on selected style
            switch (style) {
                case 'fantasy':
                    generatedContent = `The ancient forest came alive around them, the trees whispering secrets that only the wind could understand. As they ventured deeper, the air grew thick with magic, and distant lights flickered between the trunks like mischievous spirits. Suddenly, a figure stepped from the shadows—a tall elf with eyes like starlight, holding a staff topped with a glowing crystal. "You tread upon sacred ground," they said, their voice like wind through leaves. "What brings mortals to the heart of the Wildwood?"`;
                    break;
                
                case 'scifi':
                    generatedContent = `The starship shuddered as it entered the asteroid field, alarms blaring throughout the bridge. Captain Reynolds gripped the console, her knuckles white. "Full reverse thrusters!" she ordered, but it was too late. A massive asteroid clipped the port wing, sending the ship into a death spiral. Just as all hope seemed lost, a blinding light enveloped the vessel. When it faded, they found themselves in the center of a massive alien structure, its surfaces pulsing with an otherworldly energy."Welcome, travelers," a voice boomed through the comms. "We've been expecting you."`;
                    break;
                
                case 'romance':
                    generatedContent = `The rain tapped gently against the cafe window, creating a soft rhythm that matched the beating of her heart. Across the table, he smiled, his eyes crinkling at the corners in that way she loved. "You know," he said, reaching across the table to brush her hand, "I've been wanting to tell you this for a long time." Her breath caught in her throat as he continued. "Every moment with you feels like magic. You've turned my ordinary life into something extraordinary, and I don't want to imagine a future without you in it."`;
                    break;
                
                case 'mystery':
                    generatedContent = `The old mansion loomed before them, its windows boarded up, but a faint light glowed from the attic. Detective Morgan tightened her grip on her flashlight, her partner Jones right behind her. "You're sure this is where the witness saw him?" Jones asked, his voice tight with tension. Morgan nodded. "Every clue leads here." As they crossed the threshold, the door slammed shut behind them with a deafening crash. When they turned, it was gone—replaced by a solid wall. "We're not alone," Morgan whispered, her hand drifting to her service weapon. A low laugh echoed through the empty hall."Welcome, detectives. I've been waiting for you."`;
                    break;
                
                default:
                    generatedContent = `The world around them transformed as they took the final step, the air shimmering with untapped potential. They had journeyed far, faced countless challenges, and now stood at the threshold of something extraordinary. What happened next would change everything, not just for them, but for the entire realm. The future stretched out before them, full of possibilities, and for the first time in a long while, they felt truly alive.`;
            }
            
            demoOutput.innerHTML = `
                <h4>AI Continuation:</h4>
                <p>${generatedContent}</p>
            `;
            
            // Reset button
            demoGenerateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate';
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
        'Transform your writing',
        'Create amazing novels',
        'Unleash your creativity',
        'Write with AI assistance'
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

console.log('NOVA GitHub Pages - Interactive Features Loaded!');