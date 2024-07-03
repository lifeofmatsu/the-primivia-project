/** Detect attack (damageBox) and p2 (hitBox) collision
 * a. Right edge of 1P's damageBox is not to the left of 2P's hitBox.
 * b. Left edge of 1P's damageBox is not to the right of 2P's hitBox.
 * c. Bottom edge of 1P's damageBox is not above 2P's hitBox.
 * d. Top edge of 1P's damageBox is not below 2P's hitBox.
 */
export const rectangularCollision = ({ rect1P, rect2P }) => {
	return (
		rect1P.damageBox.position.x + rect1P.damageBox.width >= rect2P.position.x &&
		rect1P.damageBox.position.x <= rect2P.position.x + rect2P.width &&
		rect1P.damageBox.position.y + rect1P.damageBox.height >= rect2P.position.y &&
		rect1P.damageBox.position.y <= rect2P.position.y + rect2P.height
	);
};

// Declare fight match winner
export const setWinner = ({ p1, p2, timerVal }) => {
	cancelTimeout(timerVal);
	document.querySelector('#textDisplay').style.display = 'flex';

	if (p1.health === p2.health) {
		document.querySelector('#textDisplay').innerHTML = 'Tie';
	} else if (p1.health > p2.health) {
		document.querySelector('#textDisplay').innerHTML = 'Player 1 Wins';
	} else if (p1.health < p2.health) {
		document.querySelector('#textDisplay').innerHTML = 'Player 2 Wins';
	}
}

// Countdown fight clock-match timer
export const runMatchTimer = (timer, timerVal) => {
	if (timer > 0) {
		timerVal = setTimeout(runMatchTimer, 1000);
		timer--;
		document.querySelector('#matchClock').innerHTML = timer;
	}

	if (timer === 0) {
		setWinner({ p1, p2, timerVal });
	}
}