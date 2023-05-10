export default class SortableTable {
  isSortLocally;
  element;

  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    this.data = data;
    this.sorted = sorted;
    this.headersConfig = headersConfig;

    if (sorted.id && sorted.order) {
      this.sortElements(sorted.id, sorted.order);
    }
    this.render();
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    const element = wrapper.firstElementChild;
    this.element = element;
    this.subElements = this.getSubElements(element);

    for (const column of this.subElements.header.children) {
      if (column.dataset.sortable === 'true') {
        column.onpointerdown = () => this.changeSort(column);
      }
      if (column.dataset.id === this.sorted.id) {
        column.dataset.order = this.sorted.order;
      }
    }
  }

  getTemplate() {
    return `
    <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.getTemplateHeader()}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this.getTemplateBody()}
        </div>
        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          <div>
            <p>No products satisfies your filter criteria</p>
            <button type="button" class="button-primary-outline">Reset all filters</button>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  getTemplateArrow() {
    return `<span data-element="arrow" class="sortable-table__sort-arrow">
    <span class="sort-arrow"></span>
  </span>`;
  }

  getTemplateHeader() {
    return this.headersConfig.map(({ id , title, sortable }) => {
      return (
      `<div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
        ${id === this.sorted.id && sortable && this.getTemplateArrow() || ''}
      </div>`);
    }).join('');
  }

  getTemplateBody() {
    return this.data.map((product) => {
      return `
        <a href="/products/${product.id}" class="sortable-table__row">
          ${this.headersConfig.map((column) => {
            return column.template ? column.template(product.images) : (`<div class="sortable-table__cell">${product[column.id]}</div>`);
          }).join('')}
        </a>
      `;
    }).join('');
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }

    return result;
  }

  changeSort(clickedColumn) {
    this.sorted = {
      id: clickedColumn.dataset.id,
      order: (clickedColumn.dataset.order && clickedColumn.dataset.order === 'asc') ? 'desc' : 'asc',
    };
    this.sort(this.sorted.id, this.sorted.order);
  }

  sort(fieldValue = '', orderValue = '') {
    this.sortElements(fieldValue, orderValue);
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${fieldValue}"]`);
    const prevArrow = this.element.querySelector('.sortable-table__sort-arrow');

    for (const column of this.subElements.header.children) {
      column.dataset.order = '';
    }

    prevArrow.outerHTML = '';
    currentColumn.dataset.order = orderValue;
    currentColumn.innerHTML = currentColumn.innerHTML + this.getTemplateArrow();

    this.subElements.body.innerHTML = this.getTemplateBody();
  }

  sortElements(fieldValue = '', orderValue = '') {
    const newData = [...this.data];
    const { sortType } = this.headersConfig.find(({ id }) => id === fieldValue);
    const order = {
      asc: 1,
      desc: -1,
    };

    newData.sort((a, b) => {
      const firstEl = a[fieldValue];
      const secondEl = b[fieldValue];

      switch(sortType) {
        case 'string': {
          let elem = firstEl.localeCompare(secondEl, ['ru', 'en']);
          return elem * order[orderValue];
        };
        case 'number': {
          return (firstEl - secondEl) * order[orderValue];
        };
        default: throw new Error(`Ошибка сортировки.
        Переданы следующие данные:
        направление сортировки - ${orderValue},
        колонка для сортировки - ${fieldValue}.`);
      }
    });

    this.data = newData;
  }

  destroy() {
    this.element = null;
    this.subElements = null;
  }
}
