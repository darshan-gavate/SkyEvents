/* ==========================================
   SKY EVENTS & SFX - APPLICATION LOGIC (app.js)
   Database Simulation, Routing, Validation & Dashboards
   ========================================== */

// ----------------------------------------------------
// 1. LOCAL STORAGE DATABASE & SEED DATA
// ----------------------------------------------------

const DB_KEYS = {
  USERS: 'sky_users',
  SERVICES: 'sky_services',
  BOOKINGS: 'sky_bookings',
  GALLERY: 'sky_gallery',
  TESTIMONIALS: 'sky_testimonials',
  ENQUIRIES: 'sky_enquiries'
};

// Local storage wrappers
const dbGet = (key) => JSON.parse(localStorage.getItem(key)) || [];
const dbSet = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// Initialize Database Seed Data
function initDatabase() {
  // 1. Users Collection
  if (!localStorage.getItem(DB_KEYS.USERS)) {
    const defaultUsers = [
      {
        _id: 'usr_admin',
        name: 'Dr. Mukul Kulkarni',
        email: 'admin@skyevents.in',
        phone: '9999999999',
        passwordHash: 'admin123', // Clean simple password for academic review
        role: 'admin',
        createdAt: new Date('2026-06-01').toISOString()
      },
      {
        _id: 'usr_customer_1',
        name: 'Rohan Deshmukh',
        email: 'rohan@gmail.com',
        phone: '9876543210',
        passwordHash: 'rohan123',
        role: 'customer',
        createdAt: new Date('2026-07-01').toISOString()
      },
      {
        _id: 'usr_customer_2',
        name: 'Sneha Kulkarni',
        email: 'sneha@gmail.com',
        phone: '9888877777',
        passwordHash: 'sneha123',
        role: 'customer',
        createdAt: new Date('2026-07-15').toISOString()
      }
    ];
    dbSet(DB_KEYS.USERS, defaultUsers);
  }

  // 2. Service Collection
  if (!localStorage.getItem(DB_KEYS.SERVICES)) {
    const defaultServices = [
      {
        _id: 'srv_1',
        name: 'Bride & Groom Entry',
        category: 'Entrance',
        description: 'Spectacular special effects entry for the bride and groom including flower showers, heavy low fog, and synchronized mini-pyro fountains.',
        price: 8000,
        imageUrl: '/assets/images/wedding_entry.png',
        isActive: true
      },
      {
        _id: 'srv_2',
        name: 'Flower Blower',
        category: 'Effects',
        description: 'High-power petal blowers to rain down rose and marigold petals during wedding entrances, exits, or special stage moments.',
        price: 3500,
        imageUrl: '/assets/images/wedding_entry.png',
        isActive: true
      },
      {
        _id: 'srv_3',
        name: 'Cold Pyro Effects',
        category: 'Effects',
        description: 'Safe, cold-to-the-touch pyro sparklers for stage backdrops, indoor entries, and major stage highlights.',
        price: 6500,
        imageUrl: '/assets/images/sfx_stage.png',
        isActive: true
      },
      {
        _id: 'srv_4',
        name: 'Bubble / Smoke / Snow Machine',
        category: 'Effects',
        description: 'Multi-machine atmospheric setups offering realistic snow storms, rich dry fog, or glowing bubbles for children parties and dance floors.',
        price: 5000,
        imageUrl: '/assets/images/dry_ice_dance.png',
        isActive: true
      },
      {
        _id: 'srv_5',
        name: 'Dry Ice Pot / Machine',
        category: 'Effects',
        description: 'Thick, low-lying cloud effect covering the dance floor completely for romantic couple dances or product launches.',
        price: 4000,
        imageUrl: '/assets/images/dry_ice_dance.png',
        isActive: true
      },
      {
        _id: 'srv_6',
        name: 'CO2 Confetti Shower',
        category: 'Effects',
        description: 'Massive blast of metallic and colorful confetti launched via high-pressure CO2 cannons for grand celebrations.',
        price: 7000,
        imageUrl: '/assets/images/confetti_shower.png',
        isActive: true
      },
      {
        _id: 'srv_7',
        name: 'CO2 Gun / Jets',
        category: 'Effects',
        description: 'Handheld CO2 guns and floor jets emitting dense white smoke plumes for high-energy music events and product reveals.',
        price: 4500,
        imageUrl: '/assets/images/confetti_shower.png',
        isActive: false // Initialized as inactive as per Screen 4
      }
    ];
    dbSet(DB_KEYS.SERVICES, defaultServices);
  }

  // 3. Booking Collection
  if (!localStorage.getItem(DB_KEYS.BOOKINGS)) {
    const defaultBookings = [
      {
        _id: 'bk_1',
        userId: 'usr_customer_1',
        customerName: 'Rohan Deshmukh',
        eventType: 'Wedding Reception',
        eventDate: '2026-11-14',
        venue: 'Riverside Lawns, Pune',
        guestCount: 300,
        serviceIds: ['srv_1', 'srv_3'],
        serviceNames: 'Bride & Groom Entry, Cold Pyro Effects',
        advanceAmount: 15000,
        status: 'confirmed',
        createdAt: new Date('2026-07-10').toISOString()
      },
      {
        _id: 'bk_2',
        userId: 'usr_customer_2',
        customerName: 'Sneha Kulkarni',
        eventType: 'Birthday Party',
        eventDate: '2026-08-02',
        venue: 'Sunshine Banquets, Pune',
        guestCount: 150,
        serviceIds: ['srv_2', 'srv_4'],
        serviceNames: 'Flower Blower, Bubble / Smoke / Snow Machine',
        advanceAmount: 6000,
        status: 'pending',
        createdAt: new Date('2026-07-28').toISOString()
      },
      {
        _id: 'bk_3',
        userId: 'usr_customer_1', // Reused for screen match
        customerName: 'Amit & Priya',
        eventType: 'Bride & Groom Entry',
        eventDate: '2026-12-21',
        venue: 'Grand Palazzo, Pune',
        guestCount: 500,
        serviceIds: ['srv_1', 'srv_3'],
        serviceNames: 'Bride & Groom Entry, Cold Pyro Effects',
        advanceAmount: 12500,
        status: 'confirmed',
        createdAt: new Date('2026-07-12').toISOString()
      },
      {
        _id: 'bk_4',
        userId: 'guest_user',
        customerName: 'Vikram Traders',
        eventType: 'Corporate Launch',
        eventDate: '2026-09-05',
        venue: 'Hotel Le Meridien, Pune',
        guestCount: 200,
        serviceIds: ['srv_3', 'srv_6'],
        serviceNames: 'Cold Pyro Effects, CO2 Confetti Shower',
        advanceAmount: 20000,
        status: 'pending',
        createdAt: new Date('2026-07-15').toISOString()
      },
      {
        _id: 'bk_5',
        userId: 'usr_customer_1',
        customerName: 'Meera Joshi',
        eventType: 'Anniversary',
        eventDate: '2026-08-18',
        venue: "Meera's Residence, Baner",
        guestCount: 80,
        serviceIds: ['srv_2', 'srv_5'],
        serviceNames: 'Flower Blower, Dry Ice Pot / Machine',
        advanceAmount: 4500,
        status: 'completed',
        createdAt: new Date('2026-07-05').toISOString()
      },
      {
        _id: 'bk_6',
        userId: 'usr_customer_1',
        customerName: 'Kunal Sharma',
        eventType: 'Welcome Decoration',
        eventDate: '2026-07-30',
        venue: 'Airport VIP Lounge, Pune',
        guestCount: 50,
        serviceIds: ['srv_2'],
        serviceNames: 'Flower Blower',
        advanceAmount: 3000,
        status: 'cancelled',
        createdAt: new Date('2026-07-01').toISOString()
      }
    ];
    dbSet(DB_KEYS.BOOKINGS, defaultBookings);
  }

  // 4. Gallery Collection
  if (!localStorage.getItem(DB_KEYS.GALLERY)) {
    const defaultGallery = [
      {
        _id: 'gal_1',
        serviceId: 'srv_3',
        imageUrl: '/assets/images/sfx_stage.png',
        caption: 'Cold Pyro Stage Entry - Riverside Lawns',
        category: 'Effects',
        uploadedAt: new Date('2026-07-01').toISOString()
      },
      {
        _id: 'gal_2',
        serviceId: 'srv_6',
        imageUrl: '/assets/images/confetti_shower.png',
        caption: 'CO2 Confetti Shower - Grand Palazzo',
        category: 'Effects',
        uploadedAt: new Date('2026-07-02').toISOString()
      },
      {
        _id: 'gal_3',
        serviceId: 'srv_1',
        imageUrl: '/assets/images/wedding_entry.png',
        caption: 'Bride & Groom Entry - Le Meridien',
        category: 'Entrance',
        uploadedAt: new Date('2026-07-03').toISOString()
      },
      {
        _id: 'gal_4',
        serviceId: 'srv_4',
        imageUrl: '/assets/images/dry_ice_dance.png',
        caption: 'Snow Machine First Dance - Sunshine Banquets',
        category: 'Effects',
        uploadedAt: new Date('2026-07-04').toISOString()
      },
      {
        _id: 'gal_5',
        serviceId: 'srv_5',
        imageUrl: '/assets/images/dry_ice_dance.png',
        caption: "Dry Ice Floor Effect - Meera's Residence",
        category: 'Effects',
        uploadedAt: new Date('2026-07-05').toISOString()
      },
      {
        _id: 'gal_6',
        serviceId: 'srv_2',
        imageUrl: '/assets/images/birthday_decoration.png',
        caption: 'Welcome Decoration - Airport VIP Lounge',
        category: 'Decoration',
        uploadedAt: new Date('2026-07-06').toISOString()
      }
    ];
    dbSet(DB_KEYS.GALLERY, defaultGallery);
  }

  // 5. Testimonials Collection
  if (!localStorage.getItem(DB_KEYS.TESTIMONIALS)) {
    const defaultTestimonials = [
      {
        _id: 'test_1',
        bookingId: 'bk_1',
        customerName: 'Rohan Deshmukh',
        message: 'Absolutely spectacular entry! The cold pyro and smoke machines worked flawlessly and made our wedding reception entrance unforgettable.',
        rating: 5,
        approved: true,
        createdAt: new Date('2026-07-15').toISOString()
      },
      {
        _id: 'test_2',
        bookingId: 'bk_5',
        customerName: 'Meera Joshi',
        message: 'The low-lying fog cloud during our anniversary dance looked magical. Professional staff and seamless execution.',
        rating: 5,
        approved: true,
        createdAt: new Date('2026-07-20').toISOString()
      },
      {
        _id: 'test_3',
        bookingId: 'bk_3',
        customerName: 'Amit Kulkarni',
        message: 'Incredible coordination and safety checks. The cold pyro effects added a great premium feel to the product launch.',
        rating: 4,
        approved: true,
        createdAt: new Date('2026-07-22').toISOString()
      },
      {
        _id: 'test_4',
        bookingId: 'bk_2',
        customerName: 'Sneha Kulkarni',
        message: 'The bubble machine was a big hit at the birthday party! Prompt setup.',
        rating: 4,
        approved: false, // Pending moderation
        createdAt: new Date('2026-07-29').toISOString()
      }
    ];
    dbSet(DB_KEYS.TESTIMONIALS, defaultTestimonials);
  }

  // 6. Enquiry Collection
  if (!localStorage.getItem(DB_KEYS.ENQUIRIES)) {
    const defaultEnquiries = [
      {
        _id: 'enq_1',
        name: 'Amit Shah',
        email: 'amit@gmail.com',
        phone: '9888877777',
        message: 'Can you customize the bride and groom entry with 8 pyro guns instead of 4? Also let me know if you travel to Lonavala.',
        status: 'new',
        createdAt: new Date('2026-07-28T10:00:00Z').toISOString()
      },
      {
        _id: 'enq_2',
        name: 'Sagar Patil',
        email: 'sagar@outlook.com',
        phone: '9112233445',
        message: 'Do you provide flower blower setups for outdoor school events? Looking for a quote for mid-August.',
        status: 'responded',
        createdAt: new Date('2026-07-25T14:30:00Z').toISOString()
      }
    ];
    dbSet(DB_KEYS.ENQUIRIES, defaultEnquiries);
  }
}

