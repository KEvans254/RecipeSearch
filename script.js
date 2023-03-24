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
  const query = document.getElementById('query').value.trim(); // remove leading/trailing whitespace
  const excludeIngredients = document.getElementById('excludeIngredients').value.trim();
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

  // Validate excludeIngredients input
  if (excludeIngredients && !/^[A-Za-z ]+$/.test(excludeIngredients)) {
    displayError('Exclude ingredients should only contain letters and spaces');
    return;
  }

  // Build API URL
  let apiUrl = `https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${appKey}`;

  if (excludeIngredients) {
    apiUrl += `&excluded=${excludeIngredients}`;
  }

  if (diet) {
    apiUrl += `&diet=${diet}`;
  }

  if (cuisineType) {
    apiUrl += `&cuisineType=${cuisineType}`;
  }

  // Reset current page and current results
  currentPage = 0;
  currentResults = [];

  // Fetch initial results
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
  // Increment current page
  currentPage++;

  // Calculate start and end indexes of next page of results
  const startIndex = currentPage * resultsPerPage;
  const endIndex = (currentPage + 1) * resultsPerPage;

  // Check if there are more results to display
  if (startIndex >= currentResults.length) {
    loadMoreBtn.style.display = 'none';
    return;
  }

  // Slice current results to get next page of results
  const nextResults = currentResults.slice(startIndex, endIndex);

  // Display next page of results
  displayResults(nextResults);
}

function displayResults(results) {
  // If current page is 0, clear the results list
  if (currentPage === 0) {
    resultsList.innerHTML = '';
  }

  // Loop through results and create HTML elements to display each result
  results.forEach(result => {
    const { recipe } = result;
    if (!recipe) {
      return;
    }

    const { label, image, url, ingredients } = recipe;

    const li = document.createElement('li');
    const img = document.createElement('img');
    img.src = image;

    const h3 = document.createElement('h3');
    const a = document.createElement('a');
    a.href = ${url};
    a.target = '_blank';
    a.innerText = label;
    const ul = document.createElement('ul');
ingredients.forEach(ingredient => {
  const li = document.createElement('li');
  li.innerText = ingredient.text;
  ul.appendChild(li);
});

li.appendChild(img);
li.appendChild(h3);
h3.appendChild(a);
li.appendChild(ul);

resultsList.appendChild(li);

    });
}

function displayError(message) {
const errorDiv = document.getElementById('error-message');
errorDiv.innerHTML = message;
resultsList.innerHTML = '';
loadMoreBtn.style.display = 'none';
}
