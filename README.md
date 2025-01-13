# Evolution of Metal Frontend

This project presents a visual representation of metal music's evolution into various subgenres over time. The frontend displays a dynamic interface showcasing the splitting of metal genres throughout history.

## Overview

The Evolution of Metal Frontend is an interactive web application that visually represents the evolution of metal music into various subgenres. This project aims to provide users with an engaging and informative experience, allowing them to explore how different metal genres have developed over time.

## Key Features

- Interactive timeline displaying metal genre evolution
- Visual representation of subgenre splits
- Research-based selection of influential albums and artists
- Responsive design for optimal viewing on various devices

## Tech Stack

- Frontend: Vite with React and TypeScript
- Backend: Actix-web Rust API
- Database: PostgreSQL
- Storage: AWS S3 Bucket

## Research Methods

Each genre required extensive research to ensure accurate representation of the genre's evolution. The following sources were used:

- Rate Your Music: Used as a primary source for album ratings and a collection of one demographic of user ratings
- The Metal Archives: Provided the most extensive database of metal music as well as a second demographic of user ratings to cross reference, while RYM provided reviews from general music lovers, The Metal Archives is explicitly made up of people within the Metal Community.
- Discogs: Offered detailed information about albums, artists, and release dates and popularity of albums

It's important to note that while these sources were valuable, personal musical taste and bias inevitably influenced some selections. Efforts were made to be as objective as possible by focusing on albums generally agreed upon within the metal community as important in each genre's evolution.

## Installation and Usage

To run the Evolution of Metal Frontend locally:

1. Clone the repository:
git clone https://github.com/yourusername/Evolution-of-Metal-Frontend.git

2. Navigate to the backend directory:
cd Evolution-of-Metal-Backend

3. Start the backend sever:
cargo run

4. Navigate to the frontend directory:
cd ..
cd Evolution-of-Metal-Frontend

5. Start the frontend
npm run dev

5. Open http://localhost:5173 in your browser to view the frontend

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.