// ----------------------------------------------------
// 2. GLOBAL SESSION MANAGEMENT
// ----------------------------------------------------

let currentUser = null;

function loadSession() {
  const session = sessionStorage.getItem('sky_session');
  if (session) {
    currentUser = JSON.parse(session);
  } else {
    currentUser = null;
  }
  updateAuthNavBar();
}

function saveSession(user) {
  currentUser = user;
  sessionStorage.setItem('sky_session', JSON.stringify(user));
  updateAuthNavBar();
}

function clearSession() {
  currentUser = null;
  sessionStorage.removeItem('sky_session');
  updateAuthNavBar();
  showToast('Logged out successfully', 'info');
  window.location.hash = '#home';
}

function updateAuthNavBar() {
  const authBtn = document.getElementById('nav-auth-btn');
  if (currentUser) {
    if (currentUser.role === 'admin') {
      authBtn.innerHTML = `<i class="fa-solid fa-gauge-high"></i> Admin Control`;
      authBtn.href = '#admin';
      authBtn.setAttribute('data-route', 'admin');
    } else {
      authBtn.innerHTML = `<i class="fa-solid fa-chalkboard-user"></i> Dashboard`;
      authBtn.href = '#dashboard';
      authBtn.setAttribute('data-route', 'dashboard');
    }
  } else {
    authBtn.innerHTML = `<i class="fa-solid fa-user"></i> Login / Register`;
    authBtn.href = '#login';
    authBtn.setAttribute('data-route', 'login');
  }
}

// ----------------------------------------------------
// 3. TOAST NOTIFICATION SERVICE
// ----------------------------------------------------

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let iconClass = 'fa-circle-info';
  if (type === 'success') iconClass = 'fa-circle-check';
  if (type === 'error') iconClass = 'fa-circle-xmark';
  
  toast.innerHTML = `
    <i class="fa-solid ${iconClass}"></i>
    <div class="toast-content">${message}</div>
    <button class="toast-close">&times;</button>
  `;
  
  container.appendChild(toast);
  
  // Close handler
  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  });
  
  // Auto-remove after 4 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }
  }, 4000);
}

// ----------------------------------------------------
// 4. CLIENT SIDE ROUTING & TAB NAVIGATION
// ----------------------------------------------------

