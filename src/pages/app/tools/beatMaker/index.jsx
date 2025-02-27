import React, { useEffect, useState } from 'react';
// import { Context } from "../Context";
import './styles/index.css';
import './styles/playhead.css';
import InstrumentRow from './Components/InstrumentRow';
import Bpm from './helpers/useBPM';
import Tempo from './Components/Tempo';
import { instruments, getBassNote } from './helpers/instruments';
import PlayButton from './Components/PlayButton';
import StopButton from './Components/StopButton';
import Volume from './Components/Volume';
import { Howl } from 'howler';
import MyBeats from "./Components/MyBeats";

const BeatMaker = () => {

 //beat machine initial states
 const [isPlaying, setIsPlaying] = useState(false);
 const [tempo, setTempo] = useState(120);
 const [volNum, setVolNum] = useState(50);
 // state tracking for playhead when isPlaying
 const [squares, setSquares] = useState([
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
 ]);
 // state tracking for our dumb component when !isPlaying
 const [playHeadArray, setPlayHeadArray] = useState([
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
   0,
 ]);
 const [counter, setCounter] = useState(0);
 // holds on off state for each row of instruments
 const [grid, setGrid] = useState([
   instruments[0].pattern,
   instruments[1].pattern,
   instruments[2].pattern,
   instruments[3].pattern,
   instruments[4].pattern,
   instruments[5].pattern,
   instruments[6].pattern,
 ]);

 // TODO: Refactor player controls into helpers
 const togglePlay = () => {
   setIsPlaying(!isPlaying);
 };

 

 //set BPM
 let beats = Bpm(tempo);

 //ParseInt() as tempo field currently a string
 const handleTempoChange = (event) => {
   const eventValue = event.target.value;
   setTempo(parseInt(eventValue));
 };

 //volume handler
 const handleVol = (event, volNum) => {
   setVolNum(volNum);
 };

 //Animation Specific functions
 //helper function for playHeadLoop()
 const getPreviousSquare = () => {
   if (counter === 0) {
     return document.getElementById('15');
   } else {
     return document.getElementById(`${counter - 1}`);
   }
 };

 // animates playhead based off the counter position
 const playHeadLoop = () => {
   //get the square to animate
   let squareToAnimate = document.getElementById(`${counter}`);
   //find previousSquare
   let previousSquare = getPreviousSquare();
   //TODO Re-factor into one toggle
   previousSquare.classList.remove('playhead');
   previousSquare.classList.add('inactive');
   squareToAnimate.classList.remove('inactive');
   squareToAnimate.classList.add('playhead');
 };

 //when player is stopped reset playhead and array to initial values
 const resetSquares = () => {
   setCounter(0);
   setPlayHeadArray(
     squares.map((square, i) => (
       <td
         key={i + squares}
         id={i}
         className={square > 0 ? 'playhead' : 'inactive cycle'}
       ></td>
     ))
   );
 };

 //handles any changes user makes to instrument grid and updates values accordingly
 const updateGrid = (row, column, toggle) => {
   const clonedObj = { ...grid[row] };
   clonedObj[column] = toggle;
   //temporary const for setGrid
   const arrayToPassSetGrid = [];
   for (let i = 0; i < 7; i++) {
     if (row === i) {
       arrayToPassSetGrid.push(clonedObj);
     } else {
       arrayToPassSetGrid.push(grid[i]);
     }
   }
   setGrid(arrayToPassSetGrid);
 };

 //play an individual sound from our array from PlaySounds()
 const playSound = (source) => {
   var sound = new Howl({
     src: [source],
     html5: true,
     volume: volNum / 100,
   });
   sound.play();
 };

 //Iterate through the array of collected sounds compiled from our grid in loop()
 const playSounds = (array) => {
   for (let i = 0; i < array.length; i++) {
     playSound(array[i]);
   }
 };

 //collate all active sound samples on the current beat into an array from instruments
 const loop = () => {
   //create an array to hold our sounds for a beat
   let soundArr = [];
   //loop through each instrument in our column
   for (let j = 0; j < 7; j++) {
     //if the square is active e.g. 0,0
     if (grid[j][counter]) {
       //set a temporary variable to hold our soundSrc
       let soundSrc =
         instruments[j].name === 'Bassline'
         //e.g. "./BassSamples/D-BassNote.wav"
           ? getBassNote(counter)
           : instruments[j].sound;
           //e.g. "./DrumSamples/ClosedHats/HiHat01.wav"
       soundArr.push(soundSrc);
     }
     playSounds(soundArr);
   }
 };

 //useEffect re-renders and runs our beat machine functions if IsPlaying per tick of setInterval
 useEffect(() => {
   //is the beat machine playing?
   if (isPlaying) {
     //set an interval to perform player logic
     const interval = setInterval(() => {
       //animate the playHead based on counter position
       playHeadLoop();
       // create an array of up to 6 sounds that are then played at the same time
       loop();
       // increments counter based on current tempo
       if (counter < 15) {
         setCounter((prevState) => ++prevState);
       } else {
         setCounter(0);
       }
     }, beats);
     return () => clearInterval(interval);
   }
   resetSquares();
 }, [isPlaying, beats, volNum, counter]);

 //Map each instrumentRow onto the beat machine
 const instrumentRows = instruments.map((instrument, row) => {
   return (
     <InstrumentRow
       key={row}
       row={row}
       updateGrid={(row, column, toggle) => updateGrid(row, column, toggle)}
       instrumentName={instrument.name}
       instrumentSound={instrument.sound}
       pattern={instrument.pattern}
       instrumentColor={instrument.color}
     />
   );
 });

 //Conditionally Render Playhead if isPlaying
 const playHead = () => {
   if (isPlaying) {
     return (
       <>
         <td className="instrument" />
         {playHeadArray}
       </>
     );
   } else {
     return (
       <>
       <tr>
         <td className={isPlaying ? 'hidden' : 'instrument'} key="1"/>
         <td className="inactive" key="2"></td>
         <td className="inactive" key="3"></td>
         <td className="inactive" key="4"></td>
         <td className="inactive" key="5"></td>
         <td className="inactive" key="6"></td>
         <td className="inactive"key="7"></td>
         <td className="inactive" key="8"></td>
         <td className="inactive" key="9"></td>
         <td className="inactive" key="10"></td>
         <td className="inactive" key="11"> </td>
         <td className="inactive"  key="12"></td>
         <td className="inactive"key="13"></td>
         <td className="inactive"key="14"></td>
         <td className="inactive"key="15"></td>
         <td className="inactive"key="16"></td>
         <td className="inactive"key="17"></td>
         </tr>
       </>
     );
   }
 };
 //store playHeadComponent in a variable for readability
 const playHeadComponent = playHead();

 //App returns the composite of our beat machine and components

 
 const context = new(window.AudioContext || window.webkitAudioContext)()
 async function run()
 {
     var myArrayBuffer = context.createBuffer(2, context.sampleRate, context.sampleRate);
     // Fill the buffer with white noise;
     // just random values between -1.0 and 1.0
     for (var channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
       // This gives us the actual array that contains the data
       var nowBuffering = myArrayBuffer.getChannelData(channel);
       for (var i = 0; i < myArrayBuffer.length; i++) {
         // audio needs to be in [-1.0; 1.0]
         nowBuffering[i] = Math.random() * 2 - 1;
       }
     }
     playAudio(myArrayBuffer)
 }
 
 function playAudio(buf){
     const streamNode = context.createMediaStreamDestination();
     const stream = streamNode.stream;
     const recorder = new MediaRecorder( stream );
     const chunks = [];
     recorder.ondataavailable = evt => chunks.push( evt.data );
     recorder.onstop = evt => exportAudio( new Blob( chunks ) );
 
     const source = context.createBufferSource()
     source.onended = () => recorder.stop();
     source.buffer = buf
     source.playbackRate.value = 0.2
     source.connect( streamNode );
     source.connect(context.destination);
     source.start(0)
     recorder.start();
 }
 
 function exportAudio( blob ) {
   const aud = new Audio( URL.createObjectURL( blob ) );
   aud.controls = true;
   document.body.prepend( aud );
 }

 return (
   <div className='flex content-center canvas'>


   <div className="container bg-black flex-initial w-64">
     <div className="btnGroup">
       <PlayButton onClick={togglePlay} isPlaying={isPlaying} />
       <StopButton onClick={togglePlay} isPlaying={isPlaying} />
       <h1 className='text-white text-7xl	'>Beat Maker <span className={` ${isPlaying ? "rotate" :''}`}>🎧</span>🔥
       
       </h1>
     </div>
     <br />
     <div className="volTempo">
       <div className="volStyle">
         <Volume volNum={volNum} onChange={handleVol} />
       </div>
       <div className="tempoStyle">
         <Tempo
           value={tempo}
           onTempoChange={(event) => {
             handleTempoChange(event);
           }}
         />
       </div>
     </div>
     <br />
     <table className='table-auto'>
       <tbody>
         {playHeadComponent}
         {instrumentRows}
       </tbody>
     </table>
   </div>
   
   </div>

 );
};

export default BeatMaker;
