let mic;
let micStarted = false;
let debugVolume = 0;
let analyzer;
let audioContext;

function setup() {
  createCanvas(400, 400);
  
  console.log("p5:", typeof p5);
  console.log("p5.AudioIn:", typeof p5.AudioIn);
  
  // Initialize Web Audio API
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    console.log("Audio context created:", audioContext.state);
    
    // Create analyzer node
    analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 2048;
    console.log("Analyzer created");
  } catch (e) {
    console.error("Error creating audio context:", e);
  }
  
  // Create microphone input
  if (typeof p5.AudioIn !== "undefined") {
    mic = new p5.AudioIn();
    console.log("AudioIn instance created");
  } else {
    console.error("p5.AudioIn not available!");
  }
}

function startMic() {
  if (!micStarted) {
    try {
      // Resume audio context if needed (required in Safari)
      if (audioContext && audioContext.state === "suspended") {
        audioContext.resume();
        console.log("Audio context resumed");
      }
      
      // Request permission and connect microphone to analyzer
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          console.log("Microphone permission granted");
          
          // Connect stream to analyzer for volume detection
          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyzer);
          analyzer.connect(audioContext.destination);
          
          // Also start p5.AudioIn
          if (mic) {
            mic.start();
            console.log("p5.AudioIn started");
          }
          
          micStarted = true;
          console.log("Full microphone setup complete");
        })
        .catch((err) => {
          console.error("Microphone access denied:", err);
          alert("Microphone access denied. Check System Preferences > Security & Privacy > Microphone");
        });
    } catch (e) {
      console.error("Error in startMic:", e);
    }
  }
}

function draw() {
  background(0);
  
  // Display status text
  fill(255);
  textSize(16);
  text("Mic: " + (micStarted ? "ON" : "OFF"), 10, 30);
  text("AudioCtx: " + (audioContext ? audioContext.state : "none"), 10, 60);
  
  if (mic) {
    debugVolume = mic.getLevel();
    text("Vol: " + debugVolume.toFixed(3), 10, 90);
    
    // Map volume to circle size
    let size = map(debugVolume, 0, 0.5, 10, 400);
    size = constrain(size, 10, 400);
    
    fill(255);
    ellipse(width/2, height/2 + 50, size, size);
  }
}
