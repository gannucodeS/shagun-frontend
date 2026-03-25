/* ============================================================
   SHAGUN WEDDING PLANNERS — MASTER SCRIPT
   ============================================================ */

// ─── API BASE URL ───
const API_BASE = 'http://localhost:5000/api';

/* ────────────────────────────────────────
   1. LOADER
──────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 1800);
  }
});

/* ────────────────────────────────────────
   2. SCROLL PROGRESS BAR
──────────────────────────────────────── */
const progressBar = document.getElementById('progress-bar');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  });
}

/* ────────────────────────────────────────
   3. NAVBAR SCROLL EFFECT
──────────────────────────────────────── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

/* ────────────────────────────────────────
   4. MOBILE MENU TOGGLE
──────────────────────────────────────── */
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  // Close on link click
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
  // Close when tapping outside the menu
  document.addEventListener('click', (e) => {
    if (mobileNav.classList.contains('open') &&
        !mobileNav.contains(e.target) &&
        !hamburger.contains(e.target)) {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ────────────────────────────────────────
   5. DARK MODE TOGGLE
──────────────────────────────────────── */
const darkToggle = document.getElementById('dark-toggle');
if (darkToggle) {
  // Load preference
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkToggle.textContent = '☀️';
  }
  darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    darkToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('darkMode', isDark);
  });
}

/* ────────────────────────────────────────
   6. SCROLL FADE-IN ANIMATION
──────────────────────────────────────── */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  elements.forEach(el => observer.observe(el));
}
document.addEventListener('DOMContentLoaded', initScrollAnimations);

/* ────────────────────────────────────────
   7. GALLERY TABS + LIGHTBOX
──────────────────────────────────────── */
function initGallery() {
  // Gallery data
  const galleryData = {
    all: [
      { src: 'pics/resized/pic17.jpg', label: 'Royal Mandap', cat: 'Wedding' },
      { src: 'pics/resized/pic16.jpg', label: 'Bridal Portrait', cat: 'Wedding' },
      { src: 'pics/resized/pic20.jpg', label: 'Haldi Ceremony', cat: 'Haldi' },
      { src: 'pics/resized/pic9 (1).jpg', label: 'Mehendi Night', cat: 'Mehendi' },
      { src: 'pics/resized/pic4.jpg', label: 'Grand Reception', cat: 'Reception' },
      { src: 'pics/resized/pic19.jpg', label: 'Wedding Decor', cat: 'Wedding' },
      { src: 'pics/resized/resize.jpg', label: 'Groom Arrival', cat: 'Wedding' },
    ],
    wedding: [],
    haldi: [],
    mehendi: [],
    reception: []
  };

  // Populate categories
  galleryData.all.forEach(item => {
    const key = item.cat.toLowerCase();
    if (galleryData[key]) galleryData[key].push(item);
  });

  const grid = document.getElementById('gallery-grid');
  const tabs = document.querySelectorAll('.gallery-tab');
  let currentImages = [...galleryData.all];
  let lightboxIdx = 0;

  // Render gallery
  function renderGallery(items) {
    if (!grid) return;
    grid.innerHTML = items.map((item, i) => `
      <div class="gallery-item fade-in" data-index="${i}" data-src="${item.src}">
        <img src="${item.src}" alt="${item.label}" loading="lazy" />
        <div class="gallery-overlay">
          <span>${item.label}</span>
          <p>${item.cat}</p>
        </div>
      </div>
    `).join('');

    // Re-init scroll animations
    initScrollAnimations();

    // Lightbox click
    grid.querySelectorAll('.gallery-item').forEach(el => {
      el.addEventListener('click', () => {
        lightboxIdx = parseInt(el.dataset.index);
        openLightbox(currentImages[lightboxIdx].src);
      });
    });
  }

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      currentImages = cat === 'all' ? [...galleryData.all] : [...(galleryData[cat] || galleryData.all)];
      renderGallery(currentImages);
    });
  });

  // Initial render
  renderGallery(currentImages);

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  function openLightbox(src) {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  document.getElementById('lightbox-prev')?.addEventListener('click', () => {
    lightboxIdx = (lightboxIdx - 1 + currentImages.length) % currentImages.length;
    lightboxImg.src = currentImages[lightboxIdx].src;
  });

  document.getElementById('lightbox-next')?.addEventListener('click', () => {
    lightboxIdx = (lightboxIdx + 1) % currentImages.length;
    lightboxImg.src = currentImages[lightboxIdx].src;
  });

  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') document.getElementById('lightbox-prev')?.click();
    if (e.key === 'ArrowRight') document.getElementById('lightbox-next')?.click();
  });
}

