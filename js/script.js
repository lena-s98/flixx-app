const global = {
	currentPage: window.location.pathname,
	search: {
		term: "",
		type: "",
		page: 1,
		totalPages: 1,
	},
	api: {
		apiKey: "825997b93aad673e0f714421bcd2b986",
		apiUrl: "https://api.themoviedb.org/3/",
	},
};

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
	const API_KEY = global.api.apiKey;
	const API_URL = global.api.apiUrl;

	showSpinner();

	const response = await fetch(
		`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
	);

	const data = await response.json();

	hideSpinner();

	return data;
}

// Make Request to Search
async function searchAPIData() {
	const API_KEY = global.api.apiKey;
	const API_URL = global.api.apiUrl;

	showSpinner();

	const response = await fetch(
		`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}`
	);

	const data = await response.json();

	hideSpinner();

	return data;
}

// Search for Movies/TV Shows
async function search() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	global.search.type = urlParams.get("type");
	global.search.term = urlParams.get("search-term");

	if (global.search.term !== "" && global.search.term !== null) {
		const { results, total_pages, page } = await searchAPIData();

		if (results.length === 0) {
			showAlert("No results found");
			return;
		}

		displaySearchResults(results);

		document.querySelector("#search-term").value = "";
	} else {
		showAlert("Please enter a search term");
	}
}

// Append the search results to the DOM
function displaySearchResults(results) {
	results.forEach((result) => {
		const div = document.createElement("div");
		div.classList.add("card");
		div.innerHTML = `
    <a href="${global.search.type}-details.html?${result.id}">
      ${
				result.poster_path
					? `<img src="https://image.tmdb.org/t/p/w500${
							result.poster_path
					  }" class="card-img-top" alt="${
							global.search.type === "movie" ? result.title : result.name
					  }">`
					: `<img src="images/no-image.jpg" class="card-img-top" alt="${
							global.search.type === "movie" ? result.title : result.name
					  }"
    />`
			}
      
    </a>
    <div class="card-body">
      <h5 class="card-title">${
				global.search.type === "movie" ? result.title : result.name
			}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${
					global.search.type === "movie"
						? result.release_date
						: result.first_air_date
				}</small>
      </p>
    </div>`;

		document.querySelector("#search-results").appendChild(div);
	});
}

// Display popular movies
async function displayPopularMovies() {
	const { results } = await fetchAPIData("movie/popular");
	results.forEach((movie) => {
		const div = document.createElement("div");
		div.classList.add("card");
		div.innerHTML = `
    <a href="movie-details.html?${movie.id}">
      ${
				movie.poster_path
					? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}">`
					: `<img src="images/no-image.jpg" class="card-img-top" alt="${movie.title}"
    />`
			}
      
    </a>
    <div class="card-body">
      <h5 class="card-title">${movie.title}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${movie.release_date}</small>
      </p>
    </div>`;

		document.querySelector("#popular-movies").appendChild(div);
	});
}

// Display movie details
async function displayMovieDetails() {
	const movieId = window.location.search.split("?")[1];

	const movie = await fetchAPIData(`movie/${movieId}`);

	displayBackdropImage("movie", movie.backdrop_path);

	const div = document.createElement("div");

	div.innerHTML = `
  <div class="details-top">
  <div>
  ${
		movie.poster_path
			? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}">`
			: `<img src="images/no-image.jpg" class="card-img-top" alt="${movie.title}" />`
	}
  </div>
  <div>
    <h2>${movie.title}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${movie.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${movie.release_date}</p>
    <p>
      ${movie.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${movie.genres.map((genre) => `<li>${genre.name}`).join("")}
    </ul>
    <a href="${
			movie.homepage
		}" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Budget:</span> $${addCommaToNumber(
			movie.budget
		)}</li>
    <li><span class="text-secondary">Revenue:</span> $${addCommaToNumber(
			movie.revenue
		)}</li>
    <li><span class="text-secondary">Runtime:</span> 
			${movie.runtime} min
		</li>
    <li><span class="text-secondary">Status:</span> ${movie.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
    ${movie.production_companies
			.map((company) => `<span>${company.name}</span>`)
			.join(" | ")}
  </div>
</div>
  `;

	document.querySelector("#movie-details").appendChild(div);
}

// Display popular tv shows
async function displayPopularShows() {
	const { results } = await fetchAPIData("tv/popular");
	results.forEach((show) => {
		const div = document.createElement("div");
		div.classList.add("card");
		div.innerHTML = `
    <a href="tv-details.html?${show.id}">
      ${
				show.poster_path
					? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" class="card-img-top" alt="${show.name}">`
					: `<img src="images/no-image.jpg" class="card-img-top" alt="${show.name}"
    />`
			}
      
    </a>
    <div class="card-body">
      <h5 class="card-title">${show.name}</h5>
      <p class="card-text">
        <small class="text-muted">Air Date: ${show.first_air_date}</small>
      </p>
    </div>`;

		document.querySelector("#popular-shows").appendChild(div);
	});
}

// Display tv show details
async function displayShowDetails() {
	const showId = window.location.search.split("?")[1];

	const show = await fetchAPIData(`tv/${showId}`);

	displayBackdropImage("tv", show.backdrop_path);

	const div = document.createElement("div");

	div.innerHTML = `
  <div class="details-top">
  <div>
  ${
		show.poster_path
			? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" class="card-img-top" alt="${show.name}">`
			: `<img src="images/no-image.jpg" class="card-img-top" alt="${show.name}" />`
	}
  </div>
  <div>
    <h2>${show.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${show.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${show.first_air_date}</p>
    <p>
      ${show.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${show.genres.map((genre) => `<li>${genre.name}`).join("")}
    </ul>
    <a href="${
			show.homepage
		}" target="_blank" class="btn">Visit show Homepage</a>
  </div>
</div>
<div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${
							show.number_of_episodes
						}</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${
								show.last_air_date
							}
            </li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${show.production_companies
						.map((company) => `<span>${company.name}</span>`)
						.join(" | ")}</div>
        </div>
</div>
  `;

	document.querySelector("#show-details").appendChild(div);
}

// Display backdrop image in details page
function displayBackdropImage(type, backgroundPath) {
	const overlayDiv = document.createElement("div");
	overlayDiv.style.backgroundImage = `url(
		https://image.tmdb.org/t/p/original/${backgroundPath}
	)`;
	overlayDiv.style.backgroundSize = "cover";
	overlayDiv.style.backgroundPosition = "center";
	overlayDiv.style.backgroundRepeat = "no-repeat";
	overlayDiv.style.height = "100vh";
	overlayDiv.style.width = "100vw";
	overlayDiv.style.position = "absolute";
	overlayDiv.style.top = "0";
	overlayDiv.style.left = "0";
	overlayDiv.style.zIndex = "-1";
	overlayDiv.style.opacity = "0.1";

	if (type === "movie") {
		document.querySelector("#movie-details").appendChild(overlayDiv);
	} else {
		document.querySelector("#show-details").appendChild(overlayDiv);
	}
}

// Slider for movies that are currently playing
async function displayMovieSlider() {
	const { results } = await fetchAPIData("movie/now_playing");
	results.forEach((movie) => {
		const div = document.createElement("div");
		div.classList.add("swiper-slide");

		div.innerHTML = `
    <a href="movie-details.html?${movie.id}">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
			movie.title
		}" />
    </a>
    <h4 class="swiper-rating">
      <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
				1
			)} / 10
    </h4>
    `;

		document.querySelector(".swiper-wrapper").appendChild(div);

		initSwiper();
	});
}

// Slider for tv show that are currently on air
async function displayShowSlider() {
	const { results } = await fetchAPIData("tv/on_the_air");
	results.forEach((show) => {
		const div = document.createElement("div");
		div.classList.add("swiper-slide");

		div.innerHTML = `
    <a href="tv-details.html?${show.id}">
      <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${
			show.name
		}" />
    </a>
    <h4 class="swiper-rating">
      <i class="fas fa-star text-secondary"></i> ${show.vote_average.toFixed(
				1
			)} / 10
    </h4>
    `;

		document.querySelector(".swiper-wrapper").appendChild(div);

		initSwiper();
	});
}

// Initialize the Swiper Object
function initSwiper() {
	const swiper = new Swiper(".swiper", {
		slidesPerView: 1,
		spaceBetween: 30,
		slidesPerView: true,
		loop: true,
		autoplay: {
			delay: 4000,
			disableOnInteraction: false,
		},
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
		breakpoints: {
			640: {
				slidesPerView: 2,
				spaceBetween: 20,
			},
			768: {
				slidesPerView: 3,
				spaceBetween: 30,
			},
			1024: {
				slidesPerView: 4,
				spaceBetween: 40,
			},
		},
	});
}

// Show Alert
function showAlert(msg, className = "error") {
	const alertEl = document.createElement("div");
	alertEl.classList.add("alert", className);
	alertEl.appendChild(document.createTextNode(msg));
	document.querySelector("#alert").appendChild(alertEl);

	setTimeout(() => alertEl.remove(), 3000);
}

// Show the loading spinner animation
function showSpinner() {
	document.querySelector(".spinner").classList.add("show");
}

// Hide the loading spinner animation
function hideSpinner() {
	document.querySelector(".spinner").classList.remove("show");
}

// Highlight active link
function hightlightActiveLink() {
	const links = document.querySelectorAll(".nav-link");
	links.forEach((link) => {
		if (link.getAttribute("href") === global.currentPage) {
			link.classList.add("active");
		}
	});
}

// Add commas to long numbers
function addCommaToNumber(num) {
	if (num) {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	} else {
		return "N/A";
	}
}

function init() {
	switch (global.currentPage) {
		case "/":
		case "/index.html":
			displayMovieSlider();
			displayPopularMovies();
			break;
		case "/shows.html":
			displayShowSlider();
			displayPopularShows();
			break;
		case "/movie-details.html":
			displayMovieDetails();
			break;
		case "/tv-details.html":
			displayShowDetails();
			break;
		case "/search.html":
			search();
			break;
	}
	hightlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
