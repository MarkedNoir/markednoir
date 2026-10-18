// =========================================================
// 1. NAVBAR SCROLL, MOBILE MENU & SCROLL INDICATOR
// =========================================================
const navbar = document.getElementById("navbar");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");
const heroFooter = document.querySelector(".hero-footer"); // Grabs the scroll arrow container

window.addEventListener("scroll", () => {
  // Navbar background change
  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  // Fade out scroll indicator arrow
  if (heroFooter) {
    if (window.scrollY > 100) {
      heroFooter.style.opacity = "0";
      heroFooter.style.pointerEvents = "none"; // Prevents clicking when invisible
    } else {
      heroFooter.style.opacity = "1";
      heroFooter.style.pointerEvents = "auto";
    }
  }
});

mobileMenuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// Close mobile menu when a link is clicked
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

// =========================================================
// 3. GALLERY CATEGORY FILTERING
// =========================================================
const filterButtons = document.querySelectorAll(".filter-btn[data-filter]");
const galleryCards = document.querySelectorAll(".gallery-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.getAttribute("data-filter");

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    galleryCards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category");
      if (selectedCategory === "all" || cardCategory === selectedCategory) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  });
});

// =========================================================
// 4. FULL-SCREEN LIGHTBOX & SLIDESHOW VIEWER
// =========================================================
const lightbox = document.getElementById("lightbox");
const lightboxImageContainer = document.getElementById("lightboxImageContainer");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxClose = document.getElementById("lightboxClose");

const playAllBtn = document.getElementById("playAllBtn");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const lightboxPlayToggle = document.getElementById("lightboxPlayToggle");

let visibleCards = [];
let currentIndex = 0;
let isPlaying = false;
let slideInterval = null;
let isAnimating = false; // Prevents fast-clicking from breaking the stack
const SLIDE_TIME = 4500; // 4.5 seconds per photo

function updateVisibleCards() {
  visibleCards = Array.from(galleryCards).filter((card) => !card.classList.contains("hidden"));
}

// Display a photo, sliding it over while the current one fades
function showPhoto(index, direction = "next") {
  if (visibleCards.length === 0 || isAnimating) return;

  const isOpening = !lightbox.classList.contains("open");
  currentIndex = (index + visibleCards.length) % visibleCards.length;
  const card = visibleCards[currentIndex];

  // 1. Create the new image layer
  const newImg = document.createElement("img");
  newImg.className = "lightbox-layer";

  if (isOpening) {
    newImg.classList.add("card-center");
  } else {
    newImg.classList.add(direction === "next" ? "card-off-right" : "card-off-left");
  }

  newImg.src = card.getAttribute("data-src");
  lightboxTitle.textContent = card.getAttribute("data-title");

  // 2. Wait for the new image to decode
  newImg.onload = () => {
    // Identify the currently visible photo(s) before dropping the new one in
    const oldImages = Array.from(lightboxImageContainer.children);

    // Drop the new photo on top
    lightboxImageContainer.appendChild(newImg);

    if (isOpening) return;

    isAnimating = true;

    // Force browser to register starting positions
    void newImg.offsetWidth;

    // 3. Trigger the slow slide for the NEW photo
    newImg.className = "lightbox-layer card-center";

    // 4. Trigger the slow fade-out for the OLD photo underneath
    oldImages.forEach((img) => {
      img.classList.add("card-exit-fade");
    });

    // 5. Delete the old photo after the long 900ms transition finishes
    setTimeout(() => {
      oldImages.forEach((img) => img.remove());
      isAnimating = false;
    }, 900);
  };

  // Preload next photo silently
  const nextIndex = (currentIndex + 1) % visibleCards.length;
  const preloadImg = new Image();
  preloadImg.src = visibleCards[nextIndex].getAttribute("data-src");
}

function startSlideshow() {
  isPlaying = true;
  lightboxPlayToggle.innerHTML = "&#10074;&#10074;"; // Pause icon
  clearInterval(slideInterval);
  slideInterval = setInterval(() => {
    showPhoto(currentIndex + 1, "next");
  }, SLIDE_TIME);
}

function stopSlideshow() {
  isPlaying = false;
  lightboxPlayToggle.innerHTML = "&#9654;"; // Play icon
  clearInterval(slideInterval);
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = ""; // Unlocks normal website scrolling
  stopSlideshow();
  setTimeout(() => {
    lightboxImageContainer.innerHTML = "";
    isAnimating = false;
  }, 300);
}

