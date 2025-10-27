// ===== NAVBAR TOGGLE =====
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");
hamburger.addEventListener("click", () => {
  openSidebar();
});

// ===== GALLERY =====
const displayedImg = document.getElementById("displayed-img");
const thumbs = document.querySelectorAll(".thumbnails img");
thumbs.forEach(img => img.addEventListener("click", () => displayedImg.src = img.src));

// ===== MOVIES =====
const movieInput = document.getElementById("newMovieInput");
const addMovieBtn = document.getElementById("addMovieBtn");
const movieList = document.getElementById("movieList");
const searchInput = document.getElementById("searchInput");

let movies = ["Interstellar", "Inception", "The Batman", "Frozen"];

function renderMovies() {
  movieList.innerHTML = "";
  const filtered = movies.filter(m => m.toLowerCase().includes(searchInput.value.toLowerCase()));
  filtered.forEach(m => {
    const li = document.createElement("li");
    li.textContent = m;
    li.addEventListener("click", () => {
      movies = movies.filter(x => x !== m);
      renderMovies();
    });
    movieList.appendChild(li);
  });
}

addMovieBtn.addEventListener("click", () => {
  const newMovie = movieInput.value.trim();
  if(newMovie && !movies.includes(newMovie)) {
    movies.push(newMovie);
    movieInput.value = "";
    renderMovies();
  }
});
searchInput.addEventListener("input", renderMovies);
renderMovies();

// ===== TO-DO LIST =====
const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

addBtn.addEventListener("click", () => {
  const task = taskInput.value.trim();
  if(!task) return;
  const li = document.createElement("li");
  li.textContent = task;
  li.addEventListener("click", () => li.classList.toggle("done"));
  li.addEventListener("dblclick", () => li.remove());
  taskList.appendChild(li);
  taskInput.value = "";
});

// ===== POKEDEX (replaces Weather) =====
const pokemonBtn = document.getElementById("getPokemon"); // button now named for Pokémon
const pokemonInput = document.getElementById("pokemonInput");
const pokemonInfo = document.getElementById("pokemonInfo");
const pokemonMain = document.getElementById("pokemonMain");
const pokemonDetails = document.getElementById("pokemonDetails");

function capitalize(s){ return s && s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

pokemonBtn.addEventListener("click", async () => {
  const query = pokemonInput.value.trim().toLowerCase();
  if (!query) {
    alert("Please enter a Pokémon name or id!");
    return;
  }

  try {
    const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`;
    console.log('Fetching PokeAPI URL:', url);
    const response = await fetch(url);
    console.log('PokeAPI response status:', response.status);

    if (!response.ok) {
      // PokeAPI returns JSON with detail for some errors; attempt to parse
      let errMsg = 'Pokémon not found';
      try {
        const errData = await response.json();
        if (errData && errData.detail) errMsg = errData.detail;
      } catch (e) { /* ignore parse errors */ }
      throw new Error(errMsg);
    }

    const data = await response.json();
    console.log('PokeAPI data:', data);

    // Show container
    pokemonInfo.style.display = "block";

    // Choose best available sprite
    const sprite = (data.sprites && (data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default)) || '';

    // Main area: image, name & types
    pokemonMain.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:center">
        <img src="${sprite}" alt="${data.name}" style="width:120px;height:120px;object-fit:contain" />
        <div style="text-align:left">
        <div style="font-size:1.2rem;font-weight:700">${capitalize(data.name)} (ID: ${data.id})</div>
        <div style="text-transform:capitalize">Type: ${data.types.map(t => t.type.name).join(', ')}</div>
        </div>
      </div>
    `;

    // Details: height, weight, abilities, base experience
    pokemonDetails.innerHTML = `
      <div>Height: ${data.height / 10} m</div>
      <div>Weight: ${data.weight / 10} kg</div>
      <div>Abilities: ${data.abilities.map(a => a.ability.name).join(', ')}</div>
      <div>Base experience: ${data.base_experience}</div>
    `;
  } catch (error) {
    console.error('Error fetching Pokémon:', error);
    pokemonInfo.style.display = "block";
    pokemonMain.innerHTML = `Error: ${error.message || 'Pokémon not found'}`;
    pokemonDetails.innerHTML = "";
  }
});

// ===== COUNTDOWN =====
const startCountdown = document.getElementById("startCountdown");
const timerDisplay = document.getElementById("countdown-timer");

startCountdown.addEventListener("click", () => {
  const name = document.getElementById("occasionName").value;
  const date = document.getElementById("occasionDate").value;
  const time = document.getElementById("occasionTime").value;
  if(!date || !time) { timerDisplay.textContent = "Please enter date and time!"; return; }
  const target = new Date(`${date}T${time}`).getTime();
  const occ = name || "Your Event";
  clearInterval(window.countdownInterval);
  window.countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const diff = target - now;
    if(diff < 0) { timerDisplay.textContent = `${occ} has arrived!`; clearInterval(window.countdownInterval); return; }
    const d = Math.floor(diff / (1000*60*60*24));
    const h = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
    const m = Math.floor((diff % (1000*60*60)) / (1000*60));
    const s = Math.floor((diff % (1000*60)) / 1000);
    timerDisplay.textContent = `${occ}: ${d}d ${h}h ${m}m ${s}s`;
  }, 1000);
});

// ===== CALCULATOR =====
const calcDisplay = document.getElementById("calcDisplay");
const calcExpression = document.getElementById("calcExpression");
const btns = document.querySelectorAll(".calc-buttons .btn");
let expression = "";
let soundOn = true;

btns.forEach(btn => {
  btn.addEventListener("click", () => {
    const val = btn.dataset.value;
    if(val === undefined) return;
    expression += val;
    calcDisplay.value = expression;
    calcExpression.textContent = expression;
  });
});

document.getElementById("clear").addEventListener("click", () => {
  expression = "";
  calcDisplay.value = "";
  calcExpression.textContent = "0";
});

document.getElementById("delete").addEventListener("click", () => {
  expression = expression.slice(0,-1);
  calcDisplay.value = expression;
  calcExpression.textContent = expression || "0";
});

document.getElementById("equal").addEventListener("click", () => {
  try { expression = eval(expression).toString(); } catch(e) { expression="Error"; }
  calcDisplay.value = expression;
  calcExpression.textContent = expression;
});

// SOUND TOGGLE
const soundBtn = document.getElementById("soundToggle");
soundBtn.addEventListener("click", () => {
  soundOn = !soundOn;
  soundBtn.textContent = soundOn ? "🔈 Sound: On" : "🔇 Sound: Off";
});

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️ Light" : "🌙 Dark";
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;
  const msg = document.getElementById("message").value.trim();
  const error = document.getElementById("error-msg");
  if(!name || !email || !pass || !confirm || !msg) { error.textContent = "All fields are required!"; return; }
  if(pass !== confirm) { error.textContent = "Passwords do not match!"; return; }
  error.textContent = "Form submitted successfully!";
  contactForm.reset();
});

// ===== SIDEBAR =====
function openSidebar() {
  document.getElementById("sidebar").style.width = "250px";
  document.getElementById("sidebar").style.display = "block";
}

function closeSidebar() {
  document.getElementById("sidebar").style.width = "0";
  setTimeout(() => {
    document.getElementById("sidebar").style.display = "none";
  }, 300); // Wait for transition to complete
}
