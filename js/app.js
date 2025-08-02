/**
 * Karachi Guesthouse Hub - Main Application JavaScript
 * Handles search, filtering, navigation, form validation, and interactive features
 */

class KarachiGuesthouseApp {
    constructor() {
        this.guesthouses = [];
        this.filteredGuesthouses = [];
        this.searchHistory = [];
        this.userPreferences = {};
        this.currentPage = 'home';
        
        this.init();
    }

    init() {
        // Add js-loaded class to enable animations
        document.body.classList.add('js-loaded');

        this.loadUserPreferences();
        this.loadGuesthouses();
        this.initializeEventListeners();
        this.initializeSearch();
        this.initializeFilters();
        this.initializeFormValidation();
        this.initializeImageGallery();
        this.initializeWhatsAppIntegration();
        this.initializeAnimations();
        this.setupErrorHandling();

        // Show welcome message for first-time users
        this.showWelcomeMessage();
    }

    // Load guesthouse data
    loadGuesthouses() {
        this.guesthouses = [
            {
                id: 1,
                name: "Ocean View Guesthouse",
                neighborhood: "Clifton",
                price: 2800,
                amenities: ["AC", "WiFi", "Breakfast", "Parking"],
                description: "2 mins from Clifton Beach with sea breeze",
                phone: "+923001234567",
                images: [
                    "https://images.unsplash.com/photo-1522199710521-72d69614c702?ixlib=rb-4.0.3&auto=format&fit=crop&w=2048&q=90",
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2048&q=90",
                    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2048&q=90"
                ],
                rating: 4.5,
                address: "Block 4, Clifton, Karachi"
            },
            {
                id: 2,
                name: "Luxury DHA Residency",
                neighborhood: "DHA",
                price: 3200,
                amenities: ["AC", "WiFi", "Laundry", "Kitchen"],
                description: "Quiet neighborhood with modern amenities",
                phone: "+923009876543",
                images: [
                    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2048&q=90",
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2048&q=90"
                ],
                rating: 4.7,
                address: "Phase 5, DHA, Karachi"
            },
            {
                id: 3,
                name: "Sea View Guesthouse",
                neighborhood: "Gulshan-e-Iqbal",
                price: 2500,
                amenities: ["AC", "WiFi", "Breakfast"],
                description: "Ocean-facing rooms 5 mins from Lucky One Mall",
                phone: "+923005555555",
                images: [
                    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2048&q=90",
                    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=2048&q=90"
                ],
                rating: 4.3,
                address: "Block 13, Gulshan-e-Iqbal, Karachi"
            },
            {
                id: 4,
                name: "Defence Comfort Inn",
                neighborhood: "Defence",
                price: 2000,
                amenities: ["AC", "WiFi", "Parking"],
                description: "Close to Tariq Road shopping district",
                phone: "+923007777777",
                images: [
                    "https://images.unsplash.com/photo-1551918120-9739cb430c6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2048&q=90",
                    "https://images.unsplash.com/photo-1522199710521-72d69614c702?ixlib=rb-4.0.3&auto=format&fit=crop&w=2048&q=90"
                ],
                rating: 4.2,
                address: "Block 2, Defence, Karachi"
            },
            {
                id: 5,
                name: "Nazimabad Family Stay",
                neighborhood: "North Nazimabad",
                price: 1800,
                amenities: ["AC", "WiFi", "Kitchen"],
                description: "Spacious rooms for families and groups",
                phone: "+923008888888",
                images: [
                    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=2048&q=90",
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2048&q=90"
                ],
                rating: 4.0,
                address: "Block 5, North Nazimabad, Karachi"
            },
            {
                id: 6,
                name: "Historic Saddar Lodge",
                neighborhood: "Saddar",
                price: 1500,
                amenities: ["WiFi", "Parking"],
                description: "Close to all major landmarks and transport",
                phone: "+923009999999",
                images: [
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2048&q=90",
                    "https://images.unsplash.com/photo-1522199710521-72d69614c702?ixlib=rb-4.0.3&auto=format&fit=crop&w=2048&q=90"
                ],
                rating: 3.8,
                address: "M.A. Jinnah Road, Saddar, Karachi"
            }
        ];
        this.filteredGuesthouses = [...this.guesthouses];
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Search functionality
        const searchInput = document.querySelector('.search-box input');
        const searchButton = document.querySelector('.search-box button');

        if (searchInput && searchButton) {
            searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
            searchButton.addEventListener('click', this.handleSearch.bind(this));
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });
        }

        // Navigation
        document.addEventListener('click', this.handleNavigation.bind(this));

        // Mobile menu toggle
        this.initializeMobileMenu();

        // Window resize handler
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
    }

    // Handle navigation
    handleNavigation(event) {
        const target = event.target;

        // Handle view details buttons
        if (target.classList.contains('view-details')) {
            event.preventDefault();
            const id = parseInt(target.dataset.id);
            if (id) {
                this.navigateToGuesthouseDetails(id);
            }
        }

        // Handle navigation links
        if (target.tagName === 'A' && target.getAttribute('href')) {
            const href = target.getAttribute('href');
            if (href.startsWith('#')) {
                event.preventDefault();
                this.scrollToSection(href.substring(1));
            }
        }
    }

    // Scroll to section
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Initialize mobile menu
    initializeMobileMenu() {
        const header = document.querySelector('header');
        if (!header) return;

        // Create mobile menu toggle if it doesn't exist
        let mobileToggle = header.querySelector('.mobile-menu-toggle');
        if (!mobileToggle) {
            mobileToggle = document.createElement('button');
            mobileToggle.className = 'mobile-menu-toggle';
            mobileToggle.innerHTML = '☰';
            mobileToggle.style.cssText = `
                display: none;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--primary-color);
            `;

            const headerContent = header.querySelector('.header-content');
            if (headerContent) {
                headerContent.appendChild(mobileToggle);
            }
        }

        // Add mobile styles
        const nav = header.querySelector('nav');
        if (nav) {
            const style = document.createElement('style');
            style.textContent = `
                @media (max-width: 768px) {
                    .mobile-menu-toggle {
                        display: block !important;
                    }

                    nav {
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: white;
                        box-shadow: var(--shadow);
                        transform: translateY(-100%);
                        opacity: 0;
                        visibility: hidden;
                        transition: all 0.3s ease;
                    }

                    nav.mobile-open {
                        transform: translateY(0);
                        opacity: 1;
                        visibility: visible;
                    }

                    nav ul {
                        flex-direction: column;
                        padding: 1rem;
                        gap: 0.5rem;
                    }

                    nav li {
                        text-align: center;
                        padding: 0.5rem 0;
                        border-bottom: 1px solid #e2e8f0;
                    }

                    nav li:last-child {
                        border-bottom: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Toggle functionality
        mobileToggle.addEventListener('click', () => {
            nav.classList.toggle('mobile-open');
            mobileToggle.innerHTML = nav.classList.contains('mobile-open') ? '×' : '☰';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!header.contains(e.target) && nav.classList.contains('mobile-open')) {
                nav.classList.remove('mobile-open');
                mobileToggle.innerHTML = '☰';
            }
        });
    }

    // Handle window resize
    handleResize() {
        const nav = document.querySelector('nav');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');

        if (window.innerWidth > 768 && nav && nav.classList.contains('mobile-open')) {
            nav.classList.remove('mobile-open');
            if (mobileToggle) {
                mobileToggle.innerHTML = '☰';
            }
        }
    }

    // Search functionality
    handleSearch(event) {
        const searchInput = document.querySelector('.search-box input');
        if (!searchInput) return;

        const query = searchInput.value.trim().toLowerCase();
        
        if (query === '') {
            this.filteredGuesthouses = [...this.guesthouses];
        } else {
            this.filteredGuesthouses = this.guesthouses.filter(guesthouse => 
                guesthouse.name.toLowerCase().includes(query) ||
                guesthouse.neighborhood.toLowerCase().includes(query) ||
                guesthouse.description.toLowerCase().includes(query)
            );
            
            // Save to search history
            this.addToSearchHistory(query);
        }
        
        this.updateGuesthouseDisplay();
        this.showSearchResults(query);
    }

    // Add to search history
    addToSearchHistory(query) {
        if (!this.searchHistory.includes(query)) {
            this.searchHistory.unshift(query);
            if (this.searchHistory.length > 10) {
                this.searchHistory = this.searchHistory.slice(0, 10);
            }
            this.saveUserPreferences();
        }
    }

    // Initialize filters
    initializeFilters() {
        this.createFilterUI();
    }

    // Initialize form validation
    initializeFormValidation() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        // Add real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Handle form submission
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(contactForm);
        });
    }

    // Validate individual field
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Remove existing error
        this.clearFieldError(field);

        // Validation rules
        switch (fieldName) {
            case 'name':
                if (!value) {
                    errorMessage = 'Name is required';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                    isValid = false;
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!emailRegex.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;

            case 'phone':
                if (value) {
                    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
                    if (!phoneRegex.test(value)) {
                        errorMessage = 'Please enter a valid phone number';
                        isValid = false;
                    }
                }
                break;

            case 'message':
                if (!value) {
                    errorMessage = 'Message is required';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Message must be at least 10 characters';
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    // Show field error
    showFieldError(field, message) {
        field.classList.add('error');

        // Create error message element
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem;';
            field.parentNode.appendChild(errorElement);
        }

        errorElement.textContent = message;

        // Add error styling to field
        field.style.borderColor = '#ef4444';
        field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    }

    // Clear field error
    clearFieldError(field) {
        field.classList.remove('error');
        field.style.borderColor = '';
        field.style.boxShadow = '';

        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Handle form submission
    handleFormSubmission(form) {
        const inputs = form.querySelectorAll('input, textarea');
        let isFormValid = true;

        // Validate all fields
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            this.submitForm(form);
        } else {
            this.showError('Please correct the errors above and try again.');
            // Focus on first error field
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.focus();
            }
        }
    }

    // Submit form
    async submitForm(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        try {
            // Show loading state
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message
            this.showSuccess('Thank you for your message! We will get back to you soon.');
            form.reset();

            // Clear any remaining errors
            form.querySelectorAll('input, textarea').forEach(field => {
                this.clearFieldError(field);
            });

        } catch (error) {
            this.showError('Failed to send message. Please try again later.');
            console.error('Form submission error:', error);
        } finally {
            // Restore button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    // Create filter UI
    createFilterUI() {
        const container = document.querySelector('.container');
        if (!container || document.querySelector('.filters-container')) return;

        const filtersHTML = `
            <div class="filters-container" style="margin: 2rem 0; padding: 1.5rem; background: white; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <h3 style="margin-bottom: 1rem; color: var(--primary-color);">Filter Guesthouses</h3>
                <div class="filters-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    <div class="filter-group">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Price Range</label>
                        <select id="priceFilter" style="width: 100%; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.25rem;">
                            <option value="">All Prices</option>
                            <option value="0-5000">Under ₨5,000</option>
                            <option value="5000-15000">₨5,000 - ₨15,000</option>
                            <option value="15000-999999">Above ₨15,000</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Neighborhood</label>
                        <select id="neighborhoodFilter" style="width: 100%; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.25rem;">
                            <option value="">All Areas</option>
                            <option value="Clifton">Clifton</option>
                            <option value="DHA">DHA</option>
                            <option value="Gulshan">Gulshan-e-Iqbal</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Amenities</label>
                        <div class="amenity-checkboxes" style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            <label style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.875rem;">
                                <input type="checkbox" value="AC" class="amenity-filter"> AC
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.875rem;">
                                <input type="checkbox" value="WiFi" class="amenity-filter"> WiFi
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.875rem;">
                                <input type="checkbox" value="Parking" class="amenity-filter"> Parking
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.875rem;">
                                <input type="checkbox" value="Breakfast" class="amenity-filter"> Breakfast
                            </label>
                        </div>
                    </div>
                    <div class="filter-group">
                        <button id="clearFilters" style="padding: 0.5rem 1rem; background: #64748b; color: white; border: none; border-radius: 0.25rem; cursor: pointer; margin-top: 1.5rem;">
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Insert filters after the hero section or at the beginning of container
        const heroSection = document.querySelector('.hero');
        if (heroSection && heroSection.nextElementSibling) {
            heroSection.nextElementSibling.insertAdjacentHTML('afterbegin', filtersHTML);
        } else {
            container.insertAdjacentHTML('afterbegin', filtersHTML);
        }

        // Add event listeners for filters
        document.getElementById('priceFilter')?.addEventListener('change', this.applyFilters.bind(this));
        document.getElementById('neighborhoodFilter')?.addEventListener('change', this.applyFilters.bind(this));
        document.querySelectorAll('.amenity-filter').forEach(checkbox => {
            checkbox.addEventListener('change', this.applyFilters.bind(this));
        });
        document.getElementById('clearFilters')?.addEventListener('click', this.clearFilters.bind(this));
    }

    // Apply filters
    applyFilters() {
        const priceFilter = document.getElementById('priceFilter')?.value;
        const neighborhoodFilter = document.getElementById('neighborhoodFilter')?.value;
        const amenityFilters = Array.from(document.querySelectorAll('.amenity-filter:checked')).map(cb => cb.value);

        this.filteredGuesthouses = this.guesthouses.filter(guesthouse => {
            // Price filter
            if (priceFilter) {
                const [min, max] = priceFilter.split('-').map(Number);
                if (guesthouse.price < min || guesthouse.price > max) return false;
            }

            // Neighborhood filter
            if (neighborhoodFilter && guesthouse.neighborhood !== neighborhoodFilter) return false;

            // Amenity filters
            if (amenityFilters.length > 0) {
                const hasAllAmenities = amenityFilters.every(amenity => 
                    guesthouse.amenities.includes(amenity)
                );
                if (!hasAllAmenities) return false;
            }

            return true;
        });

        this.updateGuesthouseDisplay();
    }

    // Clear filters
    clearFilters() {
        document.getElementById('priceFilter').value = '';
        document.getElementById('neighborhoodFilter').value = '';
        document.querySelectorAll('.amenity-filter').forEach(cb => cb.checked = false);
        document.querySelector('.search-box input').value = '';
        
        this.filteredGuesthouses = [...this.guesthouses];
        this.updateGuesthouseDisplay();
    }

    // Update guesthouse display
    updateGuesthouseDisplay() {
        const grid = document.querySelector('.guesthouse-grid');
        if (!grid) return;

        if (this.filteredGuesthouses.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <h3>No guesthouses found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.filteredGuesthouses.map(guesthouse => this.createGuesthouseCard(guesthouse)).join('');
        this.initializeCardInteractions();
    }

    // Create guesthouse card HTML
    createGuesthouseCard(guesthouse) {
        return `
            <div class="guesthouse-card" data-id="${guesthouse.id}">
                <div class="card-image">
                    <img src="${guesthouse.images[0]}" alt="${guesthouse.name}" loading="lazy">
                    <span class="neighborhood-badge">${guesthouse.neighborhood}</span>
                </div>
                <div class="card-content">
                    <h3>${guesthouse.name}</h3>
                    <p>${guesthouse.description}</p>
                    <div class="price">₨ ${guesthouse.price.toLocaleString()}/night</div>
                    <div class="amenities">
                        ${guesthouse.amenities.map(amenity => `<span class="amenity">${amenity}</span>`).join('')}
                    </div>
                    <div class="card-actions">
                        <button class="view-details" data-id="${guesthouse.id}">View Details</button>
                        <a href="https://wa.me/${guesthouse.phone.replace(/[^0-9]/g, '')}?text=Hi! I'm interested in ${encodeURIComponent(guesthouse.name)} in ${encodeURIComponent(guesthouse.neighborhood)}. Can you provide more details?"
                           class="whatsapp-btn">
                            📱 WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    // Initialize card interactions
    initializeCardInteractions() {
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.navigateToGuesthouseDetails(id);
            });
        });

        // Add hover animations to cards
        document.querySelectorAll('.guesthouse-card').forEach(card => {
            card.addEventListener('mouseenter', this.animateCardHover);
            card.addEventListener('mouseleave', this.animateCardLeave);
        });
    }

    // Navigate to guesthouse details page
    navigateToGuesthouseDetails(id) {
        const guesthouse = this.guesthouses.find(g => g.id === id);
        if (!guesthouse) return;

        // Save guesthouse data to localStorage for the detail page
        localStorage.setItem('selectedGuesthouse', JSON.stringify(guesthouse));

        // Navigate to the appropriate detail page or create a generic one
        if (id === 1) {
            window.location.href = 'oceanview.html';
        } else {
            // For other guesthouses, we'll create a generic detail page
            window.location.href = `guesthouse-detail.html?id=${id}`;
        }
    }



    // Open lightbox
    openLightbox(images, startIndex = 0) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-overlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.95); z-index: 2000; display: flex; align-items: center; justify-content: center;">
                <button class="lightbox-close" style="position: absolute; top: 2rem; right: 2rem; background: rgba(255,255,255,0.2); border: none; color: white; font-size: 2rem; cursor: pointer; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">×</button>
                <button class="lightbox-prev" style="position: absolute; left: 2rem; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.2); border: none; color: white; font-size: 2rem; cursor: pointer; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">‹</button>
                <button class="lightbox-next" style="position: absolute; right: 2rem; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.2); border: none; color: white; font-size: 2rem; cursor: pointer; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">›</button>
                <img class="lightbox-image" style="max-width: 90%; max-height: 90%; object-fit: contain;" src="${images[startIndex]}" alt="Gallery Image">
                <div class="lightbox-counter" style="position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); color: white; background: rgba(0,0,0,0.5); padding: 0.5rem 1rem; border-radius: 1rem;">${startIndex + 1} / ${images.length}</div>
            </div>
        `;

        document.body.appendChild(lightbox);

        let currentIndex = startIndex;
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const counter = lightbox.querySelector('.lightbox-counter');

        const updateImage = (index) => {
            lightboxImage.src = images[index];
            counter.textContent = `${index + 1} / ${images.length}`;
        };

        // Event listeners
        lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
            document.body.removeChild(lightbox);
        });

        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateImage(currentIndex);
        });

        lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateImage(currentIndex);
        });

        // Keyboard navigation
        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(lightbox);
                document.removeEventListener('keydown', handleKeyPress);
            } else if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                updateImage(currentIndex);
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % images.length;
                updateImage(currentIndex);
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        lightbox.querySelector('.lightbox-overlay').addEventListener('click', (e) => {
            if (e.target === lightbox.querySelector('.lightbox-overlay')) {
                document.body.removeChild(lightbox);
                document.removeEventListener('keydown', handleKeyPress);
            }
        });
    }

    // Initialize animations (fade-in animations removed for reliability)
    initializeAnimations() {
        // Fade-in animations have been removed to ensure immediate content visibility
        // Only hover animations and transitions are maintained
        console.log('Animation system initialized - content visible immediately');
    }



    // Animate card hover
    animateCardHover(event) {
        const card = event.currentTarget;
        card.style.transform = 'translateY(-8px) scale(1.02)';
        card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    }

    // Animate card leave
    animateCardLeave(event) {
        const card = event.currentTarget;
        card.style.transform = '';
        card.style.boxShadow = '';
    }

    // Initialize WhatsApp integration
    initializeWhatsAppIntegration() {
        // Update existing WhatsApp links with better messages
        document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
            const href = link.getAttribute('href');
            if (!href.includes('text=')) {
                const newHref = href + '?text=Hi! I found your guesthouse on Karachi Guesthouse Hub and I\'m interested in booking. Can you provide more details?';
                link.setAttribute('href', newHref);
            }
        });

        // Add WhatsApp sticky button functionality
        const stickyButton = document.querySelector('.whatsapp-sticky');
        if (stickyButton) {
            stickyButton.addEventListener('click', () => {
                // Track WhatsApp click
                this.trackEvent('whatsapp_click', { source: 'sticky_button' });
            });
        }
    }

    // Initialize image gallery
    initializeImageGallery() {
        // Add click handlers to existing images
        document.querySelectorAll('.card-image img, .guesthouse-image img').forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', (e) => {
                const card = e.target.closest('.guesthouse-card');
                if (card) {
                    const id = parseInt(card.dataset.id);
                    const guesthouse = this.guesthouses.find(g => g.id === id);
                    if (guesthouse) {
                        this.openLightbox(guesthouse.images, 0);
                    }
                }
            });
        });
    }

    // Load user preferences from localStorage
    loadUserPreferences() {
        try {
            const saved = localStorage.getItem('karachiGuesthousePreferences');
            if (saved) {
                this.userPreferences = JSON.parse(saved);
                this.searchHistory = this.userPreferences.searchHistory || [];
            }
        } catch (error) {
            console.warn('Failed to load user preferences:', error);
            this.userPreferences = {};
            this.searchHistory = [];
        }
    }

    // Save user preferences to localStorage
    saveUserPreferences() {
        try {
            this.userPreferences.searchHistory = this.searchHistory;
            this.userPreferences.lastVisit = new Date().toISOString();
            localStorage.setItem('karachiGuesthousePreferences', JSON.stringify(this.userPreferences));
        } catch (error) {
            console.warn('Failed to save user preferences:', error);
        }
    }

    // Show welcome message for first-time users
    showWelcomeMessage() {
        if (!this.userPreferences.hasVisited) {
            setTimeout(() => {
                this.showInfo('Welcome to Karachi Guesthouse Hub! Use the search and filters to find your perfect stay.');
                this.userPreferences.hasVisited = true;
                this.saveUserPreferences();
            }, 2000);
        }
    }

    // Setup error handling
    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.showError('Something went wrong. Please refresh the page and try again.');
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.showError('An unexpected error occurred. Please try again.');
        });
    }

    // Show error message
    showError(message) {
        this.showNotification(message, 'error');
    }

    // Show success message
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    // Show info message
    showInfo(message) {
        this.showNotification(message, 'info');
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 500;
            z-index: 1000;
            max-width: 400px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            ${type === 'error' ? 'background-color: #ef4444;' : ''}
            ${type === 'success' ? 'background-color: #10b981;' : ''}
            ${type === 'info' ? 'background-color: #3b82f6;' : ''}
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; margin-left: 1rem;">×</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    // Show search results
    showSearchResults(query) {
        if (query && this.filteredGuesthouses.length > 0) {
            this.showInfo(`Found ${this.filteredGuesthouses.length} guesthouse${this.filteredGuesthouses.length === 1 ? '' : 's'} for "${query}"`);
        } else if (query && this.filteredGuesthouses.length === 0) {
            this.showError(`No guesthouses found for "${query}". Try a different search term.`);
        }
    }

    // Track events (for analytics)
    trackEvent(eventName, properties = {}) {
        // This would integrate with analytics service
        console.log('Event tracked:', eventName, properties);
    }

    // Utility function for debouncing
    debounce(func, wait) {
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
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.guesthouseApp = new KarachiGuesthouseApp();
});
