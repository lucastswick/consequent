SoundApp = (sketch) ->

  @mute = false
  @data = null
  @gibber = sketch.Gibber

  sketch.connect = =>
    socket_ = new WebSocket("ws://literature.uncontext.com:80")
    socket_.onmessage = (response) =>
      match = true
      data = jQuery.parseJSON response.data
      
      if data isnt @data
        sketch.onDataChange data

      return

  sketch.setup = =>


    sketch.createCanvas sketch.windowWidth, sketch.windowHeight

    console.log @gibber

    # @crush = sketch.createCrush()
    @kick = sketch.createEDrum("x...x...")
    @snare = sketch.createEDrum("..o...o.")
    @hat = sketch.createEDrum("xxxxxxx-")
    @sine = sketch.createSine()
    @fm = sketch.createFM()
    
    @schizo = sketch.createSchizo()
    @delay = sketch.createDelay()

    # @fm.fx.add( @schizo )
    # @fm.fx.add( @delay )

    # @kickFollow = @gibber.Analysis.Follow(@kick)

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

  sketch.createSynth = =>
    
    synth = @gibber.Synths.Synth().note.seq( [0,1,2,3], 1/4 )
    synth = @gibber.Synths.Synth({attack: .5, decay: .85})
    synth.play [
      "c3"
      "c3"
      "eb3"
      "d4"
    ].random(), [
      1 / 2
      1 / 4
      1 / 4
    ].random(1 / 4, 1/2)
    synth.amp = .1

    #return
    synth

  sketch.createFM = =>

    fm = @gibber.Synths.FM(
      attack: 0.01
      cmRatio: .5
    )
    fm.fx.add @gibber.FX.Delay(
      time: sketch.mouseX
      feedback: sketch.mouseY
    )
    fm.play [
      "c3"
      "c3"
      "d3"
      "eb3"
      "c3"
      "eb3"
      "eb3"
      "d3"
    ].random(), [
      1 / 8
      1 / 8
      1/16
    ]

    #return

    fm

  sketch.createMono = =>

    mono = @gibber.Synths.Mono()
      .note.seq( 0, 1, 1/4 )
      .detune2.seq( @gibber.Utilities.Rndf(0,.035) )
      .detune3.seq( @gibber.Utilities.Rndf(0,.65) )

    # set oscillator octaves to match main oscillator
    mono.octave2 = 0
    mono.octave3 = 0

    #return
    mono

  sketch.createSchizo = =>

    schizo = @gibber.FX.Schizo({chance:.2})
    
    #return 
    schizo

  sketch.createDelay = =>

    delay = @gibber.FX.Delay({feedback:.3})
    #return
    delay

  sketch.onDataChange = (data) =>
    @data = data

    f = (@data.a + @data.b) * @data.d
    time = (@data.e.f + .3) / @data.e.g

    TweenLite.to(@fm, time, {frequency: f})

    @fm.frequency = (@data.a + @data.b) * @data.d * 5

    @schizo.chance = @data.a / @data.b


  sketch.draw = =>

    # @fm.fx[0].time = sketch.mouseX / sketch.windowWidth * 10
    # @fm.fx[0].feedback = sketch.mouseY / sketch.windowHeight * 1

    # console.log @fm
    # console.log @fm.frequency

    # @schizo.chance = sketch.mouseY / sketch.windowHieight 

    # sketch.background @kickFollow.getValue() * 255
    return


  sketch.keyPressed = (e) =>

    switch e.keyCode 
      
      when 32

        @mute = !@mute

        if @mute
          @gibber.Master.amp = 0
          sketch.noLoop()
        else
          @gibber.Master.amp = 1
          sketch.loop()

      when 16
        console.log @data


  return





soundApp = new p5(SoundApp)
soundApp.connect()