/* ────────────────────────────────────────
   8. TESTIMONIALS SLIDER
──────────────────────────────────────── */
function initSlider() {
  const track = document.querySelector('.testimonials-track');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  if (!track) return;

  let idx = 0;
  const total = track.children.length;

  function goTo(n) {
    idx = (n + total) % total;
    track.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
  prevBtn?.addEventListener('click', () => goTo(idx - 1));
  nextBtn?.addEventListener('click', () => goTo(idx + 1));

  // Auto-advance
  const autoSlide = setInterval(() => goTo(idx + 1), 5000);
  track.addEventListener('mouseenter', () => clearInterval(autoSlide));
}

/* ────────────────────────────────────────
   9. PACKAGES → CHECKOUT (localStorage)
──────────────────────────────────────── */
function initPackageSelection() {
  const selectBtns = document.querySelectorAll('.select-package-btn');
  selectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const pkg = {
        name: btn.dataset.name,
        price: btn.dataset.price,
        features: btn.dataset.features ? btn.dataset.features.split('|') : []
      };
      localStorage.setItem('selectedPackage', JSON.stringify(pkg));
      window.location.href = 'checkout.html';
    });
  });
}

/* ────────────────────────────────────────
   10. CHECKOUT PAGE — Load selected package
──────────────────────────────────────── */
function initCheckout() {
  const pkgData = localStorage.getItem('selectedPackage');
  if (!pkgData) return;
  const pkg = JSON.parse(pkgData);

  const nameEl = document.getElementById('pkg-name');
  const priceEl = document.getElementById('pkg-price');
  const featEl = document.getElementById('pkg-features');

  if (nameEl) nameEl.textContent = pkg.name || 'Gold';
  if (priceEl) priceEl.textContent = pkg.price || '₹2,50,000';
  if (featEl && pkg.features) {
    featEl.innerHTML = pkg.features.map(f => `<li>${f}</li>`).join('');
  }

  // Payment option selection
  const paymentOptions = document.querySelectorAll('.payment-option');
  paymentOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      paymentOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });
}

/* ────────────────────────────────────────
   11. FORM VALIDATION
──────────────────────────────────────── */
function validateForm(form) {
  let valid = true;
  const required = form.querySelectorAll('[required]');
  required.forEach(field => {
    field.style.borderColor = '';
    if (!field.value.trim()) {
      field.style.borderColor = 'var(--maroon)';
      valid = false;
    }
  });
  // Email check
  const emailFields = form.querySelectorAll('[type="email"]');
  emailFields.forEach(f => {
    if (f.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) {
      f.style.borderColor = 'var(--maroon)';
      valid = false;
    }
  });
  return valid;
}

