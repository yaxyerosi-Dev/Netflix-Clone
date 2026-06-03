const API_KEY = "0c93bbaf53a92c5ffddf809ed47c1dc5";

const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/original";
const POSTER_URL = "https://image.tmdb.org/t/p/w500";

const moviesContainer = document.getElementById("moviesContainer");
const sectionTitle = document.getElementById("sectionTitle");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const hero = document.getElementById("hero");
const heroTitle = document.getElementById("heroTitle");
const heroOverview = document.getElementById("heroOverview");
const heroTrailerBtn = document.getElementById("heroTrailerBtn");

const trailerModal = document.getElementById("trailerModal");
const trailerFrame = document.getElementById("trailerFrame");
const closeModal = document.getElementById("closeModal");

let heroMovieId = null;

// Load trending movies
async function loadTrendingMovies() {
  const url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  displayHero(data.results[0]);
  displayMovies(data.results);
}

// Display hero movie
function displayHero(movie) {
  heroMovieId = movie.id;

  hero.style.backgroundImage = `
    linear-gradient(to top, black, transparent),
    url(${IMAGE_URL + movie.backdrop_path})
  `;

  heroTitle.textContent = movie.title;
  heroOverview.textContent = movie.overview.slice(0, 180) + "...";
}

// Display movies
function displayMovies(movies) {
  moviesContainer.innerHTML = "";

  movies.forEach(movie => {
    if (!movie.poster_path) return;

    const movieCard = document.createElement("div");

    movieCard.className =
      "bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition cursor-pointer";

    movieCard.innerHTML = `
      <img
        src="${POSTER_URL + movie.poster_path}"
        alt="${movie.title}"
        class="w-full h-72 object-cover"
      />

      <div class="p-3">
        <h3 class="font-bold text-sm truncate">${movie.title}</h3>
        <p class="text-gray-400 text-sm">⭐ ${movie.vote_average}</p>

        <button
          onclick="openTrailer(${movie.id})"
          class="mt-3 w-full bg-red-600 py-2 rounded font-semibold hover:bg-red-700"
        >
          Watch Trailer
        </button>
      </div>
    `;

    moviesContainer.appendChild(movieCard);
  });
}

// Load category movies
async function loadCategory(genreId) {
  sectionTitle.textContent = "Category Movies";

  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`;

  const response = await fetch(url);
  const data = await response.json();

  displayMovies(data.results);
}

// Search movies
async function searchMovies() {
  const query = searchInput.value.trim();

  if (query === "") {
    alert("Please enter movie name");
    return;
  }

  sectionTitle.textContent = `Search Results: ${query}`;

  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;

  const response = await fetch(url);
  const data = await response.json();

  displayMovies(data.results);
}

// Open trailer
async function openTrailer(movieId) {
  const url = `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  const trailer = data.results.find(video =>
    video.type === "Trailer" && video.site === "YouTube"
  );

  if (!trailer) {
    alert("Trailer not available");
    return;
  }

  trailerFrame.src = `https://www.youtube.com/embed/${trailer.key}`;
  trailerModal.classList.remove("hidden");
  trailerModal.classList.add("flex");
}

// Hero trailer button
heroTrailerBtn.addEventListener("click", () => {
  openTrailer(heroMovieId);
});

// Close modal
closeModal.addEventListener("click", () => {
  trailerModal.classList.add("hidden");
  trailerModal.classList.remove("flex");
  trailerFrame.src = "";
});

// Search events
searchBtn.addEventListener("click", searchMovies);

searchInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    searchMovies();
  }
});

// Start app
loadTrendingMovies();