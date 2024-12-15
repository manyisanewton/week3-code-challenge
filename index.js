document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements - References to the HTML elements where data will be displayed or updated
    const movieTitle = document.getElementById("movie-title");
    const moviePoster = document.getElementById("movie-poster");
    const movieDescription = document.getElementById("movie-description");
    const movieRuntime = document.getElementById("movie-runtime");
    const movieShowtime = document.getElementById("movie-showtime");
    const movieTickets = document.getElementById("movie-tickets");
    const buyTicketButton = document.getElementById("buy-ticket");
    const filmsList = document.getElementById("films");

    // The base URL of your local server API where movie data is fetched
    const API_URL = "http://localhost:3000/films";

    // Function to display movie details in the main section when a movie is selected
    function displayMovieDetails(movie) {
        if (!movie) {
            console.error("No movie data to display"); // Safety check in case the movie data is missing
            return;
        }

        // Populate the movie details section with the movie's data
        movieTitle.textContent = movie.title;
        moviePoster.src = movie.poster;
        movieDescription.textContent = movie.description;
        movieRuntime.textContent = `Runtime: ${movie.runtime} minutes`;
        movieShowtime.textContent = `Showtime: ${movie.showtime}`;

        // Check localStorage to see if there's saved ticket info for this movie
        const storedTickets = localStorage.getItem(`movie_${movie.id}_tickets`);

        // Calculate tickets left: Use stored tickets if available, else use server data
        const ticketsLeft = storedTickets 
            ? parseInt(storedTickets) 
            : movie.capacity - movie.tickets_sold;

        // Update the displayed available tickets
        movieTickets.textContent = `Available Tickets: ${ticketsLeft}`;
        buyTicketButton.dataset.movieId = movie.id; // Store movie ID for later reference
        buyTicketButton.dataset.remainingTickets = ticketsLeft; // Store remaining tickets info

        // Save tickets data in localStorage for persistence across page reloads
        localStorage.setItem(`movie_${movie.id}_tickets`, ticketsLeft);

        // Update the Buy Ticket button's state (enabled or disabled)
        if (ticketsLeft > 0) {
            buyTicketButton.textContent = "Buy Ticket";
            buyTicketButton.disabled = false;
        } else {
            buyTicketButton.textContent = "Sold Out";
            buyTicketButton.disabled = true;
        }
    }

    // Fetch movie details from the API using the movie ID
    function fetchMovieDetails(movieId) {
        fetch(`${API_URL}/${movieId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch movie: ${response.status}`); // Handle errors gracefully
                }
                return response.json(); // Convert response to JSON format
            })
            .then((movie) => {
                // If tickets data is in localStorage, update movie object
                const storedTickets = localStorage.getItem(`movie_${movie.id}_tickets`);
                if (storedTickets) {
                    movie.tickets_sold = movie.capacity - parseInt(storedTickets);
                }

                // Display movie details on the page
                displayMovieDetails(movie);
            })
            .catch((error) => console.error("Error fetching movie:", error));
    }

    // Fetch the list of all movies and populate the sidebar
    function fetchMovies() {
        fetch(API_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch movies: ${response.status}`);
                }
                return response.json();
            })
            .then((movies) => populateMoviesSidebar(movies)) // Call helper to fill the sidebar
            .catch((error) => console.error("Error fetching movies:", error));
    }

    // Populate the movies list in the sidebar
    function populateMoviesSidebar(movies) {
        filmsList.innerHTML = ""; // Clear any existing list items

        // Loop through each movie and create a list item
        movies.forEach((movie) => {
            const filmItem = document.createElement("li");
            filmItem.textContent = movie.title; // Set the text of the list item to the movie title
            filmItem.classList.add("film", "item"); // Add classes for styling
            filmItem.dataset.id = movie.id; // Store the movie ID for reference

            // Check if this movie's ticket data is in localStorage
            const storedTickets = localStorage.getItem(`movie_${movie.id}_tickets`);
            const ticketsLeft = storedTickets 
                ? parseInt(storedTickets) 
                : movie.capacity - movie.tickets_sold;

            // Style sold-out movies differently
            if (ticketsLeft === 0) {
                filmItem.classList.add("sold-out");
                filmItem.style.backgroundColor = "red";
                filmItem.style.color = "white";
                filmItem.style.display = "flex";
                filmItem.style.justifyContent = "space-between";
                filmItem.style.alignItems = "center";

                // Add a delete button for sold-out movies
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.classList.add("delete-button");
                deleteButton.style.backgroundColor = "green";
                deleteButton.style.color = "white";
                deleteButton.style.border = "none";
                deleteButton.style.padding = "5px 10px";
                deleteButton.style.cursor = "pointer";

                // Add click event to delete the movie from the sidebar and localStorage
                deleteButton.addEventListener("click", () => {
                    filmsList.removeChild(filmItem);
                    localStorage.removeItem(`movie_${movie.id}_tickets`);
                });

                // Append the delete button to the movie item
                filmItem.appendChild(deleteButton);
            }

            // Add click event to show movie details on the main section
            filmItem.addEventListener("click", () => fetchMovieDetails(movie.id));

            // Append the movie item to the sidebar
            filmsList.appendChild(filmItem);
        });
    }

    // Event listener for the "Buy Ticket" button
    buyTicketButton.addEventListener("click", () => {
        const movieId = buyTicketButton.dataset.movieId; // Get the current movie ID
        let remainingTickets = parseInt(buyTicketButton.dataset.remainingTickets); // Get tickets left

        if (remainingTickets > 0) {
            remainingTickets -= 1; // Reduce tickets by 1
            movieTickets.textContent = `Available Tickets: ${remainingTickets}`; // Update the display
            buyTicketButton.dataset.remainingTickets = remainingTickets; // Update button's data

            // Save updated tickets to localStorage
            localStorage.setItem(`movie_${movieId}_tickets`, remainingTickets);

            // Update UI if tickets are sold out
            if (remainingTickets === 0) {
                buyTicketButton.textContent = "Sold Out";
                buyTicketButton.disabled = true;

                const filmItem = [...filmsList.children].find(
                    (li) => li.dataset.id === movieId
                );
                if (filmItem) {
                    filmItem.classList.add("sold-out");
                    filmItem.style.backgroundColor = "red";
                    filmItem.style.color = "white";
                    filmItem.style.display = "flex";
                    filmItem.style.justifyContent = "space-between";
                    filmItem.style.alignItems = "center";

                    // Add delete button
                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Delete";
                    deleteButton.classList.add("delete-button");
                    deleteButton.style.backgroundColor = "green";
                    deleteButton.style.color = "white";
                    deleteButton.style.border = "none";
                    deleteButton.style.padding = "5px 10px";
                    deleteButton.style.cursor = "pointer";

                    deleteButton.addEventListener("click", () => {
                        filmsList.removeChild(filmItem);
                        localStorage.removeItem(`movie_${movieId}_tickets`);
                    });

                    filmItem.appendChild(deleteButton);
                }
            }

            // Update ticket info on the server
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

    // Initial fetch for the first movie and all movies
    fetchMovieDetails(1); // Load the first movie by default
    fetchMovies(); // Load all movies for the sidebar
});
