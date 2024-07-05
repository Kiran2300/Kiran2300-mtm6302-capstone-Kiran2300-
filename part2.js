// Function to show an alert when the "Learn More" button is clicked
function showAlert() {
    alert('More information coming soon!');
}

// Function to validate the contact form
function validateForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    if (name === '' || email === '' || message === '') {
        alert('Please fill in all fields.');
        return false;
    }
    
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    alert('Form submitted successfully!');
    return true;
}

// Helper function to validate email format
function validateEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
}

// Function for smooth scrolling to section
function smoothScroll(target, duration) {
    const targetSection = document.querySelector(target);
    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - document.querySelector('header').offsetHeight;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Function to handle smooth scrolling when navigation links are clicked
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        smoothScroll(target, 1000);
    });
});

// Function to toggle the mobile navigation menu
function toggleMenu() {
    const nav = document.querySelector('nav ul');
    nav.classList.toggle('show');
}

// Event listener for form submission
document.querySelector('form').addEventListener('submit', validateForm);

// Event listener for menu toggle
document.querySelector('.menu-toggle').addEventListener('click', toggleMenu);