/* ────────────────────────────────────────
   12. CHECKOUT FORM SUBMIT
──────────────────────────────────────── */
function initCheckoutForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form)) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    const pkg = JSON.parse(localStorage.getItem('selectedPackage') || '{}');
    const token = localStorage.getItem('token');
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    const payload = {
      packageName: pkg.name || 'Silver',
      eventType: form.eventType.value,
      date: form.eventDate.value,
      location: form.location.value,
      budget: form.budget.value,
      guestCount: form.guestCount?.value || '',
      specialRequests: form.specialRequests?.value || ''
    };

    try {
      const res = await fetch(`${API_BASE}/bookings/book-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        showBookingSuccessPopup();
        localStorage.removeItem('selectedPackage');
        form.reset();
      } else {
        showToast(data.message || 'Booking failed. Please try again.', 'error');
      }
    } catch (err) {
      // Demo mode — show success anyway
      showBookingSuccessPopup();
    } finally {
      submitBtn.textContent = 'Confirm Booking';
      submitBtn.disabled = false;
    }
  });
}

/* ────────────────────────────────────────
   13. SUCCESS POPUP
──────────────────────────────────────── */
function showBookingSuccessPopup() {
  const popup = document.getElementById('booking-success-popup');
  if (popup) {
    popup.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

document.getElementById('close-success-popup')?.addEventListener('click', () => {
  document.getElementById('booking-success-popup')?.classList.remove('open');
  document.body.style.overflow = '';
  window.location.href = 'dashboard.html';
});

/* ────────────────────────────────────────
   14. TOAST NOTIFICATION
──────────────────────────────────────── */
function showToast(msg, type = 'info') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position:fixed; bottom:2rem; left:50%; transform:translateX(-50%);
      padding:1rem 2rem; border-radius:2px; z-index:99999;
      font-family:var(--font-ui); font-size:0.8rem; letter-spacing:0.1em;
      text-transform:uppercase; transition:all 0.4s;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.background = type === 'error' ? 'var(--maroon)' : '#1A4731';
  toast.style.color = '#fff';
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 3500);
}

/* ────────────────────────────────────────
   15. AUTH — LOGIN / SIGNUP
──────────────────────────────────────── */
function initAuth() {
  // Tab switching
  const authTabs = document.querySelectorAll('.auth-tab');
  const authPanels = document.querySelectorAll('.auth-panel');
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      authTabs.forEach(t => t.classList.remove('active'));
      authPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.getElementById(target)?.classList.add('active');
    });
  });

  // Role switching (client / admin)
  const roleBtns = document.querySelectorAll('.role-btn');
  roleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      roleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Login form
  const loginForm = document.getElementById('login-form');
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(loginForm)) return;

    const role = document.querySelector('.role-btn.active')?.dataset.role || 'client';
    const email = loginForm.querySelector('[name="email"]').value;
    const password = loginForm.querySelector('[name="password"]').value;
    const btn = loginForm.querySelector('[type="submit"]');
    btn.textContent = 'Signing in...';
    btn.disabled = true;

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        showToast('Welcome back! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = data.user.role === 'admin' ? 'admin.html' : 'dashboard.html';
        }, 1200);
      } else {
        showToast(data.message || 'Invalid credentials', 'error');
      }
    } catch (err) {
      // Demo fallback
      localStorage.setItem('user', JSON.stringify({ name: 'Demo User', email, role }));
      showToast('Demo: Redirecting...', 'info');
      setTimeout(() => {
        window.location.href = role === 'admin' ? 'admin.html' : 'dashboard.html';
      }, 1200);
    } finally {
      btn.textContent = 'Sign In';
      btn.disabled = false;
    }
  });

  // Signup form
  const signupForm = document.getElementById('signup-form');
  signupForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(signupForm)) return;

    const name = signupForm.querySelector('[name="name"]').value;
    const email = signupForm.querySelector('[name="email"]').value;
    const password = signupForm.querySelector('[name="password"]').value;
    const btn = signupForm.querySelector('[type="submit"]');
    btn.textContent = 'Creating account...';
    btn.disabled = true;

    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'client' })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Account created! Please sign in.', 'success');
        // Switch to login tab
        document.querySelector('[data-tab="login"]')?.click();
      } else {
        showToast(data.message || 'Signup failed', 'error');
      }
    } catch (err) {
      showToast('Account created (demo). Please sign in.', 'info');
      document.querySelector('[data-tab="login"]')?.click();
    } finally {
      btn.textContent = 'Create Account';
      btn.disabled = false;
    }
  });
}

/* ────────────────────────────────────────
   16. DASHBOARD — Load user data
──────────────────────────────────────── */
function initDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  // Set user name
  const nameEls = document.querySelectorAll('.user-name');
  nameEls.forEach(el => el.textContent = user.name || 'Guest');

  // Load bookings
  async function loadBookings() {
    try {
      const res = await fetch(`${API_BASE}/bookings/user-bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      renderBookings(data.bookings || []);
    } catch (err) {
      // Demo data
      renderBookings([{
        _id: 'demo1',
        packageName: 'Gold Package',
        eventType: 'Wedding',
        date: '2024-12-15',
        location: 'Ajmer',
        status: 'confirmed'
      }]);
    }
  }

  function renderBookings(bookings) {
    const tbody = document.getElementById('bookings-tbody');
    if (!tbody) return;
    if (!bookings.length) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-light);padding:2rem;">No bookings yet. <a href="packages.html" style="color:var(--gold)">Browse packages</a></td></tr>`;
      return;
    }
    tbody.innerHTML = bookings.map(b => `
      <tr>
        <td>${b._id?.slice(-6).toUpperCase() || 'DEMO01'}</td>
        <td>${b.packageName}</td>
        <td>${b.eventType}</td>
        <td>${b.date ? new Date(b.date).toLocaleDateString('en-IN') : 'TBD'}</td>
        <td>${b.location}</td>
        <td><span class="status-badge status-${b.status}">${b.status}</span></td>
      </tr>
    `).join('');
  }

  if (document.getElementById('bookings-tbody')) loadBookings();

  // Logout
  document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    });
  });

  // Profile form
  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.querySelector('[name="name"]').value = user.name || '';
    profileForm.querySelector('[name="email"]').value = user.email || '';
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Profile updated successfully!', 'success');
    });
  }
}

