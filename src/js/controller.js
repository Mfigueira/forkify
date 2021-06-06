// Babel Polyfills
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// App imports
import * as model from './model.js';
import recipeView from './views/RecipeView.js';
import searchView from './views/SearchView.js';
import resultsView from './views/ResultsView.js';
import paginationView from './views/PaginationView.js';
import bookmarksView from './views/BookmarksView.js';

// Parcel hot module replacement
if (module.hot) module.hot.accept();

const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderErrorMessage();
    console.error(`${err} 💥💥💥`);
  }
};

const controlSearchResults = async () => {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();
    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = goToPage => {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = newServings => {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = () => {
  model.state.recipe.bookmarked
    ? model.deleteBookmark(model.state.recipe.id)
    : model.addBookmark(model.state.recipe);
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

const controlRenderBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};

const init = () => {
  bookmarksView.addHandlerRender(controlRenderBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
