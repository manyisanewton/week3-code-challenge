document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const movieTitle = document.getElementById("movie-title");
    const moviePoster = document.getElementById("movie-poster");
    const movieDescription = document.getElementById("movie-description");
    const movieRuntime = document.getElementById("movie-runtime");
    const movieShowtime = document.getElementById("movie-showtime");
    const movieTickets = document.getElementById("movie-tickets");
    const buyTicketButton = document.getElementById("buy-ticket");
    const filmsList = document.getElementById("films");

    const API_URL = "http://localhost:3000/films";

    // Helper Function: Display Movie Details
    function displayMovieDetails(movie) {
        if (!movie) {
            console.error("No movie data to display");
            return;
        }

        movieTitle.textContent = movie.title;
        moviePoster.src = movie.poster;
        movieDescription.textContent = movie.description;
        movieRuntime.textContent = `Runtime: ${movie.runtime} minutes`;
        movieShowtime.textContent = `Showtime: ${movie.showtime}`;
        const ticketsLeft = movie.capacity - movie.tickets_sold;
        movieTickets.textContent = `Available Tickets: ${ticketsLeft}`;
        buyTicketButton.dataset.movieId = movie.id;
        buyTicketButton.dataset.remainingTickets = ticketsLeft;

        // Update button state
        if (ticketsLeft > 0) {
            buyTicketButton.textContent = "Buy Ticket";
            buyTicketButton.disabled = false;
        } else {
            buyTicketButton.textContent = "Sold Out";
            buyTicketButton.disabled = true;
        }
    }

    // Fetch First Movie and Display Its Details
    function fetchFirstMovie() {
        fetch(`${API_URL}/1`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch movie: ${response.status}`);
                }
                return response.json();
            })
            .then((movie) => displayMovieDetails(movie))
            .catch((error) => console.error("Error fetching the first movie:", error));
    }

    // Fetch All Movies and Populate Sidebar
    function fetchMovies() {
        fetch(API_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch movies: ${response.status}`);
                }
                return response.json();
            })
            .then((movies) => {
                populateMoviesSidebar(movies);
            })
            .catch((error) => {
                console.error("Error fetching movies:", error);
            });
    }

    // Populate Movies Sidebar
    function populateMoviesSidebar(movies) {
        filmsList.innerHTML = ""; // Clear any existing list items
        movies.forEach((movie) => {
            const filmItem = document.createElement("li");
            filmItem.textContent = movie.title;
            filmItem.classList.add("film", "item");
            filmItem.dataset.id = movie.id;

            // Add "sold-out" class if movie is sold out
            const ticketsLeft = movie.capacity - movie.tickets_sold;
            if (ticketsLeft === 0) {
                filmItem.classList.add("sold-out");
            }

            // Add click event to display movie details
            filmItem.addEventListener("click", () => displayMovieDetails(movie));

            filmsList.appendChild(filmItem);
        });
    }

    // Buy Ticket Button Event Listener
    buyTicketButton.addEventListener("click", () => {
        const movieId = buyTicketButton.dataset.movieId;
        let remainingTickets = parseInt(buyTicketButton.dataset.remainingTickets);

        if (remainingTickets > 0) {
            remainingTickets -= 1;

            movieTickets.textContent = `Available Tickets: ${remainingTickets}`;
            buyTicketButton.dataset.remainingTickets = remainingTickets;

            if (remainingTickets === 0) {
                buyTicketButton.textContent = "Sold Out";
                buyTicketButton.disabled = true;

                const filmItem = [...filmsList.children].find(
                    (li) => li.dataset.id === movieId
                );
                if (filmItem) filmItem.classList.add("sold-out");
            }

            // Update on the server
            fetch(`${API_URL}/${movieId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tickets_sold: movie.capacity - remainingTickets }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Failed to update tickets: ${response.status}`);
                    }
                    return response.json();
                })
                .then((updatedMovie) => console.log("Updated movie:", updatedMovie))
                .catch((error) => console.error("Error updating tickets:", error));
        } else {
            alert("Tickets are already sold out!");
        }
    });

    // Initial Fetch and Setup
    fetchFirstMovie();
    fetchMovies();
});
