//
// chalkboard-redux: chalkboard, but better.
//

window.ChalkboardRedux = function() {
	let data = {
		notesBoard: null,
		chalkboardBoard: null,
	};

	function getBoard(width, height) {
		let container = document.createElement('div');

		container.classList.add('overlay');
		container.style.background = 'none';

		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;

		const graphics = canvas.getContext('2d');
		graphics.fillStyle = 'green';
		graphics.fillRect(0, 0, 100, 100);

		let draw = false;
		let on = false;
		let pos = {};

		canvas.addEventListener('mousedown', (event) => {
			draw = true;

			pos = {
				x: event.clientX,
				y: event.clientY,
			};
		});

		canvas.addEventListener('mouseup', () => {
			draw = false;
		});

		canvas.addEventListener('mousemove', () => {
			if (!draw) {
				return;
			}

			let next = {
				x: event.clientX,
				y: event.clientY,
			};

			graphics.beginPath();
			graphics.lineWidth = 5;
			graphics.strokeStyle = 'black';

			graphics.moveTo(pos.x, pos.y);
			graphics.lineTo(next.x, next.y);

			graphics.stroke();

			pos = next;
		});


		container.appendChild(canvas);

		return {
			container,
			graphics,

			toggle: () => {
				if (on) {
					// turn off
					container.style.pointerEvents = 'none';
				} else {
					// turn on
					container.style.pointerEvents = 'auto';
				}

				on = !on;
			},
			clear: () => {
				console.log('clear');
				graphics.clearRect(0, 0, width, height);
			}
		};
	}

	return {
		id: 'ChalkboardRedux',
		init: (deck) => {
			let { width, height } = deck.getComputedSlideSize();
			let revealElement = deck.getRevealElement();

			let notesBoard = getBoard(width, height);

			notesBoard.container.style.pointerEvents = 'none';
			notesBoard.on = false;

			revealElement.appendChild(notesBoard.container);

			// toggle notes on pressing 'b'
			deck.addKeyBinding(66, notesBoard.toggle);

			// clear image
			deck.addKeyBinding(46, notesBoard.clear);
		},
	};
};
