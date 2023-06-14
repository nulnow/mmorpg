export class Chat {
  private static getStyles(): string {
    return (
      `
        <style>
         .chat {
            position: fixed;
            bottom: 10px;
            left: 10px;
            width: 450px;
            height: 270px;
            
            /* TODO move to common styles */
            background-color: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(4px);
            color: white;
            
            /*border: 1px solid gray;*/
            border-radius: 8px;
            overflow: hidden;
            opacity: 0.6;
            transition: 0.2s ease-in-out;
          }
          .chat.focus,
           .chat:hover {
            opacity: 1;
          }
          .chat__messages {
            overflow-y: scroll;
            max-height: 80%;
            font-size: 13px;
            font-weight: 300;
          }
          .chat__input-wrapper {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 50px;
            padding: 10px;
          }
          .chat input {
            width: 100%;
            height: 100%;
            background-color: transparent;
            color: #d3d3d3;
            border: 1px solid rgba(94,94,94,0.65);
            border-radius: 4px;
          }
          .chat input:focus {
            outline: 1px solid crimson;
          }
          .chat__message {
            padding: 5px 10px;
            border-bottom: 1px solid rgba(128,128,128,0.38);
            color: #d3d3d3;
          }
          .chat__player-name {
            font-weight: bold;
            color: #0065d9;
          }
        </style>
      `
    )
  }

  private static render(): string {
    return (
      `
        ${Chat.getStyles()}
        <div class="chat" id="chat">
            <div class="chat__messages">
                
            </div>
            <div class="chat__input-wrapper">
                <input type="text">
            </div>
        </div>
      `
    );
  }

  private chatDiv: HTMLDivElement;
  private messagesDiv: HTMLDivElement;
  private input: HTMLInputElement;

  public constructor(private ui: HTMLDivElement) {
    this.ui.innerHTML += Chat.render();
    this.chatDiv = this.ui.querySelector('#chat')!;
    this.messagesDiv = this.chatDiv.querySelector('.chat__messages')!;
    this.input = this.chatDiv.querySelector('input')!;

    this.input.addEventListener('keypress', (event) => {
      if (event.key === "Enter") {
        const text = this.input.value;
        this.messagesDiv.innerHTML += (
          `
            <div class="chat__message"><span class="chat__player-name">Player</span>: ${text}</div>
          `
        );

        this.input.value = '';

        this.messagesDiv.scrollTo(0, this.messagesDiv.scrollHeight);
      }
    });
    this.input.addEventListener('keyup', (event) => {
      if (event.key === 'Escape') {
        this.input.blur();
      }
    });
    this.input.addEventListener('focus', () => {
      this.chatDiv.classList.add('focus');
    });
    this.input.addEventListener('blur', () => {
      this.chatDiv.classList.remove('focus');
    });
    this.input.addEventListener('keydown', event => {
      event.stopPropagation();
    })
  }
}
