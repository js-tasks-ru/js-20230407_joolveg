export default class SortableTable {
  element;
  subElements;

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.render();
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    const element = wrapper.firstElementChild;
    this.element = element;
    this.subElements = this.getSubElements(element);
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

  getTemplateHeader() {
    return this.headerConfig.map(({ id , title, sortable }) => {
      return (
      `<div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
      </div>`);
    }).join('');
  }

  getTemplateBody() {
    return this.data.map((product) => {
      return `
        <a href="/products/${product.id}" class="sortable-table__row">
          ${this.headerConfig.map((column) => {
            return column.template ? column.template(product[column.id]) : (`<div class="sortable-table__cell">${product[column.id]}</div>`);
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

  sort(fieldValue = '', orderValue = '') {
    const sortedData = this.sortElements(fieldValue, orderValue);
    const prevColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${fieldValue}"]`);

    for (const column of prevColumns) {
      column.dataset.order = '';
    }

    currentColumn.dataset.order = orderValue;

    this.data = sortedData;
    this.subElements.body.innerHTML = this.getTemplateBody();
  }

  sortElements(fieldValue = '', orderValue = '') {
    const newData = [...this.data];
    const { sortType } = this.headerConfig.find(({ id }) => id === fieldValue);
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

    return newData;
  }

  destroy() {
    this.element = null;
    this.subElements = null;
  }
}

