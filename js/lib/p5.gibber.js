(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f
            }
            var l = n[o] = {
                exports: {}
            };
            t[o][0].call(l.exports, function(e) {
                var n = t[o][1][e];
                return s(n ? n : e)
            }, l, l.exports, e, t, n, r)
        }
        return n[o].exports
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s
})({
    1: [function(require, module, exports) {
        p5.prototype.Gibber = require('gibber.lib')

        p5.prototype.Gibber.export(p5.prototype)

        p5.prototype.Gibber.init({
            globalize: false,
            target: p5.prototype
        })

        p5.prototype.Rndi = p5.prototype.Gibber.Audio.Rndi
        p5.prototype.Rndf = p5.prototype.Gibber.Audio.Rndf
        p5.prototype.rndi = p5.prototype.Gibber.Audio.rndi
        p5.prototype.rndf = p5.prototype.Gibber.Audio.rndf
    }, {
        "gibber.lib": 2
    }],
    2: [function(require, module, exports) {
        (function(global) {
            ! function(e) {
                if ("object" == typeof exports) module.exports = e();
                else if ("function" == typeof define && define.amd) define(e);
                else {
                    var t;
                    "undefined" != typeof window ? t = window : "undefined" != typeof global ? t = global : "undefined" != typeof self && (t = self), t.Gibber = e()
                }
            }(function() {
                var define, module, exports;
                return function e(t, i, n) {
                    function r(o, a) {
                        if (!i[o]) {
                            if (!t[o]) {
                                var u = "function" == typeof require && require;
                                if (!a && u) return u(o, !0);
                                if (s) return s(o, !0);
                                throw new Error("Cannot find module '" + o + "'")
                            }
                            var c = i[o] = {
                                exports: {}
                            };
                            t[o][0].call(c.exports, function(e) {
                                var i = t[o][1][e];
                                return r(i ? i : e)
                            }, c, c.exports, e, t, i, n)
                        }
                        return i[o].exports
                    }
                    for (var s = "function" == typeof require && require, o = 0; o < n.length; o++) r(n[o]);
                    return r
                }({
                    1: [function(_dereq_, module, exports) {
                        ! function(e, t) {
                            "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? module.exports = t() : e.Gibberish = t()
                        }(this, function() {
                            function createInput() {
                                console.log("connecting audio input..."), navigator.webkitGetUserMedia({
                                    audio: !0
                                }, function(e) {
                                    console.log("audio input connected"), Gibberish.mediaStreamSource = Gibberish.context.createMediaStreamSource(e), Gibberish.mediaStreamSource.connect(Gibberish.node), _hasInput = !0
                                }, function() {
                                    console.log("error opening audio input")
                                })
                            }
                            var Gibberish = {
                                memo: {},
                                codeblock: [],
                                analysisCodeblock: [],
                                analysisUgens: [],
                                dirtied: [],
                                id: 0,
                                isDirty: !1,
                                out: null,
                                debug: !1,
                                callback: "",
                                audioFiles: {},
                                sequencers: [],
                                callbackArgs: ["input"],
                                callbackObjects: [],
                                analysisCallbackArgs: [],
                                analysisCallbackObjects: [],
                                createCallback: function() {
                                    this.memo = {}, this.codeblock.length = 0, this.callbackArgs.length = 0, this.callbackObjects.length = 0, this.analysisCallbackArgs.length = 0, this.dirtied.length = 0, this.codestring = "", this.args = ["input"], this.memo = {}, this.out.codegen();
                                    var e = this.codeblock.slice(0);
                                    if (this.analysisUgens.length > 0) {
                                        this.analysisCodeblock.length = 0;
                                        for (var t = 0; t < this.analysisUgens.length; t++) this.analysisCallbackArgs.push(this.analysisUgens[t].analysisSymbol)
                                    }
                                    if (this.args = this.args.concat(this.callbackArgs), this.args = this.args.concat(this.analysisCallbackArgs), this.codestring += e.join("	"), this.codestring += "\n	", this.analysisUgens.length > 0) {
                                        this.analysisCodeblock.length = 0;
                                        for (var t = 0; t < this.analysisUgens.length; t++) this.codeblock.length = 0, this.analysisUgens[t].analysisCodegen();
                                        this.codestring += this.analysisCodeblock.join("\n	"), this.codestring += "\n	"
                                    }
                                    return this.codestring += "return " + this.out.variable + ";\n", this.callbackString = this.codestring, this.debug && console.log(this.callbackString), [this.args, this.codestring]
                                },
                                audioProcess: function(e) {
                                    var t, i, n = e.outputBuffer.getChannelData(0),
                                        r = e.outputBuffer.getChannelData(1),
                                        s = e.inputBuffer.getChannelData(0),
                                        o = Gibberish,
                                        a = o.callback,
                                        u = o.sequencers,
                                        c = (Gibberish.out.callback, o.callbackObjects.slice(0));
                                    c.unshift(0);
                                    for (var l = 0, p = e.outputBuffer.length; p > l; l++) {
                                        for (var h = 0; h < u.length; h++) u[h].tick();
                                        if (o.isDirty) {
                                            t = o.createCallback();
                                            try {
                                                a = o.callback = new Function(t[0], t[1])
                                            } catch (e) {
                                                console.error("ERROR WITH CALLBACK : \n\n", t)
                                            }
                                            o.isDirty = !1, c = o.callbackObjects.slice(0), c.unshift(0)
                                        }
                                        c[0] = s[l], i = a.apply(null, c), n[l] = i[0], r[l] = i[1]
                                    }
                                },
                                audioProcessFirefox: function(e) {
                                    var t, i = Gibberish,
                                        n = i.callback,
                                        r = i.sequencers,
                                        s = i.callbackObjects.slice(0);
                                    s.unshift(0);
                                    for (var o = 0, a = e.length; a > o; o += 2) {
                                        for (var u = 0; u < r.length; u++) r[u].tick();
                                        if (i.isDirty) {
                                            t = i.createCallback();
                                            try {
                                                n = i.callback = new Function(t[0], t[1])
                                            } catch (c) {
                                                console.error("ERROR WITH CALLBACK : \n\n", n)
                                            }
                                            i.isDirty = !1, s = i.callbackObjects.slice(0), s.unshift(0)
                                        }
                                        var l = n.apply(null, s);
                                        e[o] = l[0], e[o + 1] = l[1]
                                    }
                                },
                                clear: function() {
                                    this.out.inputs.length = 0, this.analysisUgens.length = 0, this.sequencers.length = 0, this.callbackArgs.length = 2, this.callbackObjects.length = 1, Gibberish.dirty(this.out)
                                },
                                dirty: function(e) {
                                    if ("undefined" != typeof e) {
                                        for (var t = !1, i = 0; i < this.dirtied.length; i++) this.dirtied[i].variable === e.variable && (t = !0);
                                        t || (this.isDirty = !0, this.dirtied.push(e))
                                    } else this.isDirty = !0
                                },
                                generateSymbol: function(e) {
                                    return e + "_" + this.id++
                                },
                                AudioDataDestination: function(e, t) {
                                    var i = new Audio;
                                    i.mozSetup(2, e);
                                    var n, r = 0,
                                        s = e / 2,
                                        o = null;
                                    setInterval(function() {
                                        var e;
                                        if (o) {
                                            if (e = i.mozWriteAudio(o.subarray(n)), r += e, n += e, n < o.length) return;
                                            o = null
                                        }
                                        var a = i.mozCurrentSampleOffset(),
                                            u = a + s - r;
                                        if (u > 0) {
                                            var c = new Float32Array(u);
                                            t(c), e = i.mozWriteAudio(c), a = i.mozCurrentSampleOffset(), e < c.length && (o = c, n = e), r += e
                                        }
                                    }, 100)
                                },
                                init: function() {
                                    var e, t, i = "undefined" == typeof arguments[0] ? 1024 : arguments[0];
                                    return "undefined" != typeof webkitAudioContext ? e = webkitAudioContext : "undefined" != typeof AudioContext && (e = AudioContext), t = function() {
                                        if ("undefined" != typeof e) {
                                            if (document && document.documentElement && "ontouchstart" in document.documentElement && (window.removeEventListener("touchstart", t), "ontouchstart" in document.documentElement)) {
                                                var i = Gibberish.context.createBufferSource();
                                                i.connect(Gibberish.context.destination), i.noteOn(0)
                                            }
                                        } else alert("Your browser does not support javascript audio synthesis. Please download a modern web browser that is not Internet Explorer.");
                                        Gibberish.onstart && Gibberish.onstart()
                                    }, Gibberish.context = new e, Gibberish.node = Gibberish.context.createScriptProcessor(i, 2, 2, Gibberish.context.sampleRate), Gibberish.node.onaudioprocess = Gibberish.audioProcess, Gibberish.node.connect(Gibberish.context.destination), Gibberish.out = new Gibberish.Bus2, Gibberish.out.codegen(), Gibberish.dirty(Gibberish.out), document && document.documentElement && "ontouchstart" in document.documentElement ? window.addEventListener("touchstart", t) : t(), this
                                },
                                makePanner: function() {
                                    for (var e = [], t = [], i = Math.sqrt(2) / 2, n = 0; 1024 > n; n++) {
                                        var r = -1 + n / 1024 * 2;
                                        e[n] = i * (Math.cos(r) - Math.sin(r)), t[n] = i * (Math.cos(r) + Math.sin(r))
                                    }
                                    return function(i, n, r) {
                                        var s, o, a, u, c, l, p = "object" == typeof i,
                                            h = p ? i[0] : i,
                                            f = p ? i[1] : i;
                                        return s = 1023 * (n + 1) / 2, o = 0 | s, a = s - o, o = 1023 & o, u = 1023 === o ? 0 : o + 1, c = e[o], l = e[u], r[0] = (c + a * (l - c)) * h, c = t[o], l = t[u], r[1] = (c + a * (l - c)) * f, r
                                    }
                                },
                                defineUgenProperty: function(e, t, i) {
                                    var n = i.properties[e] = {
                                        value: t,
                                        binops: [],
                                        parent: i,
                                        name: e
                                    };
                                    Object.defineProperty(i, e, {
                                        configurable: !0,
                                        get: function() {
                                            return n.value
                                        },
                                        set: function(e) {
                                            n.value = e, Gibberish.dirty(i)
                                        }
                                    })
                                },
                                polyInit: function(e) {
                                    e.mod = e.polyMod, e.removeMod = e.removePolyMod, e.voicesClear = function() {
                                        if (e.children.length > 0) {
                                            for (var t = 0; t < e.children.length; t++) e.children[t].disconnect();
                                            e.children.length = 0, e.voiceCount = 0
                                        }
                                    };
                                    for (var t in e.polyProperties) ! function(t) {
                                        var i = e.polyProperties[t];
                                        Object.defineProperty(e, t, {
                                            configurable: !0,
                                            get: function() {
                                                return i
                                            },
                                            set: function(n) {
                                                i = n;
                                                for (var r = 0; r < e.children.length; r++) e.children[r][t] = i
                                            }
                                        })
                                    }(t);
                                    var i = e.maxVoices;
                                    Object.defineProperty(e, "maxVoices", {
                                        get: function() {
                                            return i
                                        },
                                        set: function(e) {
                                            i = e, this.voicesClear(), this.initVoices()
                                        }
                                    })
                                },
                                interpolate: function(e, t) {
                                    var i = 0 | t,
                                        n = i + 1 > e.length - 1 ? 0 : i + 1;
                                    return frac = t - i, e[i] + frac * (e[n] - e[i])
                                },
                                pushUnique: function(e, t) {
                                    for (var i = e, n = !0, r = 0; r < t.length; r++)
                                        if (i === t[r]) {
                                            n = !1;
                                            break
                                        }
                                    n && t.push(i)
                                },
                                "export": function(e, t) {
                                    for (var i in Gibberish[e]) t[i] = Gibberish[e][i]
                                },
                                ugen: function() {
                                    Gibberish.extend(this, {
                                        processProperties: function() {
                                            if ("object" != typeof arguments[0][0] || "undefined" != typeof arguments[0][0].type || Array.isArray(arguments[0][0]) || "op" === arguments[0][0].name) {
                                                var e = 0;
                                                for (var t in this.properties) "object" == typeof this.properties[t] && "undefined" != typeof this.properties[t].binops ? "undefined" != typeof arguments[0][e] && (this.properties[t].value = arguments[0][e++]) : "undefined" != typeof arguments[0][e] && (this.properties[t] = arguments[0][e++])
                                            } else {
                                                var i = arguments[0][0];
                                                for (var t in i) "undefined" != typeof i[t] && ("object" == typeof this.properties[t] && "undefined" != typeof this.properties[t].binops ? this.properties[t].value = i[t] : this[t] = i[t])
                                            }
                                            return this
                                        },
                                        valueOf: function() {
                                            return this.codegen(), this.variable
                                        },
                                        codegen: function() {
                                            var e = "",
                                                t = null;
                                            if (Gibberish.memo[this.symbol]) return Gibberish.memo[this.symbol];
                                            t = this.variable ? this.variable : Gibberish.generateSymbol("v"), Gibberish.memo[this.symbol] = t, this.variable = t, e += "var " + t + " = " + this.symbol + "(";
                                            for (var i in this.properties) {
                                                var n = this.properties[i],
                                                    r = "";
                                                if (Array.isArray(n.value)) {
                                                    0 === n.value.length && (r = 0);
                                                    for (var s = 0; s < n.value.length; s++) {
                                                        var o = n.value[s];
                                                        r += "object" == typeof o ? null !== o ? o.valueOf() : "null" : "function" == typeof n.value ? n.value() : n.value, r += s < n.value.length - 1 ? ", " : ""
                                                    }
                                                } else "object" == typeof n.value ? null !== n.value && (r = n.value.codegen ? n.value.valueOf() : n.value) : "undefined" !== n.name && (r = "function" == typeof n.value ? n.value() : n.value);
                                                if (0 != n.binops.length) {
                                                    for (var a = 0; a < n.binops.length; a++) e += "(";
                                                    for (var u = 0; u < n.binops.length; u++) {
                                                        var c, l = n.binops[u];
                                                        c = "number" == typeof l.ugen ? l.ugen : null !== l.ugen ? l.ugen.valueOf() : "null", "=" === l.binop ? (e = e.replace(r, ""), e += c) : "++" === l.binop ? e += " + Math.abs(" + c + ")" : (0 === u && (e += r), e += " " + l.binop + " " + c + ")")
                                                    }
                                                } else e += r;
                                                e += ", "
                                            }
                                            return " " === e.charAt(e.length - 1) && (e = e.slice(0, -2)), e += ");\n", this.codeblock = e, -1 === Gibberish.codeblock.indexOf(this.codeblock) && Gibberish.codeblock.push(this.codeblock), -1 === Gibberish.callbackArgs.indexOf(this.symbol) && "op" !== this.name && Gibberish.callbackArgs.push(this.symbol), -1 === Gibberish.callbackObjects.indexOf(this.callback) && "op" !== this.name && Gibberish.callbackObjects.push(this.callback), this.dirty = !1, t
                                        },
                                        init: function() {
                                            if (this.initalized || (this.symbol = Gibberish.generateSymbol(this.name), this.codeblock = null, this.variable = null), "undefined" == typeof this.properties && (this.properties = {}), !this.initialized) {
                                                this.destinations = [];
                                                for (var e in this.properties) Gibberish.defineUgenProperty(e, this.properties[e], this)
                                            }
                                            if (arguments.length > 0 && "object" == typeof arguments[0][0] && "undefined" === arguments[0][0].type) {
                                                var t = arguments[0][0];
                                                for (var e in t) this[e] = t[e]
                                            }
                                            return this.initialized = !0, this
                                        },
                                        mod: function(e, t, i) {
                                            var n = this.properties[e],
                                                r = {
                                                    ugen: t,
                                                    binop: i
                                                };
                                            n.binops.push(r), Gibberish.dirty(this)
                                        },
                                        removeMod: function(e, t) {
                                            if ("undefined" == typeof t) this.properties[e].binops.length = 0;
                                            else if ("number" == typeof t) this.properties[e].binops.splice(t, 1);
                                            else if ("object" == typeof t)
                                                for (var i = 0, n = this.properties[e].binops.length; n > i; i++) this.properties[e].binops[i].ugen === t && this.properties[e].binops.splice(i, 1);
                                            Gibberish.dirty(this)
                                        },
                                        polyMod: function(e, t, i) {
                                            for (var n = 0; n < this.children.length; n++) this.children[n].mod(e, t, i);
                                            Gibberish.dirty(this)
                                        },
                                        removePolyMod: function() {
                                            var e = Array.prototype.slice.call(arguments, 0);
                                            if ("amp" !== arguments[0] && "pan" !== arguments[0])
                                                for (var t = 0; t < this.children.length; t++) this.children[t].removeMod.apply(this.children[t], e);
                                            else this.removeMod.apply(this, e);
                                            Gibberish.dirty(this)
                                        },
                                        smooth: function(e) {
                                            var t = new Gibberish.OnePole;
                                            this.mod(e, t, "=")
                                        },
                                        connect: function(e, t) {
                                            return "undefined" == typeof e && (e = Gibberish.out), -1 === this.destinations.indexOf(e) && (e.addConnection(this, 1, t), this.destinations.push(e)), this
                                        },
                                        send: function(e, t) {
                                            return -1 === this.destinations.indexOf(e) ? (e.addConnection(this, t), this.destinations.push(e)) : e.adjustSendAmount(this, t), this
                                        },
                                        disconnect: function(e) {
                                            var t;
                                            if (e) t = this.destinations.indexOf(e), t > -1 && this.destinations.splice(t, 1), e.removeConnection(this);
                                            else {
                                                for (var i = 0; i < this.destinations.length; i++) this.destinations[i].removeConnection(this);
                                                this.destinations = []
                                            }
                                            return Gibberish.dirty(this), this
                                        }
                                    })
                                }
                            };
                            Array2 = function() {
                                this.length = 0
                            }, Array2.prototype = [], Array2.prototype.remove = function(e, t) {
                                if (t = "undefined" == typeof t ? !0 : t, "undefined" == typeof e) {
                                    for (var i = 0; i < this.length; i++) delete this[i];
                                    this.length = 0
                                } else if ("number" == typeof e) this.splice(e, 1);
                                else if ("string" == typeof e) {
                                    for (var n = [], i = 0; i < this.length; i++) {
                                        var r = this[i];
                                        if (r.type === e || r.name === e) {
                                            if (!t) return void this.splice(i, 1);
                                            n.push(i)
                                        }
                                    }
                                    for (var i = 0; i < n.length; i++) this.splice(n[i], 1)
                                } else if ("object" == typeof e)
                                    for (var s = this.indexOf(e); s > -1;) this.splice(s, 1), s = this.indexOf(e);
                                this.parent && Gibberish.dirty(this.parent)
                            }, Array2.prototype.get = function(e) {
                                if ("number" == typeof e) return this[e];
                                if ("string" == typeof e)
                                    for (var t = 0; t < this.length; t++) {
                                        var i = this[t];
                                        if (i.name === e) return i
                                    } else if ("object" == typeof e) {
                                        var n = this.indexOf(e);
                                        if (n > -1) return this[n]
                                    }
                                return null
                            }, Array2.prototype.replace = function(e, t) {
                                if (t.parent = this, t.input = e.input, "number" != typeof e) {
                                    var i = this.indexOf(e);
                                    i > -1 && this.splice(i, 1, t)
                                } else this.splice(e, 1, t);
                                this.parent && Gibberish.dirty(this.parent)
                            }, Array2.prototype.insert = function(e, t) {
                                if (e.parent = this, this.input = this.parent, Array.isArray(e))
                                    for (var i = 0; i < e.length; i++) this.splice(t + i, 0, e[i]);
                                else this.splice(t, 0, e);
                                this.parent && Gibberish.dirty(this.parent)
                            }, Array2.prototype.add = function() {
                                for (var e = 0; e < arguments.length; e++) arguments[e].parent = this, arguments[e].input = this.parent, this.push(arguments[e]);
                                this.parent && (console.log("DIRTYING"), Gibberish.dirty(this.parent))
                            };
                            var rnd = Math.random;
                            Gibberish.rndf = function(e, t, i, n) {
                                if (n = "undefined" == typeof n ? !0 : n, "undefined" == typeof i && "object" != typeof e) {
                                    1 == arguments.length ? (t = arguments[0], e = 0) : 2 == arguments.length ? (e = arguments[0], t = arguments[1]) : (e = 0, t = 1);
                                    var r = t - e,
                                        s = Math.random(),
                                        o = r * s;
                                    return e + o
                                }
                                var a = [],
                                    u = [];
                                "undefined" == typeof i && (i = t || e.length);
                                for (var c = 0; i > c; c++) {
                                    var l;
                                    if ("object" == typeof arguments[0]) l = arguments[0][rndi(0, arguments[0].length - 1)];
                                    else if (n) l = Gibberish.rndf(e, t);
                                    else {
                                        for (l = Gibberish.rndf(e, t); u.indexOf(l) > -1;) l = Gibberish.rndf(e, t);
                                        u.push(l)
                                    }
                                    a.push(l)
                                }
                                return a
                            }, Gibberish.Rndf = function() {
                                var e, t, i, n;
                                return Math.random, 0 === arguments.length ? (e = 0, t = 1) : 1 === arguments.length ? (t = arguments[0], e = 0) : 2 === arguments.length ? (e = arguments[0], t = arguments[1]) : 3 === arguments.length ? (e = arguments[0], t = arguments[1], i = arguments[2]) : (e = arguments[0], t = arguments[1], i = arguments[2], n = arguments[3]),
                                    function() {
                                        var r, s, o;
                                        return s = "function" == typeof e ? e() : e, o = "function" == typeof t ? t() : t, r = "undefined" == typeof i ? Gibberish.rndf(s, o) : Gibberish.rndf(s, o, i, n)
                                    }
                            }, Gibberish.rndi = function(e, t, i, n) {
                                var r;
                                if (0 === arguments.length ? (e = 0, t = 1) : 1 === arguments.length ? (t = arguments[0], e = 0) : 2 === arguments.length ? (e = arguments[0], t = arguments[1]) : (e = arguments[0], t = arguments[1], i = arguments[2], n = arguments[3]), r = t - e, i > r && (n = !0), "undefined" == typeof i) return r = t - e, Math.round(e + Math.random() * r);
                                for (var s = [], o = [], a = 0; i > a; a++) {
                                    var u;
                                    if (n) u = Gibberish.rndi(e, t);
                                    else {
                                        for (u = Gibberish.rndi(e, t); o.indexOf(u) > -1;) u = Gibberish.rndi(e, t);
                                        o.push(u)
                                    }
                                    s.push(u)
                                }
                                return s
                            }, Gibberish.Rndi = function() {
                                var e, t, i, n, r;
                                return Math.random, Math.round, 0 === arguments.length ? (e = 0, t = 1) : 1 === arguments.length ? (t = arguments[0], e = 0) : 2 === arguments.length ? (e = arguments[0], t = arguments[1]) : 3 === arguments.length ? (e = arguments[0], t = arguments[1], i = arguments[2]) : (e = arguments[0], t = arguments[1], i = arguments[2], n = arguments[3]), r = t - e, "number" == typeof i && i > r && (n = !0),
                                    function() {
                                        var r, s, o;
                                        return s = "function" == typeof e ? e() : e, o = "function" == typeof t ? t() : t, r = "undefined" == typeof i ? Gibberish.rndi(s, o) : Gibberish.rndi(s, o, i, n)
                                    }
                            }, Gibberish.extend = function(e, t) {
                                for (var i in t) i.split("."), t[i] instanceof Array && t[i].length < 100 ? (e[i] = t[i].slice(0), "fx" === i && (e[i].parent = t[i].parent)) : "object" != typeof t[i] || null === t[i] || t[i] instanceof Float32Array ? e[i] = t[i] : (e[i] = e[i] || {}, arguments.callee(e[i], t[i]));
                                return e
                            }, Function.prototype.clone = function() {
                                return eval("[" + this.toString() + "]")[0]
                            }, String.prototype.format = function(e, t, i) {
                                function n() {
                                    var n = this,
                                        r = arguments.length + 1;
                                    for (e = 0; r > e; i = arguments[e++]) t = i, n = n.replace(RegExp("\\{" + (e - 1) + "\\}", "g"), t);
                                    return n
                                }
                                return n.native = String.prototype.format, n
                            }(), Gibberish.future = function(e, t) {
                                var i = new Gibberish.Sequencer({
                                    values: [function() {}, function() {
                                        e(), i.stop(), i.disconnect()
                                    }],
                                    durations: [t]
                                }).start();
                                return i.cancel = function() {
                                    i.stop(), i.disconnect()
                                }, i
                            }, Gibberish.Proxy = function() {
                                var e = 0;
                                Gibberish.extend(this, {
                                    name: "proxy",
                                    type: "effect",
                                    properties: {},
                                    callback: function() {
                                        return e
                                    }
                                }).init(), this.input = arguments[0], e = this.input.parent[this.input.name], delete this.input.parent[this.input.name], this.input.parent.properties[this.input.name].value = this, Object.defineProperty(this.input.parent, this.input.name, {
                                    get: function() {
                                        return e
                                    },
                                    set: function(t) {
                                        e = t
                                    }
                                }), Gibberish.dirty(this.input.parent)
                            }, Gibberish.Proxy.prototype = new Gibberish.ugen, Gibberish.Proxy2 = function() {
                                var e = arguments[0],
                                    t = arguments[1];
                                Gibberish.extend(this, {
                                    name: "proxy2",
                                    type: "effect",
                                    properties: {},
                                    callback: function() {
                                        var i = e[t];
                                        return Array.isArray(i) ? (i[0] + i[1] + i[2]) / 3 : i
                                    }
                                }).init(), this.getInput = function() {
                                    return e
                                }, this.setInput = function(t) {
                                    e = t
                                }, this.getName = function() {
                                    return t
                                }, this.setName = function(e) {
                                    t = e
                                }
                            }, Gibberish.Proxy2.prototype = new Gibberish.ugen, Gibberish.Proxy3 = function() {
                                var e = arguments[0],
                                    t = arguments[1];
                                Gibberish.extend(this, {
                                    name: "proxy3",
                                    type: "effect",
                                    properties: {},
                                    callback: function() {
                                        var i = e[t];
                                        return i || 0
                                    }
                                }), this.init(), this.codegen = function() {
                                    console.log(" CALLED "), this.variable || (this.variable = Gibberish.generateSymbol("v")), Gibberish.callbackArgs.push(this.symbol), Gibberish.callbackObjects.push(this.callback), this.codeblock = "var " + this.variable + " = " + this.symbol + "(" + e.properties[t].codegen() + ");\n"
                                }
                            }, Gibberish.Proxy3.prototype = new Gibberish.ugen, Gibberish.oscillator = function() {
                                this.type = "oscillator", this.oscillatorInit = function() {
                                    return this.fx = new Array2, this.fx.parent = this, this
                                }
                            }, Gibberish.oscillator.prototype = new Gibberish.ugen, Gibberish._oscillator = new Gibberish.oscillator, Gibberish.Wavetable = function() {
                                var e = 0,
                                    t = null,
                                    i = Gibberish.context.sampleRate / 1024,
                                    n = 0;
                                this.properties = {
                                    frequency: 440,
                                    amp: .25,
                                    sync: 0
                                }, this.getTable = function() {
                                    return t
                                }, this.setTable = function(e) {
                                    t = e, i = Gibberish.context.sampleRate / t.length
                                }, this.getTableFreq = function() {
                                    return i
                                }, this.setTableFreq = function(e) {
                                    i = e
                                }, this.getPhase = function() {
                                    return e
                                }, this.setPhase = function(t) {
                                    e = t
                                }, this.callback = function(r, s) {
                                    var o, a, u, c, l, p;
                                    for (e += r / i; e >= 1024;) e -= 1024;
                                    return o = 0 | e, a = e - o, o = 1023 & o, u = 1023 === o ? 0 : o + 1, c = t[o], l = t[u], 0 !== p && (n = p), (c + a * (l - c)) * s
                                }
                            }, Gibberish.Wavetable.prototype = Gibberish._oscillator, Gibberish.Table = function(e) {
                                this.__proto__ = new Gibberish.Wavetable, this.name = "table";
                                var t = 2 * Math.PI;
                                if ("undefined" == typeof e) {
                                    e = new Float32Array(1024);
                                    for (var i = 1024; i--;) e[i] = Math.sin(i / 1024 * t)
                                }
                                this.setTable(e), this.init(), this.oscillatorInit()
                            }, Gibberish.asmSine = function(e, t, i) {
                                "use asm";

                                function n() {
                                    for (var e = 1024, t = 1024; e = e - 1 | 0;) t -= 1, u[e >> 2] = +o(+(t / 1024) * 6.2848);
                                    l = 44100 / 1024
                                }

                                function r(e, t, i) {
                                    e = +e, t = +t, i = +i;
                                    var n = 0,
                                        r = 0,
                                        s = 0,
                                        o = 0,
                                        p = 0,
                                        h = 0;
                                    return a = +(a + e / l), a >= 1024 && (a = +(a - 1024)), n = +c(a), o = a - n, r = ~~n, s = (r | 0) == 1024 ? 0 : r + 1 | 0, p = +u[r >> 2], h = +u[s >> 2], +((p + o * (h - p)) * t)
                                }

                                function s(e) {
                                    return e |= 0, +u[e >> 2]
                                }
                                var o = e.Math.sin,
                                    a = 0,
                                    u = new e.Float32Array(i),
                                    c = e.Math.floor,
                                    l = 0;
                                return {
                                    init: n,
                                    gen: r,
                                    get: s
                                }
                            }, Gibberish.asmSine2 = function() {
                                this.properties = {
                                    frequency: 440,
                                    amp: .5,
                                    sr: Gibberish.context.sampleRate
                                }, this.name = "sine";
                                var e = new ArrayBuffer(4096),
                                    t = Gibberish.asmSine(window, null, e);
                                return t.init(), this.getTable = function() {
                                    return e
                                }, this.get = t.get, this.callback = t.gen, this.init(), this.oscillatorInit(), this.processProperties(arguments), this
                            }, Gibberish.asmSine2.prototype = Gibberish._oscillator, Gibberish.Sine = function() {
                                this.__proto__ = new Gibberish.Wavetable, this.name = "sine";
                                for (var e = 2 * Math.PI, t = new Float32Array(1024), i = 1024; i--;) t[i] = Math.sin(i / 1024 * e);
                                this.setTable(t), this.init(arguments), this.oscillatorInit(), this.processProperties(arguments)
                            }, Gibberish.Sine2 = function() {
                                this.__proto__ = new Gibberish.Sine, this.name = "sine2";
                                var e = this.__proto__.callback,
                                    t = Gibberish.makePanner(),
                                    i = [0, 0];
                                this.callback = function(n, r, s) {
                                    var o = e(n, r);
                                    return i = t(o, s, i)
                                }, this.init(), this.oscillatorInit(), Gibberish.defineUgenProperty("pan", 0, this), this.processProperties(arguments)
                            }, Gibberish.Square = function() {
                                this.__proto__ = new Gibberish.Wavetable, this.name = "square";
                                for (var e = (2 * Math.PI, new Float32Array(1024)), t = 1024; t--;) e[t] = t / 1024 > .5 ? 1 : -1;
                                this.setTable(e), this.init(arguments), this.oscillatorInit(), this.processProperties(arguments)
                            }, Gibberish.Saw = function() {
                                this.__proto__ = new Gibberish.Wavetable, this.name = "saw";
                                for (var e = new Float32Array(1024), t = 1024; t--;) e[t] = 4 * ((t / 1024 / 2 + .25) % .5 - .25);
                                this.setTable(e), this.init(arguments), this.oscillatorInit(), this.processProperties(arguments)
                            }, Gibberish.Saw2 = function() {
                                this.__proto__ = new Gibberish.Saw, this.name = "saw2";
                                var e = this.__proto__.callback,
                                    t = Gibberish.makePanner(),
                                    i = [0, 0];
                                this.callback = function(n, r, s) {
                                    var o = e(n, r);
                                    return i = t(o, s, i)
                                }, this.init(), Gibberish.defineUgenProperty("pan", 0, this)
                            }, Gibberish.Triangle = function() {
                                this.__proto__ = new Gibberish.Wavetable, this.name = "triangle";
                                for (var e = new Float32Array(1024), t = Math.abs, i = 1024; i--;) e[i] = 1 - 4 * t((i / 1024 + .25) % 1 - .5);
                                this.setTable(e), this.init(arguments), this.oscillatorInit(), this.processProperties(arguments)
                            }, Gibberish.Triangle2 = function() {
                                this.__proto__ = new Gibberish.Triangle, this.name = "triangle2";
                                var e = this.__proto__.callback,
                                    t = Gibberish.makePanner(),
                                    i = [0, 0];
                                this.callback = function(n, r, s) {
                                    var o = e(n, r);
                                    return t(o, s, i)
                                }, this.init(), this.oscillatorInit(), Gibberish.defineUgenProperty("pan", 0, this), this.processProperties(arguments)
                            }, Gibberish.Saw3 = function() {
                                var e = 0,
                                    t = 0,
                                    i = 2.5,
                                    n = -1.5,
                                    r = 0,
                                    s = Math.sin,
                                    o = 11;
                                pi_2 = 2 * Math.PI, flip = 0, signHistory = 0, ignore = !1, sr = Gibberish.context.sampleRate, Gibberish.extend(this, {
                                    name: "saw",
                                    properties: {
                                        frequency: 440,
                                        amp: .15,
                                        sync: 0,
                                        sr: Gibberish.context.sampleRate
                                    },
                                    callback: function(a) {
                                        var u = a / sr,
                                            c = .5 - u,
                                            l = o * c * c * c * c,
                                            p = .376 - .752 * u,
                                            h = 1 - 2 * u,
                                            f = 0;
                                        return t += u, t -= t > 1 ? 2 : 0, e = .5 * (e + s(pi_2 * (t + e * l))), f = i * e + n * r, r = e, f += p, f *= h
                                    }
                                }), Object.defineProperty(this, "scale", {
                                    get: function() {
                                        return o
                                    },
                                    set: function(e) {
                                        o = e
                                    }
                                }), this.init(), this.oscillatorInit(), this.processProperties(arguments)
                            }, Gibberish.Saw3.prototype = Gibberish._oscillator, Gibberish.PWM = function() {
                                var e = 0,
                                    t = 0,
                                    i = 0,
                                    n = 0,
                                    r = 0,
                                    s = 2.5,
                                    o = -1.5,
                                    a = Math.sin,
                                    u = 11;
                                pi_2 = 2 * Math.PI, test = 0, sr = Gibberish.context.sampleRate, Gibberish.extend(this, {
                                    name: "pwm",
                                    properties: {
                                        frequency: 440,
                                        amp: .15,
                                        pulsewidth: .05,
                                        sr: Gibberish.context.sampleRate
                                    },
                                    callback: function(c, l, p) {
                                        var h = c / sr,
                                            f = .5 - h,
                                            b = u * f * f * f * f,
                                            m = 1 - 2 * h,
                                            d = 0;
                                        return r += h, r -= r > 1 ? 2 : 0, e = .5 * (e + a(pi_2 * (r + e * b))), t = .5 * (t + a(pi_2 * (r + t * b + p))), d = t - e, d = s * d + o * (i - n), i = e, n = t, d * m * l
                                    }
                                }), Object.defineProperty(this, "scale", {
                                    get: function() {
                                        return u
                                    },
                                    set: function(e) {
                                        u = e
                                    }
                                }), this.init(), this.oscillatorInit(), this.processProperties(arguments)
                            }, Gibberish.PWM.prototype = Gibberish._oscillator, Gibberish.Noise = function() {
                                var e = Math.random;
                                Gibberish.extend(this, {
                                    name: "noise",
                                    properties: {
                                        amp: 1
                                    },
                                    callback: function(t) {
                                        return (2 * e() - 1) * t
                                    }
                                }), this.init(), this.oscillatorInit(), this.processProperties(arguments)
                            }, Gibberish.Noise.prototype = Gibberish._oscillator, Gibberish.KarplusStrong = function() {
                                var e = [0],
                                    t = 0,
                                    i = Math.random,
                                    n = Gibberish.makePanner(),
                                    r = Gibberish.context.sampleRate,
                                    s = [0, 0];
                                Gibberish.extend(this, {
                                    name: "karplus_strong",
                                    frequency: 0,
                                    properties: {
                                        blend: 1,
                                        damping: 0,
                                        amp: 1,
                                        channels: 2,
                                        pan: 0
                                    },
                                    note: function(t) {
                                        var n = Math.floor(r / t);
                                        e.length = 0;
                                        for (var s = 0; n > s; s++) e[s] = 2 * i() - 1;
                                        this.frequency = t
                                    },
                                    callback: function(r, o, a, u, c) {
                                        var l = e.shift(),
                                            p = i() > r ? -1 : 1;
                                        o = o > 0 ? o : 0;
                                        var h = p * (l + t) * (.5 - o / 100);
                                        return t = h, e.push(h), h *= a, 1 === u ? h : n(h, c, s)
                                    }
                                }).init().oscillatorInit().processProperties(arguments)
                            }, Gibberish.KarplusStrong.prototype = Gibberish._oscillator, Gibberish.PolyKarplusStrong = function() {
                                this.__proto__ = new Gibberish.Bus2, Gibberish.extend(this, {
                                    name: "poly_karplus_strong",
                                    maxVoices: 5,
                                    voiceCount: 0,
                                    _frequency: 0,
                                    polyProperties: {
                                        blend: 1,
                                        damping: 0
                                    },
                                    note: function(e, t) {
                                        var i = this.children[this.voiceCount++];
                                        this.voiceCount >= this.maxVoices && (this.voiceCount = 0), i.note(e, t), this._frequency = e
                                    },
                                    initVoices: function() {
                                        for (var e = 0; e < this.maxVoices; e++) {
                                            var t = {
                                                    blend: this.blend,
                                                    damping: this.damping,
                                                    channels: 2,
                                                    amp: 1
                                                },
                                                i = new Gibberish.KarplusStrong(t).connect(this);
                                            this.children.push(i)
                                        }
                                    }
                                }), this.amp = 1 / this.maxVoices, this.children = [], "object" == typeof arguments[0] && (this.maxVoices = arguments[0].maxVoices ? arguments[0].maxVoices : this.maxVoices), Gibberish.polyInit(this), this.initVoices(), this.processProperties(arguments), this.initialized = !1, Gibberish._synth.oscillatorInit.call(this), Gibberish.dirty(this)
                            }, Gibberish.bus = function() {
                                this.type = "bus", this.inputCodegen = function() {
                                    var e, t = this.value.valueOf();
                                    return e = t + ", " + this.amp, this.codeblock = e, e
                                }, this.addConnection = function() {
                                    var e = arguments[2],
                                        t = {
                                            value: arguments[0],
                                            amp: arguments[1],
                                            codegen: this.inputCodegen,
                                            valueOf: function() {
                                                return this.codegen()
                                            }
                                        };
                                    "undefined" != typeof e ? this.inputs.splice(e, 0, t) : this.inputs.push(t), Gibberish.dirty(this)
                                }, this.removeConnection = function(e) {
                                    for (var t = 0; t < this.inputs.length; t++)
                                        if (this.inputs[t].value === e) {
                                            this.inputs.splice(t, 1), Gibberish.dirty(this);
                                            break
                                        }
                                }, this.adjustSendAmount = function(e, t) {
                                    for (var i = 0; i < this.inputs.length; i++)
                                        if (this.inputs[i].value === e) {
                                            this.inputs[i].amp = t, Gibberish.dirty(this);
                                            break
                                        }
                                }, this.callback = function() {
                                    var e = arguments[arguments.length - 2],
                                        t = arguments[arguments.length - 1];
                                    output[0] = output[1] = 0;
                                    for (var i = 0; i < arguments.length - 2; i += 2) {
                                        var n = "object" == typeof arguments[i],
                                            r = arguments[i + 1];
                                        output[0] += n ? arguments[i][0] * r : arguments[i] * r, output[1] += n ? arguments[i][1] * r : arguments[i] * r
                                    }
                                    return output[0] *= e, output[1] *= e, panner(output, t, output)
                                }
                            }, Gibberish.bus.prototype = new Gibberish.ugen, Gibberish._bus = new Gibberish.bus, Gibberish.Bus = function() {
                                return Gibberish.extend(this, {
                                    name: "bus",
                                    properties: {
                                        inputs: [],
                                        amp: 1
                                    },
                                    callback: function() {
                                        for (var e = 0, t = arguments.length - 1, i = arguments[t], n = 0; t > n; n++) e += arguments[n];
                                        return e *= i
                                    }
                                }), this.init(), this.processProperties(arguments), this
                            }, Gibberish.Bus.prototype = Gibberish._bus, Gibberish.Bus2 = function() {
                                this.name = "bus2", this.type = "bus", this.properties = {
                                    inputs: [],
                                    amp: 1,
                                    pan: 0
                                };
                                var e = [0, 0],
                                    t = Gibberish.makePanner();
                                this.callback = function() {
                                    var i = arguments,
                                        n = i.length,
                                        r = i[n - 2],
                                        s = i[n - 1];
                                    e[0] = e[1] = 0;
                                    for (var o = 0, a = n - 2; a > o; o += 2) {
                                        var u = "object" == typeof i[o],
                                            c = i[o + 1];
                                        e[0] += u ? i[o][0] * c || 0 : i[o] * c || 0, e[1] += u ? i[o][1] * c || 0 : i[o] * c || 0
                                    }
                                    return e[0] *= r, e[1] *= r, t(e, s, e)
                                }, this.show = function() {
                                    console.log(e, args)
                                }, this.getOutput = function() {
                                    return e
                                }, this.getArgs = function() {
                                    return args
                                }, this.init(arguments), this.processProperties(arguments)
                            }, Gibberish.Bus2.prototype = Gibberish._bus, Gibberish.envelope = function() {
                                this.type = "envelope"
                            }, Gibberish.envelope.prototype = new Gibberish.ugen, Gibberish._envelope = new Gibberish.envelope, Gibberish.ExponentialDecay = function() {
                                var e = Math.pow,
                                    t = 0,
                                    i = 0;
                                Gibberish.extend(this, {
                                    name: "ExponentialDecay",
                                    properties: {
                                        decay: .5,
                                        length: 11050
                                    },
                                    callback: function(n, r) {
                                        return t = e(n, i), i += 1 / r, t
                                    },
                                    trigger: function() {
                                        i = "number" == typeof arguments[0] ? arguments[0] : 0
                                    }
                                }).init()
                            }, Gibberish.ExponentialDecay.prototype = Gibberish._envelope, Gibberish.Line = function(e, t, i, n) {
                                var r, s = {
                                        name: "line",
                                        properties: {
                                            start: e || 0,
                                            end: isNaN(t) ? 1 : t,
                                            time: i || Gibberish.context.sampleRate,
                                            loops: n || !1
                                        },
                                        retrigger: function(e, t) {
                                            o = 0, this.start = r, this.end = e, this.time = t, a = (e - r) / t
                                        }
                                    },
                                    o = 0,
                                    a = (t - e) / i;
                                return this.callback = function(e, t, i, n) {
                                    return r = i > o ? e + o++ * a : t, o = r >= t && n ? 0 : o, r
                                }, Gibberish.extend(this, s), this.init(), this
                            }, Gibberish.Line.prototype = Gibberish._envelope, Gibberish.AD = function(e, t) {
                                var i = 0,
                                    n = 0;
                                Gibberish.extend(this, {
                                    name: "AD",
                                    properties: {
                                        attack: e || 1e4,
                                        decay: t || 1e4
                                    },
                                    run: function() {
                                        return n = 0, i = 0, this
                                    },
                                    callback: function(e, t) {
                                        if (e = 0 > e ? 22050 : e, t = 0 > t ? 22050 : t, 0 === n) {
                                            var r = 1 / e;
                                            i += r, i >= 1 && n++
                                        } else if (1 === n) {
                                            var r = 1 / t;
                                            i -= r, 0 >= i && (i = 0, n++)
                                        }
                                        return i
                                    },
                                    getState: function() {
                                        return n
                                    }
                                }).init().processProperties(arguments)
                            }, Gibberish.AD.prototype = Gibberish._envelope, Gibberish.ADSR = function(e, t, i, n, r, s, o) {
                                var a = {
                                    name: "adsr",
                                    type: "envelope",
                                    requireReleaseTrigger: "undefined" != typeof o ? o : !1,
                                    properties: {
                                        attack: isNaN(e) ? 1e4 : e,
                                        decay: isNaN(t) ? 1e4 : t,
                                        sustain: isNaN(i) ? 22050 : i,
                                        release: isNaN(n) ? 1e4 : n,
                                        attackLevel: r || 1,
                                        sustainLevel: s || .5,
                                        releaseTrigger: 0
                                    },
                                    run: function() {
                                        this.setPhase(0), this.setState(0)
                                    },
                                    stop: function() {
                                        this.releaseTrigger = 1
                                    }
                                };
                                Gibberish.extend(this, a);
                                var u = 0,
                                    c = 0,
                                    l = 0,
                                    p = this;
                                return this.callback = function(e, t, i, n, r, s, o) {
                                    var a = 0;
                                    return l = 1 === l ? 1 : o, 0 === c ? (a = u / e * r, ++u / e === 1 && (c++, u = t)) : 1 === c ? (a = u / t * (r - s) + s, --u <= 0 && (null !== i ? (c += 1, u = i) : (c += 2, u = n))) : 2 === c ? (a = s, p.requireReleaseTrigger && l ? (c++, u = n, p.releaseTrigger = 0, l = 0) : 0 !== u-- || p.requireReleaseTrigger || (c++, u = n)) : 3 === c && (u--, a = u / n * s, 0 >= u && c++), a
                                }, this.call = function() {
                                    return this.callback(this.attack, this.decay, this.sustain, this.release, this.attackLevel, this.sustainLevel, this.releaseTrigger)
                                }, this.setPhase = function(e) {
                                    u = e
                                }, this.setState = function(e) {
                                    c = e, u = 0
                                }, this.getState = function() {
                                    return c
                                }, this.init(), this
                            }, Gibberish.ADSR.prototype = Gibberish._envelope, Gibberish.ADR = function(e, t, i, n, r) {
                                var s = {
                                    name: "adr",
                                    type: "envelope",
                                    properties: {
                                        attack: isNaN(e) ? 11025 : e,
                                        decay: isNaN(t) ? 11025 : t,
                                        release: isNaN(i) ? 22050 : i,
                                        attackLevel: n || 1,
                                        releaseLevel: r || .2
                                    },
                                    run: function() {
                                        this.setPhase(0), this.setState(0)
                                    }
                                };
                                Gibberish.extend(this, s);
                                var o = 0,
                                    a = 0;
                                return this.callback = function(e, t, i, n, r) {
                                    var s = 0;
                                    return 0 === a ? (s = o / e * n, ++o / e === 1 && (a++, o = t)) : 1 === a ? (s = o / t * (n - r) + r, --o <= 0 && (a += 1, o = i)) : 2 === a && (o--, s = o / i * r, 0 >= o && a++), s
                                }, this.setPhase = function(e) {
                                    o = e
                                }, this.setState = function(e) {
                                    a = e, o = 0
                                }, this.getState = function() {
                                    return a
                                }, this.init(), this
                            }, Gibberish.ADR.prototype = Gibberish._envelope, Gibberish.analysis = function() {
                                this.type = "analysis", this.codegen = function() {
                                    if (Gibberish.memo[this.symbol]) return Gibberish.memo[this.symbol];
                                    var e = this.variable ? this.variable : Gibberish.generateSymbol("v");
                                    return Gibberish.memo[this.symbol] = e, this.variable = e, Gibberish.callbackArgs.push(this.symbol), Gibberish.callbackObjects.push(this.callback), this.codeblock = "var " + this.variable + " = " + this.symbol + "();\n", -1 === Gibberish.codeblock.indexOf(this.codeblock) && Gibberish.codeblock.push(this.codeblock), this.variable
                                }, this.analysisCodegen = function() {
                                    var e = 0;
                                    this.input.codegen ? (e = this.input.codegen(), e.indexOf("op") > -1 && console.log("ANALYSIS BUG")) : e = this.input.value ? "undefined" != typeof this.input.value.codegen ? this.input.value.codegen() : this.input.value : "null";
                                    var t = this.analysisSymbol + "(" + e + ",";
                                    for (var i in this.properties) "input" !== i && (t += this[i] + ",");
                                    return t = t.slice(0, -1), t += ");", this.analysisCodeblock = t, -1 === Gibberish.analysisCodeblock.indexOf(this.analysisCodeblock) && Gibberish.analysisCodeblock.push(this.analysisCodeblock), -1 === Gibberish.callbackObjects.indexOf(this.analysisCallback) && Gibberish.callbackObjects.push(this.analysisCallback), t
                                }, this.remove = function() {
                                    Gibberish.analysisUgens.splice(Gibberish.analysisUgens.indexOf(this), 1)
                                }, this.analysisInit = function() {
                                    this.analysisSymbol = Gibberish.generateSymbol(this.name), Gibberish.analysisUgens.push(this), Gibberish.dirty()
                                }
                            }, Gibberish.analysis.prototype = new Gibberish.ugen, Gibberish._analysis = new Gibberish.analysis, Gibberish.Follow = function() {
                                this.name = "follow", this.properties = {
                                    input: 0,
                                    bufferSize: 4410,
                                    mult: 1,
                                    useAbsoluteValue: !0
                                };
                                var e = Math.abs,
                                    t = [0],
                                    i = 0,
                                    n = 0,
                                    r = 0;
                                this.analysisCallback = function(s, o, a, u) {
                                    "object" == typeof s && (s = s[0] + s[1]), i += u ? e(s) : s, i -= t[n], t[n] = u ? e(s) : s, n = (n + 1) % o, t[n] = t[n] ? t[n] : 0, r = i / o * a
                                }, this.callback = this.getValue = function() {
                                    return r
                                }, this.init(), this.analysisInit(), this.processProperties(arguments);
                                var s = (this.__lookupSetter__("bufferSize"), this.bufferSize);
                                Object.defineProperty(this, "bufferSize", {
                                    get: function() {
                                        return s
                                    },
                                    set: function(e) {
                                        s = e, i = 0, t = [0], n = 0
                                    }
                                })
                            }, Gibberish.Follow.prototype = Gibberish._analysis, Gibberish.SingleSampleDelay = function() {
                                this.name = "single_sample_delay", this.properties = {
                                    input: arguments[0] || 0,
                                    amp: arguments[1] || 1
                                };
                                var e = 0;
                                this.analysisCallback = function(t) {
                                    e = t
                                }, this.callback = function() {
                                    return e
                                }, this.getValue = function() {
                                    return e
                                }, this.init(), this.analysisInit(), this.processProperties(arguments)
                            }, Gibberish.SingleSampleDelay.prototype = Gibberish._analysis, Gibberish.Record = function(e, t, i) {
                                var n = new Float32Array(t),
                                    r = 0,
                                    s = !1,
                                    o = this;
                                Gibberish.extend(this, {
                                    name: "record",
                                    oncomplete: i,
                                    properties: {
                                        input: 0,
                                        size: t || 0
                                    },
                                    analysisCallback: function(e, t) {
                                        s && (n[r++] = "object" == typeof e ? e[0] + e[1] : e, r >= t && (s = !1, o.remove()))
                                    },
                                    record: function() {
                                        return r = 0, s = !0, this
                                    },
                                    getBuffer: function() {
                                        return n
                                    },
                                    getPhase: function() {
                                        return r
                                    },
                                    remove: function() {
                                        "undefined" != typeof this.oncomplete && this.oncomplete();
                                        for (var e = 0; e < Gibberish.analysisUgens.length; e++) {
                                            var t = Gibberish.analysisUgens[e];
                                            if (t === this) return Gibberish.callbackArgs.indexOf(this.analysisSymbol) > -1 && Gibberish.callbackArgs.splice(Gibberish.callbackArgs.indexOf(this.analysisSymbol), 1), Gibberish.callbackObjects.indexOf(this.analysisCallback) > -1 && Gibberish.callbackObjects.splice(Gibberish.callbackObjects.indexOf(this.analysisCallback), 1), void Gibberish.analysisUgens.splice(e, 1)
                                        }
                                    }
                                }), this.properties.input = e, this.init(), this.analysisInit(), Gibberish.dirty()
                            }, Gibberish.Record.prototype = Gibberish._analysis, Gibberish.effect = function() {
                                this.type = "effect"
                            }, Gibberish.effect.prototype = new Gibberish.ugen, Gibberish._effect = new Gibberish.effect, Gibberish.Distortion = function() {
                                var e = Math.abs,
                                    t = Math.log,
                                    i = Math.LN2;
                                Gibberish.extend(this, {
                                    name: "distortion",
                                    properties: {
                                        input: 0,
                                        amount: 50
                                    },
                                    callback: function(n, r) {
                                        var s;
                                        return r = r > 2 ? r : 2, "number" == typeof n ? (s = n * r, n = s / (1 + e(s)) / (t(r) / i)) : (s = n[0] * r, n[0] = s / (1 + e(s)) / (t(r) / i), s = n[1] * r, n[1] = s / (1 + e(s)) / (t(r) / i)), n
                                    }
                                }).init().processProperties(arguments)
                            }, Gibberish.Distortion.prototype = Gibberish._effect, Gibberish.Gain = function() {
                                Gibberish.extend(this, {
                                    name: "gain",
                                    properties: {
                                        input: 0,
                                        amount: 1
                                    },
                                    callback: function(e, t) {
                                        return "number" == typeof e ? e *= t : (e[0] *= t, e[1] *= t), e
                                    }
                                }).init().processProperties(arguments)
                            }, Gibberish.Gain.prototype = Gibberish._effect, Gibberish.Delay = function() {
                                var e = [],
                                    t = 0;
                                e.push(new Float32Array(2 * Gibberish.context.sampleRate)), e.push(new Float32Array(2 * Gibberish.context.sampleRate)), Gibberish.extend(this, {
                                    name: "delay",
                                    properties: {
                                        input: 0,
                                        time: 22050,
                                        feedback: .5,
                                        wet: 1,
                                        dry: 1
                                    },
                                    callback: function(i, n, r, s, o) {
                                        var a = "number" == typeof i ? 1 : 2,
                                            u = t++ % 88200,
                                            c = (u + (0 | n)) % 88200;
                                        return 1 === a ? (e[0][c] = (i + e[0][u]) * r, i = i * o + e[0][u] * s) : (e[0][c] = (i[0] + e[0][u]) * r, i[0] = i[0] * o + e[0][u] * s, e[1][c] = (i[1] + e[1][u]) * r, i[1] = i[1] * o + e[1][u] * s), i
                                    }
                                });
                                var i = Math.round(this.properties.time);
                                Object.defineProperty(this, "time", {
                                    configurable: !0,
                                    get: function() {
                                        return i
                                    },
                                    set: function(e) {
                                        i = Math.round(e), Gibberish.dirty(this)
                                    }
                                }), this.init(), this.processProperties(arguments)
                            }, Gibberish.Delay.prototype = Gibberish._effect, Gibberish.Decimator = function() {
                                var e = 0,
                                    t = [],
                                    i = Math.pow,
                                    n = Math.floor;
                                Gibberish.extend(this, {
                                    name: "decimator",
                                    properties: {
                                        input: 0,
                                        bitDepth: 16,
                                        sampleRate: 1
                                    },
                                    callback: function(r, s, o) {
                                        e += o;
                                        var a = "number" == typeof r ? 1 : 2;
                                        if (1 === a) {
                                            if (e >= 1) {
                                                var u = i(s, 2);
                                                t[0] = n(r * u) / u, e -= 1
                                            }
                                            r = t[0]
                                        } else {
                                            if (e >= 1) {
                                                var u = i(s, 2);
                                                t[0] = n(r[0] * u) / u, t[1] = n(r[1] * u) / u, e -= 1
                                            }
                                            r = t
                                        }
                                        return r
                                    }
                                }).init().processProperties(arguments)
                            }, Gibberish.Decimator.prototype = Gibberish._effect, Gibberish.RingModulation = function() {
                                var e = (new Gibberish.Sine).callback,
                                    t = [0, 0];
                                Gibberish.extend(this, {
                                    name: "ringmod",
                                    properties: {
                                        input: 0,
                                        frequency: 440,
                                        amp: .5,
                                        mix: .5
                                    },
                                    callback: function(i, n, r, s) {
                                        var o = "number" == typeof i ? 1 : 2,
                                            a = 1 === o ? i : i[0],
                                            u = e(n, r);
                                        if (a = a * (1 - s) + a * u * s, 2 === o) {
                                            var c = i[1];
                                            return c = c * (1 - s) + c * u * s, t[0] = a, t[1] = c, t
                                        }
                                        return a
                                    }
                                }).init().processProperties(arguments)
                            }, Gibberish.RingModulation.prototype = Gibberish._effect, Gibberish.DCBlock = function() {
                                var e = 0,
                                    t = 0;
                                Gibberish.extend(this, {
                                    name: "dcblock",
                                    type: "effect",
                                    properties: {
                                        input: 0
                                    },
                                    reset: function() {
                                        e = 0, t = 0
                                    },
                                    callback: function(i) {
                                        var n = i - e + .9997 * t;
                                        return e = i, t = n, n
                                    }
                                }).init().processProperties(arguments)
                            }, Gibberish.DCBlock.prototype = Gibberish._effect, Gibberish.Tremolo = function() {
                                var e = (new Gibberish.Sine).callback;
                                Gibberish.extend(this, {
                                    name: "tremolo",
                                    type: "effect",
                                    properties: {
                                        input: 0,
                                        frequency: 2.5,
                                        amp: .5
                                    },
                                    callback: function(t, i, n) {
                                        var r = "number" == typeof t ? 1 : 2,
                                            s = e(i, n);
                                        return 1 === r ? t *= s : (t[0] *= s, t[1] *= s), t
                                    }
                                }).init().processProperties(arguments)
                            }, Gibberish.Tremolo.prototype = Gibberish._effect, Gibberish.OnePole = function() {
                                var e = 0;
                                Gibberish.extend(this, {
                                    name: "onepole",
                                    type: "effect",
                                    properties: {
                                        input: 0,
                                        a0: .15,
                                        b1: .85
                                    },
                                    callback: function(t, i, n) {
                                        var r = t * i + e * n;
                                        return e = r, r
                                    },
                                    smooth: function(t, i) {
                                        this.input = i[t], e = this.input, i[t] = this, this.obj = i, this.property = t, this.oldSetter = i.__lookupSetter__(t), this.oldGetter = i.__lookupGetter__(t);
                                        var n = this;
                                        Object.defineProperty(i, t, {
                                            get: function() {
                                                return n.input
                                            },
                                            set: function(e) {
                                                n.input = e
                                            }
                                        })
                                    },
                                    remove: function() {
                                        Object.defineProperty(this.obj, this.property, {
                                            get: this.oldGetter,
                                            set: this.oldSetter
                                        }), this.obj[this.property] = this.input
                                    }
                                }).init().processProperties(arguments)
                            }, Gibberish.OnePole.prototype = Gibberish._effect, Gibberish.Filter24 = function() {
                                var e = [0, 0, 0, 0],
                                    t = [0, 0, 0, 0],
                                    i = [0, 0],
                                    n = isNaN(arguments[0]) ? .1 : arguments[0],
                                    r = isNaN(arguments[1]) ? 3 : arguments[1];
                                _isLowPass = "undefined" != typeof arguments[2] ? arguments[2] : !0, Gibberish.extend(this, {
                                    name: "filter24",
                                    properties: {
                                        input: 0,
                                        cutoff: n,
                                        resonance: r,
                                        isLowPass: _isLowPass
                                    },
                                    callback: function(n, r, s, o) {
                                        var a = "number" == typeof n ? 1 : 2,
                                            u = 1 === a ? n : n[0],
                                            c = e[3] * s;
                                        if (c = c > 1 ? 1 : c, r = 0 > r ? 0 : r, r = r > 1 ? 1 : r, u -= c, e[0] = e[0] + (-e[0] + u) * r, e[1] = e[1] + (-e[1] + e[0]) * r, e[2] = e[2] + (-e[2] + e[1]) * r, e[3] = e[3] + (-e[3] + e[2]) * r, u = o ? e[3] : u - e[3], 2 === a) {
                                            var l = n[1];
                                            return c = t[3] * s, c = c > 1 ? 1 : c, l -= c, t[0] = t[0] + (-t[0] + l) * r, t[1] = t[1] + (-t[1] + t[0]) * r, t[2] = t[2] + (-t[2] + t[1]) * r, t[3] = t[3] + (-t[3] + t[2]) * r, l = o ? t[3] : l - t[3], i[0] = u, i[1] = l, i
                                        }
                                        return u
                                    }
                                }).init().processProperties(arguments)
                            }, Gibberish.Filter24.prototype = Gibberish._effect, Gibberish.SVF = function() {
                                var e = [0, 0],
                                    t = [0, 0],
                                    i = Math.PI,
                                    n = [0, 0];
                                Gibberish.extend(this, {
                                    name: "SVF",
                                    properties: {
                                        input: 0,
                                        cutoff: 440,
                                        Q: 2,
                                        mode: 0,
                                        sr: Gibberish.context.sampleRate
                                    },
                                    callback: function(r, s, o, a, u) {
                                        var c = "number" == typeof r ? 1 : 2,
                                            l = 1 === c ? r : r[0],
                                            p = 2 * i * s / u;
                                        o = 1 / o;
                                        var h = t[0] + p * e[0],
                                            f = l - h - o * e[0],
                                            b = p * f + e[0],
                                            m = f + h;
                                        if (e[0] = b, t[0] = h, l = 0 === a ? h : 1 === a ? f : 2 === a ? b : m, 2 === c) {
                                            var d = r[1],
                                                h = t[1] + p * e[1],
                                                f = d - h - o * e[1],
                                                b = p * f + e[1],
                                                m = f + h;
                                            e[1] = b, t[1] = h, d = 0 === a ? h : 1 === a ? f : 2 === a ? b : m, n[0] = l, n[1] = d
                                        } else n = l;
                                        return n
                                    }
                                }).init().processProperties(arguments)
                            }, Gibberish.SVF.prototype = Gibberish._effect, Gibberish.Biquad = function() {
                                var e = x2 = y1 = y2 = 0,
                                    t = [0, 0],
                                    i = .001639,
                                    n = .003278,
                                    r = .001639,
                                    s = -1.955777,
                                    o = .960601,
                                    a = "LP",
                                    u = 2e3,
                                    c = .5,
                                    l = Gibberish.context.sampleRate;
                                Gibberish.extend(this, {
                                    name: "biquad",
                                    properties: {
                                        input: null
                                    },
                                    calculateCoefficients: function() {
                                        switch (a) {
                                            case "LP":
                                                var e = 2 * Math.PI * u / l,
                                                    t = Math.sin(e),
                                                    p = Math.cos(e),
                                                    h = t / (2 * c);
                                                i = (1 - p) / 2, n = 1 - p, r = i, a0 = 1 + h, s = -2 * p, o = 1 - h;
                                                break;
                                            case "HP":
                                                var e = 2 * Math.PI * u / l,
                                                    t = Math.sin(e),
                                                    p = Math.cos(e),
                                                    h = t / (2 * c);
                                                i = (1 + p) / 2, n = -(1 + p), r = i, a0 = 1 + h, s = -2 * p, o = 1 - h;
                                                break;
                                            case "BP":
                                                var e = 2 * Math.PI * u / l,
                                                    t = Math.sin(e),
                                                    p = Math.cos(e),
                                                    f = Math.log(2) / 2 * c * e / t,
                                                    h = t * (Math.exp(f) - Math.exp(-f)) / 2;
                                                i = h, n = 0, r = -h, a0 = 1 + h, s = -2 * p, o = 1 - h;
                                                break;
                                            default:
                                                return
                                        }
                                        i /= a0, n /= a0, r /= a0, s /= a0, o /= a0
                                    },
                                    callback: function(a) {
                                        var u = "number" == typeof a ? 1 : 2,
                                            c = 0,
                                            l = 0,
                                            p = 1 === u ? a : a[0];
                                        return c = i * p + n * e + r * x2 - s * y1 - o * y2, x2 = e, e = a, y2 = y1, y1 = c, 2 === u && (inR = a[1], l = i * inR + n * e[1] + r * x2[1] - s * y1[1] - o * y2[1], x2[1] = e[1], e[1] = a[1], y2[1] = y1[1], y1[1] = l, t[0] = c, t[1] = l), 1 === u ? c : t
                                    }
                                }).init(), Object.defineProperties(this, {
                                    mode: {
                                        get: function() {
                                            return a
                                        },
                                        set: function(e) {
                                            a = e, this.calculateCoefficients()
                                        }
                                    },
                                    cutoff: {
                                        get: function() {
                                            return u
                                        },
                                        set: function(e) {
                                            u = e, this.calculateCoefficients()
                                        }
                                    },
                                    Q: {
                                        get: function() {
                                            return c
                                        },
                                        set: function(e) {
                                            c = e, this.calculateCoefficients()
                                        }
                                    }
                                }), this.processProperties(arguments), this.calculateCoefficients()
                            }, Gibberish.Biquad.prototype = Gibberish._effect, Gibberish.Flanger = function() {
                                var e = [new Float32Array(88200), new Float32Array(88200)],
                                    t = 88200,
                                    i = (new Gibberish.Sine).callback,
                                    n = Gibberish.interpolate,
                                    r = -100,
                                    s = 0;
                                Gibberish.extend(this, {
                                    name: "flanger",
                                    properties: {
                                        input: 0,
                                        rate: .25,
                                        feedback: 0,
                                        amount: 125,
                                        offset: 125
                                    },
                                    callback: function(o, a, u, c) {
                                        var l = "number" == typeof o ? 1 : 2,
                                            p = r + i(a, .95 * c);
                                        p > t ? p -= t : 0 > p && (p += t);
                                        var h = n(e[0], p);
                                        return e[0][s] = 1 === l ? o + h * u : o[0] + h * u, 2 === l ? (o[0] += h, h = n(e[1], p), e[1][s] = o[1] + h * u, o[1] += h) : o += h, ++s >= t && (s = 0), ++r >= t && (r = 0), o
                                    }
                                }).init().processProperties(arguments), r = -1 * this.offset
                            }, Gibberish.Flanger.prototype = Gibberish._effect, Gibberish.Vibrato = function() {
                                var e = [new Float32Array(88200), new Float32Array(88200)],
                                    t = 88200,
                                    i = (new Gibberish.Sine).callback,
                                    n = Gibberish.interpolate,
                                    r = -100,
                                    s = 0;
                                Gibberish.extend(this, {
                                    name: "vibrato",
                                    properties: {
                                        input: 0,
                                        rate: 5,
                                        amount: .5,
                                        offset: 125
                                    },
                                    callback: function(o, a, u, c) {
                                        var l = "number" == typeof o ? 1 : 2,
                                            p = r + i(a, u * c - 1);
                                        p > t ? p -= t : 0 > p && (p += t);
                                        var h = n(e[0], p);
                                        return e[0][s] = 1 === l ? o : o[0], 2 === l ? (o[0] = h, h = n(e[1], p), e[1][s] = o[1], o[1] = h) : o = h, ++s >= t && (s = 0), ++r >= t && (r = 0), o
                                    }
                                }).init().processProperties(arguments), r = -1 * this.offset
                            }, Gibberish.Vibrato.prototype = Gibberish._effect, Gibberish.BufferShuffler = function() {
                                var e = [new Float32Array(88200), new Float32Array(88200)],
                                    t = 88200,
                                    i = 0,
                                    n = 0,
                                    r = 0,
                                    s = 0,
                                    o = 0,
                                    a = Math.random,
                                    u = 1,
                                    c = !1,
                                    l = !1,
                                    p = !1,
                                    h = Gibberish.interpolate,
                                    f = !1,
                                    b = 1,
                                    m = !1,
                                    d = Gibberish.rndf,
                                    g = [0, 0];
                                Gibberish.extend(this, {
                                    name: "buffer_shuffler",
                                    properties: {
                                        input: 0,
                                        chance: .25,
                                        rate: 11025,
                                        length: 22050,
                                        reverseChange: .5,
                                        pitchChance: .5,
                                        pitchMin: .25,
                                        pitchMax: 2,
                                        wet: 1,
                                        dry: 0
                                    },
                                    callback: function(y, v, G, x, k, j, w, q, _, P) {
                                        var A = "number" == typeof y ? 1 : 2;
                                        o ? ++s % (x - 400) === 0 && (c = !1, l = !0, u = 1, s = 0) : (e[0][n] = 1 === A ? y : y[0], e[1][n] = 1 === A ? y : y[1], n++, n %= t, m = 0 === n ? 1 : m, r++, r % G == 0 && a() < v && (p = a() < k, o = !0, p || (i = n - x, 0 > i && (i = t + i)), f = a() < j, f && (b = d(w, q)), u = 1, c = !0, l = !1)), i += p ? -1 * b : b, 0 > i ? i += t : i >= t && (i -= t);
                                        var M, S, C, O, R = h(e[0], i);
                                        return c ? (u -= .0025, C = R * (1 - u), M = 1 === A ? C + y * u : C + y[0] * u, 2 === A && (O = h(e[1], i), C = O * (1 - u), S = 1 === A ? M : C + y[1] * u), .0025 >= u && (c = !1)) : l ? (u -= .0025, C = R * u, M = 1 === A ? C + y * u : C + y[0] * (1 - u), 2 === A && (O = h(e[1], i), C = O * u, S = C + y[1] * (1 - u)), .0025 >= u && (l = !1, o = !1, p = !1, b = 1, f = 0)) : 1 === A ? M = o && m ? R * _ + y * P : y : (O = h(e[1], i), M = o && m ? R * _ + y[0] * P : y[0], S = o && m ? O * _ + y[1] * P : y[1]), g = [M, S], 1 === A ? M : g
                                    }
                                }).init().processProperties(arguments)
                            }, Gibberish.BufferShuffler.prototype = Gibberish._effect, Gibberish.AllPass = function(e) {
                                var t = -1,
                                    i = new Float32Array(e || 500),
                                    n = i.length;
                                Gibberish.extend(this, {
                                    name: "allpass",
                                    properties: {
                                        input: 0
                                    },
                                    callback: function(e) {
                                        t = ++t % n;
                                        var r = i[t],
                                            s = -1 * e + r;
                                        return i[t] = e + .5 * r, s
                                    }
                                })
                            }, Gibberish.Comb = function(e) {
                                var t = new Float32Array(e || 1200),
                                    i = t.length,
                                    n = 0,
                                    r = 0;
                                Gibberish.extend(this, {
                                    name: "comb",
                                    properties: {
                                        input: 0,
                                        feedback: .84,
                                        damping: .2
                                    },
                                    callback: function(e, s, o) {
                                        var a = ++n % i,
                                            u = t[a];
                                        return r = u * (1 - o) + r * o, t[a] = e + r * s, u
                                    }
                                })
                            }, Gibberish.Reverb = function() {
                                var e = {
                                        combCount: 8,
                                        combTuning: [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617],
                                        allPassCount: 4,
                                        allPassTuning: [556, 441, 341, 225],
                                        allPassFeedback: .5,
                                        fixedGain: .015,
                                        scaleDamping: .4,
                                        scaleRoom: .28,
                                        offsetRoom: .7,
                                        stereoSpread: 23
                                    },
                                    t = .84,
                                    i = [],
                                    n = [],
                                    r = [0, 0];
                                Gibberish.extend(this, {
                                    name: "reverb",
                                    roomSize: .5,
                                    properties: {
                                        input: 0,
                                        wet: .5,
                                        dry: .55,
                                        roomSize: .84,
                                        damping: .5
                                    },
                                    callback: function(e, t, s, o, a) {
                                        for (var u = "object" == typeof e ? 2 : 1, c = 1 === u ? e : e[0] + e[1], l = .015 * c, p = l, h = 0; 8 > h; h++) {
                                            var f = i[h](l, .98 * o, .4 * a);
                                            p += f
                                        }
                                        for (var h = 0; 4 > h; h++) p = n[h](p);
                                        return r[0] = r[1] = c * s + p * t, r
                                    }
                                }).init().processProperties(arguments), this.setFeedback = function(e) {
                                    t = e
                                };
                                for (var s = 0; 8 > s; s++) i.push(new Gibberish.Comb(e.combTuning[s]).callback);
                                for (var s = 0; 4 > s; s++) n.push(new Gibberish.AllPass(e.allPassTuning[s], e.allPassFeedback).callback)
                            }, Gibberish.Reverb.prototype = Gibberish._effect, Gibberish.Granulator = function(e) {
                                var t = [];
                                buffer = null, interpolate = Gibberish.interpolate, panner = Gibberish.makePanner(), bufferLength = 0, debug = 0, write = 0, self = this, out = [0, 0], _out = [0, 0], rndf = Gibberish.rndf, numberOfGrains = e.numberOfGrains || 20, Gibberish.extend(this, {
                                    name: "granulator",
                                    bufferLength: 88200,
                                    reverse: !0,
                                    spread: .5,
                                    properties: {
                                        speed: 1,
                                        speedMin: -0,
                                        speedMax: 0,
                                        grainSize: 1e3,
                                        position: .5,
                                        positionMin: 0,
                                        positionMax: 0,
                                        amp: .2,
                                        fade: .1,
                                        pan: 0,
                                        shouldWrite: !1
                                    },
                                    setBuffer: function(e) {
                                        buffer = e, bufferLength = e.length
                                    },
                                    callback: function(e, i, n, r, s, o, a, u, c, l) {
                                        for (var p = 0; numberOfGrains > p; p++) {
                                            var h = t[p];
                                            if (h._speed > 0) {
                                                h.pos > h.end && (h.pos = (a + rndf(s, o)) * buffer.length, h.start = h.pos, h.end = h.start + r, h._speed = e + rndf(i, n), h._speed = h._speed < .1 ? .1 : h._speed, h._speed = h._speed < .1 && h._speed > 0 ? .1 : h._speed, h._speed = h._speed > -.1 && h._speed < 0 ? -.1 : h._speed, h.fadeAmount = h._speed * c * r, h.pan = rndf(-1 * self.spread, self.spread));
                                                for (var f = h.pos; f > buffer.length;) f -= buffer.length;
                                                for (; 0 > f;) f += buffer.length;
                                                var b = interpolate(buffer, f);
                                                b *= h.pos < h.fadeAmount + h.start ? (h.pos - h.start) / h.fadeAmount : 1, b *= h.pos > h.end - h.fadeAmount ? (h.end - h.pos) / h.fadeAmount : 1
                                            } else {
                                                h.pos < h.end && (h.pos = (a + rndf(s, o)) * buffer.length, h.start = h.pos, h.end = h.start - r, h._speed = e + rndf(i, n), h._speed = h._speed < .1 && h._speed > 0 ? .1 : h._speed, h._speed = h._speed > -.1 && h._speed < 0 ? -.1 : h._speed, h.fadeAmount = h._speed * c * r);
                                                for (var f = h.pos; f > buffer.length;) f -= buffer.length;
                                                for (; 0 > f;) f += buffer.length;
                                                var b = interpolate(buffer, f);
                                                b *= h.pos > h.start - h.fadeAmount ? (h.start - h.pos) / h.fadeAmount : 1, b *= h.pos < h.end + h.fadeAmount ? (h.end - h.pos) / h.fadeAmount : 1
                                            }
                                            _out = panner(b * u, h.pan, _out), out[0] += _out[0], out[1] += _out[1], h.pos += h._speed
                                        }
                                        return panner(out, l, out)
                                    }
                                }).init().processProperties(arguments);
                                for (var i = 0; numberOfGrains > i; i++) t[i] = {
                                    pos: self.position + Gibberish.rndf(self.positionMin, self.positionMax),
                                    _speed: self.speed + Gibberish.rndf(self.speedMin, self.speedMax)
                                }, t[i].start = t[i].pos, t[i].end = t[i].pos + self.grainSize, t[i].fadeAmount = t[i]._speed * self.fade * self.grainSize, t[i].pan = Gibberish.rndf(-1 * self.spread, self.spread);
                                "undefined" != typeof e.buffer && (buffer = e.buffer, bufferLength = buffer.length)
                            }, Gibberish.Granulator.prototype = Gibberish._effect, Gibberish.synth = function() {
                                this.type = "oscillator", this.oscillatorInit = function() {
                                    this.fx = new Array2, this.fx.parent = this
                                }
                            }, Gibberish.synth.prototype = new Gibberish.ugen, Gibberish._synth = new Gibberish.synth, Gibberish.Synth = function(e) {
                                this.name = "synth", this.properties = {
                                    frequency: 0,
                                    pulsewidth: .5,
                                    attack: 22050,
                                    decay: 22050,
                                    sustain: 22050,
                                    release: 22050,
                                    attackLevel: 1,
                                    sustainLevel: .5,
                                    releaseTrigger: 0,
                                    glide: .15,
                                    amp: .25,
                                    channels: 2,
                                    pan: 0,
                                    sr: Gibberish.context.sampleRate
                                }, this.note = function(e, n) {
                                    if (0 !== n) {
                                        if ("object" != typeof this.frequency) {
                                            if (t && e === l) return void(this.releaseTrigger = 1);
                                            this.frequency = l = e, this.releaseTrigger = 0
                                        } else this.frequency[0] = l = e, this.releaseTrigger = 0, Gibberish.dirty(this);
                                        "undefined" != typeof n && (this.amp = n), i.run()
                                    } else this.releaseTrigger = 1
                                }, e = e || {};
                                var t = "undefined" == typeof e.useADSR ? !1 : e.useADSR,
                                    i = t ? new Gibberish.ADSR : new Gibberish.AD,
                                    n = i.getState,
                                    r = i.callback,
                                    s = new Gibberish.PWM,
                                    o = s.callback,
                                    a = (new Gibberish.OnePole).callback,
                                    u = Gibberish.makePanner(),
                                    c = this,
                                    l = 0,
                                    p = [0, 0];
                                i.requireReleaseTrigger = e.requireReleaseTrigger || !1, this.callback = function(e, i, s, l, h, f, b, m, d, g, y, v, G, x) {
                                    g = g >= 1 ? .99999 : g, e = a(e, 1 - g, g);
                                    var k, j;
                                    return t ? (k = r(s, l, h, f, b, m, d), d && (c.releaseTrigger = 0), n() < 4 ? (j = o(e, 1, i, x) * k * y, 1 === v ? j : u(j, G, p)) : (j = p[0] = p[1] = 0, 1 === v ? j : p)) : n() < 2 ? (k = r(s, l), j = o(e, 1, i, x) * k * y, 1 === v ? j : u(j, G, p)) : (j = p[0] = p[1] = 0, 1 === v ? j : p)
                                }, this.getEnv = function() {
                                    return i
                                }, this.getOsc = function() {
                                    return s
                                }, this.setOsc = function(e) {
                                    s = e, o = s.callback
                                };
                                var h = "PWM";
                                Object.defineProperty(this, "waveform", {
                                    get: function() {
                                        return h
                                    },
                                    set: function(e) {
                                        this.setOsc(new Gibberish[e])
                                    }
                                }), this.init(), this.oscillatorInit(), this.processProperties(arguments)
                            }, Gibberish.Synth.prototype = Gibberish._synth, Gibberish.PolySynth = function() {
                                this.__proto__ = new Gibberish.Bus2, Gibberish.extend(this, {
                                    name: "polysynth",
                                    maxVoices: 5,
                                    voiceCount: 0,
                                    frequencies: [],
                                    _frequency: 0,
                                    polyProperties: {
                                        frequency: 0,
                                        glide: 0,
                                        attack: 22050,
                                        decay: 22050,
                                        pulsewidth: .5,
                                        waveform: "PWM"
                                    },
                                    note: function(e, t) {
                                        var i = this.frequencies.indexOf(e),
                                            n = i > -1 ? i : this.voiceCount++,
                                            r = this.children[n];
                                        r.note(e, t), -1 === i ? (this.frequencies[n] = e, this._frequency = e, this.voiceCount >= this.maxVoices && (this.voiceCount = 0)) : delete this.frequencies[n]
                                    },
                                    initVoices: function() {
                                        for (var e = 0; e < this.maxVoices; e++) {
                                            var t = {
                                                    waveform: this.waveform,
                                                    attack: this.attack,
                                                    decay: this.decay,
                                                    pulsewidth: this.pulsewidth,
                                                    channels: 2,
                                                    amp: 1,
                                                    useADSR: this.useADSR || !1,
                                                    requireReleaseTrigger: this.requireReleaseTrigger || !1
                                                },
                                                i = new Gibberish.Synth(t).connect(this);
                                            this.children.push(i)
                                        }
                                    }
                                }), this.amp = 1 / this.maxVoices, this.children = [], "object" == typeof arguments[0] && (this.maxVoices = arguments[0].maxVoices ? arguments[0].maxVoices : this.maxVoices, this.useADSR = "undefined" != typeof arguments[0].useADSR ? arguments[0].useADSR : !1, this.requireReleaseTrigger = "undefined" != typeof arguments[0].requireReleaseTrigger ? arguments[0].requireReleaseTrigger : !1), Gibberish.polyInit(this), this.initVoices(), this.processProperties(arguments), Gibberish._synth.oscillatorInit.call(this)
                            }, Gibberish.Synth2 = function(e) {
                                this.name = "synth2", this.properties = {
                                    frequency: 0,
                                    pulsewidth: .5,
                                    attack: 22050,
                                    decay: 22050,
                                    sustain: 22050,
                                    release: 22050,
                                    attackLevel: 1,
                                    sustainLevel: .5,
                                    releaseTrigger: 0,
                                    cutoff: .25,
                                    resonance: 3.5,
                                    useLowPassFilter: !0,
                                    glide: .15,
                                    amp: .25,
                                    channels: 1,
                                    pan: 0,
                                    sr: Gibberish.context.sampleRate
                                }, this.note = function(e, n) {
                                    if (0 !== n) {
                                        if ("object" != typeof this.frequency) {
                                            if (t && e === p) return void(this.releaseTrigger = 1);
                                            this.frequency = p = e, this.releaseTrigger = 0
                                        } else this.frequency[0] = p = e, this.releaseTrigger = 0, Gibberish.dirty(this);
                                        "undefined" != typeof n && (this.amp = n), i.run()
                                    } else this.releaseTrigger = 1
                                }, e = e || {};
                                var t = "undefined" == typeof e.useADSR ? !1 : e.useADSR,
                                    i = t ? new Gibberish.ADSR : new Gibberish.AD,
                                    n = i.getState,
                                    r = i.callback,
                                    s = new Gibberish.PWM,
                                    o = s.callback,
                                    a = new Gibberish.Filter24,
                                    u = a.callback,
                                    c = (new Gibberish.OnePole).callback,
                                    l = Gibberish.makePanner(),
                                    p = 0,
                                    h = this,
                                    f = [0, 0];
                                i.requireReleaseTrigger = e.requireReleaseTrigger || !1, this.callback = function(e, i, s, a, p, b, m, d, g, y, v, G, x, k, j, w, q) {
                                    x = x >= 1 ? .99999 : x, e = c(e, 1 - x, x);
                                    var _, P;
                                    return t ? (_ = r(s, a, p, b, m, d, g), g && (h.releaseTrigger = 0), n() < 4 ? (P = u(o(e, .15, i, q), y * _, v, G) * _ * k, 1 === j ? P : l(P, w, f)) : (P = f[0] = f[1] = 0, 1 === j ? P : f)) : n() < 2 ? (_ = r(s, a), P = u(o(e, .15, i, q), y * _, v, G) * _ * k, 1 === j ? P : l(P, w, f)) : (P = f[0] = f[1] = 0, 1 === j ? P : f)
                                }, this.getUseADSR = function() {
                                    return t
                                }, this.getEnv = function() {
                                    return i
                                }, this.getOsc = function() {
                                    return s
                                }, this.setOsc = function(e) {
                                    s = e, o = s.callback
                                };
                                var b = "PWM";
                                Object.defineProperty(this, "waveform", {
                                    get: function() {
                                        return b
                                    },
                                    set: function(e) {
                                        this.setOsc(new Gibberish[e])
                                    }
                                }), this.init(), this.oscillatorInit(), this.processProperties(arguments)
                            }, Gibberish.Synth2.prototype = Gibberish._synth, Gibberish.PolySynth2 = function() {
                                this.__proto__ = new Gibberish.Bus2, Gibberish.extend(this, {
                                    name: "polysynth2",
                                    maxVoices: 5,
                                    voiceCount: 0,
                                    frequencies: [],
                                    _frequency: 0,
                                    polyProperties: {
                                        frequency: 0,
                                        glide: 0,
                                        attack: 22050,
                                        decay: 22050,
                                        pulsewidth: .5,
                                        resonance: 3.5,
                                        cutoff: .25,
                                        useLowPassFilter: !0,
                                        waveform: "PWM"
                                    },
                                    note: function(e, t) {
                                        var i = this.frequencies.indexOf(e),
                                            n = i > -1 ? i : this.voiceCount++,
                                            r = this.children[n];
                                        r.note(e, t), -1 === i ? (this.frequencies[n] = e, this._frequency = e, this.voiceCount >= this.maxVoices && (this.voiceCount = 0)) : delete this.frequencies[n]
                                    },
                                    initVoices: function() {
                                        this.dirty = !0;
                                        for (var e = 0; e < this.maxVoices; e++) {
                                            var t = {
                                                    attack: this.attack,
                                                    decay: this.decay,
                                                    pulsewidth: this.pulsewidth,
                                                    channels: 2,
                                                    amp: 1,
                                                    useADSR: this.useADSR || !1,
                                                    requireReleaseTrigger: this.requireReleaseTrigger || !1
                                                },
                                                i = new Gibberish.Synth2(t).connect(this);
                                            this.children.push(i)
                                        }
                                    }
                                }), this.amp = 1 / this.maxVoices, this.children = [], "object" == typeof arguments[0] && (this.maxVoices = arguments[0].maxVoices ? arguments[0].maxVoices : this.maxVoices, this.useADSR = "undefined" != typeof arguments[0].useADSR ? arguments[0].useADSR : !1, this.requireReleaseTrigger = "undefined" != typeof arguments[0].requireReleaseTrigger ? arguments[0].requireReleaseTrigger : !1), Gibberish.polyInit(this), this.initVoices(), this.processProperties(arguments), Gibberish._synth.oscillatorInit.call(this)
                            }, Gibberish.FMSynth = function(e) {
                                this.name = "fmSynth", this.properties = {
                                    frequency: 0,
                                    cmRatio: 2,
                                    index: 5,
                                    attack: 22050,
                                    decay: 22050,
                                    sustain: 22050,
                                    release: 22050,
                                    attackLevel: 1,
                                    sustainLevel: .5,
                                    releaseTrigger: 0,
                                    glide: .15,
                                    amp: .25,
                                    channels: 2,
                                    pan: 0
                                }, this.note = function(e, n) {
                                    if (0 !== n) {
                                        if ("object" != typeof this.frequency) {
                                            if (t && e === p) return void(this.releaseTrigger = 1);
                                            this.frequency = p = e, this.releaseTrigger = 0
                                        } else this.frequency[0] = p = e, this.releaseTrigger = 0, Gibberish.dirty(this);
                                        "undefined" != typeof n && (this.amp = n), i.run()
                                    } else this.releaseTrigger = 1
                                }, e = e || {};
                                var t = "undefined" == typeof e.useADSR ? !1 : e.useADSR,
                                    i = t ? new Gibberish.ADSR : new Gibberish.AD,
                                    n = i.getState,
                                    r = i.callback,
                                    s = (new Gibberish.Sine).callback,
                                    o = (new Gibberish.Sine).callback,
                                    a = (new Gibberish.OnePole).callback,
                                    u = Gibberish.makePanner(),
                                    c = [0, 0],
                                    l = this,
                                    p = 0;
                                i.requireReleaseTrigger = e.requireReleaseTrigger || !1, this.callback = function(e, i, p, h, f, b, m, d, g, y, v, G, x, k) {
                                    var j, w, q;
                                    return v >= 1 && (v = .9999), e = a(e, 1 - v, v), t ? (j = r(h, f, b, m, d, g, y), y && (l.releaseTrigger = 0), n() < 4 ? (q = o(e * i, e * p) * j, w = s(e + q, 1) * j * G, 1 === x ? w : u(w, k, c)) : (w = c[0] = c[1] = 0, 1 === x ? w : c)) : n() < 2 ? (j = r(h, f), q = o(e * i, e * p) * j, w = s(e + q, 1) * j * G, 1 === x ? w : u(w, k, c)) : (w = c[0] = c[1] = 0, 1 === x ? w : c)
                                }, this.init(), this.oscillatorInit(), this.processProperties(arguments)
                            }, Gibberish.FMSynth.prototype = Gibberish._synth, Gibberish.PolyFM = function() {
                                this.__proto__ = new Gibberish.Bus2, Gibberish.extend(this, {
                                    name: "polyfm",
                                    maxVoices: 5,
                                    voiceCount: 0,
                                    children: [],
                                    frequencies: [],
                                    _frequency: 0,
                                    polyProperties: {
                                        glide: 0,
                                        attack: 22050,
                                        decay: 22050,
                                        index: 5,
                                        cmRatio: 2
                                    },
                                    note: function(e, t) {
                                        var i = this.frequencies.indexOf(e),
                                            n = i > -1 ? i : this.voiceCount++,
                                            r = this.children[n];
                                        r.note(e, t), -1 === i ? (this.frequencies[n] = e, this._frequency = e, this.voiceCount >= this.maxVoices && (this.voiceCount = 0)) : delete this.frequencies[n]
                                    },
                                    initVoices: function() {
                                        for (var e = 0; e < this.maxVoices; e++) {
                                            var t = {
                                                    attack: this.attack,
                                                    decay: this.decay,
                                                    cmRatio: this.cmRatio,
                                                    index: this.index,
                                                    channels: 2,
                                                    useADSR: this.useADSR || !1,
                                                    requireReleaseTrigger: this.requireReleaseTrigger || !1,
                                                    amp: 1
                                                },
                                                i = new Gibberish.FMSynth(t);
                                            i.connect(this), this.children.push(i)
                                        }
                                    }
                                }), this.amp = 1 / this.maxVoices, this.children = [], "object" == typeof arguments[0] && (this.maxVoices = arguments[0].maxVoices ? arguments[0].maxVoices : this.maxVoices, this.useADSR = "undefined" != typeof arguments[0].useADSR ? arguments[0].useADSR : !1, this.requireReleaseTrigger = "undefined" != typeof arguments[0].requireReleaseTrigger ? arguments[0].requireReleaseTrigger : !1), Gibberish.polyInit(this), this.initVoices(), this.processProperties(arguments), Gibberish._synth.oscillatorInit.call(this)
                            }, Gibberish.Sampler = function() {
                                function e(e) {
                                    Gibberish.context.decodeAudioData(e, function(e) {
                                        s = e.getChannelData(0), a.length = t = a.end = o = s.length, a.isPlaying = !0, a.buffers[a.file] = s, Gibberish.audioFiles[a.file] = s, a.onload && a.onload(), 0 !== a.playOnLoad && a.note(a.playOnLoad), a.isLoaded = !0
                                    }, function(e) {
                                        console.log("Error decoding file", e)
                                    })
                                }
                                var t = 1,
                                    i = Gibberish.interpolate,
                                    n = Gibberish.makePanner(),
                                    r = [0, 0],
                                    s = null,
                                    o = 1,
                                    a = this;
                                if (Gibberish.extend(this, {
                                        name: "sampler",
                                        file: null,
                                        isLoaded: !1,
                                        playOnLoad: 0,
                                        buffers: {},
                                        properties: {
                                            pitch: 1,
                                            amp: 1,
                                            isRecording: !1,
                                            isPlaying: !0,
                                            input: 0,
                                            length: 0,
                                            start: 0,
                                            end: 1,
                                            loops: 0,
                                            pan: 0
                                        },
                                        _onload: function(e) {
                                            s = e.channels[0], o = e.length, a.end = o, a.length = t = o, a.isPlaying = !0, Gibberish.audioFiles[a.file] = s, a.buffers[a.file] = s, a.onload && a.onload(), 0 !== a.playOnLoad && a.note(a.playOnLoad), a.isLoaded = !0
                                        },
                                        switchBuffer: function(e) {
                                            if ("string" == typeof e) "undefined" != typeof a.buffers[e] && (s = a.buffers[e], o = a.end = a.length = s.length);
                                            else if ("number" == typeof e) {
                                                var t = Object.keys(a.buffers);
                                                if (0 === t.length) return;
                                                s = a.buffers[t[e]], o = a.end = a.length = s.length
                                            }
                                        },
                                        floatTo16BitPCM: function(e, t, i) {
                                            for (var n = 0; n < i.length - 1; n++, t += 2) {
                                                var r = Math.max(-1, Math.min(1, i[n]));
                                                e.setInt16(t, 0 > r ? 32768 * r : 32767 * r, !0)
                                            }
                                        },
                                        encodeWAV: function() {
                                            function e(e, t, i) {
                                                for (var n = 0; n < i.length; n++) e.setUint8(t + n, i.charCodeAt(n))
                                            }
                                            var t = this.getBuffer(),
                                                i = new ArrayBuffer(44 + 2 * t.length),
                                                n = new DataView(i),
                                                r = Gibberish.context.sampleRate;
                                            return e(n, 0, "RIFF"), n.setUint32(4, 32 + 2 * t.length, !0), e(n, 8, "WAVE"), e(n, 12, "fmt "), n.setUint32(16, 16, !0), n.setUint16(20, 1, !0), n.setUint16(22, 1, !0), n.setUint32(24, r, !0), n.setUint32(28, 4 * r, !0), n.setUint16(32, 2, !0), n.setUint16(34, 16, !0), e(n, 36, "data"), n.setUint32(40, 2 * t.length, !0), this.floatTo16BitPCM(n, 44, t), n
                                        },
                                        download: function() {
                                            var e = this.encodeWAV(),
                                                t = new Blob([e]),
                                                i = window.webkitURL.createObjectURL(t),
                                                n = window.document.createElement("a");
                                            n.href = i, n.download = "output.wav";
                                            var r = document.createEvent("Event");
                                            r.initEvent("click", !0, !0), n.dispatchEvent(r)
                                        },
                                        note: function(e, i) {
                                            switch (typeof e) {
                                                case "number":
                                                    this.pitch = e;
                                                    break;
                                                case "function":
                                                    this.pitch = e();
                                                    break;
                                                case "object":
                                                    Array.isArray(e) && (this.pitch = e[0])
                                            }
                                            if ("number" == typeof i && (this.amp = i), null !== this.function) {
                                                this.isPlaying = !0;
                                                var n;
                                                switch (typeof this.pitch) {
                                                    case "number":
                                                        n = this.pitch;
                                                        break;
                                                    case "function":
                                                        n = this.pitch();
                                                        break;
                                                    case "object":
                                                        n = Array.isArray(this.pitch) ? this.pitch[0] : this.pitch, "function" == typeof n && (n = n())
                                                }
                                                t = n > 0 || "object" == typeof n ? this.start : this.end
                                            }
                                        },
                                        getBuffer: function() {
                                            return s
                                        },
                                        setBuffer: function(e) {
                                            s = e
                                        },
                                        getPhase: function() {
                                            return t
                                        },
                                        setPhase: function(e) {
                                            t = e
                                        },
                                        getNumberOfBuffers: function() {
                                            return Object.keys(a.buffers).length - 1
                                        },
                                        callback: function(e, o, a, u, c, l, p, h, f, b) {
                                            var m = 0;
                                            return t += e, h > t && t > 0 ? (e > 0 ? m = null !== s && u ? i(s, t) : 0 : t > p ? m = null !== s && u ? i(s, t) : 0 : t = f ? h : t, n(m * o, b, r)) : (t = f && e > 0 ? p : t, t = f && 0 > e ? h : t, r[0] = r[1] = m, r)
                                        }
                                    }).init().oscillatorInit().processProperties(arguments), "undefined" != typeof arguments[0] && ("string" == typeof arguments[0] ? (this.file = arguments[0], this.pitch = 0) : "object" == typeof arguments[0] && arguments[0].file && (this.file = arguments[0].file)), "undefined" != typeof Gibberish.audioFiles[this.file]) s = Gibberish.audioFiles[this.file], this.end = this.bufferLength = s.length, this.buffers[this.file] = s, t = this.bufferLength, Gibberish.dirty(this), this.onload && this.onload();
                                else if (null !== this.file) {
                                    var e, u = new XMLHttpRequest;
                                    u.open("GET", this.file, !0), u.responseType = "arraybuffer", u.onload = function() {
                                        e(this.response)
                                    }, u.send()
                                } else "undefined" != typeof this.buffer && (this.isLoaded = !0, s = this.buffer, this.end = this.bufferLength = s.length || 88200, t = this.bufferLength, arguments[0] && arguments[0].loops && (this.loops = 1), Gibberish.dirty(this), this.onload && this.onload())
                            }, Gibberish.Sampler.prototype = Gibberish._oscillator, Gibberish.Sampler.prototype.record = function(e, t) {
                                this.isRecording = !0;
                                var i = this;
                                return this.recorder = new Gibberish.Record(e, t, function() {
                                    i.setBuffer(this.getBuffer()), i.end = bufferLength = i.getBuffer().length, i.setPhase(i.end), i.isRecording = !1
                                }).record(), this
                            }, Gibberish.MonoSynth = function() {
                                Gibberish.extend(this, {
                                    name: "monosynth",
                                    properties: {
                                        attack: 1e4,
                                        decay: 1e4,
                                        cutoff: .2,
                                        resonance: 2.5,
                                        amp1: 1,
                                        amp2: 1,
                                        amp3: 1,
                                        filterMult: .3,
                                        isLowPass: !0,
                                        pulsewidth: .5,
                                        amp: .6,
                                        detune2: .01,
                                        detune3: -.01,
                                        octave2: 1,
                                        octave3: -1,
                                        glide: 0,
                                        pan: 0,
                                        frequency: 0,
                                        channels: 2
                                    },
                                    waveform: "Saw3",
                                    note: function(e, n) {
                                        "undefined" != typeof n && 0 !== n && (this.amp = n), 0 !== n && ("object" != typeof this.frequency ? this.frequency = e : (this.frequency[0] = e, Gibberish.dirty(this)), i() > 0 && t.run())
                                    },
                                    _note: function(e, i) {
                                        if ("object" != typeof this.frequency) {
                                            if (useADSR && e === lastFrequency && 0 === i) return void(this.releaseTrigger = 1);
                                            0 !== i && (this.frequency = lastFrequency = e), this.releaseTrigger = 0
                                        } else 0 !== i && (this.frequency[0] = lastFrequency = e), this.releaseTrigger = 0, Gibberish.dirty(this);
                                        "undefined" != typeof i && 0 !== i && (this.amp = i), 0 !== i && t.run()
                                    }
                                });
                                var e = this.waveform;
                                Object.defineProperty(this, "waveform", {
                                    get: function() {
                                        return e
                                    },
                                    set: function(t) {
                                        e !== t && (e = t, s = (new Gibberish[t]).callback, o = (new Gibberish[t]).callback, a = (new Gibberish[t]).callback)
                                    }
                                });
                                var t = new Gibberish.AD(this.attack, this.decay),
                                    i = t.getState,
                                    n = t.callback,
                                    r = (new Gibberish.Filter24).callback,
                                    s = new Gibberish[this.waveform](this.frequency, this.amp1).callback,
                                    o = new Gibberish[this.waveform](this.frequency2, this.amp2).callback,
                                    a = new Gibberish[this.waveform](this.frequency3, this.amp3).callback,
                                    u = (new Gibberish.OnePole).callback,
                                    c = Gibberish.makePanner(),
                                    l = [0, 0];
                                this.callback = function(e, t, p, h, f, b, m, d, g, y, v, G, x, k, j, w, q, _, P) {
                                    if (i() < 2) {
                                        w >= 1 && (w = .9999), _ = u(_, 1 - w, w);
                                        var A = _;
                                        if (k > 0)
                                            for (var M = 0; k > M; M++) A *= 2;
                                        else if (0 > k)
                                            for (var M = 0; M > k; M--) A /= 2;
                                        var S = _;
                                        if (j > 0)
                                            for (var M = 0; j > M; M++) S *= 2;
                                        else if (0 > j)
                                            for (var M = 0; M > j; M--) S /= 2;
                                        A += G > 0 ? (2 * _ - _) * G : (_ - _ / 2) * G, S += x > 0 ? (2 * _ - _) * x : (_ - _ / 2) * x;
                                        var C = s(_, f, y) + o(A, b, y) + a(S, m, y),
                                            O = n(e, t),
                                            R = r(C, p + d * O, h, g, 1) * O;
                                        return R *= v, l[0] = l[1] = R, 1 === P ? l : c(R, q, l)
                                    }
                                    return l[0] = l[1] = 0, l
                                }, this.init(), this.oscillatorInit(), this.processProperties(arguments)
                            }, Gibberish.MonoSynth.prototype = Gibberish._synth, Gibberish.Binops = {
                                "export": function(e) {
                                    Gibberish.export("Binops", e || window)
                                },
                                operator: function() {
                                    var e = new Gibberish.ugen,
                                        t = arguments[0],
                                        i = Array.prototype.slice.call(arguments, 1);
                                    e.name = "op", e.properties = {};
                                    for (var n = 0; n < i.length; n++) e.properties[n] = i[n];
                                    return e.init.apply(e, i), e.codegen = function() {
                                        var e, i = "( ";
                                        e = Object.keys(this.properties);
                                        for (var n = 0; n < e.length; n++) {
                                            var r = "object" == typeof this[n];
                                            i += r ? this[n].codegen() : this[n], n < e.length - 1 && (i += " " + t + " ")
                                        }
                                        return i += " )", this.codeblock = i, i
                                    }, e.valueOf = function() {
                                        return e.codegen()
                                    }, e
                                },
                                Add: function() {
                                    var e = Array.prototype.slice.call(arguments, 0);
                                    return e.unshift("+"), Gibberish.Binops.operator.apply(null, e)
                                },
                                Sub: function() {
                                    var e = Array.prototype.slice.call(arguments, 0);
                                    return e.unshift("-"), Gibberish.Binops.operator.apply(null, e)
                                },
                                Mul: function() {
                                    var e = Array.prototype.slice.call(arguments, 0);
                                    return e.unshift("*"), Gibberish.Binops.operator.apply(null, e)
                                },
                                Div: function() {
                                    var e = Array.prototype.slice.call(arguments, 0);
                                    return e.unshift("/"), Gibberish.Binops.operator.apply(null, e)
                                },
                                Mod: function() {
                                    var e = Array.prototype.slice.call(arguments, 0);
                                    return e.unshift("%"), Gibberish.Binops.operator.apply(null, e)
                                },
                                Abs: function() {
                                    var e = Array.prototype.slice.call(arguments, 0),
                                        t = {
                                            name: "abs",
                                            properties: {},
                                            callback: Math.abs.bind(t)
                                        };
                                    return t.__proto__ = new Gibberish.ugen, t.properties[0] = e[0], t.init(), t
                                },
                                Sqrt: function() {
                                    var e = (Array.prototype.slice.call(arguments, 0), {
                                        name: "sqrt",
                                        properties: {},
                                        callback: Math.sqrt.bind(e)
                                    });
                                    return e.__proto__ = new Gibberish.ugen, e.properties[i] = arguments[0], e.init(), e
                                },
                                Pow: function() {
                                    var e = Array.prototype.slice.call(arguments, 0),
                                        t = {
                                            name: "pow",
                                            properties: {},
                                            callback: Math.pow.bind(t)
                                        };
                                    t.__proto__ = new Gibberish.ugen;
                                    for (var i = 0; i < e.length; i++) t.properties[i] = e[i];
                                    return t.init(), console.log(t.callback), t
                                },
                                Clamp: function() {
                                    var e = Array.prototype.slice.call(arguments, 0),
                                        t = {
                                            name: "clamp",
                                            properties: {
                                                input: 0,
                                                min: 0,
                                                max: 1
                                            },
                                            callback: function(e, t, i) {
                                                return t > e ? e = t : e > i && (e = i), e
                                            }
                                        };
                                    return t.__proto__ = new Gibberish.ugen, t.init(), t.processProperties(e), t
                                },
                                Merge: function() {
                                    var e = Array.prototype.slice.call(arguments, 0),
                                        t = {
                                            name: "merge",
                                            properties: {},
                                            callback: function(e) {
                                                return e[0] + e[1]
                                            }
                                        };
                                    t.__proto__ = new Gibberish.ugen;
                                    for (var i = 0; i < e.length; i++) t.properties[i] = e[i];
                                    return t.init(), t
                                },
                                Map: function(e, t, i, n, r, s, o) {
                                    var a = Math.pow,
                                        u = 0,
                                        c = 0,
                                        l = {
                                            name: "map",
                                            properties: {
                                                input: e,
                                                outputMin: t,
                                                outputMax: i,
                                                inputMin: n,
                                                inputMax: r,
                                                curve: s || u,
                                                wrap: o || !1
                                            },
                                            callback: function(e, t, i, n, r, s, o) {
                                                var u, l = i - t,
                                                    p = r - n,
                                                    h = (e - n) / p;
                                                return h > 1 ? h = o ? h % 1 : 1 : 0 > h && (h = o ? 1 + h % 1 : 0), u = 0 === s ? t + h * l : t + a(h, 1.5) * l, c = u, u
                                            },
                                            getValue: function() {
                                                return c
                                            },
                                            invert: function() {
                                                var e = l.outputMin;
                                                l.outputMin = l.outputMax, l.outputMax = e
                                            }
                                        };
                                    return l.__proto__ = new Gibberish.ugen, l.init(), l
                                }
                            }, Gibberish.Time = {
                                bpm: 120,
                                "export": function(e) {
                                    Gibberish.export("Time", e || window)
                                },
                                ms: function(e) {
                                    return e * Gibberish.context.sampleRate / 1e3
                                },
                                seconds: function(e) {
                                    return e * Gibberish.context.sampleRate
                                },
                                beats: function(e) {
                                    return function() {
                                        var t = Gibberish.context.sampleRate / (Gibberish.Time.bpm / 60);
                                        return t * e
                                    }
                                }
                            }, Gibberish.Sequencer2 = function() {
                                var e = this,
                                    t = 0;
                                Gibberish.extend(this, {
                                    target: null,
                                    key: null,
                                    values: null,
                                    valuesIndex: 0,
                                    durations: null,
                                    durationsIndex: 0,
                                    nextTime: 0,
                                    playOnce: !1,
                                    repeatCount: 0,
                                    repeatTarget: null,
                                    isConnected: !0,
                                    keysAndValues: null,
                                    counts: {},
                                    properties: {
                                        rate: 1,
                                        isRunning: !1,
                                        nextTime: 0
                                    },
                                    offset: 0,
                                    name: "seq",
                                    callback: function(i, n, r) {
                                        if (n) {
                                            if (t >= r) {
                                                if (null !== e.values) {
                                                    if (e.target) {
                                                        var s = e.values[e.valuesIndex++];
                                                        "function" == typeof s && (s = s()), "function" == typeof e.target[e.key] ? e.target[e.key](s) : e.target[e.key] = s
                                                    } else "function" == typeof e.values[e.valuesIndex] && e.values[e.valuesIndex++]();
                                                    e.valuesIndex >= e.values.length && (e.valuesIndex = 0)
                                                } else if (null !== e.keysAndValues)
                                                    for (var o in e.keysAndValues) {
                                                        var a = e.counts[o] ++,
                                                            s = e.keysAndValues[o][a];
                                                        "function" == typeof s && (s = s()), "function" == typeof e.target[o] ? e.target[o](s) : e.target[o] = s, e.counts[o] >= e.keysAndValues[o].length && (e.counts[o] = 0), e.chose && e.chose(o, a)
                                                    } else "function" == typeof e.target[e.key] && e.target[e.key]();
                                                if (t -= r, Array.isArray(e.durations)) {
                                                    var u = e.durations[e.durationsIndex++];
                                                    e.nextTime = "function" == typeof u ? u() : u, e.chose && e.chose("durations", e.durationsIndex - 1), e.durationsIndex >= e.durations.length && (e.durationsIndex = 0)
                                                } else {
                                                    var u = e.durations;
                                                    e.nextTime = "function" == typeof u ? u() : u
                                                }
                                                return e.repeatTarget && (e.repeatCount++, e.repeatCount === e.repeatTarget && (e.isRunning = !1, e.repeatCount = 0)), 0
                                            }
                                            t += i
                                        }
                                        return 0
                                    },
                                    start: function(e) {
                                        return e || (t = 0), this.isRunning = !0, this
                                    },
                                    stop: function() {
                                        return this.isRunning = !1, this
                                    },
                                    repeat: function(e) {
                                        return this.repeatTarget = e, this
                                    },
                                    shuffle: function() {
                                        for (i in this.keysAndValues) this.shuffleArray(this.keysAndValues[i])
                                    },
                                    shuffleArray: function(e) {
                                        for (var t, i, n = e.length; n; t = parseInt(Math.random() * n), i = e[--n], e[n] = e[t], e[t] = i);
                                    }
                                }), this.init(arguments), this.processProperties(arguments);
                                for (var i in this.keysAndValues) this.counts[i] = 0;
                                this.oscillatorInit(), t += this.offset, this.connect()
                            }, Gibberish.Sequencer2.prototype = Gibberish._oscillator, Gibberish.Sequencer = function() {
                                Gibberish.extend(this, {
                                    target: null,
                                    key: null,
                                    values: null,
                                    valuesIndex: 0,
                                    durations: null,
                                    durationsIndex: 0,
                                    nextTime: 0,
                                    phase: 0,
                                    isRunning: !1,
                                    playOnce: !1,
                                    repeatCount: 0,
                                    repeatTarget: null,
                                    isConnected: !0,
                                    keysAndValues: null,
                                    counts: {},
                                    offset: 0,
                                    name: "seq",
                                    tick: function() {
                                        if (this.isRunning) {
                                            if (this.phase >= this.nextTime) {
                                                if (null !== this.values) {
                                                    if (this.target) {
                                                        var e = this.values[this.valuesIndex++];
                                                        if ("function" == typeof e) try {
                                                            e = e()
                                                        } catch (t) {
                                                            console.error("ERROR: Can't execute function triggered by Sequencer:\n" + e.toString()), this.values.splice(this.valuesIndex - 1, 1), this.valuesIndex--
                                                        }
                                                        "function" == typeof this.target[this.key] ? this.target[this.key](e) : this.target[this.key] = e
                                                    } else if ("function" == typeof this.values[this.valuesIndex]) try {
                                                        this.values[this.valuesIndex++]()
                                                    } catch (t) {
                                                        console.error("ERROR: Can't execute function triggered by Sequencer:\n" + this.values[this.valuesIndex - 1].toString()), this.values.splice(this.valuesIndex - 1, 1), this.valuesIndex--
                                                    }
                                                    this.valuesIndex >= this.values.length && (this.valuesIndex = 0)
                                                } else if (null !== this.keysAndValues)
                                                    for (var i in this.keysAndValues) {
                                                        var n = "function" == typeof this.keysAndValues[i].pick ? this.keysAndValues[i].pick() : this.counts[i] ++,
                                                            e = this.keysAndValues[i][n];
                                                        if ("function" == typeof e) try {
                                                            e = e()
                                                        } catch (t) {
                                                            console.error("ERROR: Can't execute function triggered by Sequencer:\n" + e.toString()), this.keysAndValues[i].splice(n, 1), "function" != typeof this.keysAndValues[i].pick && this.counts[i] --
                                                        }
                                                        "function" == typeof this.target[i] ? this.target[i](e) : this.target[i] = e, this.counts[i] >= this.keysAndValues[i].length && (this.counts[i] = 0)
                                                    } else "function" == typeof this.target[this.key] && this.target[this.key]();
                                                if (this.phase -= this.nextTime, Array.isArray(this.durations)) {
                                                    var r = "function" == typeof this.durations.pick ? this.durations[this.durations.pick()] : this.durations[this.durationsIndex++];
                                                    this.nextTime = "function" == typeof r ? r() : r, this.durationsIndex >= this.durations.length && (this.durationsIndex = 0)
                                                } else {
                                                    var r = this.durations;
                                                    this.nextTime = "function" == typeof r ? r() : r
                                                }
                                                return void(this.repeatTarget && (this.repeatCount++, this.repeatCount === this.repeatTarget && (this.isRunning = !1, this.repeatCount = 0)))
                                            }
                                            this.phase++
                                        }
                                    },
                                    start: function(e) {
                                        return e || (this.phase = this.offset), this.isRunning = !0, this
                                    },
                                    stop: function() {
                                        return this.isRunning = !1, this
                                    },
                                    repeat: function(e) {
                                        return this.repeatTarget = e, this
                                    },
                                    shuffle: function() {
                                        for (e in this.keysAndValues) this.shuffleArray(this.keysAndValues[e])
                                    },
                                    shuffleArray: function(e) {
                                        for (var t, i, n = e.length; n; t = parseInt(Math.random() * n), i = e[--n], e[n] = e[t], e[t] = i);
                                    },
                                    disconnect: function() {
                                        var e = Gibberish.sequencers.indexOf(this);
                                        Gibberish.sequencers.splice(e, 1), this.isConnected = !1
                                    },
                                    connect: function() {
                                        return -1 === Gibberish.sequencers.indexOf(this) && Gibberish.sequencers.push(this), this.isConnected = !0, this
                                    }
                                });
                                for (var e in arguments[0]) this[e] = arguments[0][e];
                                for (var e in this.keysAndValues) this.counts[e] = 0;
                                this.connect(), this.phase += this.offset
                            }, Gibberish.Sequencer.prototype = Gibberish._oscillator, Gibberish.PolySeq = function() {
                                var e = this,
                                    t = 0,
                                    i = function(e, t) {
                                        return t > e ? -1 : e > t ? 1 : 0
                                    };
                                Gibberish.extend(this, {
                                    seqs: [],
                                    timeline: {},
                                    playOnce: !1,
                                    repeatCount: 0,
                                    repeatTarget: null,
                                    isConnected: !1,
                                    properties: {
                                        rate: 1,
                                        isRunning: !1,
                                        nextTime: 0
                                    },
                                    offset: 0,
                                    autofire: [],
                                    name: "polyseq",
                                    getPhase: function() {
                                        return t
                                    },
                                    timeModifier: null,
                                    add: function(i) {
                                        i.valuesIndex = i.durationsIndex = 0, e.seqs.push(i), null === i.durations && e.autofire.push(i), "undefined" != typeof e.timeline[t] ? i.priority ? e.timeline[t].unshift(i) : e.timeline[t].push(i) : e.timeline[t] = [i], !e.scale || "frequency" !== i.key && "note" !== i.key || e.applyScale && e.applyScale(), e.nextTime = t, i.shouldStop = !1
                                    },
                                    callback: function(n, r, s) {
                                        var o;
                                        if (r) {
                                            if (t >= s) {
                                                var a = e.timeline[s],
                                                    u = t - s;
                                                if ("undefined" == typeof a) return;
                                                e.autofire.length && (a = a.concat(e.autofire));
                                                for (var c = 0; c < a.length; c++) {
                                                    var l = a[c];
                                                    if (!l.shouldStop) {
                                                        var p = l.values.pick ? l.values.pick() : l.valuesIndex++ % l.values.length,
                                                            h = l.values[p];
                                                        if ("function" == typeof h && (h = h()), l.target && ("function" == typeof l.target[l.key] ? l.target[l.key](h) : l.target[l.key] = h), e.chose && e.chose(l.key, p), null !== l.durations) {
                                                            if (Array.isArray(l.durations)) {
                                                                var p = l.durations.pick ? l.durations.pick() : l.durationsIndex++,
                                                                    f = l.durations[p];
                                                                o = "function" == typeof f ? f() : f, l.durationsIndex >= l.durations.length && (l.durationsIndex = 0), e.chose && e.chose("durations", p)
                                                            } else {
                                                                var f = l.durations;
                                                                o = "function" == typeof f ? f() : f
                                                            }
                                                            var b;
                                                            b = null !== e.timeModifier ? e.timeModifier(o) + t : o + t, b -= u, o -= u, "undefined" == typeof e.timeline[b] ? e.timeline[b] = [l] : l.priority ? e.timeline[b].unshift(l) : e.timeline[b].push(l)
                                                        }
                                                    }
                                                }
                                                delete e.timeline[s];
                                                var m = Object.keys(e.timeline),
                                                    d = m.length;
                                                if (d > 1) {
                                                    for (var g = 0; d > g; g++) m[g] = parseFloat(m[g]);
                                                    m = m.sort(i), e.nextTime = m[0]
                                                } else e.nextTime = parseFloat(m[0])
                                            }
                                            t += n
                                        }
                                        return 0
                                    },
                                    start: function(e, i) {
                                        if (e && this.offset) {
                                            t = 0, this.nextTime = this.offset;
                                            var n = "" + this.offset;
                                            this.timeline = {}, this.timeline[n] = [];
                                            for (var r = 0; r < this.seqs.length; r++) {
                                                var s = this.seqs[r];
                                                s.valuesIndex = s.durationsIndex = s.shouldStop = 0, this.timeline[n].push(s)
                                            }
                                        } else {
                                            t = 0, this.nextTime = 0, this.timeline = {
                                                0: []
                                            };
                                            for (var r = 0; r < this.seqs.length; r++) {
                                                var s = this.seqs[r];
                                                s.valuesIndex = s.durationsIndex = s.shouldStop = 0, this.timeline[0].push(s)
                                            }
                                        }
                                        return this.isConnected || (this.connect(Gibberish.Master, i), this.isConnected = !0), this.isRunning = !0, this
                                    },
                                    stop: function() {
                                        return this.isRunning = !1, this.isConnected && (this.disconnect(), this.isConnected = !1), this
                                    },
                                    repeat: function(e) {
                                        return this.repeatTarget = e, this
                                    },
                                    shuffle: function(e) {
                                        if ("undefined" != typeof e)
                                            for (var t = 0; t < this.seqs.length; t++) this.seqs[t].key === e && this.shuffleArray(this.seqs[t].values);
                                        else
                                            for (var t = 0; t < this.seqs.length; t++) this.shuffleArray(this.seqs[t].values)
                                    },
                                    shuffleArray: function(e) {
                                        for (var t, i, n = e.length; n; t = parseInt(Math.random() * n), i = e[--n], e[n] = e[t], e[t] = i);
                                    }
                                }), this.init(arguments), this.processProperties(arguments), this.oscillatorInit()
                            }, Gibberish.PolySeq.prototype = Gibberish._oscillator;
                            var _hasInput = !1;
                            return Gibberish.Input = function() {
                                var e = [];
                                _hasInput || createInput(), this.type = this.name = "input", this.fx = new Array2, this.fx.parent = this, this.properties = {
                                    input: "input",
                                    amp: .5,
                                    channels: 1
                                }, this.callback = function(t, i, n) {
                                    return 1 === n ? e = t * i : (e[0] = t[0] * i, e[1] = t[1] * i), e
                                }, this.init(arguments), this.processProperties(arguments)
                            }, Gibberish.Input.prototype = new Gibberish.ugen, Gibberish.Kick = function() {
                                var e = !1,
                                    t = (new Gibberish.SVF).callback,
                                    i = (new Gibberish.SVF).callback,
                                    n = .2,
                                    r = .8;
                                Gibberish.extend(this, {
                                    name: "kick",
                                    properties: {
                                        pitch: 50,
                                        __decay: 20,
                                        __tone: 1e3,
                                        amp: 2,
                                        sr: Gibberish.context.sampleRate
                                    },
                                    callback: function(n, r, s, o, a) {
                                        var u = e ? 60 : 0;
                                        return u = t(u, n, r, 2, a), u = i(u, s, .5, 0, a), u *= o, e = !1, u
                                    },
                                    note: function(t, i, n, r) {
                                        "number" == typeof t && (this.pitch = t), "number" == typeof i && (this.decay = i), "number" == typeof n && (this.tone = n), "number" == typeof r && (this.amp = r), e = !0
                                    }
                                }).init().oscillatorInit(), Object.defineProperties(this, {
                                    decay: {
                                        get: function() {
                                            return n
                                        },
                                        set: function(e) {
                                            n = e > 1 ? 1 : e, this.__decay = 100 * n
                                        }
                                    },
                                    tone: {
                                        get: function() {
                                            return r
                                        },
                                        set: function(e) {
                                            r = e > 1 ? 1 : e, this.__tone = 220 + 1400 * e
                                        }
                                    }
                                }), this.processProperties(arguments)
                            }, Gibberish.Kick.prototype = Gibberish._oscillator, Gibberish.Conga = function() {
                                var e = !1,
                                    t = (new Gibberish.SVF).callback;
                                Gibberish.extend(this, {
                                    name: "conga",
                                    properties: {
                                        pitch: 190,
                                        amp: 2,
                                        sr: Gibberish.context.sampleRate
                                    },
                                    callback: function(i, n, r) {
                                        var s = e ? 60 : 0;
                                        return s = t(s, i, 50, 2, r), s *= n, e = !1, s
                                    },
                                    note: function(t, i) {
                                        "number" == typeof t && (this.pitch = t), "number" == typeof i && (this.amp = i), e = !0
                                    }
                                }).init().oscillatorInit(), this.processProperties(arguments)
                            }, Gibberish.Conga.prototype = Gibberish._oscillator, Gibberish.Clave = function() {
                                var e = !1,
                                    t = new Gibberish.SVF,
                                    i = t.callback;
                                Gibberish.extend(this, {
                                    name: "clave",
                                    properties: {
                                        pitch: 2500,
                                        amp: 1,
                                        sr: Gibberish.context.sampleRate
                                    },
                                    callback: function(t, n, r) {
                                        var s = e ? 2 : 0;
                                        return s = i(s, t, 5, 2, r), s *= n, e = !1, s
                                    },
                                    note: function(t, i) {
                                        "number" == typeof t && (this.pitch = t), "number" == typeof i && (this.amp = i), e = !0
                                    }
                                }).init().oscillatorInit(), this.bpf = t, this.processProperties(arguments)
                            }, Gibberish.Clave.prototype = Gibberish._oscillator, Gibberish.Tom = function() {
                                var e = !1,
                                    t = (new Gibberish.SVF).callback,
                                    i = (new Gibberish.SVF).callback,
                                    n = new Gibberish.ExponentialDecay,
                                    r = n.callback,
                                    s = Math.random;
                                Gibberish.extend(this, {
                                    name: "tom",
                                    properties: {
                                        pitch: 80,
                                        amp: .5,
                                        sr: Gibberish.context.sampleRate
                                    },
                                    callback: function(n, o, a) {
                                        var u, c = e ? 60 : 0;
                                        return c = t(c, n, 30, 2, a), u = 16 * s() - 8, u = u > 0 ? u : 0, u *= r(.05, 11025), u = i(u, 120, .5, 0, a), c += u, c *= o, e = !1, c
                                    },
                                    note: function(t, i) {
                                        "number" == typeof t && (this.pitch = t), "number" == typeof i && (this.amp = i), n.trigger(), e = !0
                                    }
                                }).init().oscillatorInit(), n.trigger(1), this.processProperties(arguments)
                            }, Gibberish.Tom.prototype = Gibberish._oscillator, Gibberish.Cowbell = function() {
                                var e = new Gibberish.Square,
                                    t = new Gibberish.Square,
                                    i = e.callback,
                                    n = t.callback,
                                    r = new Gibberish.SVF({
                                        mode: 2
                                    }),
                                    s = r.callback,
                                    o = new Gibberish.ExponentialDecay(.0025, 10500),
                                    a = o.callback;
                                Gibberish.extend(this, {
                                    name: "cowbell",
                                    properties: {
                                        amp: 1,
                                        pitch: 560,
                                        bpfFreq: 1e3,
                                        bpfRez: 3,
                                        decay: 22050,
                                        decayCoeff: 1e-4,
                                        sr: Gibberish.context.sampleRate
                                    },
                                    callback: function(e, t, r, o, u, c, l) {
                                        var p;
                                        return p = i(t, 1, 1, 0), p += n(845, 1, 1, 0), p = s(p, r, o, 2, l), p *= a(c, u), p *= e
                                    },
                                    note: function(e) {
                                        o.trigger(), e && (this.decay = e)
                                    }
                                }).init().oscillatorInit().processProperties(arguments), this.bpf = r, this.eg = o, o.trigger(1)
                            }, Gibberish.Cowbell.prototype = Gibberish._oscillator, Gibberish.Snare = function() {
                                var e = (new Gibberish.SVF).callback,
                                    t = (new Gibberish.SVF).callback,
                                    i = (new Gibberish.SVF).callback,
                                    n = new Gibberish.ExponentialDecay(.0025, 11025),
                                    r = n.callback,
                                    s = Math.random,
                                    o = 0;
                                Gibberish.extend(this, {
                                    name: "snare",
                                    properties: {
                                        cutoff: 1e3,
                                        decay: 11025,
                                        tune: 0,
                                        snappy: .5,
                                        amp: 1,
                                        sr: Gibberish.context.sampleRate
                                    },
                                    callback: function(n, a, u, c, l, p) {
                                        var h, f, b = 0,
                                            m = 0;
                                        return b = r(.0025, a), b > .005 && (m = (2 * s() - 1) * b, m = i(m, n + 1e3 * u, .5, 1, p), m *= c, m = m > 0 ? m : 0, o = b, h = e(o, 180 * (u + 1), 15, 2, p), f = t(o, 330 * (u + 1), 15, 2, p), m += h, m += .8 * f, m *= l), m
                                    },
                                    note: function(e, t, i, r) {
                                        "number" == typeof e && (this.tune = e), "number" == typeof r && (this.cutoff = r), "number" == typeof i && (this.snappy = i), "number" == typeof t && (this.amp = t), n.trigger()
                                    }
                                }).init().oscillatorInit().processProperties(arguments), n.trigger(1)
                            }, Gibberish.Snare.prototype = Gibberish._oscillator, Gibberish.Hat = function() {
                                var e = new Gibberish.Square,
                                    t = new Gibberish.Square,
                                    i = new Gibberish.Square,
                                    n = new Gibberish.Square,
                                    r = new Gibberish.Square,
                                    s = new Gibberish.Square,
                                    o = e.callback,
                                    a = t.callback,
                                    u = i.callback,
                                    c = n.callback,
                                    l = r.callback,
                                    p = s.callback,
                                    h = new Gibberish.SVF({
                                        mode: 2
                                    }),
                                    f = h.callback,
                                    b = new Gibberish.Filter24,
                                    m = b.callback,
                                    d = new Gibberish.ExponentialDecay(.0025, 10500),
                                    g = d.callback,
                                    y = new Gibberish.ExponentialDecay(.1, 7500);
                                y.callback, Gibberish.extend(this, {
                                    name: "hat",
                                    properties: {
                                        amp: 1,
                                        pitch: 325,
                                        bpfFreq: 7e3,
                                        bpfRez: 2,
                                        hpfFreq: .975,
                                        hpfRez: 0,
                                        decay: 3500,
                                        decay2: 3e3,
                                        sr: Gibberish.context.sampleRate
                                    },
                                    callback: function(e, t, i, n, r, s, h, b, d) {
                                        var y;
                                        return y = o(t, 1, .5, 0), y += a(1.4471 * t, .75, 1, 0), y += u(1.617 * t, 1, 1, 0), y += c(1.9265 * t, 1, 1, 0), y += l(2.5028 * t, 1, 1, 0), y += p(2.6637 * t, .75, 1, 0), y = f(y, i, n, 2, d), y *= g(.001, h), y = m(y, r, s, 0, 1), y *= e
                                    },
                                    note: function(e, t) {
                                        d.trigger(), y.trigger(), e && (this.decay = e), t && (this.decay2 = t)
                                    }
                                }).init().oscillatorInit().processProperties(arguments), this.bpf = h, this.hpf = b, d.trigger(1), y.trigger(1)
                            }, Gibberish.Hat.prototype = Gibberish._oscillator, Gibberish
                        })
                    }, {}],
                    2: [function(e, t) {
                        ! function() {
                            function e(e, t) {
                                return e = o[e], t = o[t], e.distance > t.distance ? t.distance + 12 - e.distance : t.distance - e.distance
                            }

                            function i(e, t, i) {
                                for (; i > 0; i--) e += t;
                                return e
                            }

                            function n(e, t) {
                                if ("string" != typeof e) return null;
                                this.name = e, this.duration = t || 4, this.accidental = {
                                    value: 0,
                                    sign: ""
                                };
                                var i = e.match(/^([abcdefgh])(x|#|bb|b?)(-?\d*)/i);
                                if (i && e === i[0] && 0 !== i[3].length) this.name = i[1].toLowerCase(), this.octave = parseFloat(i[3]), 0 !== i[2].length && (this.accidental.sign = i[2].toLowerCase(), this.accidental.value = y[i[2]]);
                                else {
                                    e = e.replace(/\u2032/g, "'").replace(/\u0375/g, ",");
                                    var n = e.match(/^(,*)([abcdefgh])(x|#|bb|b?)([,\']*)$/i);
                                    if (!n || 5 !== n.length || e !== n[0]) throw Error("Invalid note format");
                                    if ("" === n[1] && "" === n[4]) this.octave = n[2] === n[2].toLowerCase() ? 3 : 2;
                                    else if ("" !== n[1] && "" === n[4]) {
                                        if (n[2] === n[2].toLowerCase()) throw Error("Invalid note format. Format must respect the Helmholtz notation.");
                                        this.octave = 2 - n[1].length
                                    } else {
                                        if ("" !== n[1] || "" === n[4]) throw Error("Invalid note format");
                                        if (n[4].match(/^'+$/)) {
                                            if (n[2] === n[2].toUpperCase()) throw Error("Invalid note format. Format must respect the Helmholtz notation");
                                            this.octave = 3 + n[4].length
                                        } else {
                                            if (!n[4].match(/^,+$/)) throw Error("Invalid characters after note name.");
                                            if (n[2] === n[2].toLowerCase()) throw Error("Invalid note format. Format must respect the Helmholtz notation");
                                            this.octave = 2 - n[4].length
                                        }
                                    }
                                    this.name = n[2].toLowerCase(), 0 !== n[3].length && (this.accidental.sign = n[3].toLowerCase(), this.accidental.value = y[n[3]])
                                }
                            }

                            function r(e, t) {
                                if (!(e instanceof n)) return null;
                                t = t || "", this.name = e.name.toUpperCase() + e.accidental.sign + t, this.root = e, this.notes = [e], this.quality = "major", this.type = "major";
                                var i, r, o, a, u, c = [],
                                    l = !1,
                                    h = "quality",
                                    f = !1,
                                    b = !1,
                                    d = null;
                                for (a = 0, u = t.length; u > a; a++) {
                                    for (i = t[a];
                                        " " === i || "(" === i || ")" === i;) i = t[++a];
                                    if (!i) break;
                                    if (r = i.charCodeAt(0), o = u >= a + 3 ? t.substr(a, 3) : "", "quality" === h) "M" === i || ("maj" === o || 916 === r ? (this.type = "major", c.push("M7"), l = !0, (t[a + 3] && "7" === t[a + 3] || 916 === r && "7" === t[a + 1]) && a++) : "m" === i || "-" === i || "min" === o ? this.quality = this.type = "minor" : 111 === r || 176 === r || "dim" === o ? (this.quality = "minor", this.type = "diminished") : "+" === i || "aug" === o ? (this.quality = "major", this.type = "augmented") : 216 === r || 248 === r ? (this.quality = "minor", this.type = "diminished", c.push("m7"), l = !0) : "sus" === o ? (this.quality = "sus", this.type = t[a + 3] && "2" === t[a + 3] ? "sus2" : "sus4") : "5" === i ? (this.quality = "power", this.type = "power") : a -= 1), o in p && (a += 2), h = "";
                                    else if ("#" === i) f = !0;
                                    else if ("b" === i) b = !0;
                                    else if ("5" === i) f ? (d = "A5", "major" === this.quality && (this.type = "augmented")) : b && (d = "d5", "minor" === this.quality && (this.type = "diminished")), b = f = !1;
                                    else if ("6" === i) c.push("M6"), b = f = !1;
                                    else if ("7" === i) c.push("diminished" === this.type ? "d7" : "m7"), l = !0, b = f = !1;
                                    else if ("9" === i) l || c.push("m7"), c.push(b ? "m9" : f ? "A9" : "M9"), b = f = !1;
                                    else {
                                        if ("1" !== i) throw Error("Unexpected character: '" + i + "' in chord name");
                                        i = t[++a], "1" === i ? c.push(b ? "d11" : f ? "A11" : "P11") : "3" === i && c.push(b ? "m13" : f ? "A13" : "M13"), b = f = !1
                                    }
                                }
                                for (var g = 0, y = m[this.type].length; y > g; g++) this.notes.push("5" === m[this.type][g][1] && d ? s.interval(this.root, d) : s.interval(this.root, m[this.type][g]));
                                for (g = 0, y = c.length; y > g; g++) this.notes.push(s.interval(this.root, c[g]))
                            }
                            var s = {},
                                o = {
                                    c: {
                                        name: "c",
                                        distance: 0,
                                        index: 0
                                    },
                                    d: {
                                        name: "d",
                                        distance: 2,
                                        index: 1
                                    },
                                    e: {
                                        name: "e",
                                        distance: 4,
                                        index: 2
                                    },
                                    f: {
                                        name: "f",
                                        distance: 5,
                                        index: 3
                                    },
                                    g: {
                                        name: "g",
                                        distance: 7,
                                        index: 4
                                    },
                                    a: {
                                        name: "a",
                                        distance: 9,
                                        index: 5
                                    },
                                    b: {
                                        name: "b",
                                        distance: 11,
                                        index: 6
                                    },
                                    h: {
                                        name: "h",
                                        distance: 11,
                                        index: 6
                                    }
                                },
                                a = ["c", "d", "e", "f", "g", "a", "b"],
                                u = {.25: "longa", .5: "breve", 1: "whole", 2: "half", 4: "quarter", 8: "eighth", 16: "sixteenth", 32: "thirty-second", 64: "sixty-fourth", 128: "hundred-twenty-eighth"
                                },
                                c = [{
                                    name: "unison",
                                    quality: "perfect",
                                    size: 0
                                }, {
                                    name: "second",
                                    quality: "minor",
                                    size: 1
                                }, {
                                    name: "third",
                                    quality: "minor",
                                    size: 3
                                }, {
                                    name: "fourth",
                                    quality: "perfect",
                                    size: 5
                                }, {
                                    name: "fifth",
                                    quality: "perfect",
                                    size: 7
                                }, {
                                    name: "sixth",
                                    quality: "minor",
                                    size: 8
                                }, {
                                    name: "seventh",
                                    quality: "minor",
                                    size: 10
                                }, {
                                    name: "octave",
                                    quality: "perfect",
                                    size: 12
                                }, {
                                    name: "ninth",
                                    quality: "minor",
                                    size: 13
                                }, {
                                    name: "tenth",
                                    quality: "minor",
                                    size: 15
                                }, {
                                    name: "eleventh",
                                    quality: "perfect",
                                    size: 17
                                }, {
                                    name: "twelfth",
                                    quality: "perfect",
                                    size: 19
                                }, {
                                    name: "thirteenth",
                                    quality: "minor",
                                    size: 20
                                }, {
                                    name: "fourteenth",
                                    quality: "minor",
                                    size: 22
                                }, {
                                    name: "fifteenth",
                                    quality: "perfect",
                                    size: 24
                                }],
                                l = {
                                    unison: 0,
                                    second: 1,
                                    third: 2,
                                    fourth: 3,
                                    fifth: 4,
                                    sixth: 5,
                                    seventh: 6,
                                    octave: 7,
                                    ninth: 8,
                                    tenth: 9,
                                    eleventh: 10,
                                    twelfth: 11,
                                    thirteenth: 12,
                                    fourteenth: 13,
                                    fifteenth: 14
                                },
                                p = {
                                    P: "perfect",
                                    M: "major",
                                    m: "minor",
                                    A: "augmented",
                                    d: "diminished",
                                    perf: "perfect",
                                    maj: "major",
                                    min: "minor",
                                    aug: "augmented",
                                    dim: "diminished"
                                },
                                h = {
                                    perfect: "P",
                                    major: "M",
                                    minor: "m",
                                    augmented: "A",
                                    diminished: "d"
                                },
                                f = {
                                    P: "P",
                                    M: "m",
                                    m: "M",
                                    A: "d",
                                    d: "A"
                                },
                                b = {
                                    perfect: ["diminished", "perfect", "augmented"],
                                    minor: ["diminished", "minor", "major", "augmented"]
                                },
                                m = {
                                    major: ["M3", "P5"],
                                    minor: ["m3", "P5"],
                                    augmented: ["M3", "A5"],
                                    diminished: ["m3", "d5"],
                                    sus2: ["M2", "P5"],
                                    sus4: ["P4", "P5"],
                                    power: ["P5"]
                                },
                                d = {
                                    major: "M",
                                    minor: "m",
                                    augmented: "aug",
                                    diminished: "dim",
                                    power: "5"
                                },
                                g = {
                                    "-2": "bb",
                                    "-1": "b",
                                    0: "",
                                    1: "#",
                                    2: "x"
                                },
                                y = {
                                    bb: -2,
                                    b: -1,
                                    "#": 1,
                                    x: 2
                                };
                            n.prototype = {
                                key: function(e) {
                                    return e ? 7 * (this.octave - 1) + 3 + Math.ceil(o[this.name].distance / 2) : 12 * (this.octave - 1) + 4 + o[this.name].distance + this.accidental.value
                                },
                                fq: function(e) {
                                    return e = e || 440, e * Math.pow(2, (this.key() - 49) / 12)
                                },
                                scale: function(e, t) {
                                    return s.scale.list(this, e, t)
                                },
                                interval: function(e, t) {
                                    return s.interval(this, e, t)
                                },
                                chord: function(e) {
                                    return e = e || "major", e in d && (e = d[e]), new r(this, e)
                                },
                                helmholtz: function() {
                                    var e, t = 3 > this.octave ? this.name.toUpperCase() : this.name.toLowerCase();
                                    return 2 >= this.octave ? (e = i("", ",", 2 - this.octave), e + t + this.accidental.sign) : (e = i("", "'", this.octave - 3), t + this.accidental.sign + e)
                                },
                                scientific: function() {
                                    return this.name.toUpperCase() + this.accidental.sign + ("number" == typeof this.octave ? this.octave : "")
                                },
                                enharmonics: function() {
                                    var e = [],
                                        t = this.key(),
                                        i = this.interval("m2", "up"),
                                        n = this.interval("m2", "down"),
                                        r = i.key() - i.accidental.value,
                                        s = n.key() - n.accidental.value,
                                        o = t - r;
                                    return 3 > o && o > -3 && (i.accidental = {
                                        value: o,
                                        sign: g[o]
                                    }, e.push(i)), o = t - s, 3 > o && o > -3 && (n.accidental = {
                                        value: o,
                                        sign: g[o]
                                    }, e.push(n)), e
                                },
                                valueName: function() {
                                    return u[this.duration]
                                },
                                toString: function(e) {
                                    return e = "boolean" == typeof e ? e : "number" == typeof this.octave ? !1 : !0, this.name.toLowerCase() + this.accidental.sign + (e ? "" : this.octave)
                                }
                            }, r.prototype.dominant = function(e) {
                                return e = e || "", new r(this.root.interval("P5"), e)
                            }, r.prototype.subdominant = function(e) {
                                return e = e || "", new r(this.root.interval("P4"), e)
                            }, r.prototype.parallel = function(e) {
                                if (e = e || "", "triad" !== this.chordType() || "diminished" === this.quality || "augmented" === this.quality) throw Error("Only major/minor triads have parallel chords");
                                return "major" === this.quality ? new r(this.root.interval("m3", "down"), "m") : new r(this.root.interval("m3", "up"))
                            }, r.prototype.chordType = function() {
                                var e, t, i;
                                if (2 === this.notes.length) return "dyad";
                                if (3 === this.notes.length) {
                                    t = {
                                        unison: !1,
                                        third: !1,
                                        fifth: !1
                                    };
                                    for (var n = 0, r = this.notes.length; r > n; n++) e = this.root.interval(this.notes[n]), i = c[parseFloat(s.interval.invert(e.simple)[1]) - 1], e.name in t ? t[e.name] = !0 : i.name in t && (t[i.name] = !0);
                                    return t.unison && t.third && t.fifth ? "triad" : "trichord"
                                }
                                if (4 === this.notes.length) {
                                    t = {
                                        unison: !1,
                                        third: !1,
                                        fifth: !1,
                                        seventh: !1
                                    };
                                    for (var n = 0, r = this.notes.length; r > n; n++) e = this.root.interval(this.notes[n]), i = c[parseFloat(s.interval.invert(e.simple)[1]) - 1], e.name in t ? t[e.name] = !0 : i.name in t && (t[i.name] = !0);
                                    if (t.unison && t.third && t.fifth && t.seventh) return "tetrad"
                                }
                                return "unknown"
                            }, r.prototype.toString = function() {
                                return this.name
                            }, s.note = function(e, t) {
                                return new n(e, t)
                            }, s.note.fromKey = function(e) {
                                var t = 440 * Math.pow(2, (e - 49) / 12);
                                return s.frequency.note(t).note
                            }, s.chord = function(e) {
                                var t;
                                if (t = e.match(/^([abcdefgh])(x|#|bb|b?)/i), t && t[0]) return new r(new n(t[0].toLowerCase()), e.substr(t[0].length));
                                throw Error("Invalid Chord. Couldn't find note name")
                            }, s.frequency = {
                                note: function(e, t) {
                                    t = t || 440;
                                    var i, r, s, u, c, l, p;
                                    return i = Math.round(49 + 12 * ((Math.log(e) - Math.log(t)) / Math.log(2))), p = t * Math.pow(2, (i - 49) / 12), l = 1200 * (Math.log(e / p) / Math.log(2)), r = Math.floor((i - 4) / 12), s = i - 12 * r - 4, u = o[a[Math.round(s / 2)]], c = u.name, s > u.distance ? c += "#" : u.distance > s && (c += "b"), {
                                        note: new n(c + (r + 1)),
                                        cents: l
                                    }
                                }
                            }, s.interval = function(e, t, i) {
                                if ("string" == typeof t) {
                                    "down" === i && (t = s.interval.invert(t));
                                    var r = p[t[0]],
                                        o = parseFloat(t.substr(1));
                                    if (!r || isNaN(o) || 1 > o) throw Error("Invalid string-interval format");
                                    return s.interval.from(e, {
                                        quality: r,
                                        interval: c[o - 1].name
                                    }, i)
                                }
                                if (t instanceof n && e instanceof n) return s.interval.between(e, t);
                                throw Error("Invalid parameters")
                            }, s.interval.from = function(t, i, r) {
                                i.direction = r || i.direction || "up";
                                var s, u, p, h, f, m;
                                if (f = l[i.interval], m = c[f], f > 7 && (f -= 7), f = o[t.name].index + f, f > a.length - 1 && (f -= a.length), s = a[f], -1 === b[m.quality].indexOf(i.quality) || -1 === b[m.quality].indexOf(m.quality)) throw Error("Invalid interval quality");
                                return u = b[m.quality].indexOf(i.quality) - b[m.quality].indexOf(m.quality), p = m.size + u - e(t.name, s), t.octave && (h = Math.floor((t.key() - t.accidental.value + e(t.name, s) - 4) / 12) + 1 + Math.floor(l[i.interval] / 7)), p += t.accidental.value, p >= 11 && (p -= 12), p > -3 && 3 > p && (s += g[p]), "down" === r && h--, new n(s + (h || ""))
                            }, s.interval.between = function(e, t) {
                                var i, n, r, s, a, u, l = e.key(),
                                    p = t.key();
                                if (i = p - l, i > 24 || -25 > i) throw Error("Too big interval. Highest interval is a augmented fifteenth (25 semitones)");
                                return 0 > i && (s = e, e = t, t = s), r = o[t.name].index - o[e.name].index + 7 * (t.octave - e.octave), n = c[r], u = b[n.quality][Math.abs(i) - n.size + 1], a = h[u] + ("" + Number(r + 1)), {
                                    name: n.name,
                                    quality: u,
                                    direction: i > 0 ? "up" : "down",
                                    simple: a
                                }
                            }, s.interval.invert = function(e) {
                                if (2 !== e.length && 3 !== e.length) return !1;
                                var t = f[e[0]],
                                    i = parseFloat(2 === e.length ? e[1] : e.substr(1));
                                return i > 8 && (i -= 7), 8 !== i && 1 !== i && (i = 9 - i), t + ("" + i)
                            }, s.scale = {
                                list: function(e, t, i) {
                                    var r, o, a = [],
                                        u = [];
                                    if (!(e instanceof n)) return !1;
                                    if ("string" == typeof t && (t = s.scale.scales[t], !t)) return !1;
                                    for (a.push(e), i && u.push(e.name + (e.accidental.sign || "")), r = 0, o = t.length; o > r; r++) a.push(s.interval(e, t[r])), i && u.push(a[r + 1].name + (a[r + 1].accidental.sign || ""));
                                    return i ? u : a
                                },
                                scales: {
                                    major: ["M2", "M3", "P4", "P5", "M6", "M7"],
                                    ionian: ["M2", "M3", "P4", "P5", "M6", "M7"],
                                    dorian: ["M2", "m3", "P4", "P5", "M6", "m7"],
                                    phrygian: ["m2", "m3", "P4", "P5", "m6", "m7"],
                                    lydian: ["M2", "M3", "A4", "P5", "M6", "M7"],
                                    mixolydian: ["M2", "M3", "P4", "P5", "M6", "m7"],
                                    minor: ["M2", "m3", "P4", "P5", "m6", "m7"],
                                    aeolian: ["M2", "m3", "P4", "P5", "m6", "m7"],
                                    locrian: ["m2", "m3", "P4", "d5", "m6", "m7"],
                                    majorpentatonic: ["M2", "M3", "P5", "M6"],
                                    minorpentatonic: ["m3", "P4", "P5", "m7"],
                                    chromatic: ["m2", "M2", "m3", "M3", "P4", "A4", "P5", "m6", "M6", "m7", "M7"],
                                    harmonicchromatic: ["m2", "M2", "m3", "M3", "P4", "A4", "P5", "m6", "M6", "m7", "M7"]
                                }
                            }, t.exports = s
                        }()
                    }, {}],
                    3: [function(e, t) {
                        ! function() {
                            "use strict";
                            var i, n, r = {
                                    value: {
                                        min: 0,
                                        max: 255,
                                        output: u,
                                        wrap: !1,
                                        timescale: "graphics"
                                    }
                                },
                                s = e("gibberish-dsp"),
                                o = e("../dollar"),
                                a = e("../mappings").outputCurves,
                                u = (a.LINEAR, a.LOGARITHMIC),
                                c = {
                                    FFT: function(e, t) {
                                        if ("undefined" == typeof i) {
                                            i = s.context.createAnalyser(), s.node.connect(i), i.fftSize = e || 32, i.updateRate = t || 40, i.values = new Uint8Array(i.frequencyBinCount), i.children = [];
                                            for (var a = 0; a < i.frequencyBinCount; a++) ! function() {
                                                var e = a,
                                                    t = {},
                                                    s = 0;
                                                Object.defineProperties(t, {
                                                    value: {
                                                        configurable: !0,
                                                        get: function() {
                                                            return s
                                                        },
                                                        set: function(e) {
                                                            s = e
                                                        }
                                                    }
                                                }), n.createProxyProperties(t, o.extend({}, r), !1), i[e] = t, i.children.push(t), t.type = "mapping", t.index = e, t.min = 0, t.max = 255, t.valueOf = function() {
                                                    return this.value()
                                                }
                                            }();
                                            setInterval(function() {
                                                i.getByteFrequencyData(i.values);
                                                for (var e = 0; e < i.values.length; e++) i[e].value = i.values[e]
                                            }, i.updateRate)
                                        } else e && (i.fftSize = e), t && (i.updateRate = t);
                                        return i
                                    },
                                    Follow: function(e, t) {
                                        var i = new s.Follow(e, t),
                                            r = {
                                                value: {
                                                    min: 0,
                                                    max: 1,
                                                    output: u,
                                                    timescale: "audio"
                                                }
                                            };
                                        return n.createProxyProperties(i, r), i
                                    }
                                };
                            t.exports = function(e) {
                                return "undefined" == typeof n && (n = e), c
                            }
                        }()
                    }, {
                        "../dollar": 16,
                        "../mappings": 18,
                        "gibberish-dsp": 1
                    }],
                    4: [function(e, t) {
                        ! function() {
                            var i, n, r = e("../../external/teoria.min"),
                                s = e("../dollar"),
                                o = e("../seq");
                            n = function(e, t, n, a, u) {
                                var c = o();
                                s.extend(c, {
                                    name: "Arp",
                                    notes: [],
                                    pattern: n || "up",
                                    notation: e || "C4m7",
                                    mult: a || 1,
                                    init: !1,
                                    speed: isNaN(t) ? _4 : t,
                                    scale: u || null,
                                    chord: function(e) {
                                        var t = [];
                                        if (this.notation = e, "undefined" == typeof this.scale || null === this.scale && "string" == typeof e) {
                                            console.log("redoing notes...");
                                            for (var i = 0; i < this.mult; i++) {
                                                var n, s, o = [],
                                                    a = this.notation.slice(0, 1);
                                                isNaN(this.notation.charAt(1)) ? (a += this.notation.charAt(1), n = parseInt(this.notation.slice(2, 3)), s = this.notation.slice(3)) : (n = parseInt(this.notation.slice(1, 2)), s = this.notation.slice(2)), n += i;
                                                for (var e = r.note(a + n).chord(s), u = 0; u < e.notes.length; u++) {
                                                    var c = e.notes[u].fq();
                                                    o[u] = c
                                                }
                                                t = t.concat(o)
                                            }
                                        } else
                                            for (var i = 0; i < this.mult; i++) {
                                                for (var o = [], u = 0; u < this.notation.length; u++) o[u] = this.notation[u] + 7 * i;
                                                t = t.concat(o)
                                            }
                                        this.notes = this.patterns[this.pattern](t), this.seqs[0] && (this.seqs[0].values = this.notes)
                                    },
                                    set: function(e, t, i, n, r) {
                                        this.speed = t || this.speed, this.pattern = i || this.pattern, this.mult = n || this.mult, this.chord(e, r)
                                    },
                                    patterns: {
                                        up: function(e) {
                                            return e
                                        },
                                        down: function(e) {
                                            return e.reverse()
                                        },
                                        updown: function(e) {
                                            var t = e.slice(0);
                                            return t.reverse(), e.concat(t)
                                        },
                                        updown2: function(e) {
                                            var t = e.slice(0);
                                            return t.pop(), t.reverse(), t.pop(), e.concat(t)
                                        }
                                    }
                                }), c.seq = c, c.__shuffle = c.shuffle, c.shuffle = function() {
                                    c.__shuffle()
                                }, i.createProxyMethods(c, ["shuffle", "reset", "chord"]), c.chord(c.notation);
                                var l = null;
                                Object.defineProperty(c, "target", {
                                    get: function() {
                                        return l
                                    },
                                    set: function(e) {
                                        l = e;
                                        var n = {
                                            key: "note",
                                            target: l,
                                            values: c.notes,
                                            durations: i.Clock.time(t)
                                        };
                                        c.add(n), c.start()
                                    }
                                });
                                var p = t;
                                return Object.defineProperty(c, "speed", {
                                    get: function() {
                                        return p
                                    },
                                    set: function(e) {
                                        p = e;
                                        for (var t = 0; t < c.seqs.length; t++) c.seqs[0].durations = i.Clock.time(p)
                                    }
                                }), c
                            }, t.exports = function(e) {
                                return "undefined" == typeof i && (i = e), n
                            }
                        }()
                    }, {
                        "../../external/teoria.min": 2,
                        "../dollar": 16,
                        "../seq": 19
                    }],
                    5: [function(e, t) {
                        ! function() {
                            "use strict";
                            var i, n = {},
                                r = e("gibberish-dsp"),
                                s = e("../mappings").outputCurves,
                                o = s.LINEAR,
                                a = s.LOGARITHMIC,
                                u = {
                                    amp: {
                                        min: 0,
                                        max: 1,
                                        hardMax: 2,
                                        output: a,
                                        timescale: "audio",
                                        dimensions: 1
                                    },
                                    out: {
                                        min: 0,
                                        max: 1,
                                        output: o,
                                        timescale: "audio",
                                        dimensions: 1
                                    }
                                },
                                c = "Input";
                            n = function() {
                                var e = (new r.Input).connect(i.Master),
                                    t = Array.prototype.slice.call(arguments, 0);
                                return e.type = "Gen", $.extend(!0, e, i.ugen), e.fx.ugen = e, Object.defineProperty(e, "_", {
                                    get: function() {
                                        return e.kill(), e
                                    },
                                    set: function() {}
                                }), i.createProxyProperties(e, u), i.processArguments2(e, t, c), e.toString = function() {
                                    return "> " + c
                                }, e
                            }, t.exports = function(e) {
                                return "undefined" == typeof i && (i = e), n
                            }
                        }()
                    }, {
                        "../mappings": 18,
                        "gibberish-dsp": 1
                    }],
                    6: [function(e, t) {
                        ! function() {
                            "use strict";
                            for (var i, n = e("../dollar"), r = e("gibberish-dsp"), s = e("../mappings").outputCurves, o = s.LINEAR, a = (s.LOGARITHMIC, [
                                    ["Bus2", "Bus"]
                                ]), u = {
                                    amp: {
                                        min: 0,
                                        max: 1,
                                        output: o,
                                        timescale: "audio"
                                    },
                                    pan: {
                                        min: -.75,
                                        max: .75,
                                        output: o,
                                        timescale: "audio"
                                    },
                                    out: {
                                        min: 0,
                                        max: 1,
                                        output: o,
                                        timescale: "audio",
                                        dimensions: 1
                                    }
                                }, c = !1, l = {
                                    mappingProperties: u,
                                    Presets: {}
                                }, p = 0; p < a.length; p++) ! function() {
                                var e = Array.isArray(a[p]) ? a[p][0] : a[p],
                                    t = Array.isArray(a[p]) ? a[p][1] : a[p];
                                l[t] = function() {
                                    var s = i.processArguments(arguments, t);
                                    return Array.isArray(s) ? (s.unshift(0), s = i.construct(r[e], s)) : s = new r[e](s), c ? s.connect(Master) : c = !0, s.type = "Gen", Object.defineProperty(s, "_", {
                                        get: function() {
                                            return s.kill(), s
                                        },
                                        set: function() {}
                                    }), n.extend(!0, s, i.ugen), s.fx.ugen = s, i.createProxyProperties(s, u), s
                                }
                            }();
                            l.Group = function() {
                                var e = i.processArguments(arguments, "Bus2");
                                e = new r.Bus2, c ? e.connect(Master) : c = !0, e.type = "FX", n.extend(!0, e, i.ugen), e.fx.ugen = e, i.createProxyProperties(e, u), n.extend(e, {
                                    add: function() {
                                        for (var t = 0; t < arguments.length; t++) arguments[t].disconnect(), arguments[t].connect(e)
                                    },
                                    remove: function() {
                                        for (var t = 0; t < arguments.length; t++) arguments[t].disconnect(e)
                                    },
                                    free: function() {
                                        for (var t = 0; t < arguments.length; t++) arguments[t].disconnect(e), arguments[t].connect()
                                    }
                                });
                                for (var t = 0; t < arguments.length; t++) e.add(arguments[t]);
                                return e
                            }, t.exports = function(e) {
                                return "undefined" == typeof i && (i = e), l
                            }
                        }()
                    }, {
                        "../dollar": 16,
                        "../mappings": 18,
                        "gibberish-dsp": 1
                    }],
                    7: [function(_dereq_, module, exports) {
                        ! function() {
                            "use strict";
                            for (var Percussion = {
                                    Presets: {}
                                }, Gibberish = _dereq_("gibberish-dsp"), Gibber, $ = _dereq_("../dollar"), Clock = _dereq_("../clock"), curves = _dereq_("../mappings").outputCurves, LINEAR = curves.LINEAR, LOGARITHMIC = curves.LOGARITHMIC, types = ["Kick", "Snare", "Hat", "Conga", "Cowbell", "Clave", "Tom"], _mappingProperties = {
                                    Drums: {
                                        pitch: {
                                            min: .25,
                                            max: 4,
                                            output: LINEAR,
                                            timescale: "audio"
                                        },
                                        amp: {
                                            min: 0,
                                            max: 1,
                                            output: LOGARITHMIC,
                                            timescale: "audio"
                                        },
                                        pan: {
                                            min: 0,
                                            max: 1,
                                            output: LINEAR,
                                            timescale: "audio"
                                        },
                                        out: {
                                            min: 0,
                                            max: 1,
                                            output: LINEAR,
                                            timescale: "audio",
                                            dimensions: 1
                                        }
                                    },
                                    XOX: {
                                        amp: {
                                            min: 0,
                                            max: 1,
                                            output: LOGARITHMIC,
                                            timescale: "audio"
                                        },
                                        pan: {
                                            min: 0,
                                            max: 1,
                                            output: LINEAR,
                                            timescale: "audio"
                                        },
                                        out: {
                                            min: 0,
                                            max: 1,
                                            output: LINEAR,
                                            timescale: "audio",
                                            dimensions: 1
                                        }
                                    },
                                    Kick: {
                                        amp: {
                                            min: 0,
                                            max: 1,
                                            output: LOGARITHMIC,
                                            timescale: "audio"
                                        },
                                        out: {
                                            min: 0,
                                            max: 1,
                                            output: LINEAR,
                                            timescale: "audio",
                                            dimensions: 1
                                        }
                                    },
                                    Snare: {
                                        amp: {
                                            min: 0,
                                            max: 1,
                                            output: LOGARITHMIC,
                                            timescale: "audio"
                                        },
                                        snappy: {
                                            min: .25,
                                            max: 1.5,
                                            output: LOGARITHMIC,
                                            timescale: "audio"
                                        },
                                        tune: {
                                            min: 0,
                                            max: 2,
                                            output: LOGARITHMIC,
                                            timescale: "audio"
                                        },
                                        out: {
                                            min: 0,
                                            max: 1,
                                            output: LINEAR,
                                            timescale: "audio",
                                            dimensions: 1
                                        }
                                    },
                                    Hat: {
                                        amp: {
                                            min: 0,
                                            max: 1,
                                            output: LOGARITHMIC,
                                            timescale: "audio"
                                        },
                                        out: {
                                            min: 0,
                                            max: 1,
                                            output: LINEAR,
                                            timescale: "audio",
                                            dimensions: 1
                                        }
                                    },
                                    Conga: {
                                        amp: {
                                            min: 0,
                                            max: 1,
                                            output: LOGARITHMIC,
                                            timescale: "audio"
                                        },
                                        out: {
                                            min: 0,
                                            max: 1,
                                            output: LINEAR,
                                            timescale: "audio",
                                            dimensions: 1
                                        }
                                    },
                                    Cowbell: {
                                        out: {
                                            min: 0,
                                            max: 1,
                                            output: LINEAR,
                                            timescale: "audio",
                                            dimensions: 1
                                        },
                                        amp: {
                                            min: 0,
                                            max: 1,
                                            output: LOGARITHMIC,
                                            timescale: "audio"
                                        }
                                    },
                                    Clave: {
                                        out: {
                                            min: 0,
                                            max: 1,
                                            output: LINEAR,
                                            timescale: "audio",
                                            dimensions: 1
                                        },
                                        amp: {
                                            min: 0,
                                            max: 1,
                                            output: LOGARITHMIC,
                                            timescale: "audio"
                                        }
                                    },
                                    Tom: {
                                        out: {
                                            min: 0,
                                            max: 1,
                                            output: LINEAR,
                                            timescale: "audio",
                                            dimensions: 1
                                        },
                                        amp: {
                                            min: 0,
                                            max: 1,
                                            output: LOGARITHMIC,
                                            timescale: "audio"
                                        }
                                    }
                                }, i = 0; i < types.length; i++) ! function() {
                                var e = Array.isArray(types[i]) ? types[i][0] : types[i],
                                    t = Array.isArray(types[i]) ? types[i][1] : types[i];
                                Percussion[t] = function() {
                                    var i, n = Array.prototype.slice.call(arguments);
                                    return "object" == typeof n[0] && "undefined" == typeof n[0].maxVoices ? n[0].maxVoices = 1 : "undefined" == typeof n[0] && (n[0] = {
                                        maxVoices: 1
                                    }), i = Gibber.processArguments(n, t), i = Array.isArray(i) ? Gibber.construct(Gibberish[e], i).connect(Gibber.Master) : new Gibberish[e](i).connect(Gibber.Master), i.type = "Gen", $.extend(!0, i, Gibber.ugen), i.fx.ugen = i, i._note = i.note.bind(i), i.note = function() {
                                        var e = Array.prototype.splice.call(arguments, 0);
                                        "string" == typeof e[0] && (e[0] = Gibber.Theory.Teoria.note(e[0]).fq()), this._note.apply(this, e)
                                    }, Gibber.createProxyProperties(i, _mappingProperties[t]), Gibber.createProxyMethods(i, ["note", "send"]), i.toString = function() {
                                        return "> " + t
                                    }, Object.defineProperty(i, "_", {
                                        get: function() {
                                            return i.kill(), i
                                        },
                                        set: function() {}
                                    }), i
                                }
                            }();
                            Percussion.Drums = function(_sequence, _timeValue, _amp, _freq) {
                                var args = Array.prototype.slice.call(arguments),
                                    obj = {},
                                    props = Gibber.processArguments(args, "Drums");
                                $.extend(!0, obj, props), obj = Array.isArray(obj) ? Gibber.construct(Gibberish.Bus2, obj).connect(Gibber.Master) : new Gibberish.Bus2(obj).connect(Gibber.Master), obj.name = "Drums", obj.type = "Gen", obj.children = [], $.extend(!0, obj, Gibber.ugen), obj.fx.ugen = obj, Object.defineProperty(obj, "_", {
                                    get: function() {
                                        return obj.kill(), obj
                                    },
                                    set: function() {}
                                }), obj.kit = Percussion.Drums.kits["default"], "object" == typeof arguments[0] && arguments[0].kit && (obj.kit = Percussion.Drums.kits[arguments[0].kit], arguments[0].kit = obj.kit);
                                for (var key in obj.kit) {
                                    var drum = obj.kit[key];
                                    obj[key] = {
                                        sampler: new Gibberish.Sampler({
                                            file: drum.file,
                                            pitch: 1,
                                            amp: drum.amp
                                        }),
                                        pitch: drum.pitch,
                                        amp: drum.amp
                                    }, obj[key].sampler.pan = drum.pan, obj[key].sampler.connect(obj), obj[key].fx = obj[key].sampler.fx, obj.children.push(obj[key].sampler)
                                }
                                if (obj.mod = obj.polyMod, obj.removeMod = obj.removePolyMod, obj.connect(), Gibber.createProxyProperties(obj, _mappingProperties.Drums), obj.pitch(1), "undefined" != typeof props) switch ($.type(props[0])) {
                                    case "string":
                                        for (var notes = props[0], _seqs = [], _durations = [], __durations = [], seqs = notes.split("|"), timeline = {}, i = 0; i < seqs.length; i++) {
                                            var seq = seqs[i],
                                                duration, hasTime = !1,
                                                idx = seq.indexOf(",");
                                            if (idx > -1) {
                                                var _value = seq.substr(0, idx),
                                                    duration = seq.substr(idx + 1);
                                                duration = eval(duration), hasTime = !0, seq = _value.trim().split("")
                                            } else seq = seq.trim().split(""), duration = 1 / seq.length;
                                            seq.indexOf(".rnd(") > -1 && (seq = seq.split(".rnd")[0], seq = seq.split("").rnd()), "undefined" != typeof props[1] && (duration = props[1]), obj.seq.add({
                                                key: "note",
                                                values: seq,
                                                durations: duration,
                                                target: obj
                                            })
                                        }
                                        break;
                                    case "object":
                                        "string" == typeof props[0].note && (props[0].note = props[0].note.split("")), props[0].target = obj, props[0].durations = Gibber.Clock.Time(props[0].durations ? props[0].durations : 1 / props[0].note.length), props[0].offset = props[0].offset ? Gibber.Clock.time(props[0].offset) : 0;
                                        break;
                                    case "function":
                                    case "array":
                                        var length = props[0].length || props[0].values.length,
                                            durations = "undefined" != typeof arguments[1] ? arguments[1] : Gibber.Clock.Time(1 / length);
                                        "function" != typeof durations && (durations = Gibber.Clock.Time(durations)), obj.seq.add({
                                            key: "note",
                                            values: [props[0]],
                                            durations: durations,
                                            target: obj
                                        }), obj.pattern = obj.seq.seqs[obj.seq.seqs.length - 1].values[0]
                                }
                                return "undefined" == typeof props && (props = {}), props.pitch && (obj.pitch = props.pitch), "undefined" != typeof props.snare && ($.extend(obj.snare.sampler, props.snare), $.extend(obj.snare, props.snare)), "undefined" != typeof props.kick && ($.extend(obj.kick.sampler, props.kick), $.extend(obj.kick, props.kick)), "undefined" != typeof props.hat && ($.extend(obj.hat.sampler, props.hat), $.extend(obj.hat, props.hat)), "undefined" != typeof props.openHat && ($.extend(obj.openHat.sampler, props.openHat), $.extend(obj.openHat, props.openHat)), obj.amp = isNaN(_amp) ? 1 : _amp, obj.seq && obj.seq.tick && Gibberish.future(obj.seq.tick, 1), obj.note = function(e) {
                                    var t = "function" == typeof obj.pitch ? obj.pitch() : obj.pitch;
                                    if ($.isArray(e))
                                        for (var i = 0; i < e.length; i++) {
                                            var n = e[i];
                                            if ("string" == typeof n) {
                                                for (var r in this.kit)
                                                    if (n === this.kit[r].symbol) {
                                                        this[r].sampler.note(1, this[r].amp);
                                                        var t = this.pitch();
                                                        this[r].sampler.pitch !== t && (this[r].sampler.pitch = t);
                                                        break
                                                    }
                                            } else {
                                                var s = obj[Object.keys(obj.kit)[n]];
                                                s.sampler.note(1, s.sampler.amp), s.sampler.pitch !== t && (s.sampler.pitch = t)
                                            }
                                        } else if ("string" == typeof e) {
                                            for (var r in this.kit)
                                                if (e === this.kit[r].symbol) {
                                                    this[r].sampler.note(1, this[r].amp);
                                                    var t = this.pitch();
                                                    this[r].sampler.pitch !== t && (this[r].sampler.pitch = t);
                                                    break
                                                }
                                        } else {
                                            var o = Object.keys(obj.kit),
                                                a = Math.abs(e),
                                                r = o[a % o.length],
                                                s = obj[r];
                                            s.sampler.note(1, s.sampler.amp), s.sampler.pitch !== t && (s.sampler.pitch = t)
                                        }
                                }, obj.start = function() {
                                    obj.seq.start(!0)
                                }, obj.stop = function() {
                                    obj.seq.stop()
                                }, obj.shuffle = function() {
                                    obj.seq.shuffle()
                                }, obj.reset = function() {
                                    obj.seq.reset()
                                }, Gibber.createProxyMethods(obj, ["play", "stop", "shuffle", "reset", "start", "send", "note"]), obj.seq.start(!0), Object.defineProperties(obj, {
                                    offset: {
                                        get: function() {
                                            return obj.seq.offset
                                        },
                                        set: function(e) {
                                            obj.seq.offset = Gibber.Clock.time(e)
                                        }
                                    }
                                }), obj.toString = function() {
                                    return "Drums : " + obj.seq.seqs[0].values.join("")
                                }, obj
                            }, Percussion.EDrums = function(_sequence, _timeValue, _amp, _freq) {
                                var args = Array.prototype.slice.call(arguments),
                                    obj = {},
                                    props = Gibber.processArguments(args, "Drums");
                                if ($.extend(!0, obj, props), obj = Array.isArray(obj) ? Gibber.construct(Gibberish.Bus2, obj).connect(Gibber.Master) : new Gibberish.Bus2(obj).connect(Gibber.Master), obj.name = "XOX", obj.type = "Gen", obj.children = [], $.extend(!0, obj, Gibber.ugen), obj.fx.ugen = obj, Object.defineProperty(obj, "_", {
                                        get: function() {
                                            return obj.kill(), obj
                                        },
                                        set: function() {}
                                    }), obj.pitch = 1, obj.kick = Gibber.Percussion.Kick().disconnect(), obj.snare = Gibber.Percussion.Snare().disconnect(), obj.hat = Gibber.Percussion.Hat().disconnect(), obj.kick.connect(obj), obj.snare.connect(obj), obj.hat.connect(obj), obj.children.push(obj.kick, obj.snare, obj.hat), obj.mod = obj.polyMod, obj.removeMod = obj.removePolyMod, obj.set = function(e) {
                                        obj.seq.note = e.split("")
                                    }, Gibber.createProxyProperties(obj, _mappingProperties.XOX), obj.start = function() {
                                        obj.seq.start(!0)
                                    }, obj.stop = function() {
                                        obj.seq.stop()
                                    }, obj.shuffle = function() {
                                        obj.seq.shuffle()
                                    }, obj.reset = function() {
                                        obj.seq.reset()
                                    }, Gibber.createProxyMethods(obj, ["play", "stop", "shuffle", "reset", "start", "send"]), "undefined" != typeof props) switch ($.type(props[0])) {
                                    case "string":
                                        for (var notes = props[0], _seqs = [], _durations = [], __durations = [], seqs = notes.split("|"), timeline = {}, i = 0; i < seqs.length; i++) {
                                            var seq = seqs[i],
                                                duration, hasTime = !1,
                                                idx = seq.indexOf(",");
                                            if (idx > -1) {
                                                var _value = seq.substr(0, idx),
                                                    duration = seq.substr(idx + 1);
                                                duration = eval(duration), hasTime = !0, seq = _value.trim().split("")
                                            } else seq = seq.trim().split(""), duration = 1 / seq.length;
                                            seq.indexOf(".rnd(") > -1 ? (seq = seq.split(".rnd")[0], seq = seq.split("").rnd()) : seq.indexOf(".random(") > -1 && (seq = seq.split(".random")[0], seq = seq.split("").rnd()), "undefined" != typeof props[1] && (duration = props[1]), obj.seq.add({
                                                key: "note",
                                                values: seq,
                                                durations: duration,
                                                target: obj
                                            })
                                        }
                                        break;
                                    case "object":
                                        "string" == typeof props[0].note && (props[0].note = props[0].note.split("")), props[0].target = obj, props[0].durations = Gibber.Clock.Time(props[0].durations ? props[0].durations : 1 / props[0].note.length), props[0].offset = props[0].offset ? Gibber.Clock.time(props[0].offset) : 0, obj.seq = Seq(props[0])
                                }
                                "undefined" == typeof props && (props = {}), props.pitch && (obj.pitch = props.pitch), "undefined" != typeof props.snare && ($.extend(obj.snare.sampler, props.snare), $.extend(obj.snare, props.snare)), "undefined" != typeof props.kick && ($.extend(obj.kick.sampler, props.kick), $.extend(obj.kick, props.kick)), "undefined" != typeof props.hat && ($.extend(obj.hat.sampler, props.hat), $.extend(obj.hat, props.hat)), "undefined" != typeof props.openHat && ($.extend(obj.openHat.sampler, props.openHat), $.extend(obj.openHat, props.openHat)), obj.amp = isNaN(_amp) ? 1 : _amp, obj.seq.tick && Gibberish.future(obj.seq.tick, 1);
                                var kcd = 1,
                                    scd = 1,
                                    hcd = 1,
                                    kf = null,
                                    sf = null,
                                    hf = null;
                                return obj.note = function(e) {
                                    switch (e) {
                                        case "x":
                                            1 === kcd && (kcd = 0), obj.kick.note(), null !== kf && (kf(), kf = null), kf = Gibber.Utilities.future(function() {
                                                kcd = 1, kf = null
                                            }, 11e4 * obj.kick.decay);
                                            break;
                                        case "o":
                                            1 === scd && (scd = 0), obj.snare.note(), null !== sf && (sf(), sf = null), sf = Gibber.Utilities.future(function() {
                                                scd = 1, sf = null
                                            }, obj.snare.decay);
                                            break;
                                        case "*":
                                            1 === hcd && (hcd = 0), obj.hat.note(5e3), null !== hf && (hf(), hf = null), hf = Gibber.Utilities.future(function() {
                                                hcd = 1, hf = null
                                            }, 5500);
                                            break;
                                        case "-":
                                            1 === hcd && (hcd = 0), obj.hat.note(3e4), null !== hf && (hf(), hf = null), hf = Gibber.Utilities.future(function() {
                                                hcd = 1, hf = null
                                            }, 30500)
                                    }
                                }, obj.seq.start(!0), obj.toString = function() {
                                    return "EDrums : " + obj.seq.seqs[0].values.join("")
                                }, obj
                            }, Percussion.Drums.kits = {
                                original: {
                                    kick: {
                                        file: "resources/audiofiles/kick.wav",
                                        symbol: "x",
                                        amp: 1,
                                        pitch: 1,
                                        pan: 0
                                    },
                                    snare: {
                                        file: "resources/audiofiles/snare.wav",
                                        symbol: "o",
                                        amp: 1,
                                        pitch: 1,
                                        pan: .15
                                    },
                                    hat: {
                                        file: "resources/audiofiles/hat.wav",
                                        symbol: "*",
                                        amp: 1,
                                        pitch: 1,
                                        pan: -.1
                                    },
                                    openHat: {
                                        file: "resources/audiofiles/openHat.wav",
                                        symbol: "-",
                                        amp: 1,
                                        pitch: 1,
                                        pan: -.2
                                    }
                                },
                                electronic: {
                                    kick: {
                                        file: "resources/audiofiles/electronic/kick.wav",
                                        symbol: "x",
                                        amp: 1.5,
                                        pitch: 1,
                                        pan: 0
                                    },
                                    snare: {
                                        file: "resources/audiofiles/electronic/snare.wav",
                                        symbol: "o",
                                        amp: 1.5,
                                        pitch: 1,
                                        pan: .15
                                    },
                                    hat: {
                                        file: "resources/audiofiles/electronic/hat.wav",
                                        symbol: "*",
                                        amp: 1.5,
                                        pitch: 1,
                                        pan: -.1
                                    },
                                    openHat: {
                                        file: "resources/audiofiles/electronic/openhat.wav",
                                        symbol: "-",
                                        amp: 1.5,
                                        pitch: 1,
                                        pan: -.2
                                    }
                                },
                                beatbox: {
                                    in_tss: {
                                        file: "resources/audiofiles/beatbox/^tss.wav",
                                        symbol: "T",
                                        amp: 1,
                                        pitch: 1,
                                        pan: .1
                                    },
                                    f: {
                                        file: "resources/audiofiles/beatbox/f.wav",
                                        symbol: "f",
                                        amp: 1,
                                        pitch: 1,
                                        pan: -.1
                                    },
                                    h: {
                                        file: "resources/audiofiles/beatbox/h.wav",
                                        symbol: "h",
                                        amp: 1,
                                        pitch: 1,
                                        pan: .1
                                    },
                                    s: {
                                        file: "resources/audiofiles/beatbox/s.wav",
                                        symbol: "s",
                                        amp: 1,
                                        pitch: 1,
                                        pan: -.1
                                    },
                                    d: {
                                        file: "resources/audiofiles/beatbox/d.wav",
                                        symbol: "d",
                                        amp: 1,
                                        pitch: 1,
                                        pan: .8
                                    },
                                    t: {
                                        file: "resources/audiofiles/beatbox/t.wav",
                                        symbol: "t",
                                        amp: 1,
                                        pitch: 1,
                                        pan: .4
                                    },
                                    k: {
                                        file: "resources/audiofiles/beatbox/k.wav",
                                        symbol: "k",
                                        amp: 1,
                                        pitch: 1,
                                        pan: -.1
                                    },
                                    in_k: {
                                        file: "resources/audiofiles/beatbox/^k.wav",
                                        symbol: "K",
                                        amp: 1,
                                        pitch: 1,
                                        pan: -.4
                                    },
                                    eight: {
                                        file: "resources/audiofiles/beatbox/8.wav",
                                        symbol: "8",
                                        amp: 1,
                                        pitch: 1,
                                        pan: -.8
                                    },
                                    psh: {
                                        file: "resources/audiofiles/beatbox/psh.wav",
                                        symbol: "p",
                                        amp: 1,
                                        pitch: 1,
                                        pan: .1
                                    },
                                    in_p: {
                                        file: "resources/audiofiles/beatbox/^p.wav",
                                        symbol: "P",
                                        amp: 1,
                                        pitch: 1,
                                        pan: -.1
                                    },
                                    pf: {
                                        file: "resources/audiofiles/beatbox/pf.wav",
                                        symbol: "F",
                                        amp: 1,
                                        pitch: 1,
                                        pan: .2
                                    },
                                    phs: {
                                        file: "resources/audiofiles/beatbox/phs.wav",
                                        symbol: "H",
                                        amp: 1,
                                        pitch: 1,
                                        pan: -.2
                                    },
                                    b: {
                                        file: "resources/audiofiles/beatbox/b.wav",
                                        symbol: "b",
                                        amp: 1,
                                        pitch: 1,
                                        pan: .3
                                    },
                                    dot: {
                                        file: "resources/audiofiles/beatbox/dot.wav",
                                        symbol: ".",
                                        amp: 1,
                                        pitch: 1,
                                        pan: 0
                                    },
                                    duf: {
                                        file: "resources/audiofiles/beatbox/duf.wav",
                                        symbol: "D",
                                        amp: 1,
                                        pitch: 1,
                                        pan: -.3
                                    },
                                    o: {
                                        file: "resources/audiofiles/beatbox/o.wav",
                                        symbol: "o",
                                        amp: 1,
                                        pitch: 1,
                                        pan: .6
                                    },
                                    a: {
                                        file: "resources/audiofiles/beatbox/a.wav",
                                        symbol: "a",
                                        amp: 1,
                                        pitch: 1,
                                        pan: .8
                                    },
                                    u: {
                                        file: "resources/audiofiles/beatbox/u.wav",
                                        symbol: "u",
                                        amp: 1,
                                        pitch: 1,
                                        pan: -.8
                                    },
                                    m: {
                                        file: "resources/audiofiles/beatbox/m.wav",
                                        symbol: "m",
                                        amp: 1,
                                        pitch: 1,
                                        pan: -.6
                                    },
                                    n: {
                                        file: "resources/audiofiles/beatbox/n.wav",
                                        symbol: "n",
                                        amp: 1,
                                        pitch: 1,
                                        pan: 0
                                    }
                                }
                            }, Percussion.Drums.kits.default = Percussion.Drums.kits.electronic, module.exports = function(e) {
                                return "undefined" == typeof Gibber && (Gibber = e), Percussion
                            }
                        }()
                    }, {
                        "../clock": 15,
                        "../dollar": 16,
                        "../mappings": 18,
                        "gibberish-dsp": 1
                    }],
                    8: [function(e, t) {
                        ! function() {
                            "use strict";
                            for (var i, n = {}, r = e("gibberish-dsp"), s = e("../dollar"), o = e("../clock"), a = e("../mappings").outputCurves, u = a.LINEAR, c = (a.LOGARITHMIC, ["Line"]), l = {
                                    Line: {
                                        start: {
                                            min: 0,
                                            max: 1,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        end: {
                                            min: 0,
                                            max: 1,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        time: {
                                            min: 0,
                                            max: 8,
                                            output: u,
                                            timescale: "audio"
                                        }
                                    }
                                }, p = 0; p < c.length; p++) ! function() {
                                var e = Array.isArray(c[p]) ? c[p][0] : c[p],
                                    t = Array.isArray(c[p]) ? c[p][1] : c[p];
                                n[t] = function() {
                                    var n, a = Array.prototype.slice.call(arguments, 0);
                                    return n = new r[e](a[0], a[1], o.time(a[2]), a[3]), n.name = t, s.extend(!0, n, i.ugen), i.createProxyProperties(n, l[t]), i.processArguments2(n, a, n.name), console.log(t + " is created."), n
                                }
                            }();
                            t.exports = function(e) {
                                return "undefined" == typeof i && (i = e), n
                            }
                        }()
                    }, {
                        "../clock": 15,
                        "../dollar": 16,
                        "../mappings": 18,
                        "gibberish-dsp": 1
                    }],
                    9: [function(e, t) {
                        ! function() {
                            "use strict";
                            var i, n = {
                                    Presets: {}
                                },
                                r = e("gibberish-dsp"),
                                s = e("../dollar"),
                                o = e("../mappings").outputCurves,
                                a = o.LINEAR,
                                u = o.LOGARITHMIC;
                            r.Gain = function() {
                                r.extend(this, {
                                    name: "gain",
                                    type: "effect",
                                    properties: {
                                        input: 0,
                                        amount: 1
                                    },
                                    callback: function(e, t) {
                                        return isNaN(e) ? (e[0] *= t, e[1] *= t) : e *= t, e
                                    }
                                }).init().processProperties(arguments)
                            }, r.Gain.prototype = r._effect;
                            for (var c = ["Reverb", "Delay", "Flanger", "Vibrato", "Distortion", "Biquad", "Gain", "Filter24", ["RingModulation", "RingMod"],
                                    ["BufferShuffler", "Schizo"],
                                    ["Decimator", "Crush"], "Tremolo"
                                ], l = {
                                    Reverb: {
                                        roomSize: {
                                            min: .5,
                                            max: .995,
                                            output: a,
                                            timescale: "audio"
                                        },
                                        damping: {
                                            min: 0,
                                            max: 1,
                                            output: a,
                                            timescale: "audio"
                                        },
                                        out: {
                                            min: 0,
                                            max: 1,
                                            output: a,
                                            timescale: "audio",
                                            dimensions: 1
                                        }
                                    },
                                    Delay: {
                                        feedback: {
                                            min: 0,
                                            max: 1,
                                            output: a,
                                            timescale: "audio"
                                        },
                                        time: {
                                            min: 50,
                                            max: 88200,
                                            output: a,
                                            timescale: "audio"
                                        },
                                        out: {
                                            min: 0,
                                            max: 1,
                                            output: a,
                                            timescale: "audio",
                                            dimensions: 1
                                        }
                                    },
                                    RingMod: {
                                        frequency: {
                                            min: 20,
                                            max: 3e3,
                                            output: a,
                                            timescale: "audio"
                                        },
                                        amp: {
                                            min: 0,
                                            max: 1,
                                            output: a,
                                            timescale: "audio"
                                        },
                                        mix: {
                                            min: 0,
                                            max: 1,
                                            output: a,
                                            timescale: "audio"
                                        },
                                        out: {
                                            min: 0,
                                            max: 1,
                                            output: a,
                                            timescale: "audio",
                                            dimensions: 1
                                        }
                                    },
                                    Flanger: {
                                        rate: {
                                            min: .01,
                                            max: 20,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        feedback: {
                                            min: 0,
                                            max: .99,
                                            output: a,
                                            timescale: "audio"
                                        },
                                        amount: {
                                            min: 25,
                                            max: 300,
                                            output: a,
                                            timescale: "audio"
                                        },
                                        out: {
                                            min: 0,
                                            max: 1,
                                            output: a,
                                            timescale: "audio",
                                            dimensions: 1
                                        }
                                    },
                                    Gain: {
                                        amount: {
                                            min: 0,
                                            max: 1,
                                            output: a,
                                            timescale: "audio"
                                        }
                                    },
                                    Vibrato: {
                                        rate: {
                                            min: .2,
                                            max: 8,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        amount: {
                                            min: 25,
                                            max: 300,
                                            output: a,
                                            timescale: "audio"
                                        },
                                        feedback: {
                                            min: .45,
                                            max: .55,
                                            output: a,
                                            timescale: "audio"
                                        },
                                        out: {
                                            min: 0,
                                            max: 1,
                                            output: a,
                                            timescale: "audio",
                                            dimensions: 1
                                        }
                                    },
                                    Filter24: {
                                        cutoff: {
                                            min: 0,
                                            max: .7,
                                            output: a,
                                            timescale: "audio"
                                        },
                                        resonance: {
                                            min: 0,
                                            max: 5.5,
                                            output: a,
                                            timescale: "audio"
                                        },
                                        out: {
                                            min: 0,
                                            max: 1,
                                            output: a,
                                            timescale: "audio",
                                            dimensions: 1
                                        }
                                    },
                                    LPF: {
                                        cutoff: {
                                            min: .05,
                                            max: .7,
                                            output: a,
                                            timescale: "audio"
                                        },
                                        resonance: {
                                            min: 0,
                                            max: 5.5,
                                            output: a,
                                            timescale: "audio"
                                        },
                                        out: {
                                            min: 0,
                                            max: 1,
                                            output: a,
                                            timescale: "audio",
                                            dimensions: 1
                                        }
                                    },
                                    HPF: {
                                        cutoff: {
                                            min: 0,
                                            max: .7,
                                            output: a,
                                            timescale: "audio"
                                        },
                                        resonance: {
                                            min: 0,
                                            max: 5.5,
                                            output: a,
                                            timescale: "audio"
                                        },
                                        out: {
                                            min: 0,
                                            max: 1,
                                            output: a,
                                            timescale: "audio",
                                            dimensions: 1
                                        }
                                    },
                                    Crush: {
                                        bitDepth: {
                                            min: 1,
                                            max: 16,
                                            output: a,
                                            timescale: "audio"
                                        },
                                        sampleRate: {
                                            min: 0,
                                            max: 1,
                                            output: a,
                                            timescale: "audio"
                                        },
                                        amp: {
                                            min: 0,
                                            max: 1,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        out: {
                                            min: 0,
                                            max: 1,
                                            output: a,
                                            timescale: "audio",
                                            dimensions: 1
                                        }
                                    },
                                    Schizo: {
                                        amp: {
                                            min: 0,
                                            max: 1,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        out: {
                                            min: 0,
                                            max: 1,
                                            output: a,
                                            timescale: "audio",
                                            dimensions: 1
                                        }
                                    },
                                    Tremolo: {
                                        amp: {
                                            min: 0,
                                            max: 1,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        frequency: {
                                            min: .05,
                                            max: 20,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        out: {
                                            min: 0,
                                            max: 1,
                                            output: a,
                                            timescale: "audio",
                                            dimensions: 1
                                        }
                                    }
                                }, p = 0; p < c.length; p++) ! function() {
                                var e = Array.isArray(c[p]) ? c[p][0] : c[p],
                                    t = Array.isArray(c[p]) ? c[p][1] : c[p];
                                n[t] = function() {
                                    var n, o = Array.prototype.slice.call(arguments, 0);
                                    return n = new r[e], n.type = "FX", n.name = t, s.extend(!0, n, i.ugen), i.createProxyProperties(n, l[t]), i.createProxyMethods(n, ["send"]), i.processArguments2(n, o, n.name), o.input = 0, n.toString = function() {
                                        return "> " + t
                                    }, n
                                }
                            }();
                            n.Chorus = function(e, t, i) {
                                var n = e || 1,
                                    r = i || ms(1),
                                    s = t || 0,
                                    o = Flanger(n, s, r, 30 * ms(1));
                                return o.name = "Chorus", o.type = "FX", o
                            }, n.LPF = function(e, t) {
                                var i = isNaN(e) ? .2 : e,
                                    n = isNaN(t) ? 3.5 : t,
                                    r = Filter24(i, n, !0);
                                return r.name = "LPF", r.type = "FX", r
                            }, n.HPF = function(e, t) {
                                var i = isNaN(e) ? .25 : e,
                                    n = isNaN(t) ? 3.5 : t,
                                    r = Filter24(i, n, !0);
                                return r.isLowPass = !1, r.name = "HPF", r.type = "FX", r
                            }, n.Presets.Schizo = {
                                sane: {
                                    chance: .1,
                                    reverseChance: 0,
                                    pitchChance: .5,
                                    mix: .5
                                },
                                borderline: {
                                    chance: .1,
                                    pitchChance: .25,
                                    reverseChance: .5,
                                    mix: 1
                                },
                                paranoid: {
                                    chance: .2,
                                    reverseChance: .5,
                                    pitchChance: .5,
                                    mix: 1
                                }
                            }, n.Presets.Reverb = {
                                space: {
                                    roomSize: .99,
                                    damping: .23,
                                    wet: .75,
                                    dry: .25
                                },
                                small: {
                                    roomSize: .6,
                                    damping: .75,
                                    wet: .15,
                                    dry: .85
                                },
                                medium: {
                                    roomSize: .8,
                                    damping: .5,
                                    wet: .35,
                                    dry: .65
                                },
                                large: {
                                    roomSize: .85,
                                    damping: .3,
                                    wet: .55,
                                    dry: .45
                                }
                            }, t.exports = function(e) {
                                return "undefined" == typeof i && (i = e), n
                            }
                        }()
                    }, {
                        "../dollar": 16,
                        "../mappings": 18,
                        "gibberish-dsp": 1
                    }],
                    10: [function(e, t) {
                        ! function() {
                            "use strict";
                            for (var i, n = e("../dollar"), r = {
                                    Presets: {}
                                }, s = e("gibberish-dsp"), o = e("../mappings").outputCurves, a = o.LINEAR, u = o.LOGARITHMIC, c = ["Sine", "Triangle", "Saw", "Square", "Noise", "PWM"], l = {
                                    frequency: {
                                        min: 50,
                                        max: 3200,
                                        hardMin: .01,
                                        hardMax: 22050,
                                        output: u,
                                        timescale: "audio",
                                        dimensions: 1
                                    },
                                    amp: {
                                        min: 0,
                                        max: 1,
                                        hardMax: 2,
                                        output: u,
                                        timescale: "audio",
                                        dimensions: 1
                                    },
                                    pulsewidth: {
                                        min: .01,
                                        max: .99,
                                        output: a,
                                        timescale: "audio",
                                        dimensions: 1
                                    },
                                    out: {
                                        min: 0,
                                        max: 1,
                                        output: a,
                                        timescale: "audio",
                                        dimensions: 1
                                    },
                                    pan: {
                                        min: -1,
                                        max: 1,
                                        output: u,
                                        timescale: "audio"
                                    },
                                    note: {
                                        min: 50,
                                        max: 3200,
                                        hardMin: .01,
                                        hardMax: 22050,
                                        output: u,
                                        timescale: "audio",
                                        doNotProxy: !0
                                    }
                                }, p = 0; p < c.length; p++) ! function() {
                                var e = Array.isArray(c[p]) ? c[p][0] : c[p],
                                    t = Array.isArray(c[p]) ? c[p][1] : c[p];
                                r[t] = function() {
                                    var r = (new s[e]).connect(i.Master),
                                        o = Array.prototype.slice.call(arguments, 0);
                                    r.type = "Gen", n.extend(!0, r, i.ugen), r.fx.ugen = r, Object.defineProperty(r, "_", {
                                        get: function() {
                                            return r.kill(), r
                                        },
                                        set: function() {}
                                    }), "undefined" == typeof r.note && (r.note = function(e) {
                                        var t = this.frequency();
                                        "number" == typeof t || "function" == typeof t ? this.frequency = "function" == typeof e ? e() : e : t[0] = e
                                    }), r.name = t, i.createProxyProperties(r, l);
                                    var a = ["note", "send"];
                                    return "Sampler" === t && a.push("pickBuffer"), i.createProxyMethods(r, a), i.processArguments2(r, o, t), r.toString = function() {
                                        return "> " + t
                                    }, r
                                }
                            }();
                            r.Wavetable = function(e) {
                                var t = (new s.Table).connect(i.Master);
                                return e && t.setTable(e), t.type = "Gen", n.extend(!0, t, i.ugen), t.fx.ugen = t, Object.defineProperty(t, "_", {
                                    get: function() {
                                        return t.kill(), t
                                    },
                                    set: function() {}
                                }), "undefined" == typeof t.note && (t.note = function(e) {
                                    var t = this.frequency();
                                    "number" == typeof t || "function" == typeof t ? this.frequency = "function" == typeof e ? e() : e : t[0] = e
                                }), i.createProxyProperties(t, {
                                    frequency: {
                                        min: 50,
                                        max: 3200,
                                        output: u,
                                        timescale: "audio",
                                        dimensions: 1
                                    },
                                    amp: {
                                        min: 0,
                                        max: 1,
                                        output: u,
                                        timescale: "audio",
                                        dimensions: 1
                                    },
                                    out: {
                                        min: 0,
                                        max: 1,
                                        output: a,
                                        timescale: "audio",
                                        dimensions: 1
                                    }
                                }), i.createProxyMethods(t, ["note"]), obj.toString = function() {
                                    return "> Wavetable"
                                }, t
                            }, r.Grains = function() {
                                var e, t = "object" == typeof arguments[0] ? arguments[0] : arguments[1],
                                    r = t.bufferLength || 88200,
                                    o = Sampler().record(t.input, r);
                                if ("string" == typeof arguments[0]) {
                                    var a = i.Presets.Grains[arguments[0]];
                                    "undefined" != typeof t && n.extend(a, t), e = new s.Granulator(a)
                                } else e = new s.Granulator(t);
                                return e.loop = function(e, t, n, r) {
                                    var o = this.position;
                                    e = isNaN(e) ? .25 : e, t = isNaN(t) ? .75 : t, n = i.Clock.time(isNaN(n) ? 1 : n), r = "undefined" == typeof r ? !0 : r, this.position = new s.Line(e, t, n, r);
                                    var a = this;
                                    r === !1 && future(function() {
                                        a.position = o
                                    }, i.Clock.time(n))
                                }, future(function() {
                                    e.setBuffer(o.getBuffer()), e.connect(), e.loop(0, 1, r), o.disconnect()
                                }, r + 1), e.type = "Gen", n.extend(!0, e, i.ugen), e.fx.ugen = e, Object.defineProperty(e, "_", {
                                    get: function() {
                                        return e.disconnect(), e
                                    },
                                    set: function() {}
                                }), e.toString = function() {
                                    return "Grains"
                                }, e
                            }, r.Presets.Grains = {
                                tight: {
                                    numberOfGrains: 10,
                                    grainSize: 1100,
                                    positionMin: -.05,
                                    positionMax: .05,
                                    speedMin: -.1,
                                    speedMax: .1,
                                    shouldReverse: !1
                                },
                                cloudy: {
                                    numberOfGrains: 20,
                                    positionMin: -.25,
                                    positionMax: .25,
                                    speedMin: -.1,
                                    speedMax: 4,
                                    grainSize: 4400,
                                    shouldReverse: !0
                                },
                                flurry: {
                                    speed: 2,
                                    speedMin: -2,
                                    speedMax: 2,
                                    position: 0,
                                    positionMin: 0,
                                    positionMax: 0,
                                    numberOfGrains: 20,
                                    grainSize: 1100
                                }
                            }, t.exports = function(e) {
                                return "undefined" == typeof i && (i = e), r
                            }
                        }()
                    }, {
                        "../dollar": 16,
                        "../mappings": 18,
                        "gibberish-dsp": 1
                    }],
                    11: [function(e, t) {
                        ! function() {
                            "use strict";
                            var i, n, r = e("gibberish-dsp"),
                                s = null,
                                o = null,
                                a = null,
                                u = i = {
                                    Compressor: function(e) {
                                        if (null === s) {
                                            s = r.context.createDynamicsCompressor();
                                            var t = s.threshold,
                                                i = s.ratio,
                                                n = s.attack,
                                                o = s.release;
                                            Object.defineProperties(s, {
                                                threshold: {
                                                    get: function() {
                                                        return t.value
                                                    },
                                                    set: function(e) {
                                                        t.value = e
                                                    }
                                                },
                                                ratio: {
                                                    get: function() {
                                                        return i.value
                                                    },
                                                    set: function(e) {
                                                        i.value = e
                                                    }
                                                },
                                                attack: {
                                                    get: function() {
                                                        return n.value
                                                    },
                                                    set: function(e) {
                                                        n.value = e
                                                    }
                                                },
                                                release: {
                                                    get: function() {
                                                        return o.value
                                                    },
                                                    set: function(e) {
                                                        o.value = e
                                                    }
                                                }
                                            }), u.insert(s, e)
                                        }
                                        return s
                                    },
                                    LowShelf: function(e) {
                                        if (null === a) {
                                            a = r.context.createBiquadFilter(), a.type = 3, a.frequency.value = 220, a.Q.value = 0, a.gain.value = 6;
                                            var t = a.gain,
                                                i = a.frequency,
                                                n = a.Q;
                                            Object.defineProperties(a, {
                                                frequency: {
                                                    get: function() {
                                                        return i.value
                                                    },
                                                    set: function(e) {
                                                        i.value = e
                                                    }
                                                },
                                                gain: {
                                                    get: function() {
                                                        return t.value
                                                    },
                                                    set: function(e) {
                                                        t.value = e
                                                    }
                                                },
                                                Q: {
                                                    get: function() {
                                                        return n.value
                                                    },
                                                    set: function(e) {
                                                        n.value = e
                                                    }
                                                }
                                            }), u.insert(a, e)
                                        }
                                        return a
                                    },
                                    HiShelf: function(e) {
                                        if (null === o) {
                                            o = r.context.createBiquadFilter(), o.type = 4, o.frequency.value = 880, o.Q.value = 0, o.gain.value = 6;
                                            var t = o.gain,
                                                i = o.frequency,
                                                n = o.Q;
                                            Object.defineProperties(o, {
                                                frequency: {
                                                    get: function() {
                                                        return i.value
                                                    },
                                                    set: function(e) {
                                                        i.value = e
                                                    }
                                                },
                                                gain: {
                                                    get: function() {
                                                        return t.value
                                                    },
                                                    set: function(e) {
                                                        t.value = e
                                                    }
                                                },
                                                Q: {
                                                    get: function() {
                                                        return n.value
                                                    },
                                                    set: function(e) {
                                                        n.value = e
                                                    }
                                                }
                                            }), u.insert(o, e)
                                        }
                                        return o
                                    }
                                };
                            t.exports = function(e) {
                                return "undefined" == typeof n && (n = e), i
                            }
                        }()
                    }, {
                        "gibberish-dsp": 1
                    }],
                    12: [function(e, t) {
                        ! function() {
                            "use strict";
                            var i, n = {
                                    Presets: {}
                                },
                                r = e("gibberish-dsp"),
                                s = e("../dollar"),
                                o = e("../clock"),
                                a = e("../mappings").outputCurves,
                                u = a.LINEAR,
                                c = a.LOGARITHMIC,
                                l = {
                                    amp: {
                                        min: 0,
                                        max: 1,
                                        hardMax: 2,
                                        output: c,
                                        timescale: "audio",
                                        dimensions: 1
                                    },
                                    pitch: {
                                        min: 1,
                                        max: 4,
                                        hardMin: .01,
                                        hardMax: 20,
                                        output: c,
                                        timescale: "audio"
                                    },
                                    out: {
                                        min: 0,
                                        max: 1,
                                        output: u,
                                        timescale: "audio",
                                        dimensions: 1
                                    },
                                    pan: {
                                        min: -1,
                                        max: 1,
                                        output: c,
                                        timescale: "audio"
                                    },
                                    note: {
                                        min: 50,
                                        max: 3200,
                                        hardMin: .01,
                                        hardMax: 22050,
                                        output: c,
                                        timescale: "audio",
                                        doNotProxy: !0
                                    }
                                };
                            n.Sampler = function() {
                                var e = (new r.Sampler).connect(i.Master),
                                    t = Array.prototype.slice.call(arguments, 0),
                                    n = "Sampler";
                                e.type = "Gen", s.extend(!0, e, i.ugen), e.fx.ugen = e, Object.defineProperty(e, "_", {
                                    get: function() {
                                        return e.kill(), e
                                    },
                                    set: function() {}
                                }), "undefined" == typeof e.note && (e.note = function(e) {
                                    var t = this.frequency();
                                    "number" == typeof t || "function" == typeof t ? this.frequency = "function" == typeof e ? e() : e : t[0] = e
                                }), i.createProxyProperties(e, l);
                                var o = ["note", "pickBuffer"];
                                return i.createProxyMethods(e, o), i.processArguments2(e, t, n), e.toString = function() {
                                    return n
                                }, e
                            }, r.Sampler.prototype.readFile = function(e) {
                                var t = this;
                                if (e.isFile) return void e.file(function(e) {
                                    t.readFile(e)
                                });
                                var i = new FileReader;
                                i.readAsArrayBuffer(e), i.onload = function() {
                                    r.context.decodeAudioData(i.result, function(i) {
                                        var n = i.getChannelData(0);
                                        t.setBuffer(n), t.length = t.end = n.length, t.buffers[e.name] = n, t.isPlaying = !0, console.log("LOADED", e.name, n.length), r.audioFiles[e.name] = n, t.onload && t.onload(), 0 !== t.playOnLoad && t.note(t.playOnLoad), t.isLoaded = !0
                                    })
                                }
                            }, r.Sampler.prototype.ondrop = function(e) {
                                for (var t = 0; t < e.length; t++) ! function(i) {
                                    {
                                        var n, r = e[t];
                                        new FileReader
                                    }
                                    if (n = r.webkitGetAsEntry(), n.isDirectory) {
                                        var s = n.createReader();
                                        s.readEntries(function(e) {
                                            for (var t = e.length; t--;) i.readFile(e[t])
                                        })
                                    } else i.readFile(n)
                                }(this)
                            }, r.Sampler.prototype.pickBuffer = function() {
                                this.switchBuffer(rndi(0, this.getNumberOfBuffers()))
                            }, r.Sampler.prototype.record = function(e, t) {
                                this.isRecording = !0, console.log("starting recording");
                                var n = this;
                                return this.recorder = new r.Record(e, i.Clock.time(t), function() {
                                    console.log("recording finished"), n.setBuffer(this.getBuffer()), n.length = n.end = n.getBuffer().length, n.setPhase(n.length), n.isRecording = !1
                                }).record(), this
                            }, n.Looper = function(e, t, n) {
                                var r = Bus();
                                s.extend(r, {
                                    children: [],
                                    input: e,
                                    length: o.time(t),
                                    numberOfLoops: n,
                                    pitch: 1,
                                    currentLoop: 0,
                                    loop: function() {
                                        r.children[r.currentLoop].record(r.input, r.length);
                                        var e = {
                                            target: r.children[r.currentLoop],
                                            durations: r.length,
                                            key: "note",
                                            values: [null]
                                        };
                                        return r.seq.add(e), r.seq.start(), future(r.nextLoop, t), r
                                    },
                                    nextLoop: function() {
                                        r.children[++r.currentLoop].record(r.input, r.length), r.currentLoop < r.numberOfLoops - 1 && future(r.nextLoop, t);
                                        var e = {
                                            target: r.children[r.currentLoop],
                                            durations: r.length,
                                            key: "note",
                                            values: [null]
                                        };
                                        r.seq.add(e)
                                    }
                                });
                                var a = 1;
                                Object.defineProperty(r, "pitch", {
                                    configurable: !0,
                                    get: function() {
                                        return a
                                    },
                                    set: function(e) {
                                        a = e;
                                        for (var t = 0; t < r.children.length; t++) r.children[t].pitch = a
                                    }
                                });
                                for (var u = 0; n > u; u++) r.children.push(Sampler({
                                    pitch: r.pitch
                                })._), r.children[u].send(r, 1);
                                return i.createProxyProperties(r, {
                                    pitch: l.pitch
                                }), r.stop = function() {
                                    r.seq.stop()
                                }, r.play = function() {
                                    r.seq.play()
                                }, r
                            }, t.exports = function(e) {
                                return "undefined" == typeof i && (i = e), n
                            }
                        }()
                    }, {
                        "../clock": 15,
                        "../dollar": 16,
                        "../mappings": 18,
                        "gibberish-dsp": 1
                    }],
                    13: [function(e, t) {
                        ! function() {
                            "use strict";
                            for (var i, n = {
                                    Presets: {}
                                }, r = e("gibberish-dsp"), s = e("../dollar"), o = e("../clock")(i), a = e("../mappings").outputCurves, u = a.LINEAR, c = a.LOGARITHMIC, l = [
                                    ["PolySynth", "Synth"],
                                    ["PolyFM", "FM"],
                                    ["PolySynth2", "Synth2"],
                                    ["MonoSynth", "Mono"],
                                    ["PolyKarplusStrong", "Pluck"]
                                ], p = {
                                    Synth: {
                                        note: {
                                            min: 50,
                                            max: 3200,
                                            output: c,
                                            timescale: "audio",
                                            doNotProxy: !0
                                        },
                                        frequency: {
                                            min: 50,
                                            max: 3200,
                                            output: c,
                                            timescale: "audio"
                                        },
                                        amp: {
                                            min: 0,
                                            max: 1,
                                            output: c,
                                            timescale: "audio"
                                        },
                                        pulsewidth: {
                                            min: .01,
                                            max: .99,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        attack: {
                                            min: o.maxMeasures + 1,
                                            max: 176400,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        decay: {
                                            min: o.maxMeasures + 1,
                                            max: 176400,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        sustain: {
                                            min: o.maxMeasures + 1,
                                            max: 176400,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        release: {
                                            min: o.maxMeasures + 1,
                                            max: 176400,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        pan: {
                                            min: -1,
                                            max: 1,
                                            output: c,
                                            timescale: "audio"
                                        },
                                        out: {
                                            min: 0,
                                            max: 1,
                                            output: u,
                                            timescale: "audio",
                                            dimensions: 1
                                        }
                                    },
                                    Synth2: {
                                        note: {
                                            min: 50,
                                            max: 3200,
                                            output: c,
                                            timescale: "audio",
                                            doNotProxy: !0
                                        },
                                        frequency: {
                                            min: 50,
                                            max: 3200,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        amp: {
                                            min: 0,
                                            max: 1,
                                            output: c,
                                            timescale: "audio"
                                        },
                                        pulsewidth: {
                                            min: .01,
                                            max: .99,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        attack: {
                                            min: o.maxMeasures + 1,
                                            max: 176400,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        decay: {
                                            min: o.maxMeasures + 1,
                                            max: 176400,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        sustain: {
                                            min: o.maxMeasures + 1,
                                            max: 176400,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        release: {
                                            min: o.maxMeasures + 1,
                                            max: 176400,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        cutoff: {
                                            min: 0,
                                            max: .7,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        resonance: {
                                            min: 0,
                                            max: 5.5,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        pan: {
                                            min: -1,
                                            max: 1,
                                            output: c,
                                            timescale: "audio"
                                        },
                                        out: {
                                            min: 0,
                                            max: 1,
                                            output: u,
                                            timescale: "audio",
                                            dimensions: 1
                                        }
                                    },
                                    Mono: {
                                        note: {
                                            min: 50,
                                            max: 3200,
                                            output: c,
                                            timescale: "audio",
                                            doNotProxy: !0
                                        },
                                        frequency: {
                                            min: 50,
                                            max: 3200,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        amp: {
                                            min: 0,
                                            max: 1,
                                            output: c,
                                            timescale: "audio"
                                        },
                                        pulsewidth: {
                                            min: .01,
                                            max: .99,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        attack: {
                                            min: o.maxMeasures + 1,
                                            max: 176400,
                                            output: c,
                                            timescale: "audio"
                                        },
                                        decay: {
                                            min: o.maxMeasures + 1,
                                            max: 176400,
                                            output: c,
                                            timescale: "audio"
                                        },
                                        cutoff: {
                                            min: 0,
                                            max: .7,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        detune2: {
                                            min: 0,
                                            max: .15,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        detune3: {
                                            min: 0,
                                            max: .15,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        glide: {
                                            min: .99,
                                            max: .999995,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        resonance: {
                                            min: 0,
                                            max: 5.5,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        pan: {
                                            min: -1,
                                            max: 1,
                                            output: c,
                                            timescale: "audio"
                                        },
                                        out: {
                                            min: 0,
                                            max: 1,
                                            output: u,
                                            timescale: "audio",
                                            dimensions: 1
                                        }
                                    },
                                    FM: {
                                        note: {
                                            min: 50,
                                            max: 3200,
                                            output: c,
                                            timescale: "audio",
                                            doNotProxy: !0
                                        },
                                        frequency: {
                                            min: 50,
                                            max: 3200,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        amp: {
                                            min: 0,
                                            max: 1,
                                            output: c,
                                            timescale: "audio"
                                        },
                                        attack: {
                                            min: o.maxMeasures + 1,
                                            max: 176400,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        decay: {
                                            min: o.maxMeasures + 1,
                                            max: 176400,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        sustain: {
                                            min: o.maxMeasures + 1,
                                            max: 176400,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        release: {
                                            min: o.maxMeasures + 1,
                                            max: 176400,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        cmRatio: {
                                            min: .1,
                                            max: 50,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        index: {
                                            min: .1,
                                            max: 50,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        pan: {
                                            min: -1,
                                            max: 1,
                                            output: c,
                                            timescale: "audio"
                                        },
                                        out: {
                                            min: 0,
                                            max: 1,
                                            output: u,
                                            timescale: "audio",
                                            dimensions: 1
                                        }
                                    },
                                    Pluck: {
                                        note: {
                                            min: 50,
                                            max: 3200,
                                            output: c,
                                            timescale: "audio",
                                            doNotProxy: !0
                                        },
                                        frequency: {
                                            min: 50,
                                            max: 3200,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        amp: {
                                            min: 0,
                                            max: 1,
                                            output: c,
                                            timescale: "audio"
                                        },
                                        blend: {
                                            min: 0,
                                            max: 1,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        damping: {
                                            min: 0,
                                            max: 1,
                                            output: u,
                                            timescale: "audio"
                                        },
                                        pan: {
                                            min: -1,
                                            max: 1,
                                            output: c,
                                            timescale: "audio"
                                        },
                                        out: {
                                            min: 0,
                                            max: 1,
                                            output: u,
                                            timescale: "audio",
                                            dimensions: 1
                                        }
                                    }
                                }, h = 0; h < l.length; h++) ! function() {
                                var e = Array.isArray(l[h]) ? l[h][0] : l[h],
                                    t = Array.isArray(l[h]) ? l[h][1] : l[h];
                                n[t] = function() {
                                    var n, o, a = Array.prototype.slice.call(arguments),
                                        u = 1,
                                        c = !1,
                                        l = !0;
                                    if ("object" == typeof a[0] && ("undefined" != typeof a[0].maxVoices && a[0].maxVoices && (u = a[0].maxVoices), "undefined" != typeof a[0].useADSR ? (c = a[0].useADSR, "undefined" != typeof a[0].requireReleaseTrigger && (l = a[0].requireReleaseTrigger)) : l = !1, "undefined" != typeof a[0].useADSR && (c = a[0].useADSR), "undefined" != typeof a[0].scale && (o = a[0].scale)), n = new r[e]({
                                            maxVoices: u,
                                            useADSR: c,
                                            requireReleaseTrigger: l,
                                            scale: o
                                        }).connect(i.Master), n.type = "Gen", s.extend(!0, n, i.ugen), n.fx.ugen = n, n._note = n.note.bind(n), n.note = function() {
                                            var e = Array.prototype.splice.call(arguments, 0);
                                            if ("string" == typeof e[0]) e[0] = i.Theory.Teoria.note(e[0]).fq();
                                            else if ("object" == typeof e[0] && (e[0] = e[0].valueOf()), e[0] < i.minNoteFrequency) {
                                                var t = n.scale || i.scale,
                                                    r = t.notes[e[0]];
                                                if (n.octave && 0 !== n.octave)
                                                    for (var s = n.octave > 0 ? 1 : 0, o = Math.abs(n.octave), a = 0; o > a; a++) r *= s ? 2 : .5;
                                                e[0] = r
                                            }
                                            return this._note.apply(this, e), this
                                        }, n.chord = i.Theory.chord, Object.defineProperty(n, "_", {
                                            get: function() {
                                                return n.kill(), n
                                            },
                                            set: function() {}
                                        }), i.createProxyProperties(n, p[t]), i.createProxyMethods(n, ["note", "chord", "send"]), n.name = t, i.processArguments2(n, a, n.name), n.toString = function() {
                                            return "> " + t
                                        }, "Mono" !== t) {
                                        var h = n._frequency;
                                        Object.defineProperty(n, "frequency", {
                                            configurable: !0,
                                            get: function() {
                                                return this._frequency
                                            },
                                            set: function(e) {
                                                if (h = e, this.children)
                                                    for (var t = 0; t < this.children.length; t++) "number" == typeof this.children[t].frequency ? this.children[t].frequency = h : this.children[t].frequency[0] = h
                                            }
                                        })
                                    }
                                    var f;
                                    return Object.defineProperty(n, "scale", {
                                        get: function() {
                                            return f
                                        },
                                        set: function(e) {
                                            f = e, n.seq.scale = f
                                        }
                                    }), n
                                }
                            }();
                            n.Presets.Synth = {
                                "short": {
                                    attack: 44,
                                    decay: 1 / 16
                                },
                                bleep: {
                                    waveform: "Sine",
                                    attack: 44,
                                    decay: 1 / 16
                                },
                                rhodes: {
                                    waveform: "Sine",
                                    maxVoices: 4,
                                    presetInit: function() {
                                        this.fx.add(i.FX.Tremolo(2, .2))
                                    },
                                    attack: 44,
                                    decay: 1
                                },
                                calvin: {
                                    waveform: "PWM",
                                    maxVoices: 4,
                                    amp: .075,
                                    presetInit: function() {
                                        this.fx.add(i.FX.Delay(1 / 6, .5), i.FX.Vibrato())
                                    },
                                    attack: 44,
                                    decay: .25
                                }
                            }, n.Presets.Synth2 = {
                                pad2: {
                                    waveform: "Saw",
                                    maxVoices: 4,
                                    attack: 1.5,
                                    decay: .5,
                                    cutoff: .3,
                                    filterMult: .35,
                                    resonance: 4.5,
                                    amp: 1.25
                                },
                                pad4: {
                                    waveform: "Saw",
                                    maxVoices: 4,
                                    attack: 2,
                                    decay: 2,
                                    cutoff: .3,
                                    filterMult: .35,
                                    resonance: 4.5,
                                    amp: 1.25
                                }
                            }, n.Presets.Mono = {
                                "short": {
                                    attack: 44,
                                    decay: 1 / 16
                                },
                                lead: {
                                    presetInit: function() {
                                        this.fx.add(i.FX.Delay(.25, .35), i.FX.Reverb())
                                    },
                                    attack: 1 / 8,
                                    decay: .5,
                                    octave3: 0,
                                    cutoff: .2,
                                    filterMult: .5,
                                    resonance: 5,
                                    isLowPass: !1
                                },
                                winsome: {
                                    presetInit: function() {
                                        this.lfo = i.Oscillators.Sine(.234375)._, this.lfo.amp = .075, this.lfo.frequency = 2, this.cutoff = this.lfo, this.detune2 = this.lfo
                                    },
                                    attack: o.maxMeasures,
                                    decay: 1,
                                    cutoff: .2
                                },
                                bass: {
                                    attack: o.maxMeasures,
                                    decay: 1 / 8 - o.maxMeasures,
                                    octave: -2,
                                    octave2: -1,
                                    cutoff: .5,
                                    filterMult: .2,
                                    resonance: 1
                                },
                                bass2: {
                                    attack: o.maxMeasures,
                                    decay: 1 / 6,
                                    octave: -2,
                                    octave2: 0,
                                    octave3: 0,
                                    cutoff: .5,
                                    filterMult: .2,
                                    resonance: 1,
                                    amp: .65
                                },
                                easy: {
                                    attack: o.maxMeasures,
                                    decay: 2,
                                    octave2: 0,
                                    octave3: 0,
                                    cutoff: .3,
                                    glide: .9995
                                },
                                easyfx: {
                                    attack: o.maxMeasures,
                                    decay: 2,
                                    presetInit: function() {
                                        this.fx.add(i.FX.Delay(1 / 6, .3))
                                    },
                                    amp: .3,
                                    octave2: 0,
                                    octave3: 0,
                                    cutoff: .3,
                                    glide: .9995
                                },
                                dark: {
                                    resonance: 0,
                                    attack: 44,
                                    cutoff: .075,
                                    amp: .35,
                                    filterMult: 0
                                },
                                dark2: {
                                    filterMult: .1,
                                    attack: o.maxMeasures,
                                    octave2: 0,
                                    octave3: 0,
                                    decay: .25,
                                    amp: .45
                                },
                                noise: {
                                    resonance: 20,
                                    decay: .5,
                                    cutoff: .3,
                                    glide: .99995,
                                    detune3: 0,
                                    detune2: 0,
                                    filterMult: 0,
                                    presetInit: function() {
                                        this.fx.add(i.FX.Gain(.1), i.FX.Delay(1 / 6, .35))
                                    }
                                }
                            }, n.Presets.FM = {
                                stabs: {
                                    maxVoices: 4,
                                    cmRatio: 1 / 1.0007,
                                    index: 5,
                                    attack: o.maxMeasures,
                                    decay: 1 / 8,
                                    amp: .1,
                                    presetInit: function() {
                                        this.bus = i.Busses.Bus().fx.add(i.FX.Delay(1 / 8, .75), i.FX.LPF({
                                            resonance: 4
                                        })), this.bus.fx[1].cutoff = i.Binops.Add(.25, i.Oscilators.Sine(.1, .2)._), this.send(this.bus, .65)
                                    }
                                },
                                bass: {
                                    cmRatio: 1,
                                    index: 3,
                                    presetInit: function() {
                                        this.attack = ms(1)
                                    },
                                    decay: 1 / 16,
                                    octave: -2
                                },
                                glockenspiel: {
                                    cmRatio: 3.5307,
                                    index: 1,
                                    attack: 44,
                                    decay: 44100
                                },
                                radio: {
                                    cmRatio: 1,
                                    index: 40,
                                    attack: 13230,
                                    decay: 22050
                                },
                                noise: {
                                    cmRatio: .04,
                                    index: 1e3,
                                    attack: 44.1,
                                    decay: 4410
                                },
                                frog: {
                                    cmRatio: .1,
                                    index: 2,
                                    attack: 13230,
                                    decay: 220.5
                                },
                                gong: {
                                    cmRatio: 1.4,
                                    index: .95,
                                    attack: 44.1,
                                    decay: 220500
                                },
                                drum: {
                                    cmRatio: 1.40007,
                                    index: 2,
                                    attack: 44,
                                    decay: 44100
                                },
                                drum2: {
                                    cmRatio: 1 + Math.sqrt(2),
                                    index: .2,
                                    attack: 44,
                                    decay: 882
                                },
                                brass: {
                                    maxVoices: 4,
                                    cmRatio: 1 / 1.0007,
                                    index: 5,
                                    attack: 4100,
                                    decay: 1
                                },
                                clarinet: {
                                    cmRatio: 1.5,
                                    index: 1.5,
                                    attack: 2205,
                                    decay: 8820
                                }
                            }, t.exports = function(e) {
                                return "undefined" == typeof i && (i = e), n
                            }
                        }()
                    }, {
                        "../clock": 15,
                        "../dollar": 16,
                        "../mappings": 18,
                        "gibberish-dsp": 1
                    }],
                    14: [function(e, t) {
                        ! function() {
                            "use strict";
                            var i, n = e("../../external/teoria.min"),
                                r = e("../dollar"),
                                s = {
                                    Teoria: n,
                                    Scale: function(e, t) {
                                        var s = {
                                                root: "string" == typeof e ? n.note(e) : e,
                                                notes: [],
                                                degree: 1,
                                                chord: function(e, t) {
                                                    var i = [];
                                                    t = t || 0;
                                                    for (var n = 0; n < e.length; n++) i.push(this.notes[e[n] + t]);
                                                    return i
                                                },
                                                create: function() {
                                                    var e = "object" == typeof s.root() ? s.root() : n.note(s.root()),
                                                        t = s.mode() || o;
                                                    if (this.notes.length = 0, i.Theory.Scales[t]) {
                                                        var r = i.Theory.Scales[t](e);
                                                        r.create(this.degree), this.notes = r.notes
                                                    }
                                                },
                                                set: function(e, t) {
                                                    Array.isArray(arguments[0]) ? (this.root = arguments[0][0], this.mode = arguments[0][1]) : (this.root = e, this.mode = t)
                                                }
                                            },
                                            o = t || "aeolian";
                                        Object.defineProperty(s, "mode", {
                                            configurable: !0,
                                            get: function() {
                                                return o
                                            },
                                            set: function(e) {
                                                o = e, s.create()
                                            }
                                        });
                                        var a = s.root;
                                        Object.defineProperty(s, "root", {
                                            configurable: !0,
                                            get: function() {
                                                return a
                                            },
                                            set: function(e) {
                                                a = "string" == typeof e ? n.note(e) : e, s.create()
                                            }
                                        });
                                        var u = s.degree;
                                        return Object.defineProperty(s, "degree", {
                                            configurable: !0,
                                            get: function() {
                                                return u
                                            },
                                            set: function(e) {
                                                u = e, s.create(u)
                                            }
                                        }), i.createProxyProperty(s, "root", !0, !1, null, !1, 1), i.createProxyProperty(s, "mode", !0, !1, null, !1, 1), i.createProxyProperty(s, "degree", !0, !1, null, !1, 1), r.subscribe("/gibber/clear", function() {
                                            s.seq.isConnected = !1, s.seq.isRunning = !1, s.seq.destinations.length = 0
                                        }), s.create(), s.toString = function() {
                                            return "Scale: " + s.root() + ", " + s.mode()
                                        }, s
                                    },
                                    CustomScale: function(e) {
                                        var t = {
                                                notes: [],
                                                degree: e || 1,
                                                ratios: arguments[1] || [1, 1.1, 1.25, 1.3333, 1.5, 1.666, 1.75],
                                                create: function(e) {
                                                    this.notes = [];
                                                    for (var t = this.root, i = 0; 8 > i; i++) {
                                                        for (var n = 0; n < this.ratios.length; n++) {
                                                            var r = n + e - 1,
                                                                s = t * (1 + Math.floor(r / this.ratios.length));
                                                            this.notes.push(s * this.ratios[r % this.ratios.length])
                                                        }
                                                        t *= 2
                                                    }
                                                    t = this.root;
                                                    for (var i = -1; i >= -8; i--) {
                                                        t /= 2;
                                                        for (var n = 0; n < this.ratios.length; n++) {
                                                            var o = i * this.ratios.length + n,
                                                                r = n + e - 1,
                                                                s = t * (1 + Math.floor(r / this.ratios.length));
                                                            this.notes[o] = s * this.ratios[r % this.ratios.length]
                                                        }
                                                    }
                                                },
                                                chord: function(e, t) {
                                                    var i = [];
                                                    t = t || 0;
                                                    for (var n = 0; n < e.length; n++) i.push(this.notes[e[n] + t]);
                                                    return i
                                                }
                                            },
                                            i = arguments[0] || 440;
                                        return Object.defineProperty(t, "root", {
                                            get: function() {
                                                return i
                                            },
                                            set: function(e) {
                                                "number" == typeof e ? i = e : "string" == typeof e ? i = s.Teoria.note(e).fq() : "object" == typeof e && (i = e.fq()), this.create(i)
                                            }
                                        }), t.root = i, t
                                    },
                                    Scales: {
                                        Major: function(e) {
                                            return s.CustomScale(e, [1, 9 / 8, 5 / 4, 4 / 3, 1.5, 5 / 3, 15 / 8])
                                        },
                                        Ionian: function(e) {
                                            return s.CustomScale(e, [1, 9 / 8, 5 / 4, 4 / 3, 1.5, 5 / 3, 15 / 8])
                                        },
                                        Dorian: function(e) {
                                            return s.CustomScale(e, [1, 9 / 8, 1.2, 4 / 3, 1.5, 5 / 3, 1.8])
                                        },
                                        Phrygian: function(e) {
                                            return s.CustomScale(e, [1, 16 / 15, 1.2, 4 / 3, 1.5, 1.6, 1.8])
                                        },
                                        Lydian: function(e) {
                                            return s.CustomScale(e, [1, 9 / 8, 5 / 4, 45 / 32, 1.5, 5 / 3, 15 / 8])
                                        },
                                        Mixolydian: function(e) {
                                            return s.CustomScale(e, [1, 9 / 8, 5 / 4, 4 / 3, 1.5, 1.6, 1.8])
                                        },
                                        Minor: function(e) {
                                            return s.CustomScale(e, [1, 9 / 8, 1.2, 4 / 3, 1.5, 1.6, 1.8])
                                        },
                                        Aeolian: function(e) {
                                            return s.CustomScale(e, [1, 9 / 8, 1.2, 4 / 3, 1.5, 1.6, 1.8])
                                        },
                                        Locrian: function(e) {
                                            return s.CustomScale(e, [1, 16 / 15, 1.2, 4 / 3, 62 / 45, 1.6, 15 / 8])
                                        },
                                        MajorPentatonic: function(e) {
                                            return s.CustomScale(e, [1, 9 / 8, 5 / 4, 1.5, 5 / 3])
                                        },
                                        MinorPentatonic: function(e) {
                                            return s.CustomScale(e, [1, 1.2, 4 / 3, 1.5, 15 / 8])
                                        },
                                        Chromatic: function(e) {
                                            return s.CustomScale(e, [1, 16 / 15, 9 / 8, 1.2, 5 / 4, 4 / 3, 45 / 32, 1.5, 1.6, 5 / 3, 15 / 8, 1.8])
                                        },
                                        HalfWhole: function(e) {
                                            return s.CustomScale(e, [1, 1.059463, 1.189207, 1.259921, 1.414214, 1.498307, 1.681793, 1.781797])
                                        },
                                        WholeHalf: function(e) {
                                            return s.CustomScale(e, [1, 1.122462, 1.189207, 1.33484, 1.414214, 1.587401, 1.681793, 1.887749])
                                        },
                                        Pythagorean: function(e) {
                                            return s.CustomScale(e, [1, 256 / 243, 9 / 8, 32 / 27, 81 / 64, 4 / 3, 729 / 512, 1.5, 128 / 81, 27 / 16, 16 / 9, 243 / 128])
                                        },
                                        PythagoreanMajor: function(e) {
                                            return s.CustomScale(e, [1, 9 / 8, 81 / 64, 4 / 3, 1.5, 27 / 16, 243 / 128])
                                        },
                                        PythagoreanMinor: function(e) {
                                            return s.CustomScale(e, [1, 9 / 8, 32 / 27, 4 / 3, 1.5, 128 / 81, 16 / 9])
                                        },
                                        Limit5: function(e) {
                                            return s.CustomScale(e, [1, 16 / 15, 9 / 8, 1.2, 5 / 4, 4 / 3, 45 / 32, 1.5, 1.6, 5 / 3, 1.8, 15 / 8])
                                        },
                                        Limit5Major: function(e) {
                                            return s.CustomScale(e, [1, 9 / 8, 5 / 4, 4 / 3, 1.5, 5 / 3, 15 / 8])
                                        },
                                        Limit5Minor: function(e) {
                                            return s.CustomScale(e, [1, 9 / 8, 1.2, 4 / 3, 1.5, 1.6, 1.8])
                                        },
                                        Mess3: function(e) {
                                            return s.CustomScale(e, [1, 1.122462, 1.189207, 1.259921, 1.414214, 1.498307, 1.587401, 1.781797, 1.887749])
                                        },
                                        Mess4: function(e) {
                                            return s.CustomScale(e, [1, 1.059463, 1.122462, 1.33484, 1.414214, 1.498307, 1.587401, 1.887749])
                                        },
                                        Mess5: function(e) {
                                            return s.CustomScale(e, [1, 1.059463, 1.33484, 1.414214, 1.498307, 1.887749])
                                        },
                                        Mess6: function(e) {
                                            return s.CustomScale(e, [1, 1.122462, 1.259921, 1.33484, 1.414214, 1.587401, 1.781797, 1.887749])
                                        },
                                        Mess7: function(e) {
                                            return s.CustomScale(e, [1, 1.059463, 1.122462, 1.189207, 1.33484, 1.414214, 1.498307, 1.587401, 1.681793, 1.887749])
                                        },
                                        Adams: function(e) {
                                            return s.CustomScale(e, [1, 1.122462, 1.259921, 1.414214, 1.498307, 1.681793, 1.781797])
                                        },
                                        Equal5Tone: function(e) {
                                            return s.CustomScale(e, [1, 1.15, 1.32, 1.35, 1.52, 1.74])
                                        },
                                        Equal7Tone: function(e) {
                                            return s.CustomScale(e, [1, 1.1, 1.22, 1.35, 1.49, 1.64, 1.81])
                                        },
                                        Just: function(e) {
                                            return s.CustomScale(e, [1, 1.0417, 1.125, 1.2, 1.25, 1.3333, 1.4063, 1.5, 1.6, 1.6667, 1.8, 1.875])
                                        },
                                        Shruti: function(e) {
                                            return s.CustomScale(e, [1, 256 / 243, 16 / 15, 10 / 9, 9 / 8, 32 / 27, 1.2, 5 / 4, 81 / 64, 4 / 3, 1.35, 45 / 32, 729 / 512, 1.5, 128 / 81, 1.6, 5 / 3, 27 / 16, 16 / 9, 1.8, 15 / 8, 243 / 128, 2])
                                        }
                                    },
                                    chord: function(e) {
                                        if (this.notation = e, "string" == typeof this.notation) {
                                            var t, i, r = this.notation.slice(0, 1);
                                            isNaN(this.notation.charAt(1)) ? (r += this.notation.charAt(1), t = parseInt(this.notation.slice(2, 3)), i = this.notation.slice(3)) : (t = parseInt(this.notation.slice(1, 2)), i = this.notation.slice(2));
                                            for (var o = n.note(r + t).chord(i), a = 0; a < o.notes.length; a++) {
                                                var u = o.notes[a];
                                                this.note("number" == typeof l ? l : u.fq())
                                            }
                                        } else
                                            for (var c = 0; c < this.notation.length; c++) {
                                                var l, p = this.scale ? this.scale.notes[this.notation[c]] : this.notation[c];
                                                switch (typeof p) {
                                                    case "number":
                                                        l = p;
                                                        break;
                                                    case "object":
                                                        l = p.fq();
                                                        break;
                                                    case "string":
                                                        l = s.Teoria.note(p).fq()
                                                }
                                                this.note(l)
                                            }
                                        return "undefined" != typeof arguments[1] && (this.amp = arguments[1]), this
                                    }
                                };
                            t.exports = function(e) {
                                return "undefined" == typeof i && (i = e), s
                            }
                        }()
                    }, {
                        "../../external/teoria.min": 2,
                        "../dollar": 16
                    }],
                    15: [function(e, t) {
                        ! function() {
                            "use strict";
                            var i, n = [],
                                r = e("./dollar"),
                                s = e("./mappings").outputCurves,
                                o = s.LINEAR,
                                a = (s.LOGARITHMIC, e("gibberish-dsp")),
                                u = {
                                    seq: null,
                                    bpm: null,
                                    maxMeasures: 44,
                                    baseBPM: 120,
                                    metronome: null,
                                    currentBeat: 0,
                                    beatsPerMeasure: 4,
                                    codeToExecute: [],
                                    signature: {
                                        lower: 4,
                                        upper: 4
                                    },
                                    sequencers: [],
                                    timeProperties: ["attack", "decay", "sustain", "release", "offset", "time"],
                                    phase: 0,
                                    processBeat: function() {
                                        if (u.currentBeat = u.currentBeat >= u.signature.upper ? 1 : u.currentBeat + 1, 1 === u.currentBeat && u.codeToExecute.length > 0) {
                                            for (var e = 0; e < u.codeToExecute.length; e++) try {
                                                "function" == typeof u.codeToExecute[e].function ? u.codeToExecute[e].function() : i.run(u.codeToExecute[e].code, u.codeToExecute[e].pos, u.codeToExecute[e].cm)
                                            } catch (t) {
                                                console.error("FAILED TO EXECUTE CODE:", u.codeToExecute[e].code, t)
                                            }
                                            u.codeToExecute.length = 0
                                        }
                                        null !== u.metronome && u.metronome.draw(u.currentBeat, u.signature.upper), u.phase += u.beats(1)
                                    },
                                    getTimeSinceStart: function() {
                                        return u.phase + u.seq.phase
                                    },
                                    reset: function() {
                                        this.phase = 0, this.currentBeat = 0, this.rate = 1, this.start()
                                    },
                                    tap: function() {
                                        var e = i.Clock.getTimeSinceStart();
                                        for (n[2] && e - n[2] > 88200 && (n.length = 0), n.unshift(e); n.length > 3;) n.pop();
                                        if (3 === n.length) {
                                            var t = (n[0] + n[1] - 2 * n[2]) / 3,
                                                r = 44100 / t,
                                                s = 60 * r;
                                            i.Clock.bpm = s
                                        }
                                    },
                                    start: function(e) {
                                        if (e) {
                                            r.extend(this, {
                                                properties: {
                                                    rate: 1
                                                },
                                                name: "master_clock",
                                                callback: function(e) {
                                                    return e
                                                }
                                            }), this.__proto__ = new a.ugen, this.__proto__.init.call(this);
                                            var t = this.baseBPM;
                                            Object.defineProperty(u, "bpm", {
                                                get: function() {
                                                    return t
                                                },
                                                set: function(e) {
                                                    t = e, u.rate = t / u.baseBPM
                                                }
                                            }), Object.defineProperty(this, "timeSignature", {
                                                get: function() {
                                                    return u.signature.upper + "/" + u.signature.lower
                                                },
                                                set: function(e) {
                                                    var t = e.split("/");
                                                    2 !== t.length || t[0] === u.signature.upper && t[1] === u.signature.lower || (u.signature.upper = parseInt(t[0]), u.signature.lower = parseInt(t[1]), u.currentBeat = 1 != u.currentBeat ? 0 : 1)
                                                }
                                            }), i.createProxyProperties(this, {
                                                rate: {
                                                    min: .1,
                                                    max: 2,
                                                    output: o,
                                                    timescale: "audio"
                                                },
                                                bpm: {
                                                    min: 20,
                                                    max: 200,
                                                    output: o,
                                                    timescale: "audio"
                                                }
                                            })
                                        }
                                        u.seq = new a.PolySeq({
                                            seqs: [{
                                                target: u,
                                                values: [u.processBeat.bind(u)],
                                                durations: [.25]
                                            }],
                                            rate: u
                                        }), u.seq.connect().start(), u.seq.timeModifier = u.time.bind(u)
                                    },
                                    addMetronome: function(e) {
                                        this.metronome = e, this.metronome.init()
                                    },
                                    time: function(e) {
                                        var t;
                                        return t = e < this.maxMeasures ? u.beats(e * u.signature.lower) : e
                                    },
                                    Time: function(e) {
                                        var t;
                                        return t = u.Beats(e < this.maxMeasures ? e * u.signature.lower : e)
                                    },
                                    beats: function(e) {
                                        var t = "undefined" != typeof a.context ? a.context.sampleRate : 44100,
                                            i = t / (u.baseBPM / 60);
                                        return i * e * (4 / u.signature.lower)
                                    },
                                    Beats: function(e) {
                                        return function() {
                                            return i.Clock.beats(e)
                                        }
                                    }
                                };
                            t.exports = function(e) {
                                return "undefined" == typeof i && (i = e), u
                            }
                        }()
                    }, {
                        "./dollar": 16,
                        "./mappings": 18,
                        "gibberish-dsp": 1
                    }],
                    16: [function(e, t) {
                        (function(e) {
                            ! function() {
                                "use strict";

                                function i(e, t, n) {
                                    for (var r in t) n && (l(t[r]) || u(t[r])) ? (l(t[r]) && !l(e[r]) && (e[r] = {}), u(t[r]) && !u(e[r]) && (e[r] = []), i(e[r], t[r], n)) : void 0 !== t[r] && (e[r] = t[r])
                                }
                                var n = "function" == typeof Zepto,
                                    r = "function" == typeof jQuery,
                                    s = "object" == typeof e.$ || "function" == typeof e.$,
                                    o = null,
                                    a = n || r || s,
                                    u = Array.isArray,
                                    c = function(e) {
                                        return "object" == typeof e
                                    },
                                    l = function(e) {
                                        return c(e) && Object.getPrototypeOf(e) == Object.prototype
                                    };
                                o = a ? r ? jQuery : n ? Zepto : s ? e.$ : {} : {}, a || (o.extend = function(e) {
                                    var t, n = Array.prototype.slice.call(arguments, 1);
                                    return "boolean" == typeof e && (t = e, e = n.shift()), n.forEach(function(n) {
                                        i(e, n, t)
                                    }), e
                                }, o.isArray = Array.isArray, o.isPlainObject = l, o.type = function(e) {
                                    return typeof e
                                });
                                var p = {};
                                o.subscribe = function(e, t) {
                                    "undefined" == typeof p[e] && (p[e] = []), p[e].push(t)
                                }, o.unsubscribe = function(e, t) {
                                    if ("undefined" != typeof p[e]) {
                                        var i = p[e];
                                        i.splice(i.indexOf(t), 1)
                                    }
                                }, o.publish = function(e, t) {
                                    if ("undefined" != typeof p[e])
                                        for (var i = p[e], n = 0; n < i.length; n++) i[n](t)
                                }, t.exports = o
                            }()
                        }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
                    }, {}],
                    17: [function(_dereq_, module, exports) {
                        ! function() {
                            var $ = _dereq_("./dollar"),
                                Gibber = {
                                    Presets: {},
                                    GraphicsLib: {},
                                    Binops: {},
                                    scale: null,
                                    minNoteFrequency: 50,
                                    started: !1,
                                    "export": function(e) {
                                        $.extend(e, Gibber.Busses), $.extend(e, Gibber.Oscillators), $.extend(e, Gibber.Synths), $.extend(e, Gibber.Percussion), $.extend(e, Gibber.Envelopes), $.extend(e, Gibber.FX), $.extend(e, Gibber.Seqs), $.extend(e, Gibber.Samplers), $.extend(e, Gibber.PostProcessing), $.extend(e, Gibber.Theory), $.extend(e, Gibber.Analysis), e.future = Gibber.Utilities.future, e.solo = Gibber.Utilities.solo, e.Clock = Gibber.Clock, e.Seq = Gibber.Seq, e.Arp = Gibber.Arp, e.ScaleSeq = Gibber.ScaleSeq, e.Rndi = Gibber.Utilities.Rndi, e.Rndf = Gibber.Utilities.Rndf, e.rndi = Gibber.Utilities.rndi, e.rndf = Gibber.Utilities.rndf, e.module = Gibber.import, Gibber.Audio.Time.export(e), e.sec = e.seconds, Gibber.Audio.Binops.export(e)
                                    },
                                    init: function(e) {
                                        "undefined" == typeof window ? (window = GLOBAL, document = GLOBAL.document = !1) : "undefined" != typeof GLOBAL && (GLOBAL.document || (document = GLOBAL.document = !1));
                                        var t = {
                                            globalize: !0,
                                            canvas: null,
                                            target: window
                                        };
                                        Gibber.Utilities.Rndi = Gibber.Audio.Rndi, Gibber.Utilities.Rndf = Gibber.Audio.Rndf, Gibber.Utilities.rndi = Gibber.Audio.rndi, Gibber.Utilities.rndf = Gibber.Audio.rndf, "object" == typeof e && $.extend(t, e), $.extend(Gibber.Presets, Gibber.Synths.Presets), $.extend(Gibber.Presets, Gibber.Percussion.Presets), $.extend(Gibber.Presets, Gibber.FX.Presets), $.extend(Gibber.Presets, Gibber.FX.Presets), $.extend(Gibber.Binops, Gibber.Audio.Binops), t.globalize && Gibber.export(t.target), t.target.$ = $, Gibber.Utilities.init();
                                        var i = null;
                                        Gibber.Audio.onstart && (i = Gibber.Audio.onstart), Gibber.Audio.context || (Gibber.Audio.context = {
                                            sampleRate: 44100
                                        }), Gibber.Audio.onstart = function() {
                                            Gibber.Clock.start(!0), null !== i && i()
                                        }, Gibber.Audio.init(), Gibber.Master = Gibber.Busses.Bus().connect(Gibber.Audio.out), t.globalize && (t.target.Master = Gibber.Master), Gibber.Master.type = "Bus", Gibber.Master.name = "Master", $.extend(!0, Gibber.Master, Gibber.ugen), Gibber.Master.fx.ugen = Gibber.Master, Gibber.isInstrument = !0, Gibber.Audio.ugen.connect = Gibber.Audio._oscillator.connect = Gibber.Audio._synth.connect = Gibber.Audio._effect.connect = Gibber.Audio._bus.connect = Gibber.connect, Gibber.Audio.defineUgenProperty = Gibber.defineUgenProperty, Gibber.scale = Gibber.Theory.Scale("c4", "Minor")
                                    },
                                    interfaceIsReady: function() {
                                        Gibber.started || "undefined" != typeof Gibber.Audio.context.currentTime && (Gibber.started = !0, Gibber.isInstrument && eval(loadFile.text))
                                    },
                                    Modules: {},
                                    "import": function(path, exportTo) {
                                        var _done = null;
                                        return console.log("Loading module " + path + "..."), -1 === path.indexOf("http:") ? (console.log("loading via post", path), $.post(Gibber.Environment.SERVER_URL + "/gibber/" + path, {}, function(d) {
                                            return d = JSON.parse(d), eval(d.text), exportTo && Gibber.Modules[path] && ($.extend(exportTo, Gibber.Modules[path]), Gibber.Modules[path] = exportTo), Gibber.Modules[path] ? (Gibber.Modules[path].init && Gibber.Modules[path].init(), console.log("Module " + path + " is now loaded.")) : console.log("Publication " + path + " is loaded. It may not be a valid module."), null !== _done && _done(Gibber.Modules[path]), !1
                                        })) : $script.get(path, function() {
                                            console.log("Module " + path + " is now loaded."), null !== _done && _done()
                                        }), {
                                            done: function(e) {
                                                _done = e
                                            }
                                        }
                                    },
                                    defineUgenProperty: function(e, t, i) {
                                        var n = Gibber.Clock.timeProperties.indexOf(e) > -1,
                                            r = i.properties[e] = {
                                                value: n ? Gibber.Clock.time(t) : t,
                                                binops: [],
                                                parent: i,
                                                name: e
                                            },
                                            s = e.charAt(0).toUpperCase() + e.slice(1);
                                        Object.defineProperty(i, e, {
                                            configurable: !0,
                                            get: function() {
                                                return r.value
                                            },
                                            set: function(e) {
                                                i[s] && i[s].mapping && i[s].mapping.remove && i[s].mapping.remove(!0), r.value = n ? Gibber.Clock.time(e) : e, Gibber.Audio.dirty(i)
                                            }
                                        }), i[e] = r.value
                                    },
                                    polyInit: function(e) {
                                        e.mod = e.polyMod, e.removeMod = e.removePolyMod;
                                        for (var t in e.polyProperties) ! function(t) {
                                            var i = e.polyProperties[t],
                                                n = Gibber.Clock.timeProperties.indexOf(t) > -1;
                                            Object.defineProperty(e, t, {
                                                get: function() {
                                                    return i
                                                },
                                                set: function(i) {
                                                    for (var r = 0; r < e.children.length; r++) e.children[r][t] = n ? Gibber.Clock.time(i) : i
                                                }
                                            })
                                        }(t)
                                    },
                                    connect: function(e, t) {
                                        return "undefined" == typeof e && (e = Gibber.Master), -1 === this.destinations.indexOf(e) && (e.addConnection(this, 1, t), 0 !== t && this.destinations.push(e)), this
                                    },
                                    log: function(e) {
                                        "undefined" != typeof e && console.log("function" != typeof e ? e : "Function")
                                    },
                                    scriptCallbacks: [],
                                    run: function(script, pos, cm) {
                                        var _start = pos.start ? pos.start.line : pos.line,
                                            tree;
                                        try {
                                            tree = Gibber.Esprima.parse(script, {
                                                loc: !0,
                                                range: !0
                                            })
                                        } catch (e) {
                                            return void console.error("Parse error on line " + (_start + e.lineNumber) + " : " + e.message.split(":")[1])
                                        }
                                        for (var __i__ = 0; __i__ < tree.body.length; __i__++) {
                                            var obj = tree.body[__i__],
                                                start = {
                                                    line: _start + obj.loc.start.line - 1,
                                                    ch: obj.loc.start.column
                                                },
                                                end = {
                                                    line: _start + obj.loc.end.line - 1,
                                                    ch: obj.loc.end.column
                                                },
                                                src = cm.getRange(start, end),
                                                result = null;
                                            try {
                                                result = eval(src), log("function" != typeof result ? result : "Function")
                                            } catch (e) {
                                                console.error("Error evaluating expression beginning on line " + (start.line + 1) + "\n" + e.message)
                                            }
                                            if (this.scriptCallbacks.length > 0)
                                                for (var ___i___ = 0; ___i___ < this.scriptCallbacks.length; ___i___++) this.scriptCallbacks[___i___](obj, cm, pos, start, end, src, _start)
                                        }
                                    },
                                    processArguments: function(e, t) {
                                        var i;
                                        return e.length ? "string" == typeof e[0] && "Drums" !== t && "XOX" !== t ? (i = Gibber.getPreset(e[0], t), "object" == typeof e[1] && $.extend(i, e[1]), i) : Array.prototype.slice.call(e, 0) : i
                                    },
                                    processArguments2: function(e, t, i) {
                                        if (t.length) {
                                            var n = t[0];
                                            if ("string" == typeof n && "Drums" !== i && "XOX" !== i && "Shader" !== i) preset = Gibber.getPreset(t[0], i), "object" == typeof t[1] && $.extend(preset, t[1]), $.extend(e, preset), e.presetInit && e.presetInit();
                                            else if ($.isPlainObject(n) && "undefined" == typeof n.type) $.extend(e, n);
                                            else {
                                                var r = Object.keys(e.properties);
                                                if ("FX" === e.type)
                                                    for (var s = 0; s < t.length; s++) e[r[s + 1]] = t[s];
                                                else
                                                    for (var s = 0; s < t.length; s++) e[r[s]] = t[s]
                                            }
                                        }
                                    },
                                    getPreset: function(e, t) {
                                        var i = {};
                                        return Gibber.Presets[t] && Gibber.Presets[t][e] ? i = Gibber.Presets[t][e] : Gibber.log(t + " does not have a preset named " + e + "."), i
                                    },
                                    stopAudio: function() {
                                        Gibber.Audio.analysisUgens.length = 0, Gibber.Audio.sequencers.length = 0;
                                        for (var e = 0; e < Gibber.Master.inputs.length; e++) Gibber.Master.inputs[e].value.disconnect();
                                        Gibber.Master.inputs.length = 0, Gibber.Clock.reset(), Gibber.Master.fx.remove(), Gibber.Master.amp = 1, console.log("Audio stopped.")
                                    },
                                    clear: function() {
                                        this.stopAudio(), Gibber.Graphics && Gibber.Graphics.clear(), Gibber.proxy(window), $.publish("/gibber/clear", {}), console.log("Gibber has been cleared.")
                                    },
                                    proxy: function(e) {
                                        for (var t = "abcdefghijklmnopqrstuvwxyz", i = 0; i < t.length; i++) {
                                            var n = t.charAt(i);
                                            "undefined" != typeof window[n] && (delete window[n], delete window["___" + n]),
                                                function() {
                                                    var t = n;
                                                    Object.defineProperty(e, t, {
                                                        configurable: !0,
                                                        get: function() {
                                                            return e["___" + t]
                                                        },
                                                        set: function(i) {
                                                            if (i) e["___" + t] && "function" == typeof e["___" + t].replaceWith && (e["___" + t].replaceWith(i), console.log(e["___" + t].name + " was replaced with " + i.name)), e["___" + t] = i;
                                                            else if (e["___" + t]) {
                                                                var n = e["___" + t];
                                                                n && "function" == typeof n.kill && n.kill()
                                                            }
                                                        }
                                                    })
                                                }()
                                        }
                                    },
                                    construct: function(e, t) {
                                        function i() {
                                            return e.apply(this, t)
                                        }
                                        return i.prototype = e.prototype, new i
                                    },
                                    createMappingObject: function(e, t) {
                                        var i = "function" == typeof e.min ? e.min() : e.min,
                                            n = "function" == typeof e.max ? e.max() : e.max,
                                            r = "function" == typeof t.min ? t.min() : t.min,
                                            s = "function" == typeof t.max ? t.max() : t.max;
                                        if ("undefined" == typeof t.object && t.Value && (t = t.Value), "undefined" != typeof e.object[e.Name].mapping) return void e.object[e.Name].mapping.replace(t.object, t.name, t.Name);
                                        "undefined" != typeof t.targets && -1 === t.targets.indexOf(e) && t.targets.push([e, e.Name]);
                                        var o = "Out" !== t.Name ? t.timescale : "audioOut";
                                        mapping = Gibber.mappings[e.timescale][o](e, t), e.object[e.name].toString = function() {
                                            return "> continuous mapping: " + t.name + " -> " + e.name
                                        }, Object.defineProperties(e.object[e.Name], {
                                            min: {
                                                configurable: !0,
                                                get: function() {
                                                    return i
                                                },
                                                set: function(t) {
                                                    i = t, e.object[e.Name].mapping.outputMin = i
                                                }
                                            },
                                            max: {
                                                configurable: !0,
                                                get: function() {
                                                    return n
                                                },
                                                set: function(t) {
                                                    n = t, e.object[e.Name].mapping.outputMax = n
                                                }
                                            }
                                        }), e.object[e.Name].mappingObjects = [], Gibber.createProxyProperty(e.object[e.Name], "min", 1, 0, {
                                            min: i,
                                            max: n,
                                            output: e.output,
                                            timescale: e.timescale,
                                            dimensions: 1
                                        }), Gibber.createProxyProperty(e.object[e.Name], "max", 1, 0, {
                                            min: i,
                                            max: n,
                                            output: e.output,
                                            timescale: e.timescale,
                                            dimensions: 1
                                        }), Object.defineProperties(t.object[t.Name], {
                                            min: {
                                                configurable: !0,
                                                get: function() {
                                                    return r
                                                },
                                                set: function(t) {
                                                    r = t, e.object[e.Name].mapping.inputMin = r
                                                }
                                            },
                                            max: {
                                                configurable: !0,
                                                get: function() {
                                                    return s
                                                },
                                                set: function(t) {
                                                    s = t, e.object[e.Name].mapping.inputMax = s
                                                }
                                            }
                                        }), e.object[e.Name].invert = function() {
                                            e.object[e.Name].mapping.invert()
                                        }, "undefined" == typeof e.object.mappings && (e.object.mappings = []), e.object.mappings.push(mapping), Gibber.defineSequencedProperty(e.object[e.Name], "invert")
                                    },
                                    defineSequencedProperty: function(e, t, i) {
                                        var n, r, s = e[t];
                                        e.seq || (e.seq = Gibber.Seqs.Seq({
                                            doNotStart: !0,
                                            scale: e.scale,
                                            priority: i
                                        })), s.seq = function(o, a) {
                                    		if (!$.isArray(o)) {
                                                o = [o];
                                    		}
                                            var u = {
                                                key: t,
                                                values: $.isArray(o) || null !== o && "function" != typeof o && "number" == typeof o.length ? o : [o],
                                                durations: $.isArray(a) ? a : "undefined" != typeof a ? [a] : null,
                                                target: e,
                                                priority: i
                                            };
                                            return "undefined" != typeof n && (n.shouldStop = !0, e.seq.seqs.splice(r, 1)), e.seq.add(u), r = e.seq.seqs.length - 1, n = e.seq.seqs[r], null === u.durations && e.seq.autofire.push(n), Object.defineProperties(s.seq, {
                                                values: {
                                                    configurable: !0,
                                                    get: function() {
                                                        return e.seq.seqs[r].values
                                                    },
                                                    set: function(i) {
                                                        Array.isArray(i) || (i = [i]), "note" === t && e.seq.scale && (i = makeNoteFunction(i, e.seq)), e.seq.seqs[r].values = i
                                                    }
                                                },
                                                durations: {
                                                    configurable: !0,
                                                    get: function() {
                                                        return e.seq.seqs[r].durations
                                                    },
                                                    set: function(t) {
                                                        Array.isArray(t) || (t = [t]), e.seq.seqs[r].durations = t
                                                    }
                                                }
                                            }), e.seq.isRunning || (e.seq.offset = Gibber.Clock.time(e.offset), e.seq.start(!0, i)), e
                                        }, s.seq.stop = function() {
                                            n.shouldStop = !0
                                        }, s.seq.start = function() {
                                            n.shouldStop = !1, e.seq.timeline[0] = [n], e.seq.nextTime = 0, e.seq.isRunning || e.seq.start(!1, i)
                                        }
                                    },
                                    defineRampedProperty: function(e, t) {
                                        var i, n = e[t],
                                            r = t.slice(1);
                                        n.ramp = function(t, n, s) {
                                            return arguments.length < 2 ? void console.err("ramp requires at least two arguments: target and time.") : ("undefined" == typeof s && (s = n, n = t, t = e[r]()), i && i(), "object" != typeof t ? e[r] = Line(t, n, s) : t.retrigger(n, Gibber.Clock.time(s)), i = future(function() {
                                                e[r] = n
                                            }, s), e)
                                        }
                                    },
                                    createProxyMethods: function(e, t) {
                                        for (var i = 0; i < t.length; i++) Gibber.defineSequencedProperty(e, t[i])
                                    },
                                    createProxyProperty: function(e, t, i, n, r, s, o) {
                                        var a, u, c = t,
                                            l = s === !1 ? !1 : !0,
                                            p = l ? r || e.mappingProperties[c] : null,
                                            h = c.charAt(0).toUpperCase() + c.slice(1);
                                        a = $.extend({}, p, {
                                            Name: h,
                                            name: c,
                                            type: "mapping",
                                            value: e[c],
                                            object: e,
                                            targets: [],
                                            oldSetter: e.__lookupSetter__(c),
                                            oldGetter: e.__lookupGetter__(c),
                                            oldMappingGetter: e.__lookupGetter__(h),
                                            oldMappingSetter: e.__lookupSetter__(h)
                                        }), e.mappingObjects || (e.mappingObjects = []), e.mappingObjects.push(a);
                                        var f = l ? "_" + c : c;
                                        u = e["_" + c] = function() {
                                            var t = function(t) {
                                                return "undefined" != typeof t ? (a.value = t, a.oldSetter && a.oldSetter(a.value), e) : a.value
                                            };
                                            return t
                                        }(), u.valueOf = function() {
                                            return a.value
                                        }, a.toString = function() {
                                            return "> continuous mapping: " + a.name
                                        }, l ? Object.defineProperty(e, c, {
                                            configurable: !0,
                                            get: function() {
                                                return e["_" + c]
                                            },
                                            set: function(t) {
                                                return "object" == typeof t && "mapping" === t.type ? Gibber.createMappingObject(a, t) : ("undefined" != typeof e[a.Name].mapping && e[a.Name].mapping.remove && e[a.Name].mapping.remove(!0), e["_" + c](t)), e
                                            }
                                        }) : ! function() {
                                            Object.defineProperty(e, c, {
                                                configurable: !0,
                                                get: function() {
                                                    return e["_" + c]
                                                },
                                                set: function(t) {
                                                    return e["_" + c](t), e
                                                }
                                            })
                                        }(), i && Gibber.defineSequencedProperty(e, f, o), n && Gibber.defineRampedProperty(e, f), l && Object.defineProperty(e, a.Name, {
                                            configurable: !0,
                                            get: function() {
                                                return "function" == typeof a.oldMappingGetter && a.oldMappingGetter(), a
                                            },
                                            set: function(t) {
                                                e[a.Name] = t, "function" == typeof a.oldMappingSetter && a.oldMappingSetter(t)
                                            }
                                        })
                                    },
                                    createProxyProperties: function(e, t, i, n) {
                                        var r = "undefined" == typeof i ? !0 : i,
                                            s = "undefined" == typeof n ? !0 : n;
                                        e.gibber = !0, !e.seq && r && (e.seq = Gibber.Seqs.Seq({
                                            doNotStart: !0,
                                            scale: e.scale
                                        })), e.mappingProperties = t, e.mappingObjects = [];
                                        for (var o in t) t[o].doNotProxy || Gibber.createProxyProperty(e, o, r, s)
                                    },
                                    object: {
                                        "class": null,
                                        text: null,
                                        init: function(e) {
                                            this.class = e, this.text = $("." + e)
                                        }
                                    },
                                    ugen: {
                                        sequencers: [],
                                        mappings: [],
                                        fx: $.extend([], {
                                            add: function() {
                                                var e = 0 === this.length ? this.ugen : this[this.length - 1];
                                                e.disconnect();
                                                for (var t = 0; t < arguments.length; t++) {
                                                    var i = arguments[t];
                                                    i.input = e, e = i, this.push(i)
                                                }
                                                return this.ugen !== Gibber.Master ? e.connect() : e.connect(Gibber.Audio.out), this.ugen
                                            },
                                            remove: function() {
                                                if (arguments.length > 0)
                                                    for (var e = 0; e < arguments.length; e++) {
                                                        var t = arguments[e];
                                                        if ("string" != typeof t) {
                                                            if ("number" == typeof t) {
                                                                var i = this[t];
                                                                if (i.disconnect(), this.splice(t, 1), "undefined" != typeof this[t]) {
                                                                    var n = t - 1;
                                                                    this[t].input = -1 !== n ? this[n] : this.ugen, "undefined" != typeof this[t + 1] ? this[t + 1].input = 0 === t ? this.ugen : this[t] : this.ugen.connect(this.ugen !== Gibber.Master ? Gibber.Master : Gibber.Audio.out)
                                                                } else this.length > 0 ? this[t - 1].connect(Gibber.Master) : this.ugen.connect(this.ugen !== Gibber.Master ? Gibber.Master : Gibber.Audio.out)
                                                            }
                                                        } else
                                                            for (var r = 0; r < this.length; r++) this[r].name === t && this.remove(r)
                                                    } else this.length > 0 ? (this[this.length - 1].disconnect(), this.ugen.connect(this.ugen !== Gibber.Master ? Gibber.Master : Gibber.Audio.out), this.ugen.codegen(), this.length = 0) : Gibber.log(this.ugen.name + " does not have any fx to remove. ")
                                            }
                                        }),
                                        replaceWith: function(e) {
                                            for (var t = 0; t < this.destinations.length; t++) e.connect(this.destinations[t]);
                                            for (var t = 0; t < this.sequencers.length; t++) this.sequencers[t].target = e, e.sequencers.push(this.sequencers[t]);
                                            for (var t = 0; t < this.mappingObjects.length; t++) {
                                                var i = this.mappingObjects[t];
                                                if (i.targets.length > 0)
                                                    for (var n = 0; n < i.targets.length; n++) {
                                                        var r = i.targets[n];
                                                        e.mappingProperties[i.name] ? r[0].mapping.replace(e, i.name, i.Name) : r[0].mapping.remove()
                                                    }
                                            }
                                            this.kill()
                                        },
                                        kill: function() {
                                            var e = 0 !== this.fx.length ? this.fx[this.fx.length - 1] : this;
                                            this.seq.isRunning && this.seq.disconnect(), e.disconnect();
                                            for (var t = 0; t < this.fx.length; t++) {
                                                var i = this.fx[t];
                                                i.seq.isRunning && i.seq.disconnect()
                                            }
                                            this.disconnect();
                                            for (var t = 0; t < this.mappings.length; t++) this.mappings[t].remove();
                                            this.clearMarks && this.clearMarks(), console.log(this.name + " has been terminated.")
                                        },
                                        play: function(e, t) {
                                            return this.note ? this.note.seq(e, t) : this.frequency && this.frequency.seq(e, t), this
                                        },
                                        fadeIn: function(e, t) {
                                            isNaN(t) && (t = 1);
                                            var i = Gibber.Clock.time(e),
                                                n = (new Gibber.Audio.ExponentialDecay({
                                                    decayCoefficient: .05,
                                                    length: i
                                                }), new Gibber.Audio.Line(0, t, i));
                                            return this.amp = n, future(function() {
                                                this.amp = t
                                            }.bind(this), i), this
                                        },
                                        fadeOut: function(e) {
                                            var t = Gibber.Clock.time(e),
                                                i = (new Gibber.Audio.ExponentialDecay({
                                                    decayCoefficient: 5e-5,
                                                    length: t
                                                }), new Gibber.Audio.Line(this.amp(), 0, Gibber.Clock.time(t)));
                                            return this.amp = i, future(function() {
                                                this.amp = 0
                                            }.bind(this), t), this
                                        }
                                    }
                                };
                            Gibber.Audio = _dereq_("gibberish-dsp"), Gibber.Clock = _dereq_("./clock")(Gibber), Gibber.Seqs = _dereq_("./seq")(Gibber), Gibber.Theory = _dereq_("./audio/theory")(Gibber), Gibber.FX = _dereq_("./audio/fx")(Gibber), Gibber.Oscillators = _dereq_("./audio/oscillators")(Gibber), Gibber.Synths = _dereq_("./audio/synths")(Gibber), Gibber.Busses = _dereq_("./audio/bus")(Gibber), Gibber.Analysis = _dereq_("./audio/analysis")(Gibber), Gibber.Envelopes = _dereq_("./audio/envelopes")(Gibber), Gibber.Percussion = _dereq_("./audio/drums")(Gibber), Gibber.Input = _dereq_("./audio/audio_input")(Gibber), Gibber.Samplers = _dereq_("./audio/sampler")(Gibber), Gibber.PostProcessing = _dereq_("./audio/postprocessing")(Gibber), Gibber.Utilities = _dereq_("./utilities")(Gibber), Gibber.Arp = _dereq_("./audio/arp")(Gibber), module.exports = Gibber
                        }()
                    }, {
                        "./audio/analysis": 3,
                        "./audio/arp": 4,
                        "./audio/audio_input": 5,
                        "./audio/bus": 6,
                        "./audio/drums": 7,
                        "./audio/envelopes": 8,
                        "./audio/fx": 9,
                        "./audio/oscillators": 10,
                        "./audio/postprocessing": 11,
                        "./audio/sampler": 12,
                        "./audio/synths": 13,
                        "./audio/theory": 14,
                        "./clock": 15,
                        "./dollar": 16,
                        "./seq": 19,
                        "./utilities": 20,
                        "gibberish-dsp": 1
                    }],
                    18: [function(e, t) {
                        ! function() {
                            var e = {
                                outputCurves: {
                                    LINEAR: 0,
                                    LOGARITHMIC: 1
                                },
                                audio: {
                                    graphics: function(e, t) {
                                        "undefined" == typeof t.object.track && (t.object.track = {});
                                        var i, n = "undefined" != typeof t.object.track[t.name] ? t.object.track[t.name] : new Gibberish.Proxy2(t.object, t.name),
                                            r = new Gibberish.OnePole({
                                                a0: .005,
                                                b1: .995
                                            });
                                        return t.object.track = n, i = e.object[e.Name].mapping = Map(n, e.min, e.max, t.min, t.max, e.output, t.wrap), r.input = i, e.object[e.name] = r, i.proxy = n, i.op = r, i.remove = function(t) {
                                            t || (e.object[e.name] = e.object[e.Name].mapping.getValue()), delete e.object[e.Name].mapping
                                        }, i
                                    },
                                    "interface": function(e, t) {
                                        var i, n = "undefined" != typeof t.track ? t.track : new Gibberish.Proxy2(t.object, t.name),
                                            r = new Gibberish.OnePole({
                                                a0: .005,
                                                b1: .995
                                            }),
                                            s = e.max - e.min,
                                            o = (e.object[e.name] - e.min) / s,
                                            a = t.min + (t.max - t.min) * o;
                                        if (t.object.setValue && t.object.setValue(a), t.track = n, i = e.object[e.Name].mapping = Map(n, e.min, e.max, t.min, t.max, e.output, t.wrap), r.input = i, e.object[e.name] = r, i.proxy = n, i.op = r, i.remove = function(t) {
                                                t || (e.object[e.name] = i.getValue()), delete i
                                            }, "undefined" != typeof t.object.label) {
                                            for (var u = "", c = 0; c < t.targets.length; c++) {
                                                var l = t.targets[c];
                                                u += l[0].object.name + "." + l[1], c !== t.targets.length - 1 && (u += " & ")
                                            }
                                            t.object.label = u
                                        }
                                        return i.replace = function(t, i, r) {
                                            n.setInput(t), -1 === t[r].targets.indexOf(e) && t[r].targets.push([e, e.Name])
                                        }, i
                                    },
                                    audio: function(e, t) {
                                        var i, n;
                                        return "undefined" != typeof t.object.track ? (i = t.object.track, i.count++) : (i = new Gibberish.Proxy2(t.object, t.name), i.count = 1), t.object.track = i, e.object[e.name] = Map(i, e.min, e.max, t.min, t.max), n = e.object[e.Name].mapping = e.object[e.name](), n.remove = function(t) {
                                            t || (e.object[e.name] = n.getValue()), n.op && n.op.remove(), delete e.object[e.Name].mapping
                                        }, n.replace = function(t, i, r) {
                                            var s = new Gibberish.Proxy2(t, i);
                                            n.input = s, t[r].targets && -1 === t[r].targets.indexOf(e) && t[r].targets.push([e, e.Name])
                                        }, n
                                    },
                                    audioOut: function(e, t) {
                                        var i;
                                        e.object[e.name] = Map(null, e.min, e.max, 0, 1, 0), i = e.object[e.Name].mapping = e.object[e.name](), "undefined" != typeof t.object.track ? (i.follow = t.object.track, i.follow.count++) : (i.follow = new Gibberish.Follow({
                                            input: t.object,
                                            useAbsoluteValue: !0
                                        }), i.follow.count = 1), t.object.track = i.follow, i.input = e.object[e.Name].mapping.follow, i.remove = function(n) {
                                            n || (e.object[e.name] = e.object[e.Name].mapping.getValue()), i.bus && i.bus.disconnect(), i.follow && (i.follow.count--, 0 === i.follow.count && (delete t.object.track, i.follow.remove())), delete e.object[e.Name].mapping
                                        }, i.replace = function(t, n, r) {
                                            i.follow.input = t, -1 === t[r].targets.indexOf(e) && t[r].targets.push([e, e.Name])
                                        };
                                        var n = i.follow.bufferSize;
                                        return Object.defineProperty(e.object[e.Name], "env", {
                                            configurable: !0,
                                            get: function() {
                                                return n
                                            },
                                            set: function(e) {
                                                n = Gibber.Clock.time(e), i.follow.bufferSize = n
                                            }
                                        }), i
                                    }
                                },
                                graphics: {
                                    graphics: function(e, t) {
                                        var i, n = Map(t.object[t.name], e.min, e.max, t.min, t.max, e.output, t.wrap),
                                            r = n.getValue.bind(n);
                                        return n.getValue = function() {
                                            return n.callback(t.object[t.name], e.min, e.max, t.min, t.max, e.output, t.wrap), r()
                                        }, i = e.object[e.Name].mapping = n, e.object.mod ? e.object.mod(e.name, i, "=") : e.modObject.mod(e.modName, i, "="), i.remove = function() {
                                            e.object.mod ? e.object.removeMod(e.name) : e.modObject.removeMod(e.modName), e.object[e.name] = e.object[e.Name].mapping.getValue(), delete e.object[e.Name].mapping
                                        }, i.replace = function(e) {
                                            i.input = e
                                        }, i
                                    },
                                    "interface": function(e, t) {
                                        var i, n = Map(t.object[t.name], e.min, e.max, t.min, t.max, e.output, t.wrap);
                                        "undefined" == typeof t.object.functions && (t.object.functions = {}, t.object.onvaluechange = function() {
                                            for (var e in t.object.functions) t.object.functions[e]()
                                        }), i = e.object[e.Name].mapping = n, e.mapping.from = t;
                                        var r = e.name + " <- " + t.object.name + "." + t.Name;
                                        if (t.object.functions[r] = function() {
                                                var n = i.callback(t.object[t.name], e.min, e.max, t.min, t.max, e.output, t.wrap);
                                                e.object[e.Name].oldSetter.call(e.object[e.Name], n)
                                            }, i.replace = function() {}, i.remove = function() {
                                                console.log("mapping removed"), delete t.object.functions[r]
                                            }, t.object.setValue && t.object.setValue(e.object[e.name]), "undefined" != typeof t.object.label) {
                                            for (var s = "", o = 0; o < t.targets.length; o++) {
                                                var a = t.targets[o];
                                                s += a[0].object.name + "." + a[1], o !== t.targets.length - 1 && (s += " & ")
                                            }
                                            t.object.label = s
                                        }
                                        return i
                                    },
                                    audio: function(e, t) {
                                        var i;
                                        i = e.object[e.Name].mapping = Map(null, e.min, e.max, t.min, t.max, e.output, t.wrap), i.follow = "undefined" != typeof t.object.track ? t.object.track : new Gibberish.Follow({
                                            input: t.object.properties[t.name],
                                            useAbsoluteValue: !1
                                        }), t.object.track = e.object[e.Name].mapping.follow, i.input = i.follow, i.bus = new Gibberish.Bus2({
                                            amp: 0
                                        }).connect(), i.connect(i.bus), i.replace = function(t, n, r) {
                                            i.follow.input = t, -1 === t[r].targets.indexOf(e) && t[r].targets.push([e, e.Name])
                                        };
                                        var n = i.follow.bufferSize;
                                        return Object.defineProperty(e.object[e.Name], "env", {
                                            get: function() {
                                                return n
                                            },
                                            set: function(e) {
                                                n = Gibber.Clock.time(e), i.follow.bufferSize = n
                                            }
                                        }), e.object.mod ? e.object.mod(e.name, i, "=") : e.modObject.mod(e.modName, i, "="), i.remove = function() {
                                            this.bus.disconnect(), this.follow && (this.follow.count--, 0 === this.follow.count && (delete t.object.track, this.follow.remove())), e.object.mod ? e.object.removeMod(e.name) : e.modObject.removeMod(e.modName), delete e.object[e.Name].mapping
                                        }, i
                                    },
                                    audioOut: function(e, t) {
                                        if (console.log(e.Name, e.object), "undefined" != typeof e.object[e.Name].mapping) return console.log("REPLACING MAPPING"), i.replace(t.object, t.name, t.Name), i;
                                        console.log("MAKING A MAPPING");
                                        var i = e.object[e.Name].mapping = Map(null, e.min, e.max, 0, 1, 0);
                                        "undefined" != typeof t.object.track ? (i.follow = t.object.track, i.follow.count++) : (i.follow = new Gibberish.Follow({
                                            input: t.object
                                        }), i.follow.count = 1), t.object.track = i.follow;
                                        var n = i.follow.bufferSize;
                                        return Object.defineProperty(e.object[e.Name], "env", {
                                            configurable: !0,
                                            get: function() {
                                                return n
                                            },
                                            set: function(e) {
                                                n = Gibber.Clock.time(e), i.follow.bufferSize = n
                                            }
                                        }), i.input = i.follow, i.bus = new Gibberish.Bus2({
                                            amp: 0
                                        }).connect(), i.connect(i.bus), i.replace = function(n, r, s) {
                                            if (n[s].timescale === t.timescale) {
                                                var o = i.follow.input[t.Name].targets.indexOf(e);
                                                o >= -1 && i.follow.input[t.Name].targets.splice(o, 1), i.follow.input = n, -1 === n[s].targets.indexOf(e) && n[s].targets.push([e, e.Name])
                                            } else i.bus.disconnect(), i.follow.remove(), Gibber.createMappingObject(e, n)
                                        }, e.object.mod ? e.object.mod(e.name, i, "=") : e.modObject ? e.modObject.mod(e.modName, i, "=") : ! function() {
                                            var t = i;
                                            e.object.update = function() {
                                                e.object[e.name](t.getValue())
                                            }
                                        }(), i.remove = function() {
                                            this.bus.disconnect(), this.follow && (this.follow.count--, 0 === this.follow.count && (delete t.object.track, this.follow.remove())), e.object.mod ? e.object.removeMod(e.name) : e.modObject ? e.modObject.removeMod(e.modName) : console.log("removing update "), delete e.object[e.Name].mapping
                                        }, i
                                    }
                                },
                                notation: {
                                    graphics: function(e, t) {
                                        var i, n = Map(t.object[t.name], e.min, e.max, t.min, t.max, e.output, t.wrap),
                                            r = n.getValue.bind(n);
                                        return n.getValue = function() {
                                            return n.callback(t.object[t.name], e.min, e.max, t.min, t.max, e.output, t.wrap), r()
                                        }, i = e.object[e.Name].mapping = n, e.object.mod ? e.object.mod(e.name, i, "=") : e.modObject.mod(e.modName, i, "="), i.remove = function() {
                                            e.object.mod ? e.object.removeMod(e.name) : e.modObject.removeMod(e.modName), e.object[e.name] = e.object[e.Name].mapping.getValue(), delete e.object[e.Name].mapping
                                        }, i.replace = function(e) {
                                            i.input = e
                                        }, i
                                    },
                                    "interface": function(e, t) {
                                        var i, n = Map(t.object[t.name], e.min, e.max, t.min, t.max, e.output, t.wrap);
                                        "undefined" == typeof t.object.functions && (t.object.functions = {}, t.object.onvaluechange = function() {
                                            for (var e in t.object.functions) t.object.functions[e]()
                                        }), i = e.object[e.Name].mapping = n, e.mapping.from = t;
                                        var r = e.name + " <- " + t.object.name + "." + t.Name;
                                        if (t.object.functions[r] = function() {
                                                var n = i.callback(t.object[t.name], e.min, e.max, t.min, t.max, e.output, t.wrap);
                                                e.object[e.Name].oldSetter.call(e.object[e.Name], n)
                                            }, i.replace = function() {}, i.remove = function() {
                                                console.log("mapping removed"), delete t.object.functions[r]
                                            }, t.object.setValue && t.object.setValue(e.object[e.name]), "undefined" != typeof t.object.label) {
                                            for (var s = "", o = 0; o < t.targets.length; o++) {
                                                var a = t.targets[o];
                                                s += a[0].object.name + "." + a[1], o !== t.targets.length - 1 && (s += " & ")
                                            }
                                            t.object.label = s
                                        }
                                        return i
                                    },
                                    audio: function(e, t) {
                                        var i;
                                        i = e.object[e.Name].mapping = Map(null, e.min, e.max, t.min, t.max, e.output, t.wrap), "undefined" != typeof t.object.track && t.object.track.input === t.object.properties[t.name] ? (i.follow = t.object.track, i.follow.count++) : (i.follow = new Gibberish.Follow({
                                            input: t.object.properties[t.name],
                                            useAbsoluteValue: !1
                                        }), i.follow.count = 1), t.object.track = e.object[e.Name].mapping.follow, i.input = i.follow, i.bus = new Gibberish.Bus2({
                                            amp: 0
                                        }).connect(), i.connect(i.bus), i.replace = function(t, n, r) {
                                            i.follow.input = t, -1 === t[r].targets.indexOf(e) && t[r].targets.push([e, e.Name])
                                        };
                                        var n = i.follow.bufferSize;
                                        return Object.defineProperty(e.object[e.Name], "env", {
                                            get: function() {
                                                return n
                                            },
                                            set: function(e) {
                                                n = Gibber.Clock.time(e), i.follow.bufferSize = n
                                            }
                                        }), i.update = function() {
                                            e.object[e.name](i.getValue())
                                        }, i.text = e.object, Gibber.Environment.Notation.add(i), i.remove = function() {
                                            this.bus.disconnect(), this.follow && (this.follow.count--, 0 === this.follow.count && (delete t.object.track, this.follow.remove())), Gibber.Environment.Notation.remove(i), delete e.object[e.Name].mapping
                                        }, i
                                    },
                                    audioOut: function(e, t) {
                                        if ("undefined" != typeof e.object[e.Name].mapping) return i.replace(t.object, t.name, t.Name), i;
                                        var i = e.object[e.Name].mapping = Map(null, e.min, e.max, 0, 1, 0);
                                        console.log("MAPPING", t), "undefined" != typeof t.object.track && t.object.track.input === t.object.properties[t.name] ? (i.follow = t.object.track, i.follow.count++) : (i.follow = new Gibberish.Follow({
                                            input: t.object,
                                            useAbsoluteValue: !0
                                        }), i.follow.count = 1), t.object.track = i.follow;
                                        var n = i.follow.bufferSize;
                                        return Object.defineProperty(e.object[e.Name], "env", {
                                            configurable: !0,
                                            get: function() {
                                                return n
                                            },
                                            set: function(e) {
                                                n = Gibber.Clock.time(e), i.follow.bufferSize = n
                                            }
                                        }), i.input = i.follow, i.bus = new Gibberish.Bus2({
                                            amp: 0
                                        }).connect(), i.connect(i.bus), i.replace = function(n, r, s) {
                                            if (n[s].timescale === t.timescale) {
                                                var o = i.follow.input[t.Name].targets.indexOf(e);
                                                o >= -1 && i.follow.input[t.Name].targets.splice(o, 1), i.follow.input = n, -1 === n[s].targets.indexOf(e) && n[s].targets.push([e, e.Name])
                                            } else i.bus.disconnect(), i.follow.remove(), Gibber.createMappingObject(e, n)
                                        }, i.update = function() {
                                            e.object[e.name](i.getValue())
                                        }, i.text = e.object, Gibber.Environment.Notation.add(i), i.remove = function() {
                                            this.bus.disconnect(), this.follow && (this.follow.count--, 0 === this.follow.count && (delete t.object.track, this.follow.remove())), Gibber.Environment.Notation.remove(i), delete e.object[e.Name].mapping
                                        }, i
                                    }
                                }
                            };
                            t.exports = e
                        }()
                    }, {}],
                    19: [function(e, t) {
                        ! function() {
                            var i, n = e("gibberish-dsp"),
                                r = e("./dollar"),
                                s = ["durations", "target", "scale", "offset", "doNotStart", "priority"],
                                o = function(e, t) {
                                    var i = r.extend([], e),
                                        n = 0;
                                    return [function() {
                                        var e, r;
                                        if (e = "function" == typeof i.pick ? i[i.pick()] : "function" == typeof i[n] ? i[n]() : i[n++], "number" == typeof t.scale.notes[e]) r = t.scale.notes[e];
                                        else try {
                                            r = t.scale.notes[e].fq()
                                        } catch (s) {
                                            console.error("The frequency could not be obtained from the current scale. Did you specify an invalid mode or root note?"), t.stop()
                                        }
                                        return n >= i.length && (n = 0), r
                                    }]
                                },
                                a = function() {
                                    var e, t = {},
                                        a = [];
                                    if ("object" == typeof arguments[0]) {
                                        {
                                            var u = arguments[0],
                                                c = typeof u.durations;
                                            typeof u.target, u.priority
                                        }
                                        t.target = u.target, "object" == typeof u.scale && (t.scale = u.scale), "number" == typeof u.offset && (t.offset = i.Clock.time(u.offset)), "array" === c ? t.durations = u.durations : "undefined" !== c && (t.durations = [u.durations]), t.keysAndValues = {}, t.seqs = [], t.autofire = [];
                                        for (var l in u)
                                            if (-1 === s.indexOf(l)) {
                                                var p = r.type(u[l]),
                                                    h = {
                                                        key: l,
                                                        target: t.target,
                                                        durations: t.durations
                                                    };
                                                "array" === p || "number" == typeof u.length ? h.values = u[l] : "undefined" !== p && (h.values = [u[l]]), t.seqs.push(h), a.push(l)
                                            }
                                        if ("scale" in t) {
                                            var f = a.indexOf("note"),
                                                b = a.indexOf("chord");
                                            if (f > -1 && (t.seqs[f].values = o(t.seqs[f].values, t)), b > -1) {
                                                var m = r.extend([], t.seqs[b]),
                                                    d = 0;
                                                t.seqs[b] = [function() {
                                                    var e, i = [];
                                                    return e = "function" == typeof m.pick ? m[m.pick()] : "function" == typeof m[d] ? m[d]() : m[d++], i = t.scale.chord(e), d >= m.length && (d = 0), i
                                                }]
                                            }
                                        }
                                    } else "function" == typeof arguments[0] && (t.seqs = [{
                                        key: "functions",
                                        values: [arguments[0]],
                                        durations: i.Clock.time(arguments[1])
                                    }], a.push("functions"));
                                    e = new n.PolySeq(t), e.timeModifier = i.Clock.time.bind(i.Clock), e.name = "Seq", e.save = {}, e.oldShuffle = e.shuffle, delete e.shuffle, e.rate = i.Clock;
                                    var g = e.__lookupSetter__("rate"),
                                        y = e.rate;
                                    Object.defineProperty(e, "rate", {
                                        get: function() {
                                            return y
                                        },
                                        set: function(t) {
                                            y = Mul(i.Clock, t), g.call(e, y)
                                        }
                                    });
                                    var v = e.nextTime,
                                        G = e.__lookupSetter__("nextTime");
                                    Object.defineProperty(e, "nextTime", {
                                        get: function() {
                                            return v
                                        },
                                        set: function(e) {
                                            v = i.Clock.time(e), G(v)
                                        }
                                    });
                                    var x = e.offset;
                                    Object.defineProperty(e, "offset", {
                                        get: function() {
                                            return x
                                        },
                                        set: function(t) {
                                            x = t, e.nextTime += x
                                        }
                                    }), e.nextTime += e.offset;
                                    for (var k = 0; k < a.length; k++) ! function(e) {
                                        var t = a[k],
                                            i = k;
                                        Object.defineProperty(e, t, {
                                            get: function() {
                                                return e.seqs[i].values
                                            },
                                            set: function(n) {
                                                "note" === t && e.scale && (n = o(n, e)), e.seqs[i].values = n
                                            }
                                        })
                                    }(e);
                                    var j = null;
                                    return Object.defineProperty(e, "durations", {
                                        get: function() {
                                            return j
                                        },
                                        set: function(t) {
                                            j = t;
                                            for (var i = 0; i < e.seqs.length; i++) {
                                                var n = e.seqs[i];
                                                n.durations = j
                                            }
                                        }
                                    }), arguments[0] && !arguments[0].doNotStart && e.start(!0), e.toString = function() {
                                        return "> Seq"
                                    }, e.gibber = !0, e
                                };
                            r.extend(n.PolySeq.prototype, {
                                constructor: a,
                                replaceWith: function() {
                                    this.kill()
                                },
                                kill: function() {
                                    this.target && this.target.sequencers && this.target.sequencers.splice(this.target.sequencers.indexOf(this), 1), this.stop().disconnect()
                                },
                                applyScale: function() {
                                    for (var e = 0; e < this.seqs.length; e++) {
                                        var t = this.seqs[e];
                                        ("note" === t.key || "frequency" === t.key) && (t.values = o(t.values, this))
                                    }
                                },
                                once: function() {
                                    return this.repeat(1), this
                                },
                                reset: function() {
                                    if (0 !== Object.keys(this.save).length)
                                        for (var e in this.save)
                                            for (var t = this.save[e], i = 0; i < this.seqs.length; i++)
                                                if (this.seqs[i].key === e) {
                                                    this.seqs[i].values = Array.isArray(t) ? this.save[e].slice(0) : this.save[e];
                                                    break
                                                }
                                },
                                shuffle: function() {
                                    if (0 === Object.keys(this.save).length)
                                        for (var e = 0; e < this.seqs.length; e++) {
                                            var t = this.seqs[e].values;
                                            this.save[this.seqs[e].key] = Array.isArray(t) ? t.slice(0) : t
                                        }
                                    var i = Array.prototype.slice.call(arguments, 0);
                                    this.oldShuffle.apply(this, i)
                                }
                            });
                            var u = function() {
                                    var e, t = arguments[0];
                                    return t.root = t.root || "c4", t.mode = t.mode || "aeolian", console.log(t), e = i.Theory.Scale(t.root, t.mode), delete t.root, delete t.mode, t.scale = e, a(t)
                                },
                                c = {
                                    Seq: a,
                                    ScaleSeq: u
                                };
                            t.exports = function(e) {
                                return "undefined" == typeof i && (i = e), c
                            }
                        }()
                    }, {
                        "./dollar": 16,
                        "gibberish-dsp": 1
                    }],
                    20: [function(e, t) {
                        ! function() {
                            "use strict";
                            var i, n = [],
                                r = !1,
                                s = (e("./dollar"), e("gibberish-dsp")),
                                o = (e("./clock")(i), {
                                    seq: function() {
                                        var e = arguments[0],
                                            t = typeof e,
                                            i = null;
                                        return "object" === t && Array.isArray(e) && (t = "array"), i
                                    },
                                    random: function() {
                                        for (var e = {}, t = null, i = 0; i < arguments.length; i += 2) e["" + arguments[i]] = {
                                            repeat: arguments[i + 1],
                                            count: 0
                                        };
                                        return this.pick = function() {
                                            var i, n, r = 0;
                                            return this[t] && (n = this[t]), null !== t && e[n].count++ <= e[n].repeat ? (i = t, e[n].count >= e[n].repeat && (e[n].count = 0, t = null)) : (i = o.rndi(0, this.length - 1), r = this[i], "undefined" != typeof e["" + r] ? (e["" + r].count = 1, t = i) : t = null), i
                                        }, this
                                    },
                                    random2: function() {
                                        for (var e = {}, t = null, i = this, n = 0; n < arguments.length; n += 2) e["" + arguments[n]] = {
                                            repeat: arguments[n + 1],
                                            count: 0
                                        };
                                        return this.pick = function() {
                                            var n, r, s = 0;
                                            return i[t] && (r = i[t]), null !== t && e[r].count++ <= e[r].repeat ? (n = t, e[r].count >= e[r].repeat && (e[r].count = 0, t = null)) : (n = o.rndi(0, i.length - 1), s = i[n], "undefined" != typeof e["" + s] ? (e["" + s].count = 1, t = n) : t = null), i[n]
                                        }, this.pick
                                    },
                                    choose: function(e) {
                                        var t = null;
                                        if (isNaN(e) && (e = 1), 1 !== e) {
                                            for (var i = [], n = 0; e > n; n++) i[n] = this[o.rndi(0, this.length - 1)];
                                            t = i
                                        } else t = this[o.rndi(0, this.length - 1)];
                                        return t
                                    },
                                    future: function(e, t) {
                                        var n = new s.Sequencer({
                                            values: [function() {}, function() {
                                                e(), n.stop(), n.disconnect()
                                            }],
                                            durations: [i.Clock.time(t)]
                                        }).start();
                                        return function() {
                                            n.stop(), n.disconnect()
                                        }
                                    },
                                    shuffle: function(e) {
                                        for (var t, i, n = e.length; n; t = parseInt(Math.random() * n), i = e[--n], e[n] = e[t], e[t] = i);
                                    },
                                    solo: function(e) {
                                        var t = Array.prototype.slice.call(arguments, 0);
                                        if (e) {
                                            r && o.solo();
                                            for (var i = 0; i < t.length; i++) {
                                                var s = t[i];
                                                s.fx.length > 0 && (t[i] = s.fx[s.fx.length - 1])
                                            }
                                            for (var a = 0; a < Master.inputs.length; a++) {
                                                var u = t.indexOf(Master.inputs[a].value),
                                                    c = Master.inputs[a].value,
                                                    l = c.name; - 1 === u && "polyseq" !== l && "Seq" !== l && (Master.inputs[a].value = Mul(Master.inputs[a].value, 0), n.push(Master.inputs[a]))
                                            }
                                            r = !0
                                        } else {
                                            for (var a = 0; a < n.length; a++) n[a].value = n[a].value[0];
                                            n.length = 0, r = !1
                                        }
                                    },
                                    fill: function(e, t) {
                                        isNaN(e) && (e = 16), "function" != typeof t && (t = Rndf()), t = t.bind(this);
                                        for (var i = 0; e > i; i++) this[i] = t();
                                        return this
                                    },
                                    merge: function() {
                                        for (var e = [], t = 0; t < this.length; t++) {
                                            var i = this[t];
                                            if (Array.isArray(i))
                                                for (var n = 0; n < i.length; n++) e.push(i[n]);
                                            else e.push(i)
                                        }
                                        return e
                                    },
                                    weight: function() {
                                        var e = Array.prototype.slice.call(arguments, 0);
                                        return this.pick = function() {
                                            for (var t = this[0], i = 0, n = o.rndf(), r = 0; r < e.length; r++)
                                                if (i += e[r], i > n) {
                                                    t = r;
                                                    break
                                                }
                                            return t
                                        }, this
                                    },
                                    gibberArray: function() {},
                                    init: function() {
                                        Array.prototype.random = Array.prototype.rnd = o.random, Array.prototype.weight = o.weight, Array.prototype.fill = o.fill, Array.prototype.choose = o.choose, Array.prototype.merge = o.merge
                                    }
                                });
                            t.exports = function(e) {
                                return "undefined" == typeof i && (i = e), o
                            }
                        }()
                    }, {
                        "./clock": 15,
                        "./dollar": 16,
                        "gibberish-dsp": 1
                    }]
                }, {}, [17])(17)
            });
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {}]
}, {}, [1]);