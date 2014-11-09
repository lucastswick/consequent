SoundApp = (sketch) ->

  @mute = false
  @dataWatcher = null
  @visualizer = null
  @gibber = sketch.Gibber
  @baseBPM = 120
  @fftSize = 32

  sketch.setup = =>

    @dataWatcher = new UncontextDataWatcher(sketch)
    console.log @dataWatcher

    sketch.createCanvas sketch.windowWidth, sketch.windowHeight
    $("#defaultCanvas").detach()

    @visualizer = new Visualizer(sketch)
    window.visualizer = @visualizer
    console.log @visualizer

    window.gibber = @gibber
    console.log @gibber

    @kick = sketch.createEDrum("x...x...")
    @snare = sketch.createEDrum("..o...o.")
    @hat = sketch.createEDrum("--------")

    bassObj = @gibber.Presets.Mono.dark
    bassObj.octave = -1
    bassObj.amp = 1
    @bass = sketch.createMono bassObj
    @bass.note.seq( [0,0,1,0,0,0,2,1], [1/8] )

    synMelody = @gibber.Presets.Mono.dark2
    synMelody.octave = -1
    synMelody.amp = .8
    synMelody.attack = .5
    synMelody.decay = 2
    @synMelody = sketch.createMono synMelody
    @synMelody.note.seq( [0, 0, 2, 3, 4], [1,1, 1, 1/2, 1/2] )


    melodyObj = attack: 0.05, decay: .85, amp: 0.05
    @melody = sketch.createSynth melodyObj
    @melody.note.seq( [0, 2, 0, 2, 0].rnd(), [1/16] )
    
    
    # @sine = sketch.createSine()
    # @fm = sketch.createFM()
    
    # @crush = sketch.createCrush()
    # @schizo = sketch.createSchizo()
    # @delay = sketch.createDelay()

    bassDelayObj = {feedback:.2, wet:.5, dry:1}
    @bassDelay = sketch.createDelay bassDelayObj
    @bass.fx.add bassDelay


    # melodySchizoObj = {chance:.2}
    # chance: 0.2
    # mix: 1
    # pitchChance: 0.5
    # reverseChance: 0.5

    # melodySchizoObj = @gibber.Presets.Schizo.borderline
    # melodySchizo = sketch.createSchizo melodySchizoObj
    # @melody.fx.add melodySchizo

    # melodyReverbObj = @gibber.Presets.Reverb.large
    # melodyReverb = sketch.createReverb melodyReverbObj
    # @melody.fx.add melodyReverb

    # melodyDelayObj = {feedback:.2}
    # @melodyDelay = sketch.createDelay melodyDelayObj
    # @melody.fx.add melodyDelay


    # @fm.fx.add( @schizo )
    # @fm.fx.add( @delay )

    

    @gibber.scale.root.seq( ['c4','ab3','bb3'], [4,2,2] )
    @gibber.scale.mode.seq( ['Minor'], [8] )
    # @gibber.scale.mode.seq( ['Minor','MinorPentatonic'], [6,2] )


    @FFT = @gibber.Analysis.FFT( @fftSize )
    
    i = 0

    @kickFollow = @gibber.Analysis.Follow(@kick)
    @snareFollow = @gibber.Analysis.Follow(@snare)
    @hatFollow = @gibber.Analysis.Follow(@hat)
    @bassFollow = @gibber.Analysis.Follow(@bass)

    kickVisObj = { color: 0xff9900, opacity: 0.8 }
    @kickVis = sketch.createVisual @kick, @kickFollow, kickVisObj, ++i

    snareVisObj = { color: 0x00ff99, opacity: 0.8 }
    @snareVis = sketch.createVisual @snare, @snareFollow, snareVisObj, ++i

    hatVisObj = { color: 0x0099ff, opacity: 0.8 }
    @hatVis = sketch.createVisual @hat, @hatFollow, hatVisObj, ++i

    bassVisObj = { color: 0x9900FF, opacity: 0.8 }
    @bassVis = sketch.createVisual @bass, @bassFollow, bassVisObj, ++i

    i = 0
    @cubes = []
    len = (@fftSize / 4) - 1
    for i in [0..len] 
      @cubes.push sketch.createCube { color: Math.random() * 0xffffff, opacity: 0.8 }, i


    return


  sketch.createCrush = =>

    crush = @gibber.FX.Crush({bitDepth: 4})
    crush.bitDepth.seq( [2, 4, 8, 6], 1/2 )
    
    #return
    crush

  sketch.createEDrum = (pattern) =>
    drum = @gibber.Percussion.EDrums(pattern)
    
    #return 
    drum

  sketch.createBass = (initObj) =>
    bass = @gibber.Synths.FM initObj
    
    #return
    bass

  sketch.createSine = =>
    
    sine = @gibber.Oscillators.Sine()
    sine.frequency.seq( [440, 220], [1/4, 1/8, 1/16] )
    tremolo = @gibber.FX.Tremolo({amp: 1, frequency: .1})
    sine.fx.add( tremolo )

    #return
    sine

  sketch.createPWM = =>
    
    pwm =  @gibber.Oscillators.PWM({ pulsewidth: @gibber.Binops.Add( .5, @gibber.Oscillators.Sine( 0.1, 100 )._ ) })# disconnect!
    #return
    pwm

  sketch.createSynth = (initObj)=>
    
    synth = @gibber.Synths.Synth initObj
    # synth.note.seq( seq, len )
    # synth.play [
    #   "c3"
    #   "c3"
    #   "eb3"
    #   "d4"
    # ]
    # ].random(), [
    #   1 / 2
    #   1 / 4
    #   1 / 4
    # ]
    
    # ].random(1 / 4, 1/2)
    # synth.amp = amp

    #return
    synth

  sketch.createSynth2 = (initObj) =>
    synth2 = @gibber.Synths.Synth2 initObj

    # return
    synth2

  sketch.createFM = (initObj) =>

    fm = @gibber.Synths.FM(initObj)

    # fm = @gibber.Synths.FM(
    #   attack: 0.01
    #   cmRatio: .5
    # )
    # fm.fx.add @gibber.FX.Delay(
    #   time: sketch.mouseX
    #   feedback: sketch.mouseY
    # )
    # fm.play [
    #   "c3"
    #   "c3"
    #   "d3"
    #   "eb3"
    #   "c3"
    #   "eb3"
    #   "eb3"
    #   "d3"
    # ].random(), [
    #   1 / 8
    #   1 / 8
    #   1/16
    # ]

    #return

    fm

  sketch.createMono = (initObj) =>

    mono = @gibber.Synths.Mono initObj

    # mono = @gibber.Synths.Mono()
    #   .note.seq( 0, 1, 1/4 )
    #   .detune2.seq( @gibber.Utilities.Rndf(0,.035) )
    #   .detune3.seq( @gibber.Utilities.Rndf(0,.65) )

    # # set oscillator octaves to match main oscillator
    # mono.octave2 = 0
    # mono.octave3 = 0

    #return
    mono

  sketch.createSchizo = (initObj) =>

    schizo = @gibber.FX.Schizo initObj
    
    #return 
    schizo

  sketch.createDelay = (initObj) =>

    delay = @gibber.FX.Delay initObj
    #return
    delay

  sketch.createReverb = (initObj) =>
    reverb = @gibber.FX.Reverb initObj

    #return
    reverb



  sketch.onDataChange = (data) =>
    @data = data

    # melodyAttack = @data.a[0]
    # melodyPulseWidth = @data.a[1]
    # TweenLite.to(@melody, 1, {attack:melodyAttack})
    # TweenLite.to(@melody, 2, {pulseWidth: melodyPulseWidth})
    
    # melodyDelayFeedback = @data.b[1]
    # TweenLite.to(@melody.fx, 1, {feedback: melodyDelayFeedback})


    bassAmp = @data.b[0]
    bassFrequency = @data.b[1] * 440
    TweenLite.to(@bass, .5, {amp:bassAmp, frequency: bassFrequency})

    bassDelayfeedback = @data.b[0]
    TweenLite.to(@bass.fx, 1, {feedback: bassDelayfeedback})


    snareAmp = @data.d
    TweenLite.to(@snare, 1, {amp:snareAmp})

    hatAmp = @data.c
    if @data.a[0] < .3
      @hat.seq.durations = [1/8]
    else if @data.a[0] >= .3 and @data.a[0] < .6
      @hat.seq.durations = [1/16]
    else
      @hat.seq.durations = [1/32]

    TweenLite.to(@hat, 3, {amp:hatAmp})

    melodyAmp = @data.b[1] / 50
    melodyAttack = Math.max(0.05, @data.b[0])
    melodyOctave = Math.floor((@data.f * 10) / 3)
    @melody.octave = melodyOctave


    # TweenLite.to(@melody, .2, {amp:melodyAmp, attack: melodyAttack})
    TweenLite.to(@melody, .2, {amp:melodyAmp})

    bpm = @baseBPM + @data.d * 10 - data.e * 10
    TweenLite.to(@gibber.Clock, 1, {baseBPM, bpm})

    synAmp = Math.min(@data.f, 1)
    synPan = @data.f * 2 - 1
    TweenLite.to(@synMelody, .5, {amp: synAmp, pan:synPan})



    # console.log 'sketch on data change', @data

    # console.log @kick.frequency
    # @kick.frequency = (@data.a[0] * 1000)



    # @crush.sampleRate = @data.e.f

    # f = (@data.a + @data.b) * @data.d
    # time = (@data.e.f + .3) / @data.e.g

    # TweenLite.to(@fm, time, {frequency: f})

    # @fm.frequency = (@data.a + @data.b) * @data.d * 5

    # @schizo.chance = @data.a / @data.b


  sketch.draw = =>

    # @fm.fx[0].time = sketch.mouseX / sketch.windowWidth * 10
    # @fm.fx[0].feedback = sketch.mouseY / sketch.windowHeight * 1

    # console.log @fm
    # console.log @fm.frequency

    # @schizo.chance = sketch.mouseY / sketch.windowHieight 

    # sketch.background @kickFollow.getValue() * 255
    # console.log @visualizer
    # @visualizer.update(@kickFollow)

    # sketch.onUpdate({kick: @kickFollow.getValue() * 255})

    # sketch.background(@kickFollow.getValue() * 255)

    @kickVis.scale.z = Math.max(.01, @kickFollow.getValue() * 100)
    @snareVis.scale.z = Math.max(.01, @snareFollow.getValue() * 100)
    @hatVis.scale.z = Math.max(.01, @hatFollow.getValue() * 100)
    @bassVis.scale.z = Math.max(.01, @bassFollow.getValue() * 10)
    
    numBars = @fftSize / 2
    barHeight = 100
    barColor = null
    value = null
    i = 0



    for cube, i in @cubes
      # read FFT value, which ranges from 0-255, and scale it.
      value = (@FFT[i].value / 255)
      cube.scale.z = value * 10


    return


  sketch.keyPressed = (e) =>

    console.log 'key code :: ', e.keyCode

    switch e.keyCode 

      # space bar
      when 32

        @mute = !@mute

        if @mute
          @gibber.Master.amp = 0
          sketch.noLoop()
        else
          @gibber.Master.amp = 1
          sketch.loop()

      # shift key
      when 16
        # console.log @data
        # console.log @FFT[0].value
        console.log @data.e
        # console.log @cubes



  return





soundApp = new p5(SoundApp)
