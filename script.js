
const API_KEY = "d569893807515ddfd23d8380b001431a";
const IMAGE_PATH = "https://image.tmdb.org/t/p/w500/";

const MOVIE_URL   = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
const SERIES_URL  = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`;
const POPULAR_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;
const TRENDS_URL  = `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`;
const SEARCH_URL  = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

// Selectors
const moviesGrid   = document.querySelector(".movies-grid");
const seriesGrid   = document.querySelector(".series-grid");
const popularGrid  = document.querySelector(".popular-grid");
const trendsGrid   = document.querySelector(".trends-grid");
const searchGrid   = document.querySelector(".search-grid");
const form = document.getElementById("form");
const searchInput = document.getElementById("search");

// Modal selectors
const modal = document.getElementById("movie-modal");
const closeBtn = document.querySelector(".close");
const modalPoster = document.getElementById("modal-poster");
const modalTitle = document.getElementById("modal-title");
const modalDate = document.getElementById("modal-date");
const modalRating = document.getElementById("modal-rating");
const modalGenres = document.getElementById("modal-genres");
const modalRuntime = document.getElementById("modal-runtime");
const modalOverview = document.getElementById("modal-overview");
const modalTrailerBtn = document.getElementById("modal-trailer");

// Fetch Helper
async function getData(url, container) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    displayResults(data.results, container);
  } catch (err) {
    console.error("Error fetching:", err);
  }
}

// Display Movies
function displayResults(items, container) {
  container.innerHTML = "";
  if (!items || items.length === 0) {
    container.innerHTML = `<p>No results found</p>`;
    return;
  }
  items.forEach(item => {
    const title = item.title || item.name;
    const poster = item.poster_path ? IMAGE_PATH + item.poster_path : "profile.jpg";
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <img src="${poster}" alt="${title}">
      <h3>${title}</h3>
    `;

    // Open modal on click
    div.addEventListener("click", () => {
      openModal(item.id);
    });

    container.appendChild(div);
  });
}

// Modal functions
async function openModal(movieId) {
  try {
    // Fetch full details including videos
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos`);
    const data = await res.json();

    // Fill modal
    modalPoster.src = data.poster_path ? IMAGE_PATH + data.poster_path : "profile.jpg";
    modalTitle.textContent = data.title;
    modalDate.textContent = data.release_date || "N/A";
    modalRating.textContent = data.vote_average || "N/A";
    modalOverview.textContent = data.overview || "No description available.";
    modalRuntime.textContent = data.runtime ? `${data.runtime} min` : "N/A";

    // Genres
    modalGenres.textContent = data.genres && data.genres.length > 0 
      ? data.genres.map(g => g.name).join(", ") 
      : "N/A";

    // Trailer
    const trailer = data.videos.results.find(v => v.type === "Trailer" && v.site === "YouTube");
    if (trailer) {
      modalTrailerBtn.style.display = "inline-block";
      modalTrailerBtn.onclick = () => {
        window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank");
      };
    } else {
      modalTrailerBtn.style.display = "none";
    }

    modal.style.display = "flex"; // Show modal
  } catch (err) {
    console.error("Error fetching movie details:", err);
  }
}

// Close modal with X
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Load Sections
getData(MOVIE_URL, moviesGrid);
getData(SERIES_URL, seriesGrid);
getData(POPULAR_URL, popularGrid);
getData(TRENDS_URL, trendsGrid);

// Search
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchValue = searchInput.value.trim();
  if (searchValue) {
    getData(SEARCH_URL + encodeURIComponent(searchValue), searchGrid);
    window.location.hash = "#search-results"; // Jump to results
    searchInput.value = "";
  }
});





            // sidebar functions

            function showSidebar(){
                const sidebar = document.querySelector(".sidebar")
                sidebar.style.display = 'flex'
            }

            function hideSidebar(){
                const sidebar = document.querySelector(".sidebar")
                sidebar.style.display = 'none'
            }

