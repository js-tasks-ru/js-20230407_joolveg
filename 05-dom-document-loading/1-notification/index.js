export default class NotificationMessage {
  timerId = null;
  static linkOnNotification = null;

  constructor(message = '', { duration = 0, type = ''} = {}) {
    this.type = type;
    this.duration = duration;
    this.message = message;
    this.render();
  }

  getTemplate() {
    return `
      <div class="notification ${this.type}" style="--value: ${this.duration / 1000}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper.firstElementChild;
  }

  show(root = document.body) {
    if (NotificationMessage.linkOnNotification) {
      NotificationMessage.linkOnNotification.remove();
    }

    root.append(this.element);

    this.timerId = setTimeout(() => this.remove(), this.duration);
    NotificationMessage.linkOnNotification = this;
  }

  remove() {
    clearTimeout(this.timerId);

    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    NotificationMessage.linkOnNotification = null;
  }
}
