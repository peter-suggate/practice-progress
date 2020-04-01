import { PracticeProgressVM } from "../PracticeProgressVM";
import { isNone, isSome, getOrElse } from "fp-ts/lib/Option";
import { AudioRecorder } from "../../audio/audio-recording/AudioRecorder";
import { requireSome } from "../../testing/fp-testing";

it("initially has empty audio recorder", () => {
  const vm = new PracticeProgressVM();

  expect(isNone(vm.recorder)).toBeTruthy();
});

test("creating recorder and starting updates the state if successful", async () => {
  const vm = new PracticeProgressVM();

  await vm.createRecorderAndStart();

  expect(isSome(vm.recorder)).toBeTruthy();
});

xtest("reports isRecording correctly", async () => {
  const vm = new PracticeProgressVM();

  await vm.createRecorderAndStart();

  expect(vm.recorderState).toBe("running");

  await vm.toggleRecording();
  expect(vm.recorderState).toBe("stopped");
});

xtest("can toggle recording off once started", async () => {
  const vm = new PracticeProgressVM();

  await vm.createRecorderAndStart();

  await vm.toggleRecording();

  expect(vm.recorderState).toBe("stopped");

  await vm.toggleRecording();

  expect(vm.recorderState).toBe("running");
});

// import * as TE from "fp-ts/lib/TaskEither";
// import * as T from "fp-ts/lib/Task";
// import { pipe } from "fp-ts/lib/pipeable";
// import { array } from "fp-ts/lib/Array";
// import * as IO from "fp-ts/lib/IO";
// import { right } from "fp-ts/lib/Either";
// import { flow } from "fp-ts/lib/function";

// test("wtf", async () => {
//   // const initial = (a: number) => TE.taskEither.of<Error, number>(a);
//   const initial = (a: number) => TE.right(a);
//   const add1 = (a: number) => TE.right(a + 1);
//   const add2 = (a: number) => TE.right(a + 2);
//   // const names = ["Gcanti", "AlexRex"];

//   // const getName = (name: string) => right(name);
//   // const doubleName = (name: string) => right(`${name}${name}`);

//   // const getName = () => async (name: string) => TE.right(name);
//   // const getName = TE.taskEitherSeq.of(async (name: string) => right(name));
//   // const doubleName = () => async (name: string) => TE.right(`${name}${name}`);
//   // const getName: T.Task<string> = async () => "tom";
//   // const doubleName = T.of(async (name: string) => `${name}${name}`);

//   // const waitAndSayName = (name: string) => {
//   //   return T.fromIO(IO.of(getName));
//   // };

//   // // sequential
//   // const result = await pipe(
//   //   array.sequence(T.taskSeq)([
//   //     waitAndSayName(names[0]),
//   //     waitAndSayName(names[1])
//   //   ])()
//   // );

//   const tasks = pipe(
//     // 5,
//     initial(5),
//     TE.chain<Error, number, number>(add1),
//     TE.chain<Error, number, number>(add2)
//     // T.chain(add1)
//     // TE.chain(doubleName)
//     // flow(getName, TE.fromEither),
//     // doubleName
//   );

//   const result = tasks;

//   // const program: T.Task<void> = pipe(
//   //   tasks("frank")
//   //   // T.chain(doSomethingElseWithYourConfig),
//   //   // getting rid of `Either` by using `getOrElse` or `fold`
//   //   // TE.getOrElse(e => {
//   //   //   // error handling (putting it to the console, sending to sentry.io, whatever is needed for you app)
//   //   //   // ...
//   //   //   return T.of(undefined);
//   //   // })
//   // );

//   // const program = pipe(
//   //   tasks,
//   //   // TE.getOrElse(e => TE.taskEitherSeq.of(""))
//   // );

//   // const result = await tasks("fred");

//   console.log(await result());
// });

// test("wtf async", async () => {
//   const padd0 = async (a: number) => a + 0;
//   const padd1 = async (a: number) => a + 1;

//   const add0 = (a: number) =>
//     TE.tryCatch(
//       () => padd0(a),
//       e => e
//     );

//   const add1 = (a: number) =>
//     TE.tryCatch(
//       () => padd1(a),
//       e => e
//     );

//   // const add2 = T.of(async (a: number) => a + 2);

//   // const initial = () => async (a: number) => TE.right(a);
//   // const add1 = () => async (a: number) => TE.right(a + 1);
//   // const add2 = () => async (a: number) => TE.right(a + 2);

//   const tasks = pipe(
//     5,
//     add0,
//     TE.chain(add1),
//     TE.chain(add1)
//     // add1
//     // add2
//     // TE.chain<Error, number, number>(add1)
//     // TE.chain<Error, number, number>(add2)
//   );

//   const result = tasks;

//   console.log(await result());
// });