function router() {
  const hash = window.location.hash || '#home';
  const route = hash.substring(1);
  
  // Route Guardian
  if (route === 'admin' && (!currentUser || currentUser.role !== 'admin')) {
    showToast('Unauthorized access. Admin login required.', 'error');
    window.location.hash = '#login';
    return;
  }
  if (route === 'dashboard' && (!currentUser || currentUser.role !== 'customer')) {
    showToast('Please login to access your customer dashboard.', 'error');
    window.location.hash = '#login';
    return;
  }

  // Deactivate all sections, activate matching one
  document.querySelectorAll('.view-section').forEach(section => {
    section.classList.remove('active');
  });

  const activeSection = document.getElementById(`view-${route}`);
  if (activeSection) {
    activeSection.classList.add('active');
  }

  // Active state on Navigation Links
  document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
    if (link.getAttribute('data-route') === route) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Handle specific section re-renders
  if (route === 'home') {
    renderHomeTeaser();
    renderPublicTestimonials();
  } else if (route === 'services') {
    renderServicesCatalogue('all');
  } else if (route === 'gallery') {
    renderGalleryPhotos('all');
  } else if (route === 'book') {
    initBookingForm();
  } else if (route === 'dashboard') {
    renderCustomerDashboard();
  } else if (route === 'admin') {
    // Default to bookings tab
    switchAdminTab('bookings');
  }

  // Scroll to top
  window.scrollTo(0, 0);
  
  // Close mobile nav drawer if open
  document.querySelector('.nav-menu').classList.remove('open');
}

// Global functions for inline actions (registered to window for onclick handlers)
window.switchAuthTab = function(tabName) {
  document.querySelectorAll('.auth-card').forEach(card => card.classList.remove('active'));
  document.querySelectorAll('.auth-tab-btn').forEach(btn => btn.classList.remove('active'));
  
  if (tabName === 'login') {
    document.getElementById('auth-login-card').classList.add('active');
    document.getElementById('btn-tab-login').classList.add('active');
  } else if (tabName === 'register') {
    document.getElementById('auth-register-card').classList.add('active');
    document.getElementById('btn-tab-register').classList.add('active');
  } else if (tabName === 'admin') {
    document.getElementById('auth-admin-card').classList.add('active');
    document.getElementById('btn-tab-admin').classList.add('active');
  }
};

window.switchAdminTab = function(tabName) {
  document.querySelectorAll('.admin-tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.admin-side-link').forEach(link => link.classList.remove('active'));
  
  const activeTab = document.getElementById(`admin-tab-${tabName}`);
  if (activeTab) activeTab.classList.add('active');
  
  // Find match side menu link
  document.querySelectorAll('.admin-side-link').forEach(link => {
    if (link.getAttribute('onclick').includes(tabName)) {
      link.classList.add('active');
    }
  });

  // Run dynamic loads
  if (tabName === 'bookings') renderAdminBookings();
  if (tabName === 'services') renderAdminServices();
  if (tabName === 'gallery') renderAdminGallery();
  if (tabName === 'testimonials') renderAdminTestimonials();
  if (tabName === 'enquiries') renderAdminEnquiries();
};

// ----------------------------------------------------
// 5. RENDERING PORTLETS (PUBLIC VIEWS)
// ----------------------------------------------------

// Render Home Teaser List (3 items)
function renderHomeTeaser() {
  const teaserList = document.getElementById('services-teaser-list');
  if (!teaserList) return;
  
  const services = dbGet(DB_KEYS.SERVICES).filter(s => s.isActive);
  teaserList.innerHTML = '';
  
  // Select first 3 active services for teaser
  services.slice(0, 3).forEach(service => {
    const card = document.createElement('div');
    card.className = 'service-card glass-panel';
    card.innerHTML = `
      <div class="service-img-wrapper">
        <span class="service-cat-badge">${service.category}</span>
        <img src="${service.imageUrl}" class="service-img" alt="${service.name}">
      </div>
      <div class="service-body">
        <h3 class="service-title">${service.name}</h3>
        <p class="service-desc">${service.description}</p>
        <div class="service-footer">
          <div class="service-price">
            <span class="price-label">Indicative Cost</span>
            <span class="price-amt">Rs ${service.price.toLocaleString('en-IN')}</span>
          </div>
          <span class="service-details-link" onclick="openServiceModal('${service._id}')">View Details -></span>
        </div>
      </div>
    `;
    teaserList.appendChild(card);
  });
}

