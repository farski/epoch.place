// Sample input:
// 1234567890 = 2009-02-13T23:31:30+00:00

const $ = i => document.getElementById(i);
let nf = true;

// The input normalized to the number of milliseconds since the Unix epoch
let ms;

function dateToLocalISOString(d) {
	const a = [
		d.getFullYear(),
		`0${d.getMonth() + 1}`.slice(-2),
		`0${d.getDate()}`.slice(-2)
	].join('-');

	const b = [
		`0${d.getHours()}`.slice(-2),
		`0${d.getMinutes()}`.slice(-2),
		`0${(d.getSeconds() + (d.getMilliseconds() / 1000)).toFixed(3)}`.slice(-6),
	].join(':');

	let o = d.getTimezoneOffset();
	const z = o >= 0 ? '-' : '+';
	o = Math.abs(o);

	const c = [
		`0${o / 60 ^ 0}`.slice(-2),
		`0${o % 60}`.slice(-2)
	].join(':');
	return `${a}T${b}${z}${c}`;
}

function input() {
	const i = document.getElementById('i').value.trim();

	// Save the input to the URL
	window.location.hash = encodeURIComponent(i);

	$('i-s').style.visibility = 'visible';
	$('i-s').classList.remove('on');
	$('i-ms').style.visibility = 'visible';
	$('i-ms').classList.remove('on');

	// Detect input format
	if (/^-?\d{1,12}(\.\d+)?s?$/.test(i) || /^-?\d+(\.\d+)?s$/.test(i)) {
		// Unix timestamp, assumed to be in seconds
		ms = (+i.replace('s', '') * 1000.0);
		$('i-s').classList.add('on');
	} else if (/^-?\d{13,}(\.\d+)?$/.test(i) || /^-?\d+(\.\d+)?(ms)?$/.test(i)) {
		// Unix timestamp, assumed to be in milliseconds
		ms = +i.replace('ms', '');
		$('i-ms').classList.add('on');
	} else {
		$('i-s').style.visibility = 'hidden';
		$('i-ms').style.visibility = 'hidden';
		ms = chrono.parseDate(i);
	}

	const d = new Date(ms);

	document.getElementById('o-unix-s').innerText = Math.floor(ms / 1000.0);
	document.getElementById('o-unix-s-d').innerText = (ms / 1000.0);

	document.getElementById('o-unix-ms').innerText = Math.round(ms);

	document.getElementById('o-iso-8601-utc').innerText = (d.toISOString());
	document.getElementById('o-iso-8601-loc').innerText = (dateToLocalISOString(d));
}

function now() {
	if (!nf) { return; }

	const now = new Date;

	$('n-unix-s').innerText = Math.floor(+now / 1000.0);
	$('n-unix-s-d').innerText = (+now / 1000.0);
	$('n-unix-ms').innerText = Math.floor(+now);
	$('n-iso-8601-utc').innerText = (now.toISOString());
	$('n-iso-8601-loc').innerText = (dateToLocalISOString(now));

	$('d-unix-s').innerText = Math.abs(Math.ceil((ms - now) / 1000.0));
	$('d-unix-s-d').innerText = Math.abs((ms - now) / 1000.0);
	$('d-unix-ms').innerText = Math.abs(ms - now);
}

function pause() { nf = false; }
function resume() { nf = true; }

function toS() {
	const i = $('i');
	i.value = `${i.value.replace('ms', '').replace('s', '')}s`;
	input();
}

function toMs() {
	const i = $('i');
	i.value = `${i.value.replace('ms', '').replace('s', '')}ms`;
	input();
}

function boot() {
	const i = $('i');
	const n = $('n');

	if (window.location.hash) {
		i.value = decodeURIComponent(window.location.hash.substring(1));
		input();
	}

	i.addEventListener('input', input);
	n.addEventListener('mouseover', pause);
	n.addEventListener('mouseout', resume);
	$('i-s').addEventListener('click', toS);
	$('i-ms').addEventListener('click', toMs);

	setInterval(now, 25);
}

(function () {
	document.addEventListener('DOMContentLoaded', boot);
})();
