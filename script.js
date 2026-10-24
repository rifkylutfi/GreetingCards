// ===== Pengaturan (ubah di sini) =====
const BIRTHDATE = new Date('2003-01-01T00:00:00'); // GANTI dengan tanggal lahir aslinya

const FORTUNES = [
	'🎓 Langsung ACC Skripsi nya.',
	'🍰 Orderan kue makin banyak.',
	'📱 Aypon 18 PRO MEXS',
	'😎 IKI makin GANTENG.'
];

const TAUNTS = [
	'Emang di suruh Traktir itu 😋',
	'Ga bakal bisa itu rusak tombolnya 🤓',
	'Hebat kalo bisa 😎'
];

// ===== Nama dari link (?nama=Sopi) =====
const nama = new URLSearchParams(location.search).get('nama') || 'Sopi';

// ===== Confetti =====
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
const colors = ['#1BBC9B', '#C0392B', '#F1C40F', '#3498DB', '#E91E63', '#9B59B6', '#FF9800'];
let particles = [];
let running = false;

function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function burst(x, y, count, angle, spread, power) {
	for (let i = 0; i < count; i++) {
		const a = (angle + (Math.random() - 0.5) * spread) * Math.PI / 180;
		const speed = power * (0.5 + Math.random() * 0.8);
		particles.push({
			x: x,
			y: y,
			vx: Math.cos(a) * speed,
			vy: -Math.sin(a) * speed,
			size: 6 + Math.random() * 6,
			color: colors[Math.floor(Math.random() * colors.length)],
			rot: Math.random() * 360,
			vr: (Math.random() - 0.5) * 14,
			round: Math.random() < 0.3,
			life: 1
		});
	}
	if (!running) {
		running = true;
		requestAnimationFrame(tick);
	}
}

function tick() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	particles.forEach(p => {
		p.vy += 0.25;
		p.vx *= 0.99;
		p.x += p.vx;
		p.y += p.vy;
		p.rot += p.vr;
		p.life -= 0.004;

		ctx.save();
		ctx.globalAlpha = Math.max(p.life, 0);
		ctx.translate(p.x, p.y);
		ctx.rotate(p.rot * Math.PI / 180);
		ctx.fillStyle = p.color;
		if (p.round) {
			ctx.beginPath();
			ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
			ctx.fill();
		} else {
			ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
		}
		ctx.restore();
	});

	particles = particles.filter(p => p.life > 0 && p.y < canvas.height + 40);

	if (particles.length > 0) {
		requestAnimationFrame(tick);
	} else {
		running = false;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
}

function celebrate() {
	const w = canvas.width;
	const h = canvas.height;
	burst(0, h, 90, 60, 40, 28);
	burst(w, h, 90, 120, 40, 28);
	for (let i = 0; i < 6; i++) {
		setTimeout(() => burst(Math.random() * w, -10, 25, 270, 60, 6), i * 250);
	}
}

// Confetti saat kartu di-hover / diklik
const card = document.querySelector('.card');
let lastBurst = 0;

function cardBurst() {
	const now = Date.now();
	if (now - lastBurst < 1500) return;
	lastBurst = now;
	const r = card.getBoundingClientRect();
	burst(r.left + r.width / 2, r.top + r.height / 2, 80, 90, 120, 16);
}

card.addEventListener('mouseenter', cardBurst);
card.addEventListener('click', cardBurst);

// ===== Emoji melayang =====
const floaters = document.getElementById('floaters');
const emojis = ['🎈', '🎉', '✨', '🎂', '🎁', '💫', '🎊', '🍰'];

for (let i = 0; i < 16; i++) {
	const s = document.createElement('span');
	s.textContent = emojis[i % emojis.length];
	s.style.left = Math.random() * 100 + '%';
	s.style.fontSize = 20 + Math.random() * 26 + 'px';
	s.style.animationDuration = 8 + Math.random() * 10 + 's';
	s.style.animationDelay = Math.random() * 10 + 's';
	floaters.appendChild(s);
}

// ===== Efek ketik di layar pembuka =====
const typedEl = document.getElementById('typed');
const openBtn = document.getElementById('openBtn');
const intro = document.getElementById('intro');
const bgm = document.getElementById('bgm');
const musicBtn = document.getElementById('musicBtn');

const introText = 'Di buka yah ...';
let ti = 0;
(function type() {
	typedEl.textContent = introText.slice(0, ++ti);
	if (ti < introText.length) {
		setTimeout(type, 70);
	} else {
		openBtn.classList.remove('invisible');
	}
})();

// ===== Tombol buka kado + musik =====
openBtn.addEventListener('click', () => {
	intro.classList.add('hide');
	celebrate();
	bgm.play()
		.then(() => musicBtn.classList.add('playing'))
		.catch(err => console.log('Musik gagal diputar:', err));
});

