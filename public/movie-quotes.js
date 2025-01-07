async function getRandomQuote() {
    const container = document.getElementById('quotesContainer');
    
    try {
        container.innerHTML = '<p>Loading...</p>';
        const response = await fetch('/movie-quotes');
        const data = await response.json();

        if (!data.quotes || data.quotes.length === 0) {
            container.innerHTML = '<p>No quotes available</p>';
            return;
        }

        const quote = data.quotes[0];
        container.innerHTML = `
            <div class="quote-card">
                <blockquote>${quote.quote}</blockquote>
                <div class="quote-info">
                    <p class="movie-title">Movie: ${quote.movie_title}</p>
                    <p class="actor">Actor: ${quote.actor_name}</p>
                    <p class="rating">Rating: ${quote.rating}/10</p>
                    <div class="author-info">
                        <h4>${quote.author}</h4>
                        <p>${quote.author_bio}</p>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<p>Error loading quote. Please try again later.</p>';
    }
}

document.getElementById('getRandomQuoteBtn').addEventListener('click', getRandomQuote);
getRandomQuote(); 