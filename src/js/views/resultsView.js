import View from './view.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipies found. Please search again :)';
  _successMessage = '';

  _generateMarkup() {
    return this._data
      .map(
        res =>
          `<li class="preview">
            <a class="preview__link" href="#${res.id}">
              <figure class="preview__fig">
                <img src="${res.image_url}" alt="${res.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${res.title}</h4>
                <p class="preview__publisher">${res.publisher}</p>
              </div>
            </a>
          </li>`
      )
      .join('');
  }
}

export default new ResultsView();