/* ────────────────────────────────────────
   17. ADMIN DASHBOARD
──────────────────────────────────────── */
function initAdmin() {
  const token = localStorage.getItem('token');

  async function loadAllBookings() {
    try {
      const res = await fetch(`${API_BASE}/bookings/all-bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      renderAdminBookings(data.bookings || []);
    } catch (err) {
      // Demo data
      renderAdminBookings([
        { _id: 'abc123', userName: 'Priya Sharma', packageName: 'Platinum', eventType: 'Wedding', date: '2024-11-20', location: 'Ajmer', status: 'pending' },
        { _id: 'def456', userName: 'Rahul Verma', packageName: 'Gold', eventType: 'Reception', date: '2024-12-05', location: 'Pushkar', status: 'confirmed' },
        { _id: 'ghi789', userName: 'Neha Singh', packageName: 'Elite', eventType: 'Wedding', date: '2025-01-15', location: 'Ajmer', status: 'pending' },
        { _id: 'jkl012', userName: 'Amit Gupta', packageName: 'Silver', eventType: 'Haldi', date: '2025-02-10', location: 'Beawar', status: 'confirmed' },
      ]);
    }
  }

  function renderAdminBookings(bookings) {
    const tbody = document.getElementById('admin-bookings-tbody');
    if (!tbody) return;

    // Update stats
    document.getElementById('total-bookings').textContent = bookings.length;
    document.getElementById('pending-bookings').textContent = bookings.filter(b => b.status === 'pending').length;
    document.getElementById('confirmed-bookings').textContent = bookings.filter(b => b.status === 'confirmed').length;

    tbody.innerHTML = bookings.map(b => `
      <tr>
        <td>${b._id?.slice(-6).toUpperCase()}</td>
        <td>${b.userName || 'Client'}</td>
        <td>${b.packageName}</td>
        <td>${b.eventType}</td>
        <td>${b.date ? new Date(b.date).toLocaleDateString('en-IN') : 'TBD'}</td>
        <td>${b.location}</td>
        <td><span class="status-badge status-${b.status}">${b.status}</span></td>
        <td>
          <select class="status-select" data-id="${b._id}" style="border:1px solid rgba(200,150,42,0.3);padding:0.3rem 0.5rem;font-size:0.75rem;border-radius:2px;background:transparent;color:var(--text-dark);">
            <option value="pending" ${b.status==='pending'?'selected':''}>Pending</option>
            <option value="confirmed" ${b.status==='confirmed'?'selected':''}>Confirm</option>
            <option value="cancelled" ${b.status==='cancelled'?'selected':''}>Cancel</option>
          </select>
        </td>
      </tr>
    `).join('');

    // Status update handlers
    tbody.querySelectorAll('.status-select').forEach(sel => {
      sel.addEventListener('change', async () => {
        const bookingId = sel.dataset.id;
        const status = sel.value;
        try {
          await fetch(`${API_BASE}/bookings/update-status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ bookingId, status })
          });
          showToast('Status updated!', 'success');
          // Update badge in same row
          const badge = sel.closest('tr').querySelector('.status-badge');
          badge.className = `status-badge status-${status}`;
          badge.textContent = status;
        } catch (err) {
          showToast('Status updated (demo)', 'info');
        }
      });
    });
  }

  loadAllBookings();

  // Logout
  document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    });
  });
}

/* ────────────────────────────────────────
   18. COUNTER ANIMATION
──────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target);
        let count = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          count += step;
          if (count >= target) {
            entry.target.textContent = target + (entry.target.dataset.suffix || '');
            clearInterval(timer);
          } else {
            entry.target.textContent = Math.floor(count) + (entry.target.dataset.suffix || '');
          }
        }, 25);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

/* ────────────────────────────────────────
   19. SIDEBAR NAVIGATION (Dashboard)
──────────────────────────────────────── */
function initSidebar() {
  const navItems = document.querySelectorAll('.sidebar-nav-item[data-section]');
  const sections = document.querySelectorAll('.dashboard-section');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navItems.forEach(n => n.classList.remove('active'));
      sections.forEach(s => s.style.display = 'none');
      item.classList.add('active');
      const target = item.dataset.section;
      const sec = document.getElementById(target);
      if (sec) sec.style.display = 'block';

      // Update header title
      const header = document.querySelector('.dashboard-header h1');
      if (header) header.textContent = item.querySelector('span:last-child')?.textContent || 'Dashboard';
    });
  });
}

/* ────────────────────────────────────────
   20. INIT ON PAGE LOAD
──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Detect current page
  const page = window.location.pathname.split('/').pop() || 'index.html';

  // Universal
  initScrollAnimations();
  initCounters();

  // Page-specific
  if (page === 'index.html' || page === '') {
    initGallery();
    initSlider();
  }
  if (page === 'packages.html') {
    initPackageSelection();
  }
  if (page === 'checkout.html') {
    initCheckout();
    initCheckoutForm();
  }
  if (page === 'login.html') {
    initAuth();
  }
  if (page === 'dashboard.html') {
    initDashboard();
    initSidebar();
  }
  if (page === 'admin.html') {
    initAdmin();
    initSidebar();
  }
});
