const appId = '7cc1191d';
const appKey = '408b5ba93e0d384e5fd58fcbcd65f649';

const searchBtn = document.getElementById('search-button');
searchBtn.addEventListener('click', searchRecipes);

let currentPage = 0;
const resultsPerPage = 10;
let currentResults = [];

const resultsList = document.getElementById('results');
const loadMoreBtn = document.getElementById('load-more');

loadMoreBtn.addEventListener('click', loadMoreResults);

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

  currentPage = 0;
  currentResults = [];

  fetchResults(apiUrl);
}

function fetchResults(apiUrl) {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      currentResults = data.hits;
      displayResults(currentResults.slice(0, resultsPerPage));
      if (currentResults.length > resultsPerPage) {
        loadMoreBtn.style.display = 'block';
      } else {
        loadMoreBtn.style.display = 'none';
      }
    })
    .catch(error => displayError(error));
}

function loadMoreResults() {
  currentPage++;
  const startIndex = currentPage * resultsPerPage;
  const endIndex = (currentPage + 1) * resultsPerPage;
  const nextResults = currentResults.slice(startIndex, endIndex);
  displayResults(nextResults);
}

function displayResults(results) {
  if (currentPage === 0) {
    resultsList.innerHTML = '';
  }

  results.forEach(result => {
    const { recipe } = result;
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

    resultsList.appendChild(li);
  });
}

function displayError(errorMessage) {
  const errorDiv = document.getElementById('error-message');
  errorDiv.innerHTML = errorMessage;
  resultsList.innerHTML = '';
  loadMoreBtn.style.display = 'none';
}