// Render Public Testimonials (Slider list)
function renderPublicTestimonials() {
  const container = document.getElementById('public-testimonials-grid');
  if (!container) return;
  
  const testimonials = dbGet(DB_KEYS.TESTIMONIALS).filter(t => t.approved);
  container.innerHTML = '';
  
  if (testimonials.length === 0) {
    container.innerHTML = `<p class="text-center text-muted col-span-3">No client testimonials posted yet.</p>`;
    return;
  }
  
  testimonials.forEach(t => {
    const starsHTML = Array(t.rating).fill('<i class="fa-solid fa-star"></i>').join('') + 
                      Array(5 - t.rating).fill('<i class="fa-regular fa-star"></i>').join('');
    
    const card = document.createElement('div');
    card.className = 'testimonial-card glass-panel';
    card.innerHTML = `
      <div class="testimonial-stars">${starsHTML}</div>
      <p class="testimonial-quote">"${t.message}"</p>
      <div class="testimonial-author">
        <div class="author-avatar">${t.customerName.charAt(0)}</div>
        <div class="author-details">
          <h4>${t.customerName}</h4>
          <span>Verified Client</span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Render Complete Services Catalogue
function renderServicesCatalogue(category = 'all') {
  const catalogueList = document.getElementById('services-catalogue-list');
  if (!catalogueList) return;
  
  let services = dbGet(DB_KEYS.SERVICES).filter(s => s.isActive);
  catalogueList.innerHTML = '';
  
  if (category !== 'all') {
    services = services.filter(s => s.category.toLowerCase() === category.toLowerCase());
  }
  
  if (services.length === 0) {
    catalogueList.innerHTML = `<p class="text-center text-muted" style="grid-column: 1/-1; padding: 40px;">No active services found in this category.</p>`;
    return;
  }
  
  services.forEach(service => {
    const card = document.createElement('div');
    card.className = 'service-card glass-panel';
    card.innerHTML = `
      <div class="service-img-wrapper">
        <span class="service-cat-badge">${service.category}</span>
        <img src="${service.imageUrl}" class="service-img" alt="${service.name}">
      </div>
      <div class="service-body">
        <h3 class="service-title">${service.name}</h3>
        <p class="service-desc">${service.description}</p>
        <div class="service-footer">
          <div class="service-price">
            <span class="price-label">Indicative Cost</span>
            <span class="price-amt">Rs ${service.price.toLocaleString('en-IN')}</span>
          </div>
          <span class="service-details-link" onclick="openServiceModal('${service._id}')">View Details -></span>
        </div>
      </div>
    `;
    catalogueList.appendChild(card);
  });
}

// Render Gallery grid
function renderGalleryPhotos(category = 'all') {
  const galleryGrid = document.getElementById('gallery-photos-grid');
  if (!galleryGrid) return;
  
  let photos = dbGet(DB_KEYS.GALLERY);
  galleryGrid.innerHTML = '';
  
  if (category !== 'all') {
    photos = photos.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  
  if (photos.length === 0) {
    galleryGrid.innerHTML = `<p class="text-center text-muted" style="grid-column: 1/-1; padding: 40px;">No event photos in this category yet.</p>`;
    return;
  }
  
  photos.forEach(photo => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.innerHTML = `
      <img src="${photo.imageUrl}" class="gallery-img" alt="${photo.caption}">
      <div class="gallery-overlay">
        <h4 class="gallery-title">${photo.caption}</h4>
        <span class="gallery-category">${photo.category}</span>
      </div>
    `;
    galleryGrid.appendChild(card);
  });
}

// ----------------------------------------------------
// 6. POPUPS & SERVICE DETAIL DIALOG
// ----------------------------------------------------

let selectedServiceIdForBooking = null;

window.openServiceModal = function(serviceId) {
  const services = dbGet(DB_KEYS.SERVICES);
  const service = services.find(s => s._id === serviceId);
  if (!service) return;
  
  selectedServiceIdForBooking = serviceId;
  
  document.getElementById('modal-srv-title').innerText = service.name;
  document.getElementById('modal-srv-img').src = service.imageUrl;
  document.getElementById('modal-srv-badge').innerText = service.category;
  document.getElementById('modal-srv-cost').innerText = `Rs ${service.price.toLocaleString('en-IN')}`;
  document.getElementById('modal-srv-description').innerText = service.description;
  
  document.getElementById('modal-service-backdrop').style.display = 'flex';
};

window.closeServiceModal = function() {
  document.getElementById('modal-service-backdrop').style.display = 'none';
};

window.selectServiceInForm = function() {
  if (!selectedServiceIdForBooking) return;
  // Trigger checkbox select inside form
  const cb = document.querySelector(`.booking-srv-cb[value="${selectedServiceIdForBooking}"]`);
  if (cb) {
    cb.checked = true;
    cb.closest('.service-check-item').classList.add('selected');
    calculateEstimatedPrice();
  }
};

// ----------------------------------------------------
// 7. BOOKING FORM LOGIC & ESTIMATOR
// ----------------------------------------------------

function initBookingForm() {
  const form = document.getElementById('booking-request-form');
  if (!form) return;
  
  const loginAlert = document.getElementById('booking-login-alert');
  const submitBtn = document.getElementById('btn-submit-booking');
  const servicesList = document.getElementById('booking-services-selection');
  
  // Guard access if Guest
  if (!currentUser || currentUser.role !== 'customer') {
    loginAlert.style.display = 'flex';
    form.classList.add('d-none');
    return;
  } else {
    loginAlert.style.display = 'none';
    form.classList.remove('d-none');
    
    // Prefill user details
    document.getElementById('booking-fullname').value = currentUser.name;
    document.getElementById('booking-fullname').readOnly = true;
    document.getElementById('booking-email').value = currentUser.email;
    document.getElementById('booking-email').readOnly = true;
    document.getElementById('booking-phone').value = currentUser.phone;
    document.getElementById('booking-phone').readOnly = true;
  }

  // Populate active services checkboxes
  const services = dbGet(DB_KEYS.SERVICES).filter(s => s.isActive);
  servicesList.innerHTML = '';
  
  services.forEach(s => {
    const label = document.createElement('label');
    label.className = 'service-check-item';
    label.innerHTML = `
      <input type="checkbox" class="booking-srv-cb" name="serviceIds" value="${s._id}">
      <div class="service-check-label">
        <span class="service-check-name">${s.name} (${s.category})</span>
        <span class="service-check-price">Rs ${s.price.toLocaleString('en-IN')}</span>
      </div>
    `;
    servicesList.appendChild(label);
  });

  // Bind change event to check boxes to update estimate & visual states
  document.querySelectorAll('.booking-srv-cb').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const parent = e.target.closest('.service-check-item');
      if (e.target.checked) {
        parent.classList.add('selected');
      } else {
        parent.classList.remove('selected');
      }
      calculateEstimatedPrice();
    });
  });

  // Clear previous inline errors
  document.querySelectorAll('.error-msg').forEach(el => el.innerText = '');
  document.getElementById('booking-price-summary').style.display = 'none';
}

function calculateEstimatedPrice() {
  const checkedBoxes = document.querySelectorAll('.booking-srv-cb:checked');
  const priceSummary = document.getElementById('booking-price-summary');
  const amountVal = document.getElementById('estimated-total-amount');
  
  if (checkedBoxes.length === 0) {
    priceSummary.style.display = 'none';
    return;
  }

  const services = dbGet(DB_KEYS.SERVICES);
  let total = 0;
  
  checkedBoxes.forEach(cb => {
    const srv = services.find(s => s._id === cb.value);
    if (srv) total += srv.price;
  });

  amountVal.innerText = `Rs ${total.toLocaleString('en-IN')}`;
  priceSummary.style.display = 'block';
}

// ----------------------------------------------------
// 8. INPUT FORM VALIDATIONS
// ----------------------------------------------------

function validateBookingForm() {
  let isValid = true;
  
  const eventType = document.getElementById('booking-eventtype');
  const eventDate = document.getElementById('booking-date');
  const venue = document.getElementById('booking-venue');
  const checkboxes = document.querySelectorAll('.booking-srv-cb:checked');
  
  // Clear errors
  document.querySelectorAll('.booking-form .error-msg').forEach(el => el.innerText = '');
  document.querySelectorAll('.booking-form input, select, textarea').forEach(el => el.classList.remove('invalid'));

  // Event Type Required
  if (!eventType.value) {
    document.getElementById('err-booking-eventtype').innerText = 'Event Type is required';
    eventType.classList.add('invalid');
    isValid = false;
  }

  // Venue Required
  if (!venue.value.trim()) {
    document.getElementById('err-booking-venue').innerText = 'Venue is required';
    venue.classList.add('invalid');
    isValid = false;
  }

  // Date Required & Must be Future Date
  if (!eventDate.value) {
    document.getElementById('err-booking-date').innerText = 'Event Date is required';
    eventDate.classList.add('invalid');
    isValid = false;
  } else {
    const selectedDate = new Date(eventDate.value);
    selectedDate.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    if (selectedDate <= today) {
      document.getElementById('err-booking-date').innerText = 'Event date must be a future date';
      eventDate.classList.add('invalid');
      isValid = false;
    }
  }

  // Service Selection Min 1 check
  if (checkboxes.length === 0) {
    document.getElementById('err-booking-services').innerText = 'At least one service must be selected for a booking';
    isValid = false;
  }

  return isValid;
}

function validateEnquiryForm() {
  let isValid = true;
  const name = document.getElementById('enquiry-name');
  const email = document.getElementById('enquiry-email');
  const phone = document.getElementById('enquiry-phone');
  const message = document.getElementById('enquiry-message');
  
  document.querySelectorAll('#general-enquiry-form .error-msg').forEach(el => el.innerText = '');
  document.querySelectorAll('#general-enquiry-form input, textarea').forEach(el => el.classList.remove('invalid'));

  // Name check: min 3 chars
  if (!name.value.trim() || name.value.trim().length < 3) {
    document.getElementById('err-enquiry-name').innerText = 'Required, minimum 3 characters';
    name.classList.add('invalid');
    isValid = false;
  }

  // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
    document.getElementById('err-enquiry-email').innerText = 'Enter a valid email address';
    email.classList.add('invalid');
    isValid = false;
  }

  // Phone: Exactly 10 digits
  const phoneRegex = /^\d{10}$/;
  if (!phone.value.trim() || !phoneRegex.test(phone.value.trim())) {
    document.getElementById('err-enquiry-phone').innerText = 'Phone number must be exactly 10 digits';
    phone.classList.add('invalid');
    isValid = false;
  }

  // Message check
  if (!message.value.trim()) {
    document.getElementById('err-enquiry-message').innerText = 'Message text is required';
    message.classList.add('invalid');
    isValid = false;
  }

  return isValid;
}

function validateRegisterForm() {
  let isValid = true;
  const name = document.getElementById('reg-name');
  const email = document.getElementById('reg-email');
  const phone = document.getElementById('reg-phone');
  const password = document.getElementById('reg-password');

  document.querySelectorAll('#customer-register-form .error-msg').forEach(el => el.innerText = '');
  document.querySelectorAll('#customer-register-form input').forEach(el => el.classList.remove('invalid'));

  // Name: min 3 chars
  if (!name.value.trim() || name.value.trim().length < 3) {
    document.getElementById('err-reg-name').innerText = 'Required, minimum 3 characters';
    name.classList.add('invalid');
    isValid = false;
  }

  // Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
    document.getElementById('err-reg-email').innerText = 'Enter a valid email address';
    email.classList.add('invalid');
    isValid = false;
  } else {
    // Unique check
    const users = dbGet(DB_KEYS.USERS);
    const exists = users.some(u => u.email.toLowerCase() === email.value.trim().toLowerCase());
    if (exists) {
      document.getElementById('err-reg-email').innerText = 'Email is already registered';
      email.classList.add('invalid');
      isValid = false;
    }
  }

  // Phone: exactly 10 digits
  const phoneRegex = /^\d{10}$/;
  if (!phone.value.trim() || !phoneRegex.test(phone.value.trim())) {
    document.getElementById('err-reg-phone').innerText = 'Phone number must be 10 digits';
    phone.classList.add('invalid');
    isValid = false;
  }

  // Password: min 8 chars
  if (!password.value.trim() || password.value.trim().length < 8) {
    document.getElementById('err-reg-password').innerText = 'Required, minimum 8 characters';
    password.classList.add('invalid');
    isValid = false;
  }

  return isValid;
}

// ----------------------------------------------------
// 9. CLIENT INTERACTION LOGIC
// ----------------------------------------------------

// Submit Booking Form
function handleBookingSubmit(e) {
  e.preventDefault();
  if (!validateBookingForm()) return;
  
  const eventType = document.getElementById('booking-eventtype').value;
  const eventDate = document.getElementById('booking-date').value;
  const venue = document.getElementById('booking-venue').value;
  const guestCount = parseInt(document.getElementById('booking-guestcount').value) || 0;
  const specialRequirements = document.getElementById('booking-requirements').value;
  
  const checkedBoxes = document.querySelectorAll('.booking-srv-cb:checked');
  const serviceIds = Array.from(checkedBoxes).map(cb => cb.value);
  
  const services = dbGet(DB_KEYS.SERVICES);
  const serviceNames = serviceIds.map(id => {
    const s = services.find(srv => srv._id === id);
    return s ? s.name : '';
  }).filter(name => name !== '').join(', ');

  // Calculate indicative amount
  let total = 0;
  serviceIds.forEach(id => {
    const s = services.find(srv => srv._id === id);
    if (s) total += s.price;
  });

  const newBooking = {
    _id: 'bk_' + Date.now(),
    userId: currentUser._id,
    customerName: currentUser.name,
    eventType: eventType,
    eventDate: eventDate,
    venue: venue,
    guestCount: guestCount,
    serviceIds: serviceIds,
    serviceNames: serviceNames,
    advanceAmount: total, // Set estimated service pricing
    status: 'pending',
    specialRequirements: specialRequirements,
    createdAt: new Date().toISOString()
  };

  const bookings = dbGet(DB_KEYS.BOOKINGS);
  bookings.push(newBooking);
  dbSet(DB_KEYS.BOOKINGS, bookings);

  showToast('Booking request submitted successfully! Pending admin approval.', 'success');
  
  // Redirect to dashboard
  setTimeout(() => {
    window.location.hash = '#dashboard';
  }, 1000);
}

// General Contact Enquiry Submit
function handleEnquirySubmit(e) {
  e.preventDefault();
  if (!validateEnquiryForm()) return;
  
  const btn = document.getElementById('btn-submit-enquiry');
  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting...`;

  const name = document.getElementById('enquiry-name').value;
  const email = document.getElementById('enquiry-email').value;
  const phone = document.getElementById('enquiry-phone').value;
  const message = document.getElementById('enquiry-message').value;

  const newEnquiry = {
    _id: 'enq_' + Date.now(),
    name: name,
    email: email,
    phone: phone,
    message: message,
    status: 'new',
    createdAt: new Date().toISOString()
  };

  // Simulate 1s server-side action to address double-click defect DF06
  setTimeout(() => {
    const enquiries = dbGet(DB_KEYS.ENQUIRIES);
    enquiries.push(newEnquiry);
    dbSet(DB_KEYS.ENQUIRIES, enquiries);
    
    showToast('Your enquiry has been sent. Thank you!', 'success');
    
    // Clear form
    document.getElementById('general-enquiry-form').reset();
    btn.disabled = false;
    btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Send Message`;
  }, 1000);
}

// Customer login submit
function handleCustomerLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email');
  const password = document.getElementById('login-password');
  
  document.querySelectorAll('#customer-login-form .error-msg').forEach(el => el.innerText = '');
  email.classList.remove('invalid');
  password.classList.remove('invalid');

  if (!email.value) {
    document.getElementById('err-login-email').innerText = 'Email is required';
    email.classList.add('invalid');
    return;
  }
  if (!password.value) {
    document.getElementById('err-login-password').innerText = 'Password is required';
    password.classList.add('invalid');
    return;
  }

  const users = dbGet(DB_KEYS.USERS);
  const matched = users.find(u => u.email.toLowerCase() === email.value.trim().toLowerCase() && u.passwordHash === password.value && u.role === 'customer');

  if (!matched) {
    showToast('Invalid email or password', 'error');
    email.classList.add('invalid');
    password.classList.add('invalid');
    return;
  }

  saveSession(matched);
  showToast(`Welcome back, ${matched.name}!`, 'success');
  
  // Clear forms
  document.getElementById('customer-login-form').reset();
  
  // Go to dashboard
  setTimeout(() => {
    window.location.hash = '#dashboard';
  }, 500);
}

// Customer Register Submit
function handleCustomerRegister(e) {
  e.preventDefault();
  if (!validateRegisterForm()) return;
  
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const phone = document.getElementById('reg-phone').value;
  const password = document.getElementById('reg-password').value;

  const newUser = {
    _id: 'usr_' + Date.now(),
    name: name,
    email: email,
    phone: phone,
    passwordHash: password,
    role: 'customer',
    createdAt: new Date().toISOString()
  };

  const users = dbGet(DB_KEYS.USERS);
  users.push(newUser);
  dbSet(DB_KEYS.USERS, users);

  showToast('Account created successfully! Logging you in...', 'success');
  
  // Clear form
  document.getElementById('customer-register-form').reset();

  saveSession(newUser);
  
  // Redirect
  setTimeout(() => {
    window.location.hash = '#dashboard';
  }, 1000);
}

// Admin login submit
function handleAdminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('admin-email');
  const password = document.getElementById('admin-password');
  
  document.querySelectorAll('#admin-login-form .error-msg').forEach(el => el.innerText = '');
  email.classList.remove('invalid');
  password.classList.remove('invalid');

  if (!email.value) {
    document.getElementById('err-admin-email').innerText = 'Admin email is required';
    email.classList.add('invalid');
    return;
  }
  if (!password.value) {
    document.getElementById('err-admin-password').innerText = 'Password is required';
    password.classList.add('invalid');
    return;
  }

  const users = dbGet(DB_KEYS.USERS);
  const matched = users.find(u => u.email.toLowerCase() === email.value.trim().toLowerCase() && u.passwordHash === password.value && u.role === 'admin');

  if (!matched) {
    showToast('Invalid admin credentials', 'error');
    email.classList.add('invalid');
    password.classList.add('invalid');
    return;
  }

  saveSession(matched);
  showToast('Admin Portal Loaded Successfully', 'success');
  document.getElementById('admin-login-form').reset();

  setTimeout(() => {
    window.location.hash = '#admin';
  }, 500);
}

// ----------------------------------------------------
// 10. CUSTOMER DASHBOARD CONTROLLER
// ----------------------------------------------------

function renderCustomerDashboard() {
  if (!currentUser) return;
  
  document.getElementById('customer-profile-name').innerText = currentUser.name;
  document.getElementById('customer-profile-email').innerText = currentUser.email;
  document.getElementById('customer-profile-phone').innerText = `Phone: ${currentUser.phone}`;

  const bookings = dbGet(DB_KEYS.BOOKINGS).filter(b => b.userId === currentUser._id);
  const tableBody = document.getElementById('customer-bookings-list');
  tableBody.innerHTML = '';

  if (bookings.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center">You have no booking requests yet. Click "New Booking" to begin.</td></tr>`;
    return;
  }

  // Sort by date desc
  bookings.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  bookings.forEach(b => {
    const formattedDate = new Date(b.eventDate).toLocaleDateString('en-IN', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });

    let actionHTML = '';
    if (b.status === 'completed') {
      // Check if testimonial is already submitted for this booking
      const testimonials = dbGet(DB_KEYS.TESTIMONIALS);
      const testExists = testimonials.some(t => t.bookingId === b._id);
      
      if (testExists) {
        actionHTML = `<span class="badge text-success"><i class="fa-solid fa-check-double"></i> Reviewed</span>`;
      } else {
        actionHTML = `<button class="btn btn-accent btn-sm" onclick="openTestimonialModal('${b._id}')">Submit Feedback</button>`;
      }
    } else if (b.status === 'pending') {
      actionHTML = `<button class="btn btn-outline btn-sm text-danger" onclick="cancelBooking('${b._id}')">Cancel</button>`;
    } else {
      actionHTML = `<span class="text-muted">-</span>`;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="table-cell-title">${b.eventType}</td>
      <td>
        <div class="table-cell-bold">${formattedDate}</div>
        <div class="table-cell-italic">${b.venue}</div>
      </td>
      <td>${b.serviceNames}</td>
      <td class="table-cell-bold">Rs ${b.advanceAmount.toLocaleString('en-IN')}</td>
      <td><span class="badge-status ${b.status}">${b.status}</span></td>
      <td>${actionHTML}</td>
    `;
    tableBody.appendChild(tr);
  });
}

window.cancelBooking = function(bookingId) {
  if (!confirm('Are you sure you want to cancel this booking request?')) return;
  
  const bookings = dbGet(DB_KEYS.BOOKINGS);
  const idx = bookings.findIndex(b => b._id === bookingId);
  if (idx !== -1) {
    bookings[idx].status = 'cancelled';
    dbSet(DB_KEYS.BOOKINGS, bookings);
    showToast('Booking cancelled successfully', 'info');
    renderCustomerDashboard();
  }
};

// Testimonial modal
window.openTestimonialModal = function(bookingId) {
  document.getElementById('modal-testimonial-booking-id').value = bookingId;
  
  // Clear forms and errors
  document.getElementById('customer-testimonial-form').reset();
  document.getElementById('err-testimonial-rating').innerText = '';
  document.getElementById('err-testimonial-message').innerText = '';
  
  document.getElementById('modal-testimonial-backdrop').style.display = 'flex';
};

window.closeTestimonialModal = function() {
  document.getElementById('modal-testimonial-backdrop').style.display = 'none';
};

function handleTestimonialSubmit(e) {
  e.preventDefault();
  
  const ratingInput = document.getElementById('testimonial-rating');
  const messageInput = document.getElementById('testimonial-message');
  const bookingId = document.getElementById('modal-testimonial-booking-id').value;
  
  const ratingErr = document.getElementById('err-testimonial-rating');
  const msgErr = document.getElementById('err-testimonial-message');
  
  ratingErr.innerText = '';
  msgErr.innerText = '';
  
  let isValid = true;
  const ratingVal = parseInt(ratingInput.value);
  
  // Validation: rating 1-5
  if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
    ratingErr.innerText = 'Rating must be an integer between 1 and 5';
    isValid = false;
  }
  
  // Validation: message
  if (!messageInput.value.trim()) {
    msgErr.innerText = 'Feedback message is required';
    isValid = false;
  }

  if (!isValid) return;

  const newTestimonial = {
    _id: 'test_' + Date.now(),
    bookingId: bookingId,
    customerName: currentUser.name,
    message: messageInput.value.trim(),
    rating: ratingVal,
    approved: false, // Must be approved by Admin
    createdAt: new Date().toISOString()
  };

  const testimonials = dbGet(DB_KEYS.TESTIMONIALS);
  testimonials.push(newTestimonial);
  dbSet(DB_KEYS.TESTIMONIALS, testimonials);

  closeTestimonialModal();
  showToast('Testimonial submitted successfully! Waiting for admin approval.', 'success');
  renderCustomerDashboard();
}

// ----------------------------------------------------
// 11. ADMINISTRATOR CONTROL DASHBOARD
// ----------------------------------------------------

// TAB 1: MANAGE BOOKINGS
function renderAdminBookings() {
  const bookings = dbGet(DB_KEYS.BOOKINGS);
  const bookingsCount = document.getElementById('admin-bookings-count');
  const listBody = document.getElementById('admin-bookings-list');
  
  bookingsCount.innerText = `${bookings.length} Bookings Total`;
  listBody.innerHTML = '';

  if (bookings.length === 0) {
    listBody.innerHTML = `<tr><td colspan="6" class="text-center">No bookings submitted.</td></tr>`;
    return;
  }

  // Sort by date desc
  bookings.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  bookings.forEach(b => {
    const formattedDate = new Date(b.eventDate).toLocaleDateString('en-IN', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });

    let selectHTML = '';
    if (b.status === 'completed' || b.status === 'cancelled') {
      selectHTML = `<span class="text-muted">Archive</span>`;
    } else {
      selectHTML = `
        <select class="admin-status-dropdown" onchange="updateBookingStatus('${b._id}', this.value)">
          <option value="pending" ${b.status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="confirmed" ${b.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
          <option value="completed" ${b.status === 'completed' ? 'selected' : ''}>Completed</option>
          <option value="cancelled" ${b.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      `;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="table-cell-bold">${b.customerName}</div>
        <div class="table-cell-italic">${b.userId}</div>
      </td>
      <td>
        <div class="table-cell-bold">${b.eventType}</div>
        <div>Services: ${b.serviceNames}</div>
      </td>
      <td>
        <div class="table-cell-bold">${formattedDate}</div>
        <div class="table-cell-italic">${b.venue}</div>
      </td>
      <td class="table-cell-bold">Rs ${b.advanceAmount.toLocaleString('en-IN')}</td>
      <td><span class="badge-status ${b.status}">${b.status}</span></td>
      <td>${selectHTML}</td>
    `;
    listBody.appendChild(tr);
  });
}

window.updateBookingStatus = function(bookingId, newStatus) {
  const bookings = dbGet(DB_KEYS.BOOKINGS);
  const idx = bookings.findIndex(b => b._id === bookingId);
  if (idx !== -1) {
    bookings[idx].status = newStatus;
    dbSet(DB_KEYS.BOOKINGS, bookings);
    showToast(`Booking status updated to ${newStatus}`, 'success');
    renderAdminBookings();
  }
};

// TAB 2: MANAGE SERVICES
function renderAdminServices() {
  const services = dbGet(DB_KEYS.SERVICES);
  const listBody = document.getElementById('admin-services-list');
  listBody.innerHTML = '';

  services.forEach(s => {
    const statusText = s.isActive ? 'active' : 'inactive';
    const statusBtnText = s.isActive ? 'Deactivate' : 'Activate';
    const statusBtnClass = s.isActive ? 'text-danger' : 'text-success';
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="table-cell-title">${s.name}</td>
      <td>${s.category}</td>
      <td class="table-cell-bold">Rs ${s.price.toLocaleString('en-IN')}</td>
      <td><span class="badge-status ${statusText}">${statusText}</span></td>
      <td class="admin-actions-cell">
        <!-- Address DF04: Admin deactivates instead of delete -->
        <button class="btn btn-outline btn-sm ${statusBtnClass}" onclick="toggleServiceStatus('${s._id}')">${statusBtnText}</button>
      </td>
    `;
    listBody.appendChild(tr);
  });

  // Clear Add form input and errors
  document.getElementById('admin-add-service-form').reset();
  document.getElementById('err-admin-srv-name').innerText = '';
  document.getElementById('err-admin-srv-category').innerText = '';
  document.getElementById('err-admin-srv-price').innerText = '';
}

window.toggleServiceStatus = function(serviceId) {
  const services = dbGet(DB_KEYS.SERVICES);
  const idx = services.findIndex(s => s._id === serviceId);
  if (idx !== -1) {
    const isCurrentActive = services[idx].isActive;
    services[idx].isActive = !isCurrentActive;
    dbSet(DB_KEYS.SERVICES, services);
    
    const msg = isCurrentActive ? 'Service deactivated' : 'Service activated';
    showToast(msg, 'success');
    renderAdminServices();
  }
};

function handleAddService(e) {
  e.preventDefault();
  
  const nameInput = document.getElementById('admin-srv-name');
  const catInput = document.getElementById('admin-srv-category');
  const priceInput = document.getElementById('admin-srv-price');
  const descInput = document.getElementById('admin-srv-desc');
  const imageInput = document.getElementById('admin-srv-image');

  const nameErr = document.getElementById('err-admin-srv-name');
  const catErr = document.getElementById('err-admin-srv-category');
  const priceErr = document.getElementById('err-admin-srv-price');

  nameErr.innerText = '';
  catErr.innerText = '';
  priceErr.innerText = '';

  let isValid = true;

  if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
    nameErr.innerText = 'Service name must be at least 3 characters';
    isValid = false;
  }
  if (!catInput.value) {
    catErr.innerText = 'Category selection is required';
    isValid = false;
  }
  const priceVal = parseInt(priceInput.value);
  if (isNaN(priceVal) || priceVal <= 0) {
    priceErr.innerText = 'Price must be a positive number';
    isValid = false;
  }

  if (!isValid) return;

  const newService = {
    _id: 'srv_' + Date.now(),
    name: nameInput.value.trim(),
    category: catInput.value,
    description: descInput.value.trim(),
    price: priceVal,
    imageUrl: imageInput.value,
    isActive: true
  };

  const services = dbGet(DB_KEYS.SERVICES);
  services.push(newService);
  dbSet(DB_KEYS.SERVICES, services);

  showToast('New service added successfully', 'success');
  renderAdminServices();
}

// TAB 3: MANAGE GALLERY
function renderAdminGallery() {
  const gallery = dbGet(DB_KEYS.GALLERY);
  const container = document.getElementById('admin-gallery-list');
  container.innerHTML = '';

  gallery.forEach(g => {
    const div = document.createElement('div');
    div.className = 'admin-gallery-card';
    div.innerHTML = `
      <img src="${g.imageUrl}" alt="${g.caption}">
      <button class="admin-gallery-card-btn" onclick="deleteGalleryPhoto('${g._id}')">
        <i class="fa-solid fa-trash-can"></i>
      </button>
      <div class="admin-gallery-card-caption">${g.caption}</div>
    `;
    container.appendChild(div);
  });

  // Populate linked services dropdown
  const srvSelect = document.getElementById('admin-gal-service');
  srvSelect.innerHTML = `<option value="">-- No Linked Service --</option>`;
  dbGet(DB_KEYS.SERVICES).filter(s => s.isActive).forEach(s => {
    const opt = document.createElement('option');
    opt.value = s._id;
    opt.innerText = s.name;
    srvSelect.appendChild(opt);
  });

  // Clear inputs
  document.getElementById('admin-add-gallery-form').reset();
  document.getElementById('err-admin-gal-caption').innerText = '';
  document.getElementById('err-admin-gal-category').innerText = '';
}

window.deleteGalleryPhoto = function(galleryId) {
  if (!confirm('Are you sure you want to remove this photo from the gallery?')) return;
  
  let gallery = dbGet(DB_KEYS.GALLERY);
  gallery = gallery.filter(g => g._id !== galleryId);
  dbSet(DB_KEYS.GALLERY, gallery);

  showToast('Image removed from gallery', 'info');
  renderAdminGallery();
};

function handleAddGallery(e) {
  e.preventDefault();
  
  const captionInput = document.getElementById('admin-gal-caption');
  const catInput = document.getElementById('admin-gal-category');
  const srvInput = document.getElementById('admin-gal-service');
  const imageInput = document.getElementById('admin-gal-image');

  const capErr = document.getElementById('err-admin-gal-caption');
  const catErr = document.getElementById('err-admin-gal-category');

  capErr.innerText = '';
  catErr.innerText = '';

  let isValid = true;
  if (!captionInput.value.trim()) {
    capErr.innerText = 'Caption is required';
    isValid = false;
  }
  if (!catInput.value) {
    catErr.innerText = 'Category is required';
    isValid = false;
  }

  if (!isValid) return;

  const newPhoto = {
    _id: 'gal_' + Date.now(),
    serviceId: srvInput.value || null,
    imageUrl: imageInput.value,
    caption: captionInput.value.trim(),
    category: catInput.value,
    uploadedAt: new Date().toISOString()
  };

  const gallery = dbGet(DB_KEYS.GALLERY);
  gallery.push(newPhoto);
  dbSet(DB_KEYS.GALLERY, gallery);

  showToast('Photo added to gallery', 'success');
  renderAdminGallery();
}

// TAB 4: TESTIMONIALS MODERATION
function renderAdminTestimonials() {
  const testimonials = dbGet(DB_KEYS.TESTIMONIALS);
  
  const pendingContainer = document.getElementById('admin-testimonials-pending-list');
  const approvedContainer = document.getElementById('admin-testimonials-approved-list');
  
  pendingContainer.innerHTML = '';
  approvedContainer.innerHTML = '';

  const pending = testimonials.filter(t => !t.approved);
  const approved = testimonials.filter(t => t.approved);

  // Render Pending
  pending.forEach(t => {
    const starsHTML = Array(t.rating).fill('<i class="fa-solid fa-star"></i>').join('') + 
                      Array(5 - t.rating).fill('<i class="fa-regular fa-star"></i>').join('');
    
    const div = document.createElement('div');
    div.className = 'testimonial-mod-card';
    div.innerHTML = `
      <div class="testimonial-mod-header">
        <div class="testimonial-mod-info">
          <h4>${t.customerName}</h4>
          <span>Submitted on ${new Date(t.createdAt).toLocaleDateString('en-IN')}</span>
        </div>
        <div class="testimonial-mod-rating">${starsHTML}</div>
      </div>
      <div class="testimonial-mod-body">"${t.message}"</div>
      <div class="testimonial-mod-actions">
        <button class="btn btn-outline btn-sm text-danger" onclick="rejectTestimonial('${t._id}')">Reject</button>
        <button class="btn btn-primary btn-sm" onclick="approveTestimonial('${t._id}')">Approve Testimonial</button>
      </div>
    `;
    pendingContainer.appendChild(div);
  });

  // Render Approved
  approved.forEach(t => {
    const starsHTML = Array(t.rating).fill('<i class="fa-solid fa-star"></i>').join('') + 
                      Array(5 - t.rating).fill('<i class="fa-regular fa-star"></i>').join('');
                      
    const div = document.createElement('div');
    div.className = 'testimonial-mod-card';
    div.innerHTML = `
      <div class="testimonial-mod-header">
        <div class="testimonial-mod-info">
          <h4>${t.customerName}</h4>
          <span>Approved Testimonial</span>
        </div>
        <div class="testimonial-mod-rating">${starsHTML}</div>
      </div>
      <div class="testimonial-mod-body">"${t.message}"</div>
      <div class="testimonial-mod-actions">
        <button class="btn btn-outline btn-sm text-danger" onclick="rejectTestimonial('${t._id}')">Remove</button>
      </div>
    `;
    approvedContainer.appendChild(div);
  });
}

window.approveTestimonial = function(id) {
  const testimonials = dbGet(DB_KEYS.TESTIMONIALS);
  const idx = testimonials.findIndex(t => t._id === id);
  if (idx !== -1) {
    testimonials[idx].approved = true;
    dbSet(DB_KEYS.TESTIMONIALS, testimonials);
    showToast('Testimonial approved successfully and is now public', 'success');
    renderAdminTestimonials();
  }
};

window.rejectTestimonial = function(id) {
  if (!confirm('Are you sure you want to reject/remove this testimonial?')) return;
  
  let testimonials = dbGet(DB_KEYS.TESTIMONIALS);
  testimonials = testimonials.filter(t => t._id !== id);
  dbSet(DB_KEYS.TESTIMONIALS, testimonials);
  showToast('Testimonial removed', 'info');
  renderAdminTestimonials();
};

// TAB 5: ENQUIRIES HANDLE
function renderAdminEnquiries() {
  const enquiries = dbGet(DB_KEYS.ENQUIRIES);
  const listBody = document.getElementById('admin-enquiries-list');
  listBody.innerHTML = '';

  if (enquiries.length === 0) {
    listBody.innerHTML = `<tr><td colspan="6" class="text-center">No contact enquiries received.</td></tr>`;
    return;
  }

  enquiries.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  enquiries.forEach(e => {
    const formattedDate = new Date(e.createdAt).toLocaleString('en-IN', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit'
    });

    let actionHTML = '';
    if (e.status === 'new') {
      actionHTML = `
        <button class="btn btn-primary btn-sm" onclick="openEnquiryReply('${e._id}')">Reply</button>
      `;
    } else {
      actionHTML = `<span class="badge text-success"><i class="fa-solid fa-check"></i> Responded</span>`;
    }

    const tr = document.createElement('tr');
    tr.id = `enq-row-${e._id}`;
    tr.innerHTML = `
      <td class="table-cell-bold">${e.name}</td>
      <td>
        <div>Email: ${e.email}</div>
        <div>Phone: ${e.phone}</div>
      </td>
      <td style="max-width: 300px; word-wrap: break-word;">${e.message}</td>
      <td>${formattedDate}</td>
      <td><span class="badge-status ${e.status}">${e.status}</span></td>
      <td>${actionHTML}</td>
    `;
    listBody.appendChild(tr);
  });
}

window.openEnquiryReply = function(enquiryId) {
  const row = document.getElementById(`enq-row-${enquiryId}`);
  // Check if reply box already exists
  if (document.getElementById(`reply-box-${enquiryId}`)) return;

  const replyTr = document.createElement('tr');
  replyTr.id = `reply-box-${enquiryId}`;
  replyTr.innerHTML = `
    <td colspan="6">
      <div class="enquiry-response-box">
        <h5>Send Response to Enquirer</h5>
        <textarea id="reply-text-${enquiryId}" class="enquiry-response-textarea" rows="3" placeholder="Write your response email here..."></textarea>
        <div class="enquiry-response-actions">
          <button class="btn btn-outline btn-sm" onclick="closeEnquiryReply('${enquiryId}')">Cancel</button>
          <button class="btn btn-success btn-sm" onclick="submitEnquiryReply('${enquiryId}')">Mark Responded & Send</button>
        </div>
      </div>
    </td>
  `;
  // Insert below current row
  row.parentNode.insertBefore(replyTr, row.nextSibling);
};

window.closeEnquiryReply = function(enquiryId) {
  const el = document.getElementById(`reply-box-${enquiryId}`);
  if (el) el.remove();
};

window.submitEnquiryReply = function(enquiryId) {
  const txt = document.getElementById(`reply-text-${enquiryId}`).value.trim();
  if (!txt) {
    alert('Please enter a response message before submitting.');
    return;
  }

  const enquiries = dbGet(DB_KEYS.ENQUIRIES);
  const idx = enquiries.findIndex(e => e._id === enquiryId);
  if (idx !== -1) {
    enquiries[idx].status = 'responded';
    dbSet(DB_KEYS.ENQUIRIES, enquiries);
    
    showToast('Enquiry response simulated and marked as responded', 'success');
    renderAdminEnquiries();
  }
};

// ----------------------------------------------------
// 12. INITIALIZATION & EVENT BINDINGS
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  // Initialize seeded database if empty
  initDatabase();
  
  // Load Session
  loadSession();

  // Route listener
  window.addEventListener('hashchange', router);
  // Trigger initial route
  router();

  // Header Mobile menu toggle
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  // Bind forms submit handlers
  const bookingForm = document.getElementById('booking-request-form');
  if (bookingForm) bookingForm.addEventListener('submit', handleBookingSubmit);

  const enquiryForm = document.getElementById('general-enquiry-form');
  if (enquiryForm) enquiryForm.addEventListener('submit', handleEnquirySubmit);

  const loginForm = document.getElementById('customer-login-form');
  if (loginForm) loginForm.addEventListener('submit', handleCustomerLogin);

  const regForm = document.getElementById('customer-register-form');
  if (regForm) regForm.addEventListener('submit', handleCustomerRegister);

  const adminLoginForm = document.getElementById('admin-login-form');
  if (adminLoginForm) adminLoginForm.addEventListener('submit', handleAdminLogin);

  const addSrvForm = document.getElementById('admin-add-service-form');
  if (addSrvForm) addSrvForm.addEventListener('submit', handleAddService);

  const addGalForm = document.getElementById('admin-add-gallery-form');
  if (addGalForm) addGalForm.addEventListener('submit', handleAddGallery);

  const testModalForm = document.getElementById('customer-testimonial-form');
  if (testModalForm) testModalForm.addEventListener('submit', handleTestimonialSubmit);

  // Dashboard logouts
  const custLogout = document.getElementById('btn-customer-logout');
  if (custLogout) custLogout.addEventListener('click', clearSession);

  const admLogout = document.getElementById('btn-admin-logout');
  if (admLogout) admLogout.addEventListener('click', clearSession);

  // Link services category selectors
  document.querySelectorAll('.services-filter-bar .filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.services-filter-bar .filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderServicesCatalogue(e.target.getAttribute('data-category'));
    });
  });

  // Link gallery category selectors
  document.querySelectorAll('.gallery-filter-bar .gallery-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.gallery-filter-bar .gallery-filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderGalleryPhotos(e.target.getAttribute('data-gallery-cat'));
    });
  });
});
