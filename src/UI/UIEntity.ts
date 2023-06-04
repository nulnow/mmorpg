import { Entity } from '../Entity';
import { UnsubscribeFn } from '../EventEmitter';

export class UIEntity extends Entity {
  private ui = document.getElementById('ui') as HTMLElement;
  private openModals: string[] = [];

  public showModal({ title, body }: { title: string, body: string }): UnsubscribeFn {
    const id = this.createModalId();
    const modal = this.createModal();
    const titleElem = modal.querySelector('.modal__title') as HTMLElement;
    const bodyElem = modal.querySelector('.modal__body') as HTMLElement;
    const okButtonElem = modal.querySelector('.modal__okButton') as HTMLElement;

    titleElem.innerHTML = title;
    bodyElem.innerHTML = body;

    this.openModals.push(id);
    this.ui.appendChild(modal);

    const close = () => {
      const prevLength = this.openModals.length;
      this.openModals = this.openModals.filter(modalId => modalId !== id);
      const newLength = this.openModals.length;
      if (prevLength !== newLength) {
        this.ui.removeChild(modal);
      }
    }

    okButtonElem.onclick = close;

    return close;
  }

  private createModal(): HTMLElement {
    const div = document.createElement('div');
    div.classList.add('modal');

    const title = document.createElement('h1');
    title.classList.add('modal__title');
    div.appendChild(title);

    const body = document.createElement('p');
    body.classList.add('modal__body');
    div.appendChild(body);

    const okButton = document.createElement('div');
    okButton.innerText = 'ok';
    okButton.classList.add('modal__okButton');
    okButton.innerHTML = `
<button id="start" class="button">
                    <div class="plate"></div>
                    <div class="plate"></div>
                    <div class="plate"></div>
                    <div class="plate"></div>
                    <div class="plate"></div>
                    <div class="button__wrapper">
                        <span class="button__text">OK</span>
                    </div>
                    <div class="button__box">
                        <div class="inner inner__top"></div>
                        <div class="inner inner__front"></div>
                        <div class="inner inner__bottom"></div>
                        <div class="inner inner__back"></div>
                        <div class="inner inner__left"></div>
                        <div class="inner inner__right"></div>
                    </div>
                </button>
    `;
    div.appendChild(okButton);

    return div;
  }

  private createModalId(): string {
    return 'modal_id_' + Math.random().toString().replace('.', '');
  }
}
