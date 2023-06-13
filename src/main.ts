import { PlayerEntity } from './Player/PlayerEntity';
import { ResourceLoader } from './ResourceLoader';
import { MusicPlayer } from './MusicPlayer';
import { EntityPreview } from './Rendering/EntityPreview';
import { Game } from './Game';

let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

// const timeSpeedInput = document.getElementById('timeSpeedInput') as HTMLInputElement;
// let timeSpeed = 1;
// function setTimeSpeed(ts: number) {
//   document.getElementById('timeSpeedValue')!.innerText = ts.toString();
//   timeSpeed = ts;
//   timeSpeedInput.value = ts.toString();
// }
//
// timeSpeedInput!.oninput = (event: any) => {
//   setTimeSpeed(parseFloat(event.target.value));
//
// };
// timeSpeedInput.value = timeSpeed.toString();
// document.getElementById('resetTimeButton')!.onclick = () => {
//   setTimeSpeed(1);
// }

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
window.addEventListener('resize', () => {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// if (!MusicPlayer.getIsPlaying()) {
//   MusicPlayer.playMainTheme();
// }

(async () => {
  const loading = document.getElementById('resource-loader')!;
  const logs = loading.querySelector('.logs')!;
  let count = ResourceLoader.getResourceCount();
  let loaded = 0;
  ResourceLoader.emitter.subscribe('logs', ({ status, name }) => {
    if (status === 'loading') {
      logs.innerHTML += `<p data-name="${name}" style="line-height: 10%;"><span data-status style="font-family: monospace"> <span style="color: yellow">LOADING</span> </span>: ${name}</p>`;
      logs.scrollTo(0, logs.scrollHeight);
    }
    if (status === 'loaded') {
      loaded++;
      let percent = Math.floor((loaded / count) * 100);
      logs.querySelector(`[data-name="${name}"] [data-status]`)!.innerHTML = ` <span style="color: lime">DONE&nbsp;&nbsp;&nbsp;</span> `;
      loading.querySelector('[data-percent]')!.innerHTML = percent.toString();
    }
  });
  await ResourceLoader.loadGameAssets();
  loading.style.display = 'none';

  // const entityPreview = new EntityPreview(new PlayerEntity(0, 0));
  // entityPreview.mount('select-hero')

  const game = new Game(
    canvas,
  );

  const state = document.getElementById('state')!;
  const startButton = document.getElementById('start')!;
  const stopButton = document.getElementById('stop')!;

  state.innerText = 'started';
  startButton.onclick = async function () {
    // entityPreview.destroy();
    state.innerText = 'started';
    state.style.color = '#22ff00';

    game.setUp();
    MusicPlayer.playMainTheme();

    game.run();
    document.getElementById('start-stop-buttons')!.style.top = '0px';
    document.getElementById('start-stop-buttons')!.style.right = '0px';
    startButton.classList.add('none');
    // stopButton.classList.remove('none');
    document.getElementById('quests')!.classList.remove('none');
    document.getElementById('mobile-controls')!.classList.remove('none');
    document.getElementById('heroes')!.classList.add('none');
  }
  stopButton.onclick = function () {
    state.innerText = 'stopped';
    state.style.color = '#ff0000';
    MusicPlayer.pause();
    game.stop();
    startButton.classList.remove('none');
    stopButton.classList.add('none');
  }
  state.innerText = 'stopped';
  state.style.color = '#ff0000';
})();
