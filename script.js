// Shared script for all pages
document.querySelectorAll('.menu-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('open');
  });
});

// Firebase Auth with multiple providers
let currentUser = null;

function updateAuthUI() {
  const loginBtn = document.getElementById('login-btn');
  const userInfo = document.getElementById('user-info');
  const reviewForm = document.getElementById('review-form');
  if (!loginBtn) return;

  if (currentUser) {
    loginBtn.textContent = 'Sign Out';
    loginBtn.onclick = signOut;
    if (userInfo) {
      userInfo.classList.remove('hidden');
      userInfo.textContent = currentUser.displayName || currentUser.email || currentUser.phoneNumber || 'User';
    }
    if (reviewForm) reviewForm.classList.remove('hidden');
  } else {
    loginBtn.textContent = 'Login';
    loginBtn.onclick = showLoginOptions;
    if (userInfo) userInfo.classList.add('hidden');
    if (reviewForm) reviewForm.classList.add('hidden');
  }
}

function signOut() {
  if (typeof firebase !== 'undefined' && firebase.apps.length) {
    firebase.auth().signOut().then(() => {
      currentUser = null;
      updateAuthUI();
    });
  } else {
    currentUser = null;
    updateAuthUI();
  }
}

function showLoginOptions() {
  const choice = prompt("Login with:\n1. Google\n2. Apple\n3. Phone\n\nEnter 1, 2 or 3:");
  if (!choice) return;

  if (typeof firebase === 'undefined' || !firebase.apps.length) {
    const name = prompt('Demo login — enter your name:') || 'Guest';
    currentUser = { displayName: name };
    updateAuthUI();
    return;
  }

  if (choice === '1') {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).catch(err => alert(err.message));
  } else if (choice === '2') {
    const provider = new firebase.auth.OAuthProvider('apple.com');
    firebase.auth().signInWithPopup(provider).catch(err => alert(err.message));
  } else if (choice === '3') {
    const phone = prompt('Enter phone number with country code (e.g. +355...):');
    if (!phone) return;
    const appVerifier = new firebase.auth.RecaptchaVerifier('login-btn', { size: 'invisible' });
    firebase.auth().signInWithPhoneNumber(phone, appVerifier)
      .then(confirmationResult => {
        const code = prompt('Enter the SMS code:');
        return confirmationResult.confirm(code);
      })
      .catch(err => alert(err.message));
  }
}

if (typeof firebase !== 'undefined' && firebase.apps.length) {
  firebase.auth().onAuthStateChanged(user => {
    currentUser = user;
    updateAuthUI();
  });
}

const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
  // Click handler is set dynamically in updateAuthUI
}

// Booking flow
document.querySelectorAll('.book-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = document.getElementById('booking-modal');
    if (!modal) return;
    const exp = btn.dataset.exp;
    const price = btn.dataset.price;
    document.getElementById('modal-title').textContent = 'Book: ' + exp;
    document.getElementById('book-summary').textContent = `Experience: ${exp} — €${price} per person`;
    modal.classList.remove('hidden');
  });
});

document.querySelectorAll('.close').forEach(c => c.addEventListener('click', () => {
  document.getElementById('booking-modal')?.classList.add('hidden');
}));

const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
  bookingForm.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('booking-form').classList.add('hidden');
    document.getElementById('booking-success').classList.remove('hidden');
  });
}

// Full Trip Planner
const plannerForm = document.getElementById('planner-form');
if (plannerForm) {
  plannerForm.addEventListener('submit', e => {
    e.preventDefault();
    const days = parseInt(document.getElementById('days').value);
    const style = document.getElementById('style').value;
    const interests = Array.from(document.querySelectorAll('#planner-form input:checked')).map(i => i.value);

    let itinerary = generateItinerary(days, style, interests);

    const result = document.getElementById('itinerary-result');
    result.innerHTML = itinerary;
    result.classList.remove('hidden');
    result.scrollIntoView({ behavior: 'smooth' });
  });
}

