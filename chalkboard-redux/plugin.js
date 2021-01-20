//
// chalkboard-redux: chalkboard, but better.
//

const selectorTempl = `
<style>
#selector {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	font-size: 13px;
	background-color: rgba(255, 255, 255, 0.7);
	text-align: center;
	z-index: 1001; // reveal's .overlay has a z-index of 1000
}
</style>

<div id="selector">
<label for="black">Black</label>
<input type="radio" name="pen" id="black" value="black">
<label for="black">Red</label>
<input type="radio" name="pen" id="red" value="red">
<label for="black">Green</label>
<input type="radio" name="pen" id="green" value="green">
<label for="erase">Erase</label>
<input type="radio" name="pen" id="erase" value="erase">
</div>
`;

window.ChalkboardRedux = function() {
	// returns a board that is visible but not-interactable
	function getBoard(width, height, toggleVisibility) {
		const container = document.createElement('div');

		container.classList.add('overlay');
		container.style.background = 'none';
		container.style.pointerEvents = 'none';

		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;

		const graphics = canvas.getContext('2d');

		let draw = false;
		let on = false;
		let pos = {};
		let colour = '#000000';

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
			graphics.lineCap = 'round';
			graphics.strokeStyle = colour;

			graphics.moveTo(pos.x, pos.y);
			graphics.lineTo(next.x, next.y);

			graphics.stroke();

			pos = next;
		});

		container.appendChild(canvas);

		function hide() {
			container.style.visibility = 'hidden';
		}

		function show() {
			container.style.visibility = 'visible';
		}

		return {
			container,
			graphics,

			hide,
			show,

			isOn: () => on,
			setOn: (to) => {
				on = to;

				if (to) {
					container.style.pointerEvents = 'auto';
				} else {
					container.style.pointerEvents = 'none';
				}
			},

			setColour: (c) => colour = c,

			clear: () => {
				graphics.clearRect(0, 0, width, height);
			}
		};
	}

	return {
		id: 'ChalkboardRedux',
		init: (deck) => {
			let revealElement = deck.getRevealElement();
			let toolbar = document.createElement('div');
			toolbar.style.visibility = 'hidden';
			toolbar.innerHTML = selectorTempl;

			let { width, height } = deck.getComputedSlideSize();

			let notesBoard = getBoard(width, height);
			revealElement.appendChild(notesBoard.container);

			let blackboardBoard = getBoard(width, height, true);
			blackboardBoard.container.style.background = 'black';
			blackboardBoard.setColour('white');
			blackboardBoard.hide();

			// toggle notes on pressing 'b'
			deck.addKeyBinding(66, () => {
				if (blackboardBoard.isOn()) {
					return;
				}

				let to = !notesBoard.isOn();

				if (to) {
					toolbar.style.visibility = 'visible';
				} else {
					toolbar.style.visibility = 'hidden';
				}

				notesBoard.setOn(!notesBoard.isOn());
			});

			// toggle chalkboard on pressing 'c'
			deck.addKeyBinding(67, () => {
				let to = !blackboardBoard.isOn();

				if (to) {
					blackboardBoard.show();
					toolbar.style.visibility = 'visible';
				} else {
					blackboardBoard.hide();

					if (!notesBoard.isOn()) {
						toolbar.style.visibility = 'hidden';
					}
				}

				blackboardBoard.setOn(to);
			});

			revealElement.appendChild(blackboardBoard.container);

			// clear image
			deck.addKeyBinding(46, () => {
				if (blackboardBoard.isOn()) {
					blackboardBoard.clear();

					return;
				}

				notesBoard.clear();
			});

			revealElement.appendChild(toolbar);
		},
	};
};
