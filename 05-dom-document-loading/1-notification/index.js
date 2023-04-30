export default class NotificationMessage {
  static timerId = null;
  constructor(message = '', { duration = 0, type = ''} = {}) {
    this.type = type;
    this.duration = duration;
    this.message = message;
    this.render();
  }

  getTemplate() {
    return `
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">${this.type}</div>
      <div class="notification-body">
        ${this.message}
      </div>
    </div>`;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.className = `notification ${this.type}`;
    wrapper.style = `--value: ${this.duration / 1000 }s`;
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper;
  }

  show(root) {
    if (NotificationMessage.timerId) {
      clearTimeout(NotificationMessage.timerId);
      NotificationMessage.timerId = null;
      this.destroy();
    }

    if (root) {
      root.innerHTML = this.element.outerHTML;
    }

    document.body.append(root ? root : this.element);
    NotificationMessage.timerId = setTimeout(() => this.remove(), this.duration);
  }

  destroy() {
    const element = document.body.getElementsByClassName('notification')[0];
    if (element) {element.remove();}
    this.remove();
  }

  remove() {
    this.element.remove();
  }
}