musicBtn.addEventListener('click', () => {
	if (bgm.paused) {
		bgm.play();
		musicBtn.classList.add('playing');
	} else {
		bgm.pause();
		musicBtn.classList.remove('playing');
	}
});

// ===== Kilau mengikuti kursor =====
let lastSparkle = 0;
document.addEventListener('mousemove', e => {
	const now = Date.now();
	if (now - lastSparkle < 60) return;
	lastSparkle = now;
	const s = document.createElement('span');
	s.className = 'sparkle';
	s.textContent = ['✨', '⭐', '💖'][Math.floor(Math.random() * 3)];
	s.style.left = e.clientX + 'px';
	s.style.top = e.clientY + 'px';
	s.style.fontSize = 12 + Math.random() * 12 + 'px';
	document.body.appendChild(s);
	setTimeout(() => s.remove(), 900);
});

// ===== HP: tap untuk buka/tutup kartu =====
if (window.matchMedia('(hover: none)').matches) {
	card.addEventListener('click', () => card.classList.toggle('open'));
}

// ===== Umur real-time =====
const ageEl = document.getElementById('age');
function updateAge() {
	const diff = Math.max(0, Date.now() - BIRTHDATE.getTime());
	const s = Math.floor(diff / 1000);
	const d = Math.floor(s / 86400);
	const h = Math.floor(s % 86400 / 3600);
	const m = Math.floor(s % 3600 / 60);
	ageEl.textContent = '🎈 Sudah hidup ' + d.toLocaleString('id-ID') + ' hari ' + h + ' jam ' + m + ' menit ' + (s % 60) + ' detik';
}
updateAge();
setInterval(updateAge, 1000);

// ===== Modal =====
function closeModals() {
	document.querySelectorAll('.modal.show').forEach(m => m.classList.remove('show'));
	stopMic();
	stopGame();
}

document.querySelectorAll('[data-modal]').forEach(btn => {
	btn.addEventListener('click', () => {
		closeModals();
		const m = document.getElementById('modal-' + btn.dataset.modal);
		if (btn.dataset.modal === 'cake') resetCake();
		if (btn.dataset.modal === 'game') resetGame();
		if (btn.dataset.modal === 'fortune') resetFortune();
		if (btn.dataset.modal === 'ask') resetAsk();
		m.classList.add('show');
	});
});

document.querySelectorAll('.modal').forEach(m => {
	m.addEventListener('click', e => { if (e.target === m) closeModals(); });
	m.querySelector('.close').addEventListener('click', closeModals);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModals(); });

// ===== Tiup lilin =====
const candles = document.querySelectorAll('.candle');
const hint = document.getElementById('cakeHint');
let micStream = null, micCtx = null, micOn = false;

function resetCake() {
	candles.forEach(c => c.classList.remove('out'));
	hint.textContent = 'Tap lilinnya, atau tiup ke mikrofon 🎤';
}

function checkCake() {
	if ([...candles].every(c => c.classList.contains('out'))) {
		hint.textContent = 'Semoga wish-mu terkabul! 🎉✨';
		stopMic();
		celebrate();
		setTimeout(celebrate, 600);
	}
}

candles.forEach(c => c.addEventListener('click', () => {
	c.classList.add('out');
	checkCake();
}));

function blowAll() {
	candles.forEach((c, i) => setTimeout(() => { c.classList.add('out'); checkCake(); }, i * 250));
}

function stopMic() {
	micOn = false;
	if (micStream) micStream.getTracks().forEach(t => t.stop());
	if (micCtx) micCtx.close();
	micStream = micCtx = null;
}

document.getElementById('micBtn').addEventListener('click', async () => {
	try {
		micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
		micCtx = new (window.AudioContext || window.webkitAudioContext)();
		const analyser = micCtx.createAnalyser();
		analyser.fftSize = 512;
		micCtx.createMediaStreamSource(micStream).connect(analyser);
		const data = new Uint8Array(analyser.fftSize);
		let loud = 0;
		micOn = true;
		hint.textContent = 'Tiup sekarang... 💨';
		(function loop() {
			if (!micOn) return;
			analyser.getByteTimeDomainData(data);
			let max = 0;
			for (const v of data) max = Math.max(max, Math.abs(v - 128));
			loud = max > 60 ? loud + 1 : 0;
			if (loud > 8) { blowAll(); stopMic(); return; }
			requestAnimationFrame(loop);
		})();
	} catch (err) {
		hint.textContent = 'Mikrofon tidak diizinkan, tap lilinnya saja ya 😊';
	}
});

// ===== Game pecahin balon =====
const arena = document.getElementById('arena');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const startBtn = document.getElementById('startGame');
const gameMsg = document.getElementById('gameMsg');
let score = 0, timeLeft = 15, spawnT, countT, playing = false;

function stopGame() {
	playing = false;
	clearInterval(spawnT);
	clearInterval(countT);
}

