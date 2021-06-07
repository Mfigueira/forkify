// Babel Polyfills
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// App imports
import { MODAL_CLOSE_SEC } from './config.js';
import * as model from './model.js';
import RecipeView from './views/RecipeView.js';
import SearchView from './views/SearchView.js';
import ResultsView from './views/ResultsView.js';
import PaginationView from './views/PaginationView.js';
import BookmarksView from './views/BookmarksView.js';
import AddRecipeView from './views/AddRecipeView.js';

const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    RecipeView.renderSpinner();
    ResultsView.update(model.getSearchResultsPage());
    BookmarksView.update(model.state.bookmarks);
    await model.loadRecipe(id);
    RecipeView.render(model.state.recipe);
  } catch (err) {
    RecipeView.renderErrorMessage();
    console.error(`${err} 💥💥💥`);
  }
};

const controlSearchResults = async () => {
  try {
    const query = SearchView.getQuery();
    if (!query) return;
    ResultsView.renderSpinner();
    await model.loadSearchResults(query);
    ResultsView.render(model.getSearchResultsPage());
    PaginationView.render(model.state.search);
  } catch (err) {
    console.error(`${err} 💥💥💥`);
  }
};

const controlPagination = goToPage => {
  ResultsView.render(model.getSearchResultsPage(goToPage));
  PaginationView.render(model.state.search);
};

const controlServings = newServings => {
  model.updateServings(newServings);
  RecipeView.update(model.state.recipe);
};

const controlAddBookmark = () => {
  model.state.recipe.bookmarked
    ? model.deleteBookmark(model.state.recipe.id)
    : model.addBookmark(model.state.recipe);
  RecipeView.update(model.state.recipe);
  BookmarksView.render(model.state.bookmarks);
};

const controlRenderBookmarks = () => {
  BookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async newRecipe => {
  try {
    AddRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    RecipeView.render(model.state.recipe);
    AddRecipeView.renderSuccessMessage();
    BookmarksView.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(() => {
      AddRecipeView.toggleModal();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    AddRecipeView.renderErrorMessage(err.message);
  }
};

const init = () => {
  AddRecipeView.addHandlerToggleModal();
  AddRecipeView.addHandlerUploadRecipe(controlAddRecipe);
  BookmarksView.addHandlerRender(controlRenderBookmarks);
  RecipeView.addHandlerRender(controlRecipes);
  RecipeView.addHandlerUpdateServings(controlServings);
  RecipeView.addHandlerBookmark(controlAddBookmark);
  SearchView.addHandlerSearch(controlSearchResults);
  PaginationView.addHandlerClick(controlPagination);
};
init();
