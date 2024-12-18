# Harmonize
Harmonize - where music meets community.

# About

Harmonize is a social platform designed to transform music discovery into a collaborative experience. Unlike traditional platforms like Spotify and Apple Music, which focus on individualized recommendations, Harmonize encourages community interaction. It integrates direct music streaming, user-generated reviews, and real-time discussions to enrich the way users find and enjoy music.

# Running The Project

### Prerequisites
Ensure you have the following installed:
- Docker
- Docker Compose

### Installation and Running the Project

1. **Clone the Repository**
   Clone the project to your local machine:
   ```bash
   git clone https://github.com/your-username/harmonize.git
   cd harmonize```

2. **Start the Application with Docker Compose Build and run the application using Docker Compose:**

```docker-compose up --build```

3. **Seed the server**

Run ```docker ps```

and get the container id for harmonize-server. Then run

Run ```docker exec <Container_ID>  npm run seed```
