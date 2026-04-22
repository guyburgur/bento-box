let mic;
let micStarted = false;
let debugVolume = 0;
let mode = 'mic'; // 'mic' or 'audio'
let amp;
let sound;
let inputUrl;
let loadBtn;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB);
  
  // Create amplitude analyzer
  if (typeof p5.Amplitude !== "undefined") {
    amp = new p5.Amplitude();
    console.log("Amplitude instance created");
  } else {
    console.warn("p5.Amplitude not available - audio visualization may not work");
  }
  
  // UI for audio URL
  inputUrl = createInput('images/beatwhile I wake up.wav');
  inputUrl.position(10, 350);
  inputUrl.size(300);
  
  loadBtn = createButton('Load Audio');
  loadBtn.position(320, 350);
  loadBtn.mousePressed(loadAudio);
  
  // Create microphone input
  if (typeof p5.AudioIn !== "undefined") {
    mic = new p5.AudioIn();
    console.log("AudioIn instance created");
  } else {
    console.warn("p5.AudioIn not available - microphone may not work");
  }
}

function loadAudio() {
  if (sound) {
    sound.stop();
  }
  sound = loadSound(inputUrl.value(), () => {
    // Connect amplitude analyzer to the sound
    if (amp) {
      amp.setInput(sound);
    }
    mode = 'audio';
    sound.play();
    console.log("Audio loaded and playing");
  }, (err) => {
    console.error("Error loading audio:", err);
  });
}

function startMic() {
  if (!micStarted && mic) {
    try {
      mic.start(() => {
        // Connect amplitude analyzer to the microphone
        if (amp) {
          amp.setInput(mic);
        }
        console.log("p5.AudioIn started successfully");
        micStarted = true;
      }, (err) => {
        console.error("Error starting microphone:", err);
        alert("Microphone access denied. Check browser permissions.");
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
  text("Mode: " + mode, 10, 30);
  text("Mic: " + (micStarted ? "ON" : "OFF"), 10, 50);
  if (mode === 'mic' && !micStarted) {
    text("Click to start microphone", 10, 70);
  }
  
  // Get volume based on mode
  let vol = 0;
  if (mode === 'mic' && mic && micStarted) {
    vol = mic.getLevel();
  } else if (mode === 'audio' && sound && sound.isPlaying() && amp) {
    vol = amp.getLevel();
  }
  
  debugVolume = vol;
  text("Vol: " + debugVolume.toFixed(3), 10, 90);
  
  // Map volume to circle size
  let size = map(vol, 0, 0.5, 10, 400);
  size = constrain(size, 10, 400);
  
  // Map size to color (hue from 0 to 360)
  let hue = map(size, 10, 400, 0, 360);
  fill(hue, 100, 100);
  ellipse(width/2, height/2 + 50, size, size);
}

function mousePressed() {
  if (mode === 'mic') {
    startMic();
  }
}

function keyPressed() {
  if (key === 'm' || key === 'M') {
    mode = 'mic';
    if (sound) sound.stop();
  } else if (key === 'a' || key === 'A') {
    if (sound && !sound.isPlaying()) {
      sound.play();
    }
    mode = 'audio';
  }
}
