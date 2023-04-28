export default class ColumnChart {
  chartHeight = 50;
  constructor ({ data = [], label = '', value = 0, link = '', formatHeading = data => data} = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;

    this.render();
  }

  getTemplate () {
    const linkTemplate = this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';

    return `
      <div class="column-chart__title">
        Total ${this.label}
        ${this.link ? linkTemplate : ''}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">
          ${this.formatHeading(this.value)}
        </div>
        <div data-element="body" class="column-chart__chart">
          ${this.getColumnChartBody()}
        </div>
      </div>
    `;
  }

  render () {
    const wrapper = document.createElement('div');
    wrapper.className = this.data?.length ? 'column-chart' : 'column-chart column-chart_loading';
    wrapper.style = '--chart-height: 50';
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper;
  }

  getColumnChartBody () {
    const maxValue = Math.max(...this.data);
    const scale = 50 / maxValue;

    return this.data.map((item) => {
      const percent = `${((item / maxValue) * 100).toFixed(0)}%`;

      return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}"></div>`;
    }).join('');
  }

  update () {}

  destroy () {}

  remove () {
    this.element.remove();
  }
}
