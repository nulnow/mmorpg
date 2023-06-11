// import mainTheme from '../assets/Main Theme.mp3';
import mainTheme from '../assets/ruapporangespace_Aim_To_Head_-_EMPeror_71070745.mp3';
import swordAttack from '../assets/Sword Whooshes Medium - QuickSounds.com.mp3';
import steps from '../assets/sneaker-shoe-on-concrete-floor-fast-pace-1-www.FesliyanStudios.com.mp3';

import evilSlime from '../assets/evil-slime.mp3';
import neutralSlime from '../assets/neutral-slime.mp3';
import movingSlime from '../assets/moving-slime.mp3';

import fireBall from '../assets/Fireball.mp3';
import fire from '../assets/fire.mp3';
import fireballExplosion from '../assets/FireballExplosion.mp3';

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
    this.currentTrack = this.createAudio(mainTheme, { loop: true, volume: 0.04 });
    this.play();
  }

  public static playSteps() {
    if (this.getIsStepsPlaying()) {
      return;
    }
    this.steps = this.createAudio(steps, { loop: true, volume: 0.3 });
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
    const zap = this.createAudio(swordAttack, { loop: false, volume: 0.04 });
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

  public static createPlayer(src: string, options: any): MusicPlayer {
    return new MusicPlayer(this.createAudio(src, options));
  }

  public static createSlimeMovingPlayer(): MusicPlayer {
    return this.createPlayer(movingSlime, { loop: true, volume: 0.001 });
  }

  public static createEvilSlimePlayer(): MusicPlayer {
    return this.createPlayer(evilSlime, { loop: true, volume: 0.002 });
  }

  public static createNeutralSlimePlayer(): MusicPlayer {
    return this.createPlayer(neutralSlime, { loop: true, volume: 0.001 });
  }

  public static createFireBallPlayer(): MusicPlayer {
    return this.createPlayer(fireBall, { loop: false, volume: 0.1 });
  }

  public static createFirePlayer(): MusicPlayer {
    return this.createPlayer(fire, { loop: true, volume: 0.1, maxTimeSEC: 10 });
  }

  public static createFireballExplosionPlayer(): MusicPlayer {
    return this.createPlayer(fireballExplosion, { loop: false, volume: 0.1 });
  }

  private audio: HTMLAudioElement;
  private isPlaying: boolean = false;
  private constructor(audio: HTMLAudioElement) {
    this.audio = audio;
  }

  public play(): void {
    if (this.isPlaying) {
      return;
    }
    this.audio.play().then(() => {
      this.isPlaying = true;
    });
  }
  public pause(): void {
    if (!this.isPlaying) {
      return;
    }
    this.audio.pause();
    this.isPlaying = false;
  }
  public setVolume(volume: number): void {
    this.audio.volume = volume;
  }
  public tuneSoundByDistance(distance: number): void {
    const MAX_DISTANCE = 400;
    if (distance > MAX_DISTANCE) {
      this.setVolume(0);
    } else {
      const MAX_VOLUME = 0.3;
      const volume = MAX_VOLUME - (distance / MAX_DISTANCE) * MAX_VOLUME;
      this.setVolume(volume);
    }
  }
}
