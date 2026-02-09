/**
 * The Common - Landing Page Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    initWaitlistForm();
    initSmoothScroll();
    initNavScrollEffect();
});

/**
 * Waitlist Form Handler
 */
function initWaitlistForm() {
    const form = document.getElementById('waitlist-form');
    const successMessage = document.getElementById('waitlist-success');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        const email = emailInput.value.trim();
        
        if (!email || !isValidEmail(email)) {
            shakeElement(emailInput);
            return;
        }
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'block';
        submitBtn.disabled = true;
        
        try {
            // Store email locally for now
            // TODO: Replace with actual backend endpoint
            const waitlist = getWaitlist();
            
            if (waitlist.includes(email)) {
                // Already on waitlist
                showSuccess();
                return;
            }
            
            waitlist.push(email);
            saveWaitlist(waitlist);
            
            // Simulate network delay for UX
            await delay(800);
            
            showSuccess();
            
        } catch (error) {
            console.error('Error:', error);
            resetButton();
            alert('Something went wrong. Please try again.');
        }
        
        function showSuccess() {
            form.style.display = 'none';
            successMessage.style.display = 'block';
            successMessage.style.animation = 'fadeIn 0.4s ease';
        }
        
        function resetButton() {
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (!target) return;
            
            e.preventDefault();
            
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Nav scroll effect
 */
function initNavScrollEffect() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.style.background = 'rgba(10, 10, 11, 0.95)';
        } else {
            nav.style.background = 'rgba(10, 10, 11, 0.8)';
        }
        
        lastScroll = currentScroll;
    });
}

/**
 * Utility Functions
 */

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease';
    element.addEventListener('animationend', () => {
        element.style.animation = '';
    }, { once: true });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Local storage helpers for waitlist (temporary until backend is set up)
function getWaitlist() {
    try {
        return JSON.parse(localStorage.getItem('thecommon_waitlist') || '[]');
    } catch {
        return [];
    }
}

function saveWaitlist(list) {
    localStorage.setItem('thecommon_waitlist', JSON.stringify(list));
}

// Add shake animation to styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
