document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     MOBILE NAVIGATION TOGGLE
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-btn');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when a navigation item is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  /* ==========================================================================
     SHRINKING HEADER FALLBACK (IntersectionObserver/Scroll Listener)
     ========================================================================== */
  const header = document.getElementById('main-header');
  
  if (header) {
    // Fallback: If browser doesn't support native CSS scroll animations
    if (!CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)')) {
      const handleScroll = () => {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
          header.style.setProperty('--header-padding', '0.6rem');
          header.style.setProperty('--header-bg', 'rgba(250, 249, 246, 0.98)');
          header.style.setProperty('--header-shadow', '0 4px 20px rgba(58, 83, 64, 0.08)');
        } else {
          header.style.setProperty('--header-padding', '1.25rem');
          header.style.setProperty('--header-bg', 'rgba(250, 249, 246, 0.95)');
          header.style.setProperty('--header-shadow', 'none');
        }
      };

      // Add throttled event listener
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      });
      // Initial trigger in case page starts scrolled down
      handleScroll();
    }
  }

  /* ==========================================================================
     SCROLL REVEAL INTERSECTION OBSERVER
     ========================================================================== */
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Once animated, stop observing this element
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is fully in view
    });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }

  /* ==========================================================================
     GALLERY FILTER LOGIC
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active states on buttons
        filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filterValue = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          
          if (itemCategory === filterValue) {
            item.classList.remove('hidden');
            // Re-apply scale-fade entry effect transition smoothly
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 10);
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ==========================================================================
     DYNAMICAL INQUIRY CALCULATOR (QUOTE BUILDER)
     ========================================================================== */
  const calcForm = document.getElementById('calculator-form');
  const calcOccasion = document.getElementById('calc-occasion');
  const srvStage = document.getElementById('srv-stage');
  const srvBalloon = document.getElementById('srv-balloon');
  const srvHampers = document.getElementById('srv-hampers');
  const srvFavors = document.getElementById('srv-favors');
  const calcScale = document.getElementById('calc-scale');
  const calcTier = document.getElementById('calc-tier');
  const calcPriceOutput = document.getElementById('calc-price-output');
  const btnSubmitInquiry = document.getElementById('btn-submit-inquiry');

  function calculateQuote() {
    if (!calcPriceOutput) return;

    let selectedAnyService = false;
    let servicesCount = 0;

    if (srvStage && srvStage.checked) { selectedAnyService = true; servicesCount++; }
    if (srvBalloon && srvBalloon.checked) { selectedAnyService = true; servicesCount++; }
    if (srvHampers && srvHampers.checked) { selectedAnyService = true; servicesCount++; }
    if (srvFavors && srvFavors.checked) { selectedAnyService = true; servicesCount++; }

    if (!selectedAnyService) {
      calcPriceOutput.textContent = 'Select a service';
      calcPriceOutput.style.fontSize = '1.5rem';
      return;
    } else {
      calcPriceOutput.style.fontSize = '';
    }

    // Dynamic formatting showing count of selected services
    calcPriceOutput.textContent = `${servicesCount} Service${servicesCount > 1 ? 's' : ''} Selected`;
  }

  // Bind input listeners
  const formInputs = [calcOccasion, srvStage, srvBalloon, srvHampers, srvFavors, calcScale, calcTier];
  formInputs.forEach(input => {
    if (input) {
      input.addEventListener('change', calculateQuote);
    }
  });

  // Calculate quote initial setup
  calculateQuote();

  /* ==========================================================================
     WHATSAPP INQUIRY GENERATOR
     ========================================================================== */
  if (btnSubmitInquiry) {
    btnSubmitInquiry.addEventListener('click', () => {
      const occasionName = calcOccasion ? calcOccasion.options[calcOccasion.selectedIndex].text : 'Event';
      const scaleName = calcScale ? calcScale.options[calcScale.selectedIndex].text : 'Standard';
      const tierName = calcTier ? calcTier.options[calcTier.selectedIndex].text : 'Premium';

      // Gather checked services
      const services = [];
      if (srvStage && srvStage.checked) services.push('Stage Decoration');
      if (srvBalloon && srvBalloon.checked) services.push('Balloon Garlands & Florals');
      if (srvHampers && srvHampers.checked) services.push('Custom Gift Hampers');
      if (srvFavors && srvFavors.checked) services.push('Return Gifts & Party Favors');

      if (services.length === 0) {
        alert('Please select at least one service to generate your quote inquiry.');
        return;
      }

      // Build text message (excluding any price range)
      const introText = `Hi LeeU Bliss Gifts & Events,\n\nI'd like to inquire about booking services for an upcoming *${occasionName}*.\n\n`;
      const srvListText = `*Services Selected*:\n${services.map(s => `- ${s}`).join('\n')}\n\n`;
      const scaleTierText = `*Event Scale*: ${scaleName}\n*Material Tier*: ${tierName}\n\n`;
      const outroText = `Please let me know your availability and next steps to plan this celebration. Thank you!`;

      const fullMessage = introText + srvListText + scaleTierText + outroText;

      // WhatsApp API parameters
      const whatsappNumber = '64221077434'; // Dedicated WhatsApp line
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(fullMessage)}`;

      // Redirect user to WhatsApp chat
      window.open(whatsappUrl, '_blank');
    });
  }

  /* ==========================================================================
     DIGITAL BUSINESS CARD TAP SUPPORT (MOBILE FOCUS/TOUCH OVERRIDE)
     ========================================================================== */
  const businessCard = document.getElementById('business-card');
  if (businessCard) {
    businessCard.addEventListener('click', () => {
      businessCard.classList.toggle('flipped');
    });

    // Support keyboard focus navigation space/enter key trigger
    businessCard.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        businessCard.classList.toggle('flipped');
      }
    });
  }
});
