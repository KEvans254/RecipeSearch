const APP_ID = '7cc1191d';
const APP_KEY = '408b5ba93e0d384e5fd58fcbcd65f649';
const searchForm = document.querySelector('form');
const searchButton = document.querySelector('#search-button');
const loadMoreButton = document.querySelector('#load-more');
const resultsList = document.querySelector('#results');
const errorMessage = document.querySelector('#error-message');
let searchStart = 0;
let searchEnd = 12;

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  searchStart = 0;
  searchEnd = 12;
  resultsList.innerHTML = '';
  errorMessage.innerHTML = '';
  const query = document.querySelector('#query').value;
  const excludeIngredients = document.querySelector('#excludeIngredients').value;
  const diet = document.querySelector('#diet').value;
  const cuisineType = document.querySelector('#cuisineType').value;
  if (!query) {
    errorMessage.innerHTML = '<p>Please enter a search query.</p>';
  } else {
    searchRecipes(query, excludeIngredients, diet, cuisineType, searchStart, searchEnd);
    loadMoreButton.style.display = 'inline';
  }
});

loadMoreButton.addEventListener('click', () => {
  searchStart += 12;
  searchEnd += 12;
  const query = document.querySelector('#query').value;
  const excludeIngredients = document.querySelector('#excludeIngredients').value;
  const diet = document.querySelector('#diet').value;
  const cuisineType = document.querySelector('#cuisineType').value;
  searchRecipes(query, excludeIngredients, diet, cuisineType, searchStart, searchEnd);
});

async function searchRecipes(query, excludeIngredients, diet, cuisineType, from, to) {
  let url = `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}&excluded=${excludeIngredients}&diet=${diet}&cuisineType=${cuisineType}&from=${from}&to=${to}`;
  const response = await fetch(url);
  if (response.ok) {
    const data = await response.json();
    if (data.hits.length === 0) {
      errorMessage.innerHTML = '<p>No results found. Please try another search query.</p>';
    } else {
      data.hits.forEach(hit => {
        const recipe = hit.recipe;
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = recipe.url;
        link.textContent = recipe.label;
        listItem.appendChild(link);
        resultsList.appendChild(listItem);
      });
    }
  } else {
    errorMessage.innerHTML = '<p>Something went wrong. Please try again later.</p>';
  }
}
