// Shared script for all pages
document.querySelectorAll('.menu-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('open');
  });
});

// Firebase Auth (works once you add real config)
let currentUser = null;

function updateAuthUI() {
  const loginBtn = document.getElementById('login-btn');
  const userInfo = document.getElementById('user-info');
  const reviewForm = document.getElementById('review-form');
  if (!loginBtn) return;

  if (currentUser) {
    loginBtn.classList.add('hidden');
    if (userInfo) {
      userInfo.classList.remove('hidden');
      userInfo.textContent = currentUser.displayName || currentUser.email;
    }
    if (reviewForm) reviewForm.classList.remove('hidden');
  } else {
    loginBtn.classList.remove('hidden');
    if (userInfo) userInfo.classList.add('hidden');
    if (reviewForm) reviewForm.classList.add('hidden');
  }
}

if (typeof firebase !== 'undefined' && firebase.apps.length) {
  firebase.auth().onAuthStateChanged(user => {
    currentUser = user;
    updateAuthUI();
  });

  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).catch(err => alert(err.message));
    });
  }
} else {
  // Fallback demo login if Firebase not configured
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const name = prompt('Demo login — enter your name:') || 'Guest';
      currentUser = { displayName: name };
      updateAuthUI();
    });
  }
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
    // In production: send to Formspree, EmailJS, or Firebase
  });
}

// Planner
const plannerForm = document.getElementById('planner-form');
if (plannerForm) {
  plannerForm.addEventListener('submit', e => {
    e.preventDefault();
    const days = document.getElementById('days').value;
    const style = document.getElementById('style').value;
    const interests = Array.from(document.querySelectorAll('#planner-form input:checked')).map(i => i.value);

    let html = `<h3>Your ${days} Albania Itinerary</h3><p><em>Style: ${style}</em></p>`;
    html += `<div><strong>Riviera Days</strong><br>Ksamil, Himarë or Dhërmi — beaches, boat trips, seafood.</div>`;
    if (interests.includes('mountains') || style.includes('Hiking') || style.includes('Mix')) {
      html += `<div><strong>Albanian Alps</strong><br>Theth to Valbonë hike + traditional guesthouse stay.</div>`;
    }
    if (interests.includes('culture') || style.includes('Culture') || style.includes('Mix')) {
      html += `<div><strong>UNESCO Towns</strong><br>Berat and/or Gjirokastër with local guide.</div>`;
    }
    if (interests.includes('nature')) {
      html += `<div><strong>Nature</strong><br>Blue Eye (Syri i Kaltër) + optional Lake Koman ferry.</div>`;
    }
    if (interests.includes('food') || style.includes('Mix')) {
      html += `<div><strong>Food & Wine</strong><br>Vineyard visit and traditional Albanian meal.</div>`;
    }
    html += `<p style="margin-top:1.5rem;color:#c0392b;">This itinerary is generated for you. In the full version it will include exact day-by-day plans, maps, and direct booking links.</p>`;

    const result = document.getElementById('itinerary-result');
    result.innerHTML = html;
    result.classList.remove('hidden');
    result.scrollIntoView({ behavior: 'smooth' });
  });
}

// Operator form
const opForm = document.getElementById('operator-form');
if (opForm) {
  opForm.addEventListener('submit', e => {
    e.preventDefault();
    opForm.classList.add('hidden');
    document.getElementById('operator-success').classList.remove('hidden');
    // Production: send via Formspree or EmailJS
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