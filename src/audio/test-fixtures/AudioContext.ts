import { AudioWorklet } from "./AudioWorklet";

export default class AudioContext {
  audioWorklet = new AudioWorklet();

  constructor() {}

  createMediaStreamSource() {
    return new MediaStreamSource();
  }

  async suspend() {}
  async resume() {}
}

export class MediaStreamSource {
  connect() {}
}

(globalThis as any).AudioContext = AudioContext;
