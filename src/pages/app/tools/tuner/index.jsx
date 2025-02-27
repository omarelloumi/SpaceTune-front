import { useEffect, useState } from "react";
import AudioContext from "./contexts/AudioContext";
import autoCorrelate from "./libs/AutoCorrelate";
import {
  noteFromPitch,
  centsOffFromPitch,
  getDetunePercent,
} from "./libs/Helpers";

const audioCtx = AudioContext.getAudioContext();
const analyserNode = AudioContext.getAnalyser();
const buflen = 2048;
var buf = new Float32Array(buflen);

const noteStrings = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];


export default function Tuner() {

    const [source, setSource] = useState(null);
    const [started, setStart] = useState(false);
    const [pitchNote, setPitchNote] = useState("C");
    const [pitchScale, setPitchScale] = useState("4");
    const [pitch, setPitch] = useState("0 Hz");
    const [detune, setDetune] = useState("0");
    const [notification, setNotification] = useState(false);
  
    const updatePitch = (time) => {
      analyserNode.getFloatTimeDomainData(buf);
      var ac = autoCorrelate(buf, audioCtx.sampleRate);
      if (ac > -1) {
        let note = noteFromPitch(ac);
        console.log("note",note)
        let sym = noteStrings[note % 12];
        let scl = Math.floor(note / 12) - 1;
        let dtune = centsOffFromPitch(ac, note);
        setPitch(parseFloat(ac).toFixed(2) + " Hz");
        setPitchNote(sym);
        setPitchScale(scl);
        setDetune(dtune);
        setNotification(false);
        console.log(note, sym, scl, dtune, ac);
      }
    };
  
    useEffect(() => {
      if (source != null) {
        source.connect(analyserNode);
      }
    }, [source]);
  
    setInterval(updatePitch, 1);
  
    const start = async () => {
      const input = await getMicInput();
  
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }
      setStart(true);
      setNotification(true);
      setTimeout(() => setNotification(false), 5000);
      setSource(audioCtx.createMediaStreamSource(input));
    };
  
    const stop = () => {
      source.disconnect(analyserNode);
      setStart(false);
    };
  
    const getMicInput = () => {
      return navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          autoGainControl: false,
          noiseSuppression: false,
          latency: 0,
        },
      });
    };
  

    return (<div>
   
    <div className="flex flex-col items-center">
    <h1 className="m-2"> Guitar Tuner</h1>
    <p className="w-3/5">
    Hello! You have found the fastest and right way to tune your guitar 🎸. The tuning will be done using the free online guitar tuner, working through a microphone on your device. This tuner is suitable for acoustic and for electric guitar.
    </p>

      <div
        className={
          started
            ? "visible flex flex-col transition-all ease-in delay-75 bg-white justify-center items-center p-10 rounded-xl shadow-lg mb-5 w-60 h-60"
            : "invisible transition-all w-0 h-0"
        }
      >
        <div className="flex items-start font-mono">
          <span
            className={
              started
                ? "visible transition-all delay-75 font-thin text-9xl"
                : "invisible text-xs"
            }
          >
            {pitchNote}
          </span>
          <span className="bg-green-600 p-1 px-2 text-white rounded-lg">
            {pitchScale}
          </span>
        </div>

        <div className="w-full flex justify-center items-center">
          <div
            className="bg-gradient-to-r to-green-400 from-red-600 py-1 rounded-full rotate-180"
            style={{
              width: (detune < 0 ? getDetunePercent(detune) : "50") + "%",
            }}
          ></div>
          <span className="font-bold text-lg text-green-800">I</span>
          <div
            className="bg-gradient-to-r from-green-400 to-red-600 py-1 rounded-full"
            style={{
              width: (detune > 0 ? getDetunePercent(detune) : "50") + "%",
            }}
          ></div>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          <span>{pitch}</span>
        </div>
      </div>
      {!started ? (
        <button
          className="bg-black text-white w-20 h-20 rounded-full shadow-xl transition-all"
          onClick={start}
        >
          Start
        </button>
      ) : (
        <button
          className="bg-black text-white w-20 h-20 rounded-full shadow-xl transition-all"
          onClick={stop}
        >
          Stop
        </button>
      )}
    </div>
  </div>
);
}