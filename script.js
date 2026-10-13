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
const filterButtons = document.querySelectorAll(".filter-btn");
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
// 4. FULL-SCREEN LIGHTBOX VIEWER
// =========================================================
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxMeta = document.getElementById("lightboxMeta");
const lightboxClose = document.getElementById("lightboxClose");

galleryCards.forEach((card) => {
  card.addEventListener("click", () => {
    lightboxImg.src = card.getAttribute("data-src");
    lightboxTitle.textContent = card.getAttribute("data-title");
    lightboxMeta.textContent = card.getAttribute("data-meta");
    lightbox.classList.add("open");
  });
});

lightboxClose.addEventListener("click", () => {
  lightbox.classList.remove("open");
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.classList.remove("open");
  }
});

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
// 5. DELETE WHEN PORTRAITS ARE AVAILABLE HERE AND CSS AND HTML
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
