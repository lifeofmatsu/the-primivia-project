import { rectangularCollision, setWinner, runMatchTimer } from './utils/helpers.js';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

// Sprites
class Sprite {
	constructor({ position, velocity, offset, color = '#005d5d' }) {
		this.position = position;
		this.velocity = velocity;
		this.width = 50;
		this.height = 150;
		this.recentKey;
		this.damageBox = {
			position: {
				x: this.position.x,
				y: this.position.y
			},
			offset, // eqv. of `offset = offset`
			width: 100,
			height: 50
		};
		this.color = color;
		this.isAttacking;
		this.health = 100;
	}

	draw() {
		c.fillStyle = this.color;
		c.fillRect(this.position.x, this.position.y, this.width, this.height);

		if (this.isAttacking) {
			c.fillStyle = '#a2191f';
			c.fillRect(
				this.damageBox.position.x,
				this.damageBox.position.y,
				this.damageBox.width,
				this.damageBox.height
			);
		}
	}

	update() {
		this.draw();
		this.damageBox.position.x = this.position.x + this.damageBox.offset.x;
		this.damageBox.position.y = this.position.y;

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		if (this.position.y + this.height + this.velocity.y >= canvas.height) {
			this.velocity.y = 0;
		} else {
			this.velocity.y += gravity;
		}
	}

	attack() {
		this.isAttacking = true;
		setTimeout(() => {
			this.isAttacking = false;
		}, 100);
	}
}

// Instantiate Player 1 (P1)
const p1 = new Sprite({
	position: { x: 0, y: 0 },
	velocity: { x: 0, y: 0 },
	offset: { x: 0, y: 0 }
});
p1.draw();
console.log(p1);

// Instantiate Player 2 (P2)
const p2 = new Sprite({
	position: { x: 400, y: 100 },
	velocity: { x: 0, y: 0 },
	offset: { x: -50, y: 0 },
	color: '#a2191f'
});

p2.draw();
console.log(p2);

// Game inputs
const keys = {
	a: { pressed: false },
	d: { pressed: false },
	w: { pressed: false },
	ArrowRight: { pressed: false },
	ArrowLeft: { pressed: false }
};


// Begin match timer
let timer = 60;
let timerVal;

runMatchTimer(timer, timerVal);


// Render
const animate = () => {
	window.requestAnimationFrame(animate);
	c.fillStyle = '#000';
	c.fillRect(0, 0, canvas.width, canvas.height);

	p1.update();
	p2.update();

	p1.velocity.x = 0;
	p2.velocity.x = 0;

	// p1 movement
	if (keys.a.pressed && p1.recentKey === 'a') {
		p1.velocity.x = -5;
	} else if (keys.d.pressed && p1.recentKey === 'd') {
		p1.velocity.x = 5;
	}

	// p2 movement
	if (keys.ArrowLeft.pressed && p2.recentKey === 'ArrowLeft') {
		p2.velocity.x = -5;
	} else if (keys.ArrowRight.pressed && p2.recentKey === 'ArrowRight') {
		p2.velocity.x = 5;
	}

	// detect collision (p1 hits p2)
	if (rectangularCollision({ rect1P: p1, rect2P: p2 }) && p1.isAttacking) {
		p1.isAttacking = false;
		p2.health -= 10;
		document.querySelector('#unusedP2HP').style.width = p2.health + '%';
	}

	// detect collision (p2 hits p1)
	if (rectangularCollision({ rect1P: p2, rect2P: p1 }) && p2.isAttacking) {
		p2.isAttacking = false;
		p1.health -= 10;
		document.querySelector('#unusedP1HP').style.width = p1.health + '%';
	}

	// game end determined by health (rather than clock)
	if (p2.health <= 0 || p1.health <= 0) {
		setWinner({ p1, p2, timerVal });
	}
};
// Instantiate Player 1 (P1)
animate();

// Event listeners
window.addEventListener('keydown', (e) => {
	switch (e.key) {
		// p1 input active
		case 'd':
			keys.d.pressed = true;
			p1.recentKey = 'd';
			break;
		case 'a':
			keys.a.pressed = true;
			p1.recentKey = 'a';
			break;
		case 'w':
			p1.velocity.y = -18.5;
			break;
		case ' ':
			p1.attack();
			break;

		// p2 input active
		case 'ArrowRight':
			keys.ArrowRight.pressed = true;
			p2.recentKey = 'ArrowRight';
			break;
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = true;
			p2.recentKey = 'ArrowLeft';
			break;
		case 'ArrowUp':
			p2.velocity.y = -18.5;
			break;
		case 'ArrowDown':
			p2.isAttacking = true;
	}
});

window.addEventListener('keyup', (e) => {
	// p1 input inactive
	switch (e.key) {
		case 'd':
			keys.d.pressed = false;
			break;
		case 'a':
			keys.a.pressed = false;
			break;
	}

	// p2 input inactive
	switch (e.key) {
		case 'ArrowRight':
			keys.ArrowRight.pressed = false;
			break;
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false;
			break;
	}
});
