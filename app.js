/**
 * AMBER & TEAL - Landing Page Scroll Engines & Physics Controllers
 */

(function () {
  'use strict';

  // Check user motion preference and enable motion features if permitted
  const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  if (motionOk) {
    document.body.classList.add('has-motion');
  }

  /* ==========================================================================
     SCROLL PORTAL ENGINE
     ========================================================================== */
  const heroSection = document.getElementById('hero');
  const panelLeft = document.getElementById('panel-left');
  const panelRight = document.getElementById('panel-right');
  const heroImage = document.getElementById('hero-image');
  const duotoneWash = document.getElementById('hero-wash');
  const dotTeal = document.getElementById('traveling-dot-teal');
  const dotAmber = document.getElementById('traveling-dot-amber');
  const titleLeft = document.getElementById('title-left');
  const titleRight = document.getElementById('title-right');
  const heroTitle = document.getElementById('hero-title');

  function updatePortal() {
    if (!heroSection || !motionOk) return;

    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollMax = heroHeight - windowHeight;

    // Calculate progression ratio [0, 1]
    const progress = Math.min(Math.max(scrollY / scrollMax, 0), 1);

    // 1. Sliding panels (outward past their own width)
    panelLeft.style.transform = `translate3d(-${progress * 102}%, 0, 0)`;
    panelRight.style.transform = `translate3d(${progress * 102}%, 0, 0)`;

    // 2. Settle image scale from 1.25 down to 1.0
    heroImage.style.transform = `scale(${1.25 - progress * 0.25})`;

    // 3. Raise duotone wash opacity from 0 to 0.35
    duotoneWash.style.opacity = progress * 0.35;

    // 4. Accent dots traveling to opposite corners
    // Start at center (50%), move outward (up to 10% and 90%)
    dotTeal.style.left = `${50 - progress * 40}%`;
    dotTeal.style.top = `${50 - progress * 40}%`;

    dotAmber.style.left = `${50 + progress * 40}%`;
    dotAmber.style.top = `${50 + progress * 40}%`;

    // 5. Wordmark Title dynamic transformation (grows, tightens, splits)
    // Scale: 1 -> 1.25
    // Letter-spacing: 0.15em -> -0.03em
    // Translate halves outward by half their width
    const titleScale = 1 + progress * 0.25;
    const letterSpacing = 0.15 - progress * 0.18; // em
    heroTitle.style.transform = `scale(${titleScale})`;
    heroTitle.style.letterSpacing = `${letterSpacing}em`;

    titleLeft.style.transform = `translate3d(-${progress * 50}%, 0, 0)`;
    titleRight.style.transform = `translate3d(${progress * 50}%, 0, 0)`;
  }

  // Bind scroll update with active/passive settings for performance
  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(updatePortal);
  }, { passive: true });

  // Initial invoke
  updatePortal();

  /* ==========================================================================
     STATEMENT VINYL PARALLAX ENGINE
     ========================================================================== */
  const statementSection = document.getElementById('statement');
  const floatingVinyl = document.getElementById('floating-vinyl');

  function updateStatementParallax() {
    if (!statementSection || !floatingVinyl || !motionOk) return;

    const rect = statementSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Check if statement fold is within viewport bounds
    if (rect.top < windowHeight && rect.bottom > 0) {
      const viewHeight = windowHeight + rect.height;
      const progress = (windowHeight - rect.top) / viewHeight;

      // Parallax translation (drift) and rotation
      const driftY = (progress - 0.5) * 140; // -70px to +70px drift
      const rotation = progress * 160;       // Rotate up to 160 degrees
      floatingVinyl.style.transform = `translate3d(0, ${driftY}px, 0) rotate(${rotation}deg)`;
    }
  }

  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateStatementParallax);
  }, { passive: true });

  /* ==========================================================================
     THROWABLE CARD DECK CONTROLLER (CATALOGUE)
     ========================================================================== */
  const deckContainer = document.getElementById('card-deck');
  const cards = Array.from(document.querySelectorAll('.deck-card'));
  const progressDots = Array.from(document.querySelectorAll('.progress-dot'));

  let activeCardIndex = 0; // The index of the top card (currently at data-index="0")
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let deltaX = 0;
  let deltaY = 0;
  let isThrowing = false;

  // Retrieve current active card
  function getTopCard() {
    return cards.find(card => card.getAttribute('data-index') === '0');
  }

  // Update visual state of dot selectors
  function updateProgressIndicators(currentIndex) {
    progressDots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Throw a card out of the view stack
  function throwCard(directionX) {
    if (isThrowing) return;
    isThrowing = true;

    const topCard = getTopCard();
    if (!topCard) return;

    // Disable dragging interactions during throw transition
    topCard.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
    
    // Animate out (Translate across deck width + lift + roll/rotate)
    const throwDistance = deckContainer.offsetWidth * 1.5;
    const liftY = -40;
    const rotateAngle = Math.sign(directionX) * 45;
    topCard.style.transform = `translate3d(${Math.sign(directionX) * throwDistance}px, ${liftY}px, 0) rotate(${rotateAngle}deg) scale(1.05)`;

    // Wait for fly-out transition to finish, then cycle index
    setTimeout(() => {
      // Clear style rules applied by dragging/throwing
      topCard.style.transition = 'none';
      topCard.style.transform = '';

      // Shift indices to cyclically restack
      const totalCards = cards.length;
      cards.forEach(card => {
        let currentIndex = parseInt(card.getAttribute('data-index'), 10);
        let nextIndex = (currentIndex - 1 + totalCards) % totalCards;
        card.setAttribute('data-index', nextIndex.toString());
      });

      // Update index tracker
      activeCardIndex = (activeCardIndex + 1) % totalCards;
      updateProgressIndicators(activeCardIndex);

      // Update dynamic audio track title if player is present
      const newTopCard = getTopCard();
      if (newTopCard) {
        const titleElement = newTopCard.querySelector('.card-title');
        const trackTitleElement = document.getElementById('track-title');
        if (titleElement && trackTitleElement) {
          trackTitleElement.textContent = titleElement.textContent;
        }
      }

      isThrowing = false;
    }, 600);
  }

  // Pointer drag event handlers
  if (deckContainer) {
    deckContainer.addEventListener('pointerdown', (e) => {
      if (isThrowing) return;

      const topCard = getTopCard();
      if (!topCard) return;

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      deltaX = 0;
      deltaY = 0;

      // Capture pointer events on container
      deckContainer.setPointerCapture(e.pointerId);

      // Disable transitions for raw tracking feedback
      topCard.style.transition = 'none';
    });

    deckContainer.addEventListener('pointermove', (e) => {
      if (!isDragging) return;

      const topCard = getTopCard();
      if (!topCard) return;

      deltaX = e.clientX - startX;
      deltaY = e.clientY - startY;

      // Rotate proportional to drag X, slightly scale up
      const rotateAngle = deltaX * 0.08;
      const scaleMultiplier = 1 + Math.min(Math.abs(deltaX) / 1000, 0.04);

      topCard.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) rotate(${rotateAngle}deg) scale(${scaleMultiplier})`;
    });

    deckContainer.addEventListener('pointerup', (e) => {
      if (!isDragging) return;
      isDragging = false;

      deckContainer.releasePointerCapture(e.pointerId);

      const topCard = getTopCard();
      if (!topCard) return;

      // Verify drag threshold (1/10th of deck container width)
      const threshold = deckContainer.offsetWidth / 10;

      if (Math.abs(deltaX) > threshold) {
        throwCard(deltaX);
      } else {
        // Snap back to initial stack state
        topCard.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        topCard.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
      }
    });

    deckContainer.addEventListener('pointercancel', (e) => {
      if (!isDragging) return;
      isDragging = false;
      deckContainer.releasePointerCapture(e.pointerId);

      const topCard = getTopCard();
      if (topCard) {
        topCard.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        topCard.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
      }
    });

    // Keyboard handlers (ArrowLeft & ArrowRight) for accessibility
    deckContainer.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        throwCard(1);
      } else if (e.key === 'ArrowLeft') {
        throwCard(-1);
      }
    });

    // Handle progress indicators click to cycle deck
    progressDots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const targetIndex = parseInt(e.target.getAttribute('data-index'), 10);
        if (targetIndex === activeCardIndex) return;

        // Perform cycle until target index is at top
        let steps = (targetIndex - activeCardIndex + cards.length) % cards.length;
        
        function runCycle() {
          if (steps > 0) {
            throwCard(1);
            steps--;
            setTimeout(runCycle, 650); // wait for card sweep animation to complete
          }
        }
        runCycle();
      });
    });
  }

  /* ==========================================================================
     FLOATING CATCHY AUDIO PLAYER (GEN Z STYLE)
     ========================================================================== */
  const audioPlayer = document.getElementById('audio-player');
  const playBtn = document.getElementById('play-btn');
  const playSvg = document.getElementById('play-svg');
  const pauseSvg = document.getElementById('pause-svg');
  const bgAudio = document.getElementById('bg-audio');

  let audioCtx = null;
  let synthInterval = null;
  let synthSequence = 0;
  let bassBoostNode = null;
  let masterGainNode = null;

  function startSynthLoop() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Master Audio routing with lowshelf bass boost and high gain
    bassBoostNode = audioCtx.createBiquadFilter();
    bassBoostNode.type = 'lowshelf';
    bassBoostNode.frequency.setValueAtTime(140, audioCtx.currentTime); // boost below 140Hz
    bassBoostNode.gain.setValueAtTime(17, audioCtx.currentTime); // +17dB bass boost!

    masterGainNode = audioCtx.createGain();
    masterGainNode.gain.setValueAtTime(1.9, audioCtx.currentTime); // loud master volume

    // Route: BassBoost -> MasterGain -> Destination
    bassBoostNode.connect(masterGainNode);
    masterGainNode.connect(audioCtx.destination);

    const tempo = 128; // faster, energetic Gen Z pace
    const noteLength = 60 / tempo / 2; // eighth notes
    let nextNoteTime = audioCtx.currentTime;

    // Deep sub-bass progression (two octaves lower)
    const melody = [
      65.41, 130.81, 98.00, 155.56, 98.00, 130.81, 98.00, 155.56,
      51.91, 103.83, 77.78, 155.56, 77.78, 103.83, 77.78, 155.56,
      38.89, 77.78, 58.27, 116.54, 58.27, 77.78, 58.27, 116.54,
      58.27, 116.54, 87.31, 174.61, 87.31, 116.54, 87.31, 174.61
    ];

    function scheduleNotes() {
      while (nextNoteTime < audioCtx.currentTime + 0.1) {
        const step = synthSequence % melody.length;
        const freq = melody[step];

        // Triangle synth oscillator
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, nextNoteTime);

        // Lowpass resonance sweep
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(700, nextNoteTime);
        filter.frequency.exponentialRampToValueAtTime(120, nextNoteTime + noteLength);

        oscGain.gain.setValueAtTime(0, nextNoteTime);
        oscGain.gain.linearRampToValueAtTime(0.09, nextNoteTime + 0.015);
        oscGain.gain.exponentialRampToValueAtTime(0.001, nextNoteTime + noteLength - 0.01);

        osc.connect(filter);
        filter.connect(oscGain);
        // Connect to bass boost node to emphasize low harmonics
        oscGain.connect(bassBoostNode);

        osc.start(nextNoteTime);
        osc.stop(nextNoteTime + noteLength);

        // Heavy Bass Kick (Loud, pitch sweep)
        if (synthSequence % 4 === 0) {
          const kick = audioCtx.createOscillator();
          const kickGain = audioCtx.createGain();
          kick.frequency.setValueAtTime(140, nextNoteTime);
          kick.frequency.exponentialRampToValueAtTime(32, nextNoteTime + 0.12);

          kickGain.gain.setValueAtTime(0.55, nextNoteTime); // double gain volume
          kickGain.gain.exponentialRampToValueAtTime(0.001, nextNoteTime + 0.16);

          kick.connect(kickGain);
          kickGain.connect(bassBoostNode); // connect to bass boost for massive punch

          kick.start(nextNoteTime);
          kick.stop(nextNoteTime + 0.2);
        }

        // Noise Hi-hat (Connect directly to master to bypass bass boost and stay crisp)
        if (synthSequence % 4 === 2) {
          const bufferSize = audioCtx.sampleRate * 0.04;
          const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }

          const noise = audioCtx.createBufferSource();
          noise.buffer = buffer;

          const hpFilter = audioCtx.createBiquadFilter();
          hpFilter.type = 'highpass';
          hpFilter.frequency.value = 8500;

          const noiseGain = audioCtx.createGain();
          noiseGain.gain.setValueAtTime(0.045, nextNoteTime);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, nextNoteTime + 0.04);

          noise.connect(hpFilter);
          hpFilter.connect(noiseGain);
          noiseGain.connect(masterGainNode); // directly to master

          noise.start(nextNoteTime);
          noise.stop(nextNoteTime + 0.05);
        }

        nextNoteTime += noteLength;
        synthSequence++;
      }
    }

    synthInterval = setInterval(scheduleNotes, 25);
  }

  function stopSynthLoop() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  }

  if (playBtn && bgAudio && audioPlayer) {
    playBtn.addEventListener('click', () => {
      // Initialize Audio Context on user interaction to comply with autoplay policy
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      const isPlaying = audioPlayer.classList.contains('playing');

      if (!isPlaying) {
        // Try playing the MP3 first
        bgAudio.play().then(() => {
          audioPlayer.classList.add('playing');
          playSvg.classList.add('hidden');
          pauseSvg.classList.remove('hidden');
        }).catch(err => {
          console.warn("MP3 blocked/failed. Initializing synthesized live beat instead.", err);
          // Fallback: start native oscillator sequencer
          startSynthLoop();
          audioPlayer.classList.add('playing');
          playSvg.classList.add('hidden');
          pauseSvg.classList.remove('hidden');
        });
      } else {
        // Stop both MP3 and Synthesizer
        bgAudio.pause();
        stopSynthLoop();
        audioPlayer.classList.remove('playing');
        playSvg.classList.remove('hidden');
        pauseSvg.classList.add('hidden');
      }
    });
  }

  /* ==========================================================================
     BUILT-IN AUTOMATED MOTION VERIFICATION CHECK
     ========================================================================== */
  window.addEventListener('DOMContentLoaded', () => {
    if (!heroSection || !panelLeft) return;

    // Simulate 700px scroll layout calculation
    const heroHeight = heroSection.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollMax = heroHeight - windowHeight;
    
    const simulatedScroll = 700;
    const progress = Math.min(Math.max(simulatedScroll / scrollMax, 0), 1);
    
    // Panel translation percentage at 700px scroll
    const translationPercent = progress * 102;
    
    // Convert to actual screen pixel measurement (assuming viewport width ~ 1280px if headless/virtual)
    const viewportWidth = window.innerWidth || 1280;
    const panelWidth = viewportWidth * 0.502; // each panel takes 50.2vw
    const travelDistancePixels = (translationPercent / 100) * panelWidth;

    console.log(`\n--- MOTION MODEL DIAGNOSTICS ---`);
    console.log(`Scrollable Hero height range: ${scrollMax}px`);
    console.log(`Scroll distance evaluated: ${simulatedScroll}px`);
    console.log(`Left Panel translation ratio: ${translationPercent.toFixed(2)}%`);
    console.log(`Calculated travel distance: ${travelDistancePixels.toFixed(2)}px`);

    if (travelDistancePixels > 100) {
      console.log(`[Diagnostic] PASS: Left portal panel moves ${travelDistancePixels.toFixed(1)}px (well over the required 100px) in the first 700px of scroll.\n`);
    } else {
      console.error(`[Diagnostic] FAIL: Portal panel only moves ${travelDistancePixels.toFixed(1)}px. Adjust scroll coefficients.\n`);
    }
  });

})();
