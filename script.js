// ============================================
// 3D CANVAS ANIMATION
// ============================================

class MedicalScene {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width = window.innerWidth;
        this.height = canvas.height = window.innerHeight;
        
        this.particles = [];
        this.time = 0;
        this.animationId = null;
        
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }

    init() {
        // Create floating medical particles
        const particleCount = window.innerWidth < 768 ? 30 : 50;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                z: Math.random() * 100,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                vz: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 3 + 1,
                type: Math.floor(Math.random() * 3),
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02
            });
        }
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    drawParticle(particle) {
        const scale = 100 / (100 + particle.z);
        const x = this.width / 2 + (particle.x - this.width / 2) * scale;
        const y = this.height / 2 + (particle.y - this.height / 2) * scale;
        const size = particle.size * scale;

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, 1 - particle.z / 100) * 0.6;

        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size * 2);
        gradient.addColorStop(0, 'rgba(0, 212, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(0, 153, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = `rgba(0, 245, 255, ${0.8 - particle.z / 100})`;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    drawHelix(x, y, size, rotation) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);

        const points = 20;
        const radius = size;

        this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.6)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 4;
            const px = Math.cos(angle) * radius;
            const py = (i / points) * size * 2 - size;
            
            if (i === 0) this.ctx.moveTo(px, py);
            else this.ctx.lineTo(px, py);
        }

        this.ctx.stroke();
        this.ctx.restore();
    }

    update() {
        this.time += 0.01;

        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.z += particle.vz;
            particle.rotation += particle.rotationSpeed;

            if (particle.x < 0) particle.x = this.width;
            if (particle.x > this.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.height;
            if (particle.y > this.height) particle.y = 0;
            if (particle.z > 100) particle.z = 0;
            if (particle.z < 0) particle.z = 100;
        });
    }

    draw() {
        this.ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.drawGrid();

        this.particles.sort((a, b) => a.z - b.z);

        this.particles.forEach(particle => {
            this.drawParticle(particle);
        });

        this.drawFloatingElements();
    }

    drawGrid() {
        const gridSize = 50;
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.05)';
        this.ctx.lineWidth = 1;

        for (let i = -5; i < 6; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(centerX - 250, centerY + i * gridSize);
            this.ctx.lineTo(centerX + 250, centerY + i * gridSize);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(centerX + i * gridSize, centerY - 250);
            this.ctx.lineTo(centerX + i * gridSize, centerY + 250);
            this.ctx.stroke();
        }
    }

    drawFloatingElements() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const time = this.time;

        const heartX = centerX - 150;
        const heartY = centerY + Math.sin(time * 0.5) * 30;
        this.drawHeart(heartX, heartY, 30, time);

        const helixX = centerX + 150;
        const helixY = centerY + Math.cos(time * 0.5) * 30;
        this.drawHelix(helixX, helixY, 40, time * 0.5);

        this.ctx.save();
        this.ctx.globalAlpha = 0.3;
        this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 100 + Math.sin(time) * 20, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawHeart(x, y, size, time) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(Math.sin(time * 0.3) * 0.1);
        this.ctx.scale(size / 100, size / 100);

        this.ctx.fillStyle = 'rgba(255, 0, 110, 0.6)';
        this.ctx.beginPath();
        this.ctx.moveTo(0, -35);
        this.ctx.bezierCurveTo(-35, -35, -35, 0, 0, 35);
        this.ctx.bezierCurveTo(35, 0, 35, -35, 0, -35);
        this.ctx.fill();

        this.ctx.restore();
    }

    animate() {
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize 3D scene
let medicalScene = null;
const canvas = document.getElementById('canvas3d');
if (canvas) {
    medicalScene = new MedicalScene(canvas);
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('scroll-fade');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.glass-card, .testimonial-card, .spec-item').forEach(el => {
    observer.observe(el);
});

// ============================================
// PARALLAX EFFECT (Desktop only)
// ============================================

if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.glass-card');
        
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateZ(20px)
            `;
        });
    });

    document.addEventListener('mouseleave', () => {
        document.querySelectorAll('.glass-card').forEach(card => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// ============================================
// FORM HANDLING
// ============================================

const appointmentForm = document.getElementById('appointmentForm');
const contactForm = document.getElementById('contactForm');

if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            reason: document.getElementById('reason').value.trim()
        };

        // Validate form
        if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Phone validation
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(formData.phone) || formData.phone.replace(/\D/g, '').length < 10) {
            showNotification('Please enter a valid phone number', 'error');
            return;
        }

        // Simulate form submission
        const submitButton = appointmentForm.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Booking...';
        submitButton.disabled = true;

        setTimeout(() => {
            showNotification('Appointment booked successfully! We\'ll confirm via email.', 'success');
            appointmentForm.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1500);
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('contact-name').value.trim(),
            email: document.getElementById('contact-email').value.trim(),
            subject: document.getElementById('contact-subject').value.trim(),
            message: document.getElementById('contact-message').value.trim()
        };

        // Validate form
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Simulate form submission
        const submitButton = contactForm.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        setTimeout(() => {
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1500);
    });
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'rgba(0, 212, 255, 0.2)' : 'rgba(255, 0, 110, 0.2)'};
        border: 1px solid ${type === 'success' ? 'rgba(0, 212, 255, 0.5)' : 'rgba(255, 0, 110, 0.5)'};
        color: ${type === 'success' ? '#00d4ff' : '#ff006e'};
        border-radius: 10px;
        backdrop-filter: blur(10px);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
        max-width: 90vw;
        word-wrap: break-word;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// ============================================
// SMOOTH SCROLL BEHAVIOR
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// DYNAMIC DATE INPUT
// ============================================

const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;

    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    dateInput.max = maxDate.toISOString().split('T')[0];
}

// ============================================
// ACTIVE NAV LINK TRACKING
// ============================================

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ============================================
// MICRO-INTERACTIONS
// ============================================

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.notification').forEach(n => n.remove());
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ============================================
// CLEANUP ON PAGE UNLOAD
// ============================================

window.addEventListener('beforeunload', () => {
    if (medicalScene) {
        medicalScene.destroy();
    }
});

// ============================================
// INITIALIZATION
// ============================================

console.log('Premium Doctor Website loaded successfully');
console.log('Mobile responsive: ' + (window.innerWidth <= 768 ? 'Yes' : 'No'));
