import { AudioWorklet } from "./AudioWorklet";

type AudioContextState = "closed" | "running" | "suspended";

export default class AudioContext {
  audioWorklet = new AudioWorklet();

  constructor() {}

  createMediaStreamSource() {
    return new MediaStreamSource();
  }

  state: AudioContextState = "closed";

  async suspend() {
    this.state = "suspended";
  }
  async resume() {
    this.state = "running";
  }
}

export class MediaStreamSource {
  connect() {}
}

(globalThis as any).AudioContext = AudioContext;
