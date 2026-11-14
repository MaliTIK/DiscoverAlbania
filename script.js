// Mobile menu
document.querySelector('.menu-toggle').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    document.querySelector('.nav-links').classList.remove('open');
  });
});

// Experience filters
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.exp-card').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Trip planner
document.getElementById('planner-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const days = document.getElementById('days').value;
  const style = document.getElementById('style').value;
  const interests = Array.from(document.querySelectorAll('#planner-form input[type="checkbox"]:checked')).map(cb => cb.value);
  
  let itinerary = `<h3>Your Personalized ${days} Albania Itinerary</h3>`;
  itinerary += `<p style="margin-bottom:1rem; color:#555;"><em>Travel style: ${style}</em></p>`;
  
  itinerary += `<div style="margin-bottom:1.5rem;"><strong>Day 1–2: Albanian Riviera</strong><br>
  Arrive in Sarandë or Himarë. Spend time on the turquoise beaches of Ksamil, take a boat to hidden coves, and enjoy fresh seafood by the sea.</div>`;
  
  if (interests.includes('mountains') || style.includes('Hiking') || style.includes('Mix')) {
    itinerary += `<div style="margin-bottom:1.5rem;"><strong>Mountains highlight: Theth & Valbonë</strong><br>
    Classic hike through the Albanian Alps. Stay in a traditional stone guesthouse and experience true mountain hospitality.</div>`;
  }
  
  if (interests.includes('culture') || style.includes('Culture') || style.includes('Mix')) {
    itinerary += `<div style="margin-bottom:1.5rem;"><strong>Culture stop: Berat</strong><br>
    Explore the UNESCO-listed “City of a Thousand Windows”. Climb to the castle and wander the historic Ottoman streets.</div>`;
  }
  
  if (interests.includes('nature') || interests.includes('beaches')) {
    itinerary += `<div style="margin-bottom:1.5rem;"><strong>Nature: Blue Eye (Syri i Kaltër)</strong><br>
    Visit one of Albania’s most magical natural springs — crystal-clear water emerging from deep underground.</div>`;
  }
  
  if (interests.includes('food') || style.includes('Mix')) {
    itinerary += `<div style="margin-bottom:1.5rem;"><strong>Food & Wine</strong><br>
    Wine tasting at a local family winery + traditional Albanian lunch (byrek, fërgesë, grilled fish or lamb).</div>`;
  }
  
  itinerary += `<p style="margin-top:1.5rem; padding-top:1rem; border-top:1px solid #ddd;"><strong>Pro tip:</strong> Albania rewards slow travel. Combine the coast and mountains for the full experience. Local guides make a huge difference.</p>`;
  itinerary += `<p style="margin-top:1rem; color:#c0392b; font-size:0.9rem;"><em>This is a high-fidelity prototype. A production version would connect to real bookings, local operators, maps, and more detailed day-by-day AI planning.</em></p>`;
  
  const result = document.getElementById('itinerary-result');
  result.innerHTML = itinerary;
  result.classList.remove('hidden');
  result.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Book buttons (demo)
document.querySelectorAll('.book-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    alert('Booking flow coming soon! In the full version this would open a booking form or connect to a payment system.');
  });
});