// Replace with your own NewsAPI key
const NEWSAPI_KEY = '86f9b530022d426abc6458d703660e8e';

// Elements
const newsQueryInput = document.getElementById('newsQuery');
const getNewsBtn      = document.getElementById('getNewsBtn');
const newsResultsEl   = document.getElementById('newsResults');

getNewsBtn.addEventListener('click', () => {
  const q = newsQueryInput.value.trim();
  fetchNews(q || 'top-headlines?country=my');
});

function fetchNews(path) {
  const url = path.startsWith('top-headlines')
    ? `https://newsapi.org/v2/${path}&apiKey=${NEWSAPI_KEY}`
    : `https://newsapi.org/v2/everything?q=${encodeURIComponent(path)}&apiKey=${NEWSAPI_KEY}`;

  fetch(url)
    .then(r => r.json())
    .then(data => {
      if (data.status !== 'ok') throw new Error(data.message || 'API error');
      renderArticles(data.articles);
    })
    .catch(err => {
      newsResultsEl.innerHTML = `<p class="text-danger">Error: ${err.message}</p>`;
    });
}

function renderArticles(articles) {
  if (!articles.length) {
    newsResultsEl.innerHTML = '<p>No articles found.</p>';
    return;
  }
  newsResultsEl.innerHTML = articles.map(a => `
    <div class="card mb-4 wow fadeInUp animated">
      ${a.urlToImage ? `<img src="${a.urlToImage}" class="card-img-top" alt="">` : ''}
      <div class="card-body">
        <h5 class="card-title">${a.title}</h5>
        <p class="card-text">${a.description || ''}</p>
        <a href="${a.url}" target="_blank" class="btn btn-primary">Read More</a>
      </div>
    </div>
  `).join('');
}

// Initial load: Top headlines
fetchNews('top-headlines?country=my');
