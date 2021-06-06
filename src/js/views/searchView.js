class SearchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this.clearSearchInput();
    return query;
  }

  clearSearchInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  // Publisher(subscriber) - Design Pattern
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
