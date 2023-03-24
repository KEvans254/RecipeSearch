const appId = '7cc1191d';
const appKey = '408b5ba93e0d384e5fd58fcbcd65f649';

const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', searchRecipes);

function searchRecipes() {
  const query = document.getElementById('query').value;
  const excludeIngredients = document.getElementById('excludeIngredients').value;
  const diet = document.getElementById('diet').value;
  const cuisineType = document.getElementById('cuisineType').value;

  // Clear error message
  const errorDiv = document.getElementById('error-message');
  errorDiv.innerHTML = '';

  // Check if required fields are filled
  if (!query) {
    displayError('Please enter a search query');
    return;
  }

  let apiUrl = `https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${appKey}`;

  if (excludeIngredients && excludeIngredients.trim() !== '') { // check if excludeIngredients is not empty or undefined
    apiUrl += `&excluded=${excludeIngredients}`;
  }

  if (diet) {
    apiUrl += `&diet=${diet}`;
  }

  if (cuisineType) {
    apiUrl += `&cuisineType=${cuisineType}`;
  }

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => displayResults(data.hits))
    .catch(error => displayError(error));
}

function displayResults(hits) {
  const results = document.getElementById('results');
  results.innerHTML = '';

  if (hits.length === 0) {
    const errorMessage = 'No results found. Please try another search.';
    displayError(errorMessage);
  } else {
    // Pagination
    const itemsPerPage = 10;
    const totalPages = Math.ceil(hits.length / itemsPerPage);
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.innerText = i;
      button.addEventListener('click', () => {
        displayPage(hits, i, itemsPerPage);
      });
      paginationDiv.appendChild(button);
    }

    displayPage(hits, 1, itemsPerPage);
  }
}

function displayPage(hits, currentPage, itemsPerPage) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageHits = hits.slice(startIndex, endIndex);

  pageHits.forEach(hit => {
    const { recipe } = hit;
    // Add an additional check for undefined `recipe`
    if (!recipe) {
      return;
    }
    const { label, image, url, ingredients } = recipe;

    const li = document.createElement('li');
    const img = document.createElement('img');
    img.src = image;

    const div = document.createElement('div');
    div.innerHTML = `<h2><a href="${url}" target="_blank">${label}</a></h2><p>${ingredients ? ingredients.length : 'Unknown'} ingredients</p>`;

    li.appendChild(img);
    li.appendChild(div);

    document.getElementById('results').appendChild(li);
  });
}

function displayError(errorMessage) {
  const errorDiv = document.getElementById('error-message');
  errorDiv.innerHTML = errorMessage;
}
