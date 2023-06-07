import { Entity } from '../Entity';
import { UnsubscribeFn } from '../EventEmitter';

export class UIEntity extends Entity {
  private ui = document.getElementById('ui') as HTMLElement;
  private openModals: string[] = [];
  private quests: { id: string, text: string, done?: boolean, onClick?: () => void }[] = [];

  public addQuest(id: string, text: string, onClick?: () => void): void {
    this.quests.push({id, text, onClick});
    this.renderQuests();
  }

  public markQuestDone(id: string): void {
    this.quests.find(q => q.id === id)!.done = true;
    this.renderQuests();
  }

  public renderQuests() {
    this.ui.querySelector('#quests .quests__list')!.innerHTML = this.quests.map(quest => {
      return `
        <div data-quest-id="${quest.id}" class="quest-list-item ${quest.done ? 'quest-list-item--done' : ''}"><p>${quest.text}</p></div>
      `;
    }).join('');
    this.quests.forEach(quest => {
      const questId = quest.id;
      if (!quest.done) {
        (this.ui.querySelector(`[data-quest-id="${questId}"]`) as HTMLDivElement)!.onclick = quest.onClick ?? null;
      }
    })
  }

  public showModal({ title, body, updater, onClose }: { title: string, body: string, updater?: (modal: HTMLElement) => void, onClose?: () => void }): UnsubscribeFn {
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

      onClose?.();
    }

    okButtonElem.onclick = close;

    if (updater) {
      updater(modal);
    }

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
    okButton.innerHTML = `<button id="start" style="width: 100%; height: 35px" class="gameButton">OK</button>`;
    div.appendChild(okButton);

    return div;
  }

  private createModalId(): string {
    return 'modal_id_' + Math.random().toString().replace('.', '');
  }
}