function resetGame() {
	stopGame();
	score = 0;
	timeLeft = 15;
	scoreEl.textContent = 0;
	timeEl.textContent = 15;
	arena.innerHTML = '';
	gameMsg.textContent = '🎁 nilainya 3 poin!';
	startBtn.textContent = 'Mulai';
	startBtn.style.display = '';
}

function spawnBalloon() {
	const b = document.createElement('span');
	b.className = 'balloon';
	b.textContent = Math.random() < 0.15 ? '🎁' : '🎈';
	b.style.left = Math.random() * 80 + '%';
	b.style.animationDuration = 2.5 + Math.random() * 1.5 + 's';
	b.addEventListener('pointerdown', () => {
		if (!playing || b.dataset.hit) return;
		b.dataset.hit = 1;
		score += b.textContent === '🎁' ? 3 : 1;
		scoreEl.textContent = score;
		b.textContent = '💥';
		setTimeout(() => b.remove(), 200);
	});
	b.addEventListener('animationend', () => b.remove());
	arena.appendChild(b);
}

function endGame() {
	stopGame();
	arena.innerHTML = '';
	startBtn.textContent = 'Main lagi';
	startBtn.style.display = '';
	if (score >= 20) { gameMsg.textContent = 'Jujur gabut, ' + score + ' poin.'; celebrate(); }
	else if (score >= 10) { gameMsg.textContent = score + ' Gabut yah.'; }
	else { gameMsg.textContent = score + ' Cupu dekssss 😜'; }
}

startBtn.addEventListener('click', () => {
	resetGame();
	playing = true;
	startBtn.style.display = 'none';
	gameMsg.textContent = 'Tap balonnya cepat!';
	spawnBalloon();
	spawnT = setInterval(spawnBalloon, 450);
	countT = setInterval(() => {
		timeEl.textContent = --timeLeft;
		if (timeLeft <= 0) endGame();
	}, 1000);
});

// ===== Ramalan (bola kristal) =====
const crystal = document.getElementById('crystal');
const fortuneText = document.getElementById('fortuneText');
let lastFortune = -1, fortuneBusy = false;

function resetFortune() {
	fortuneBusy = false;
	crystal.classList.remove('shake');
	fortuneText.classList.remove('pop');
	fortuneText.textContent = 'Tap bola kristalnya untuk melihat masa depan ✨';
}

crystal.addEventListener('click', () => {
	if (fortuneBusy) return;
	fortuneBusy = true;
	fortuneText.textContent = '🔮 Melihat masa depan...';
	fortuneText.classList.remove('pop');
	crystal.classList.remove('shake');
	void crystal.offsetWidth; // restart animasi
	crystal.classList.add('shake');
	setTimeout(() => {
		let i;
		do { i = Math.floor(Math.random() * FORTUNES.length); } while (i === lastFortune);
		lastFortune = i;
		fortuneText.textContent = FORTUNES[i];
		fortuneText.classList.add('pop');
		fortuneBusy = false;
		const r = crystal.getBoundingClientRect();
		burst(r.left + r.width / 2, r.top + r.height / 2, 30, 90, 160, 10);
	}, 800);
});

// ===== Tombol yang kabur =====
const runbox = document.getElementById('runbox');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const askMsg = document.getElementById('askMsg');
let escapes = 0;

function resetAsk() {
	escapes = 0;
	yesBtn.style.transform = '';
	yesBtn.style.display = '';
	noBtn.style.display = '';
	noBtn.style.left = '62%';
	noBtn.style.top = '50px';
	askMsg.textContent = 'Pilih dengan bijak...';
}

function runAway(e) {
	if (e) e.preventDefault();
	const maxX = runbox.clientWidth - noBtn.offsetWidth - 4;
	const maxY = runbox.clientHeight - noBtn.offsetHeight - 4;
	const yesCx = yesBtn.offsetLeft + yesBtn.offsetWidth / 2;
	const yesCy = yesBtn.offsetTop + yesBtn.offsetHeight / 2;
	let x, y, tries = 0;
	do {
		x = 4 + Math.random() * Math.max(maxX, 0);
		y = 4 + Math.random() * Math.max(maxY, 0);
		tries++;
	} while (tries < 12 && Math.hypot(x - yesCx, y - yesCy) < 90);
	noBtn.style.left = x + 'px';
	noBtn.style.top = y + 'px';
	escapes++;
	yesBtn.style.transform = 'scale(' + Math.min(1 + escapes * 0.12, 1.8) + ')';
	askMsg.textContent = TAUNTS[(escapes - 1) % TAUNTS.length];
}

noBtn.addEventListener('pointerenter', runAway);
noBtn.addEventListener('pointerdown', runAway);
noBtn.addEventListener('click', runAway);

yesBtn.addEventListener('click', () => {
	noBtn.style.display = 'none';
	yesBtn.style.display = 'none';
	askMsg.textContent = 'Aseeeek Es krim wkwkwk';
	celebrate();
});