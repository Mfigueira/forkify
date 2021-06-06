import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const curPage = this._data.page;
    const totPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const btnPrev = `
      <button
        class="btn--inline pagination__btn--prev"
        data-goto="${curPage - 1}"
      >
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
    `;
    const btnNext = `
      <button
        class="btn--inline pagination__btn--next"
        data-goto="${curPage + 1}"
      >
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;
    if (curPage === 1 && totPages > 1) return btnNext;
    if (curPage === totPages && totPages > 1) return btnPrev;
    if (curPage < totPages) return btnPrev + btnNext;
    return '';
  }

  // Publisher(subscriber) - Design Pattern
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = Number(btn.dataset.goto);
      handler(goToPage);
    });
  }
}

export default new PaginationView();
