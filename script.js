const appId = '7cc1191d';
const appKey = '408b5ba93e0d384e5fd58fcbcd65f649';

const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', searchRecipes);

function searchRecipes() {
  const query = document.getElementById('query').value.trim();
  const includeIngredients = document.getElementById('includeIngredients').value.trim();
  const excludeIngredients = document.getElementById('excludeIngredients').value.trim();
  const diet = document.getElementById('diet').value.trim();
  const cuisineType = document.getElementById('cuisineType').value.trim();

  let apiUrl = `https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${appKey}`;

  if (includeIngredients) {
    apiUrl += `&ingr=${includeIngredients}`;
  }

  if (excludeIngredients) {
    apiUrl += `&excluded=${excludeIngredients}`;
  }

  if (diet) {
    apiUrl += `&diet=${diet}`;
  }

  if (cuisineType) {
    apiUrl += `&cuisineType=${cuisineType}`;
  }

  if (!query) {
    const errorMessage = 'Please enter a search term.';
    displayError(errorMessage);
    return;
  }

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.hits.length === 0) {
        const errorMessage = 'No results found. Please try another search.';
        displayError(errorMessage);
      } else {
        displayResults(data.hits);
      }
    })
    .catch(error => {
      const errorMessage = 'An error occurred while fetching the data.';
      displayError(errorMessage);
      console.error(error);
    });
}

function displayResults(hits) {
  const results = document.getElementById('results');
  results.innerHTML = '';

  hits.forEach(hit => {
    const { recipe } = hit;
    const { label, image, url, ingredients } = recipe;

    const li = document.createElement('li');
    const img = document.createElement('img');
    img.src = image;

    const div = document.createElement('div');
    div.innerHTML = `<h2><a href="${url}" target="_blank">${label}</a></h2><p>${ingredients.length} ingredients</p>`;

    li.appendChild(img);
    li.appendChild(div);

    results.appendChild(li);
  });
}

function displayError(errorMessage) {
  const results = document.getElementById('results');
  results.innerHTML = '';

  const errorDiv = document.getElementById('error-message');
  errorDiv.innerHTML = errorMessage;
}
