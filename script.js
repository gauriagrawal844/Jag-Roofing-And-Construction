(function () {
  const toggle = document.getElementById('nav-toggle');
  const label = document.querySelector('label.hamburger');
  const overlay = document.querySelector('.nav-overlay');
  const menu = document.querySelector('.nav-menu');
  const closeBtn = document.querySelector('.menu-close');
  const links = menu ? menu.querySelectorAll('a') : [];
  const body = document.body;

  // Hamburger toggle


  function setExpanded() {
    const isOpen = !!(toggle && toggle.checked);
    if (label) label.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (body) {
      if (isOpen) { body.classList.add('no-scroll'); }
      else { body.classList.remove('no-scroll'); }
    }
  }
  function closeMenu() {
    if (toggle) { toggle.checked = false; setExpanded(); }
  }
  if (toggle) {
    toggle.addEventListener('change', setExpanded);
    setExpanded();
  }
  if (overlay) { overlay.addEventListener('click', closeMenu); }
  if (closeBtn) { closeBtn.addEventListener('click', closeMenu); }
  links.forEach(a => a.addEventListener('click', closeMenu));
})();



// Our Services Accordion


// Helper function to create the right-arrow icon (Lucide "ArrowRight")

const ICON_PATH = "Images/Our-Service/arrow.svg";
const ICON_PATH_INACTIVE = "Images/Our-Service/arrow-inactive.svg";
const getRightArrowIcon = () => `
            <img src="${ICON_PATH_INACTIVE}" alt="Arrow Icon" class="arrow-icon">
        `;

// Helper function to create the diagonal-up-arrow icon (Active)
// Note: The rotation is now handled by the CSS rule in the <style> block.
const getActiveArrowIcon = () => `
            <img src="${ICON_PATH}" alt="Arrow Icon" class="arrow-icon">
        `;

// Function to update the icon based on the active state
function updateIcon(item, isActive) {
  const iconWrap = item.querySelector('.service-icon-wrap');
  if (iconWrap) {
    // Replace the icon HTML
    iconWrap.innerHTML = isActive ? getActiveArrowIcon() : getRightArrowIcon();
  }
}

// Event handler for clicking a service item
function handleItemClick(event) {
  const clickedItem = event.currentTarget;
  const isActive = clickedItem.classList.contains('active');
  const accordionItems = document.querySelectorAll('.service-item');

  // 1. Deactivate all items and set their icon to the inactive state (right arrow)
  accordionItems.forEach(item => {
    item.classList.remove('active');
    updateIcon(item, false);
  });

  // 2. If the clicked item was NOT already active, activate it and set its icon to the active state (up-right arrow)
  if (!isActive) {
    clickedItem.classList.add('active');
    updateIcon(clickedItem, true);
  }
}

// Initial setup: Attach event listeners to the static HTML elements
window.onload = () => {
  const accordionItems = document.querySelectorAll('.service-item');

  accordionItems.forEach(item => {
    // Attach click listener
    item.addEventListener('click', handleItemClick);

    // Ensure initial icon state matches the initial active class defined in HTML
    updateIcon(item, item.classList.contains('active'));
  });
};


// Instagram Feed
// ...existing code...

// Instagram Feed
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  let slides = Array.from(track.children);
  const slidesToShow = 6;
  let index = slidesToShow; // start after prepended clones

  // Clone slides (for infinite loop effect)
  const firstClones = slides.slice(0, slidesToShow).map(slide => slide.cloneNode(true));
  const lastClones = slides.slice(-slidesToShow).map(slide => slide.cloneNode(true));

  // Add clones to DOM
  firstClones.forEach(clone => track.appendChild(clone));
  lastClones.forEach(clone => track.insertBefore(clone, track.firstChild));

  // Update slides list after cloning
  slides = Array.from(track.children);

  // Initial positioning
  function getSlideWidth() {
    return slides[0].getBoundingClientRect().width + 20; // width + gap
  }
  function setPosition() {
    track.style.transition = "none";
    track.style.transform = `translateX(-${index * getSlideWidth()}px)`;
  }
  setPosition();

  function moveCarousel() {
    index++;
    track.style.transition = "transform 0.5s ease-in-out";
    track.style.transform = `translateX(-${index * getSlideWidth()}px)`;
  }

  track.addEventListener("transitionend", () => {
    if (index >= slides.length - slidesToShow) {
      index = slidesToShow;
      setPosition();
    }
    if (index < slidesToShow) {
      index = slides.length - slidesToShow * 2;
      setPosition();
    }
  });

  // Auto-play
  setInterval(() => {
    moveCarousel();
  }, 2500);

  // Optional: Responsive support
  window.addEventListener("resize", setPosition);
});


// project section

 const latestItems = document.querySelectorAll(".latest-item");

  latestItems.forEach(item => {
    item.addEventListener("click", () => {
      if (item.classList.contains("active")) {
        item.classList.remove("active");
      } else {
        latestItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");
      }
    });
  });


