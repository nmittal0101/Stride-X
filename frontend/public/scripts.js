const searchIcon = document.getElementById('searchIcon');
const searchInput = document.getElementById('searchInput');

searchIcon.addEventListener('click', () => {
    searchInput.classList.toggle('active');
    if (searchInput.classList.contains('active')) {
        searchInput.focus();
    } else {
        searchInput.value = '';
    }
});

const footerToggles = document.querySelectorAll('.footer-toggle');

footerToggles.forEach(button => {
    button.addEventListener('click', () => {
        const content = button.nextElementSibling;
        const section = button.parentElement;

        content.classList.toggle('active');
        section.classList.toggle('active');
    });
});

const slidingBoxes = document.getElementById('slidingBoxes');
let scrollPosition = 0;
const scrollAmount = 220;

setInterval(() => {
    scrollPosition += scrollAmount;
    if (scrollPosition > slidingBoxes.scrollWidth - slidingBoxes.clientWidth) {
        scrollPosition = 0;
    }
    slidingBoxes.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
    });
}, 3000);

function addToCart(id, name, price, image) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!cart.find(item => item.id === id)) {
        cart.push({ id, name, price, image });
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${name} added to cart!`);
    } else {
        alert('Already in cart!');
    }
}

document.getElementById('authForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const mobile = document.getElementById('mobile').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
        alert('Please enter a valid 10-digit mobile number.');
        return;
    }

    const userData = {
        name,
        age,
        gender,
        mobile,
        email,
        password
    };

    console.log('User data securely collected:', userData);
    alert('Account created successfully!');
    this.reset();
});

function toggleForm() {
    alert('Redirecting to Sign In page...');
}

function addToWishlist(id, name, price, image) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (!wishlist.find(item => item.id === id)) {
        wishlist.push({ id, name, price, image });
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert(`${name} added to wishlist!`);
    } else {
        alert('Already in wishlist!');
    }
}

function addToCart(id, name, price, image) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!cart.find(item => item.id === id)) {
        cart.push({ id, name, price, image });
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${name} added to cart!`);
    } else {
        alert('Already in cart!');
    }
}

function addToWishlist(id, name, price, image) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  if (!wishlist.find(item => item.id === id)) {
    wishlist.push({ id, name, price, image });
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    alert(`${name} added to wishlist!`);
  } else {
    alert('Already in wishlist!');
  }
}

function addToCart(id, name, price, image) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (!cart.find(item => item.id === id)) {
    cart.push({ id, name, price, image });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${name} added to cart!`);
  } else {
    alert('Already in cart!');
  }
}