function generateItinerary(days, style, interests) {
  const places = {
    riviera: { name: "Albanian Riviera (Ksamil / Himarë / Dhërmi)", map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48000!2d19.9!3d39.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDU0JzAwLjAiTiAxOcKwNTQnMDAuMCJF!5e0!3m2!1sen!2s!4v1", book: "experiences.html" },
    alps: { name: "Albanian Alps (Theth & Valbonë)", map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d46000!2d19.8!3d42.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDI0JzAwLjAiTiAxOcKwNDgnMDAuMCJF!5e0!3m2!1sen!2s!4v1", book: "experiences.html" },
    berat: { name: "Berat (UNESCO)", map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d19.95!3d40.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzAwLjAiTiAxOcKwNTcnMDAuMCJF!5e0!3m2!1sen!2s!4v1", book: "experiences.html" },
    gjirokaster: { name: "Gjirokastër (UNESCO)", map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d20.14!3d40.07!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDA0JzEyLjAiTiAyMMKwMDgnMjQuMCJF!5e0!3m2!1sen!2s!4v1", book: "experiences.html" },
    blueeye: { name: "Blue Eye (Syri i Kaltër)", map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d20.15!3d39.92!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDU1JzEyLjAiTiAyMMKwMDknMDAuMCJF!5e0!3m2!1sen!2s!4v1", book: "experiences.html" },
    lakekoman: { name: "Lake Koman Ferry", map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d46000!2d19.8!3d42.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDEyJzAwLjAiTiAxOcKwNDgnMDAuMCJF!5e0!3m2!1sen!2s!4v1", book: "experiences.html" },
    saranda: { name: "Sarandë", map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d20.0!3d39.87!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDUyJzEyLjAiTiAyMMKwMDAnMDAuMCJF!5e0!3m2!1sen!2s!4v1", book: "experiences.html" },
    vlore: { name: "Vlorë", map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d19.49!3d40.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDI4JzEyLjAiTiAxOcKwMjknMjQuMCJF!5e0!3m2!1sen!2s!4v1", book: "experiences.html" },
    tirana: { name: "Tirana", map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d19.82!3d41.33!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE5JzQ4LjAiTiAxOcKwNDknMTIuMCJF!5e0!3m2!1sen!2s!4v1", book: "experiences.html" }
  };

  let daysPlan = [];

  if (interests.includes('beaches') || style === 'relaxed' || style === 'mix') {
    daysPlan.push({ place: places.riviera, activities: "Beach time, boat trip to hidden coves, seafood dinner" });
  }
  if (interests.includes('mountains') || style === 'active' || style === 'mix') {
    daysPlan.push({ place: places.alps, activities: "Theth to Valbonë hike, stay in traditional guesthouse" });
  }
  if (interests.includes('culture') || style === 'culture' || style === 'mix') {
    daysPlan.push({ place: places.berat, activities: "Castle, old town walk, Ottoman houses" });
    daysPlan.push({ place: places.gjirokaster, activities: "Stone city, castle, local bazaar" });
  }
  if (interests.includes('nature')) {
    daysPlan.push({ place: places.blueeye, activities: "Visit the crystal-clear spring, short nature walk" });
  }
  if (interests.includes('lake')) {
    daysPlan.push({ place: places.lakekoman, activities: "Scenic ferry ride through the fjords" });
  }
  if (daysPlan.length < 2) {
    daysPlan.push({ place: places.saranda, activities: "Promenade, nearby beaches, evening atmosphere" });
  }

  while (daysPlan.length < days) {
    daysPlan.push(daysPlan[daysPlan.length % Math.max(1, daysPlan.length - 1)] || daysPlan[0]);
  }
  daysPlan = daysPlan.slice(0, days);

  let html = `<h3>Your ${days}-Day Albania Itinerary</h3>`;
  html += `<p style="margin-bottom:1.5rem;color:#555;"><em>Style: ${style} • Interests: ${interests.join(', ') || 'General'}</em></p>`;

  daysPlan.forEach((day, i) => {
    html += `
      <div class="day-card">
        <h4>Day ${i + 1}: ${day.place.name}</h4>
        <p><strong>Activities:</strong> ${day.activities}</p>
        <div class="map-container">
          <iframe src="${day.place.map}" width="100%" height="250" style="border:0;border-radius:12px;" allowfullscreen loading="lazy"></iframe>
        </div>
        <a href="${day.place.book}" class="btn primary" style="margin-top:1rem;">Book Experiences Here</a>
      </div>
    `;
  });

  html += `<p style="margin-top:2rem;padding:1rem;background:#f8f9fa;border-radius:8px;"><strong>Tip:</strong> Albania is best enjoyed slowly. Combine coast and mountains for the full experience.</p>`;

  return html;
}

// Operator form
const opForm = document.getElementById('operator-form');
if (opForm) {
  opForm.addEventListener('submit', e => {
    e.preventDefault();
    opForm.classList.add('hidden');
    document.getElementById('operator-success').classList.remove('hidden');
  });
}

// Reviews
const reviewForm = document.getElementById('new-review');
if (reviewForm) {
  reviewForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!currentUser) { alert('Please log in first'); return; }
    const text = document.getElementById('review-text').value;
    const rating = document.getElementById('review-rating').value;
    const stars = '★'.repeat(rating) + '☆'.repeat(5-rating);
    const div = document.createElement('div');
    div.className = 'testimonial';
    div.innerHTML = `<p>“${text}”</p><strong>— ${currentUser.displayName || 'User'} ${stars}</strong>`;
    document.getElementById('reviews-list').prepend(div);
    reviewForm.reset();
  });
}

updateAuthUI();