class Tooltip {
  static instance;
  element;

  constructor() {
    if (!Tooltip.instance) {
      Tooltip.instance = this;
    } else {
      return Tooltip.instance;
    }
  }

  render(template = '') {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="tooltip">${template}</div>`;
    this.element = wrapper.firstElementChild;
    document.body.append(this.element);
  }

  initialize() {
    document.addEventListener('pointerover', (e) => {
      if (e.target.dataset.tooltip) {
        this.render(e.target.dataset.tooltip);
      }
    });

    document.addEventListener('pointerout', () => {
      this.destroy();
    });
  }

  destroy() {
    document.querySelector('.tooltip')?.remove();
    this.element = null;
  }
}

export default Tooltip;
