import mainTheme from '../assets/Main Theme.mp3';
import swordAttack from '../assets/Sword Whooshes Medium - QuickSounds.com.mp3';
import steps from '../assets/sneaker-shoe-on-concrete-floor-fast-pace-1-www.FesliyanStudios.com.mp3';

export class MusicPlayer {
  private static currentTrack: HTMLAudioElement;
  private static steps: HTMLAudioElement;
  private static isStepsPlaying = false;
  public static getIsStepsPlaying(): boolean {
    return this.isStepsPlaying;
  }

  private static isPlaying = false;
  public static getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public static playMainTheme() {
    this.currentTrack = this.createAudio(mainTheme, { loop: true, volume: 0.06 });
    this.play();
  }

  public static playSteps() {
    if (this.getIsStepsPlaying()) {
      return;
    }
    this.steps = this.createAudio(steps, { loop: true, volume: 0.5 });
    this.steps.play()
  }

  public static pausePlayingSteps() {
    if (!this.steps) {
      console.error('steps is not loaded. cannot play');
      return;
    }
    this.steps.pause()
  }

  public static playAttackOnce() {
    const zap = this.createAudio(swordAttack, { loop: false, volume: 0.06 });
    zap.addEventListener("timeupdate", function() {
      const currentTime = zap.currentTime;
      // const duration = zap.duration;
      if (currentTime > 1) {
        zap.pause();
      }
    });
    zap.play();
  }

  public static pause() {
    if (!this.currentTrack) {
      console.error('Trying to call pause when there is no currentTrack!');
      return;
    }
    if (!this.isPlaying) {
      return;
    }
    this.isPlaying = false;
    this.currentTrack.pause();
  }

  public static play() {
    if (!this.currentTrack) {
      console.error('Trying to call play when there is no currentTrack!');
      return;
    }
    if (this.isPlaying) {
      return;
    }
    this.isPlaying = true;
    this.currentTrack.play()
  }

  public static createAudio(src: string, options: any) {
    const audio = document.createElement('audio');
    audio.volume = options.volume || 0.5;
    audio.loop   = options.loop;
    audio.src    = src;
    return audio;
  }
}
