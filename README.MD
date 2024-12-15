# 🎬 Flatdango: Movie Ticket Booking App 🎟️
Welcome to Flatdango, a simple yet elegant web application for managing movie ticket bookings! This app enables users to browse available movies, view details, and purchase tickets, all with a dynamic and responsive interface.

 ## 🚀 Features
 1. Dynamic Movie List: View all available movies in a clean sidebar. <br>
2. Detailed Movie Information: Display runtime, showtime, available tickets, and more.<br>
3. Ticket Purchase: Real-time ticket updates for each movie.<br>
4. Persistent Data: Local storage integration ensures a seamless experience.<br>
5. Responsive Design: Works across devices with an optimized layout.<br>
 ## 🖥️ Technologies Used
1. HTML: For the structure of the application.
2. CSS: For styling and layout, including responsive design.
3. JavaScript: For dynamic functionality and interactivity.
4. JSON Server: For simulating a backend API.
## 🛠️ Setup Instructions
Follow these steps to run the project locally:

1. Clone the Repository

bash
Copy code
git clone https://github.com/your-username/flatdango.git
cd flatdango
2. Install JSON Server
Make sure you have npm installed. Then, install JSON Server:

bash
Copy code
npm install -g json-server
3. Start the Server
Run the following command to start the JSON Server:

bash
Copy code
json-server --watch db.json
4. Open the App
Open index.html in your favorite browser to launch the app.

## 📂 Project Structure
plaintext
Copy code
flatdango/
├── db.json         # Mock database for the movies
├── index.html      # Main HTML file
├── style.css       # Styling for the application
├── index.js        # JavaScript for functionality
├── README.md       # Project documentation
## 📖 Usage Guide
1. Browse Movies

The sidebar displays a list of available movies.
Click on any movie to view its details.
View Details

2. Check runtime, showtime, and available tickets.
Enjoy the movie poster and description.
3.Buy Tickets

Click the Buy Ticket button to purchase.
If tickets are sold out, the button will be disabled.
 ## 🌟 Project Highlights
Local Storage Integration:
Data is cached locally, ensuring a fast and smooth user experience.
Dynamic Updates:
Real-time updates for ticket availability with seamless UI feedback.
Minimalistic Design:
A clean and modern layout for easy navigation.
## 🤔 Future Enhancements
User Authentication: Allow users to create accounts and track bookings.
Advanced Filtering: Search and filter movies by genre, ratings, or availability.
Payment Integration: Enable real payments for ticket booking.
Admin Panel: Manage movies and ticket availability through a secure admin dashboard.
## 👨‍💻 Developer Notes
Ensure that the db.json file is in the root directory.
Customize the JSON Server endpoint if needed in the index.js file.
## 🏆 Contributing
We welcome contributions!
If you'd like to contribute:

Fork the repository.
Create a new branch: git checkout -b feature-name.
Submit a pull request with your changes.
## 💡 Credits
Built with ❤️ by Your Name.

## 📃 License
This project is licensed under the MIT License.

