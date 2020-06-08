import { AudioRecorder, StoppedAudioRecorder } from "./AudioRecorder";
import { AudioAnalyzerNode } from "../AudioAnalyzerNode";
import { pipe } from "fp-ts/lib/pipeable";
import {
  taskRight,
  taskFromAsync,
  chainTask,
  tapTask,
  mapTask,
} from "../../fp-util";

const getWebAudioMediaStream = async () =>
  globalThis.navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });

const createContextSuspended = (
  context: AudioContext,
  analyzerNode: AudioAnalyzerNode,
  mediaStream: MediaStream
): StoppedAudioRecorder & { context: AudioContext } => {
  const audioSource = context.createMediaStreamSource(mediaStream);

  const connectToAudioSource = (node: AudioAnalyzerNode) => {
    audioSource.connect(node.audioWorkletNode);
    return node;
  };

  const connectToDestination = (node: AudioAnalyzerNode) => {
    node.audioWorkletNode.connect(context.destination);
    return node;
  };

  return pipe(analyzerNode, connectToAudioSource, connectToDestination, () => ({
    type: "stopped",
    context,
  }));
};

type Options = {
  getAudioMediaStream: () => Promise<MediaStream>;
  onStatusChange: (state: AudioRecorder) => void;
};

export const createAudioRecorderTask = (optionsIn: Partial<Options>) => {
  const options = {
    getAudioMediaStream: getWebAudioMediaStream,
    onStatusChange: () => {},
    ...optionsIn,
  };

  return pipe(
    taskRight<Error, AudioRecorder>({
      type: "starting",
      message: "Connecting to media",
    }),
    tapTask(options.onStatusChange),

    chainTask(() => taskFromAsync(options.getAudioMediaStream)),
    mapTask((stream) => ({ stream })),

    mapTask(({ ...rest }) => ({
      context: new globalThis.AudioContext(),
      ...rest,
    })),

    tapTask(() =>
      options.onStatusChange({
        type: "starting",
        message: "Fetching and compiling analysis modules",
      })
    ),

    chainTask(({ context, ...rest }) =>
      pipe(
        AudioAnalyzerNode.create(context),
        mapTask((node) => ({
          node,
          context,
          ...rest,
        }))
      )
    ),

    mapTask(({ context, node, stream }) =>
      createContextSuspended(context, node, stream)
    ),

    tapTask(
      ({ context }) =>
        options.onStatusChange({
          type: "running",
          context,
        }),
      (error) =>
        options.onStatusChange({
          type: "error",
          message: error.message,
        })
    )

    // mapTaskFromAsyncWith(options.getAudioMediaStream, (stream) => ({ stream })),
    // mapTask((stream) => ({ stream })),

    // mapTaskWith(
    //   () => new globalThis.AudioContext(),
    //   (context) => ({ context })
    // ),

    // mapTask(({ ...rest }) => ({
    //   context: new globalThis.AudioContext(),
    //   ...rest,
    // }))

    // mapTaskFromAsyncWith(({ context }) => await createAnalyzerNode(context), (node) => ({ node }))
    // chainTask(({ context, ...rest }) =>
    //   taskFromAsync(async () => ({
    //     ...rest,
    //     node: await createAnalyzerNode(context),
    //   }))
    // )
    // chainTask(({ context, node }) => taskFromAsync(() => createContextSuspended(stream)))
  );
};
