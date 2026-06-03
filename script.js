const imgSlider = document.querySelector('.img-slider');
const imgItems = document.querySelectorAll('.img-item');
const infoItems = document.querySelectorAll('.info-item');
const navItems = document.querySelectorAll('.nav-item');

let index = 0;

const slider = () => {
    // Update Active Image
    document.querySelector('.img-item.active').classList.remove('active');
    imgItems[index].classList.add('active');

    // Update Active Content
    document.querySelector('.info-item.active').classList.remove('active');
    infoItems[index].classList.add('active');

    // Update Active Nav Item
    document.querySelector('.nav-item.active').classList.remove('active');
    navItems[index].classList.add('active');
}

// Bottom Nav Click Handlers
navItems.forEach((item, i) => {
    item.addEventListener('click', () => {
        index = i;
        slider();
    });
});

// Auto-play the slideshow every 8.5 seconds
setInterval(() => {
    index++;
    if(index > imgItems.length - 1)
    {
        index = 0;
    }
    slider();
}, 8500);

// Navbar mobile menu toggle
const navMenuBtn = document.querySelector('.nav-menu-btn');
const navLinks = document.querySelector('.nav-links');

navMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navMenuBtn.querySelector('i').classList.toggle('bx-x');
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navMenuBtn.querySelector('i').classList.remove('bx-x');
    });
});