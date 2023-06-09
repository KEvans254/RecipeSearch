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
    hits.forEach(hit => {
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
      div.innerHTML = `<h2><a href="${url}" target="_blank">${label}</a></h2><ul>${ingredients.map(ingredient => `<li>${ingredient.text}</li>`).join('')}</ul>`;

      li.appendChild(img);
      li.appendChild(div);

      results.appendChild(li);
    });
  }
}


function displayError(errorMessage) {
  const errorDiv = document.getElementById('error-message');
  errorDiv.innerHTML = errorMessage;
}
