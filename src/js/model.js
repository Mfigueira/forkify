import { API_URL, RES_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export const loadRecipe = async id => {
  try {
    const {
      data: { recipe },
    } = await getJSON(`${API_URL}${id}`);
    state.recipe = recipe;

    state.recipe.bookmarked = state.bookmarks.some(book => book.id === id)
      ? true
      : false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async query => {
  try {
    state.search.query = query;
    const {
      data: { recipes },
    } = await getJSON(`${API_URL}?search=${query}`);
    state.search.results = recipes;
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = (page = state.search.page) => {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = newServings => {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = () =>
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));

export const addBookmark = recipe => {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = id => {
  const index = state.bookmarks.findIndex(book => book.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const init = () => {
  const bookmarks = localStorage.getItem('bookmarks');
  console.log(bookmarks);
  if (bookmarks) state.bookmarks = JSON.parse(bookmarks);
};
init();
