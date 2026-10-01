// ==================== MOBILE NAVIGATION ====================
const menuToggle = document.getElementById("menuToggle");
const menuClose = document.getElementById("menuClose");
const navMenu = document.getElementById("navMenu");

function openMenu() {
    navMenu.classList.add("open");
    document.body.classList.add("menu-open");
    menuToggle.setAttribute("aria-expanded", "true");
}

function closeMenu() {
    navMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", openMenu);
menuClose.addEventListener("click", closeMenu);

document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", closeMenu);
});

// Close mobile menu with Escape
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

// ==================== SCROLL REVEAL ====================
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

revealElements.forEach((element) => revealObserver.observe(element));

// ==================== BACK TO TOP ====================
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
        backToTop.classList.add("visible");
    } else {
        backToTop.classList.remove("visible");
    }
});

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// ==================== CURRENT YEAR ====================
document.getElementById("year").textContent = new Date().getFullYear();

// ==================== FIREBASE CONTACT FORM ====================
// Keep the existing Firebase backend so the current contact form can continue
// storing messages in the existing Realtime Database.
//
// IMPORTANT: Firebase Realtime Database security rules must be configured
// appropriately in Firebase Console before using this form publicly.

const firebaseConfig = {
    apiKey: "AIzaSyAyKEdm7AKjjv07KyT9C-3gNScul9I0RDE",
    authDomain: "profilepage-d16fd.firebaseapp.com",
    databaseURL: "https://profilepage-d16fd-default-rtdb.firebaseio.com",
    projectId: "profilepage-d16fd",
    storageBucket: "profilepage-d16fd.appspot.com",
    messagingSenderId: "678220469003",
    appId: "1:678220469003:web:0383fe1de606573772880e"
};

let profilepageDB = null;

try {
    if (typeof firebase !== "undefined") {
        firebase.initializeApp(firebaseConfig);
        profilepageDB = firebase.database().ref("profilepage");
    }
} catch (error) {
    console.error("Firebase initialization failed:", error);
}

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
        formStatus.textContent = "Please fill in all fields.";
        return;
    }

    const submitButton = contactForm.querySelector("button[type='submit']");
    submitButton.disabled = true;
    submitButton.style.opacity = "0.65";
    formStatus.textContent = "Sending...";

    try {
        if (!profilepageDB) {
            throw new Error("Contact service unavailable.");
        }

        await profilepageDB.push({
            name,
            email,
            message,
            createdAt: new Date().toISOString()
        });

        formStatus.textContent = "Message sent successfully. Thank you!";
        contactForm.reset();
    } catch (error) {
        console.error(error);
        formStatus.textContent =
            "Unable to send right now. Please email me directly.";
    } finally {
        submitButton.disabled = false;
        submitButton.style.opacity = "1";
    }
});
