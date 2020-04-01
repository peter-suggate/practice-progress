import { map } from "fp-ts/lib/Either";
import {
  StoppedAudioRecorder,
  TransitioningAudioRecorder
} from "./AudioRecorder";
import { AudioAnalyzerNode } from "../AudioAnalyzerNode";
import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";

const getWebAudioMediaStream = async () =>
  globalThis.navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false
  });

export async function createAudioRecorder(
  getAudioMediaStream: () => Promise<MediaStream>
): Promise<StoppedAudioRecorder> {
  const context = new globalThis.AudioContext();

  try {
    const stream = await getAudioMediaStream();

    const audioSource = context.createMediaStreamSource(stream);

    const connectToAudioSource = (node: AudioAnalyzerNode) => {
      audioSource.connect(node.audioWorkletNode);
      return node;
    };

    const connectToDestination = (node: AudioAnalyzerNode) => {
      node.audioWorkletNode.connect(context.destination);
      return node;
    };

    const analyzerNode = await AudioAnalyzerNode.create(context);

    await context.suspend();

    pipe(analyzerNode, map(connectToAudioSource), map(connectToDestination));

    return {
      context,
      status: "stopped"
    };
  } catch (e) {
    throw e;
  }
}

export const createAudioRecorderTask = (
  getAudioMediaStream: () => Promise<MediaStream> = getWebAudioMediaStream
) =>
  TE.tryCatch(
    () => createAudioRecorder(getAudioMediaStream),
    e => e
  );

export async function beginCreateAudioRecorder(): Promise<
  TransitioningAudioRecorder
> {
  return {
    status: "starting"
  };
}

export const beginCreateAudioRecorderTask = () =>
  TE.tryCatch(
    () => beginCreateAudioRecorder(),
    e => e
  );