// --- Event Listeners ---
galleryCards.forEach((card) => {
  card.addEventListener("click", () => {
    updateVisibleCards();
    const clickedIndex = visibleCards.indexOf(card);
    showPhoto(clickedIndex, "next");
    stopSlideshow();
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden"; // Freezes the website behind the gallery
  });
});

playAllBtn.addEventListener("click", () => {
  updateVisibleCards();
  if (visibleCards.length === 0) return;
  showPhoto(0, "next");
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden"; // Freezes the website behind the gallery
  startSlideshow();
});

lightboxPrev.addEventListener("click", (event) => {
  event.stopPropagation();
  stopSlideshow();
  showPhoto(currentIndex - 1, "prev");
});

lightboxNext.addEventListener("click", (event) => {
  event.stopPropagation();
  stopSlideshow();
  showPhoto(currentIndex + 1, "next");
});

lightboxPlayToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  if (isPlaying) stopSlideshow();
  else startSlideshow();
});

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  else if (event.key === "ArrowRight") {
    stopSlideshow();
    showPhoto(currentIndex + 1, "next");
  } else if (event.key === "ArrowLeft") {
    stopSlideshow();
    showPhoto(currentIndex - 1, "prev");
  } else if (event.key === " ") {
    event.preventDefault();
    if (isPlaying) stopSlideshow();
    else startSlideshow();
  }
});

// --- Touch Swipe Navigation ---
let touchStartX = 0;
let touchEndX = 0;
let isPinching = false;
const SWIPE_THRESHOLD = 50; // Minimum drag distance in pixels to trigger a change

lightbox.addEventListener(
  "touchstart",
  (event) => {
    if (event.touches.length > 1) {
      isPinching = true; // Two fingers detected: user is zooming, not swiping
    } else {
      isPinching = false;
      touchStartX = event.changedTouches[0].clientX;
    }
  },
  { passive: true },
);

lightbox.addEventListener(
  "touchend",
  (event) => {
    if (isPinching) return; // Don't change photos when finishing a pinch-zoom
    touchEndX = event.changedTouches[0].clientX;
    handleSwipeGesture();
  },
  { passive: true },
);

function handleSwipeGesture() {
  const diffX = touchEndX - touchStartX;

  // Ignore accidental tiny taps
  if (Math.abs(diffX) < SWIPE_THRESHOLD) return;

  stopSlideshow();

  if (diffX < 0) {
    // Swiped left -> Move to Next photo
    showPhoto(currentIndex + 1, "next");
  } else {
    // Swiped right -> Move to Previous photo
    showPhoto(currentIndex - 1, "prev");
  }
}

// =========================================================
// 5. EMAIL COPY & CONTACT FORM (markednoir@gmail.com)
// =========================================================
const STUDIO_EMAIL = "markednoir@gmail.com";
const copyEmailBtn = document.getElementById("copyEmailBtn");
const contactForm = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");

copyEmailBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(STUDIO_EMAIL).then(() => {
    copyEmailBtn.textContent = "Copied!";
    setTimeout(() => {
      copyEmailBtn.textContent = "Copy Email Address";
    }, 2000);
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("senderName").value.trim();
  const email = document.getElementById("senderEmail").value.trim();
  const subjectType = document.getElementById("inquiryType").value;
  const message = document.getElementById("senderMessage").value.trim();

  const subject = encodeURIComponent(`${subjectType} — from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nReply Email: ${email}\nInquiry: ${subjectType}\n\nMessage:\n${message}`);

  // Opens user's email program addressed to markednoir@gmail.com
  window.location.href = `mailto:${STUDIO_EMAIL}?subject=${subject}&body=${body}`;
  formFeedback.textContent = "Opening your email app addressed to markednoir@gmail.com...";
});

// =========================================================
// 6. CLOSE MOBILE MENU ON OUTSIDE CLICK
// =========================================================
document.addEventListener("click", (event) => {
  // First, check if the menu is actually open
  if (navLinks.classList.contains("open")) {
    // Check if the click happened OUTSIDE the menu AND outside the hamburger button
    if (!navLinks.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
      navLinks.classList.remove("open");
    }
  }
});

// =========================================================
// 7. DELETE WHEN PORTRAITS ARE AVAILABLE HERE AND CSS AND HTML
// =========================================================
const portraitsBtn = document.getElementById("portraitsBtn");
const toast = document.getElementById("toastNotification");
let toastTimeout;

portraitsBtn.addEventListener("click", () => {
  // Clear any active dismiss timer
  clearTimeout(toastTimeout);

  // Show the toast
  toast.classList.add("is-visible");

  // Auto-hide after 3 seconds
  toastTimeout = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 3000);
});