// Feedback Section – Testimonials (infinite carousel)


document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".testimonial-track");
  if (!track) return;

  const originals = Array.from(track.children);
  const count = originals.length;
  const dotsContainer = document.querySelector(".carousel-dots");
  if (!count || !dotsContainer) return;

  // Build dots
  dotsContainer.innerHTML = "";
  originals.forEach((_, i) => {
    const dot = document.createElement("button");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      index = i + 1; // offset because of clone
      goTo(index, true);
    });
    dotsContainer.appendChild(dot);
  });
  const dots = Array.from(dotsContainer.querySelectorAll("button"));

  // Clone first and last slides
  const firstClone = originals[0].cloneNode(true);
  const lastClone = originals[count - 1].cloneNode(true);
  track.insertBefore(lastClone, track.firstChild);
  track.appendChild(firstClone);

  let index = 1;
  let autoplayId = null;
  const duration = 4000;

  function setTransform(withTransition = true) {
    track.style.transition = withTransition ? "transform 0.5s ease-out" : "none";
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  function syncDots() {
    const logical = (index - 1 + count) % count;
    dots.forEach(d => d.classList.remove("active"));
    if (dots[logical]) dots[logical].classList.add("active");
  }

  function goTo(targetIndex, withTransition = true) {
    index = targetIndex;
    setTransform(withTransition);
    syncDots();
  }

  // Initial snap (no animation)
  requestAnimationFrame(() => setTransform(false));

  // Clone wrapping logic
  track.addEventListener("transitionend", () => {
    if (index === 0) {
      index = count;
      setTransform(false);
      syncDots();
    } else if (index === count + 1) {
      index = 1;
      setTransform(false);
      syncDots();
    }
  });

  // --- AUTOPLAY WITH RAF ---
  let lastTime = performance.now();
  function autoplayLoop(time) {
    if (time - lastTime >= duration) {
      goTo(index + 1, true);
      lastTime = time;
    }
    autoplayId = requestAnimationFrame(autoplayLoop);
  }
  autoplayLoop(lastTime);

  function stopAutoplay() {
    if (autoplayId) cancelAnimationFrame(autoplayId);
    autoplayId = null;
  }
  function startAutoplay() {
    if (!autoplayId) {
      lastTime = performance.now();
      autoplayLoop(lastTime);
    }
  }

  // --- DRAG / SWIPE ---
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  function onDragStart(e) {
    stopAutoplay();
    isDragging = true;
    startX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    track.style.transition = "none";
  }

  function onDragMove(e) {
    if (!isDragging) return;
    currentX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    const delta = currentX - startX;
    track.style.transform = `translateX(calc(${-index * 100}% + ${delta}px))`;
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    const delta = currentX - startX;
    const threshold = track.clientWidth * 0.2;

    if (delta > threshold) {
      goTo(index - 1, true);
    } else if (delta < -threshold) {
      goTo(index + 1, true);
    } else {
      goTo(index, true);
    }
    startAutoplay();
  }

  // Mouse
  track.addEventListener("mousedown", onDragStart);
  track.addEventListener("mousemove", onDragMove);
  document.addEventListener("mouseup", onDragEnd);

  // Touch
  track.addEventListener("touchstart", onDragStart, { passive: true });
  track.addEventListener("touchmove", onDragMove, { passive: true });
  track.addEventListener("touchend", onDragEnd, { passive: true });
});


// FAQ accordion (allow only one open at a time, scoped to .faq-section)
document.addEventListener('DOMContentLoaded', () => {
  const faq = document.querySelector('.faq-section');
  if (!faq) return;

  const items = Array.from(faq.querySelectorAll('.accordion-item'));
  const headers = Array.from(faq.querySelectorAll('.accordion-header'));

  // Helper to close an item
  const closeItem = (item) => {
    if (!item.classList.contains('active')) return;
    item.classList.remove('active');
    const symbol = item.querySelector('.accordion-header span');
    if (symbol) symbol.textContent = '+';
  };

  // Helper to open an item and close others
  const openItem = (item) => {
    // Close others first
    items.forEach(i => { if (i !== item) closeItem(i); });
    // Open current
    item.classList.add('active');
    const symbol = item.querySelector('.accordion-header span');
    if (symbol) symbol.textContent = '−';
  };

  // Initial: ensure only the first active remains open (or all closed)
  const firstActive = items.find(i => i.classList.contains('active'));
  if (firstActive) {
    items.forEach(i => { if (i !== firstActive) closeItem(i); });
    openItem(firstActive);
  } else {
    items.forEach(closeItem);
  }

  // Click handlers
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      if (!item) return;
      if (item.classList.contains('active')) {
        // Close if already open
        closeItem(item);
      } else {
        // Open this and close others
        openItem(item);
      }
    });
  });
});


// Blog card

const cards = document.querySelectorAll('.blog-card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });