var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = null;
var g = null;

let base_notes_sharp = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
let base_notes_flat = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'];


// Chord Storage
var chord = {
	'C': [261.6, 329.6, 392.0],
	'Cm': [261.6, 311.1, 392.0],
	'C#': [277.2, 349.2, 415.3],
	'D': [293.7, 370.0, 440.0],
	'Dm': [293.7, 349.2, 440.0],
	'D#': [311.1, 392.0, 466.2],
	'E': [329.6, 415.3, 493.9],
	'Em': [329.6, 392.0, 493.9],
	'F': [349.2, 440.0, 523.251],
	'Fm': [349.2, 415.3, 523.251],
	'F#': [370.0, 554.365, 466.2],
	'G': [392.0, 493.9, 587.330],
	'Gm': [392.0, 466.2, 587.330],
	'G#': [466.2, 523.251, 622.254],
	'A': [440.0, 554.365, 659.255],
	'Am': [440.0, 523.251, 659.255],
	'A#': [466.2, 587.330, 698.456],
	'B': [493.9, 622.254, 739.989],
	'Bm': [493.9, 587.330, 739.989]
}

playTone = (frequency, type, duration) => {
	if (type === undefined) {
		type = "sine";
	}
	if (duration === undefined) {
		duration = 1.3;
	}
	if (frequency === undefined) {
		frequency = 440;
	}
	o = context.createOscillator();
	g = context.createGain();
	o.connect(g);
	o.type = type;
	if (typeof frequency === "string") {
		if (tone[frequency] === undefined) {
			o.frequency.value = chord[frequency][0];
			completeChord(chord[frequency][1], type, duration);
			completeChord(chord[frequency][2], type, duration);
		} else if (chord[frequency] === undefined) {
			o.frequency.value = tone[frequency];
		}
	} else if (typeof frequency === "object") {
		o.frequency.value = frequency[0];
		completeChord(frequency[1], type, duration);
		completeChord(frequency[2], type, duration);
	} else {
		o.frequency.value = frequency;
	}
	g.connect(context.destination);
	o.start(0);
	g.gain.exponentialRampToValueAtTime(0.0001,context.currentTime + duration);
}

//This function helps complete chords and should not be used by itself
completeChord = (frequency, type, duration) => {
	osc = context.createOscillator();
	gn = context.createGain();
	osc.connect(gn);
	osc.type = type;
	osc.frequency.value = frequency;
	gn.connect(context.destination);
	osc.start(0);
	gn.gain.exponentialRampToValueAtTime(0.0001,context.currentTime + duration);
}


function handler(input, base_freq){
    let note = input.split('');
    base_freq = parseInt(base_freq);
    if (note.length == 3){
        if (note[1] == 'b'){
            note_base = base_notes_flat.indexOf(note[0] + note[1]);
        } 
        else {
            note_base = base_notes_sharp.indexOf(note[0] + note[1]);
        }
    }
    else {
        note_base = base_notes_flat.indexOf(note[0]);
    }
    octave = parseInt(note[note.length - 1]);
    calcFreq(note_base, octave, base_freq);
}

function calcFreq(base, octave, base_freq){
    note_interval = Math.pow(2, 1/12);
    middle_freq = base_freq * Math.pow(note_interval, base);
    if (base > 2){
        middle_freq /= 2;
    }

    if (octave < 4){
        freq = middle_freq / (Math.pow(2, 4 - octave));
    }
    else {
        freq = middle_freq * (Math.pow(2, octave - 4))
    }

    playTone(freq);
}