//
// chalkboard-redux: chalkboard, but better.
//

const selectorTempl = (defaultPen) => {
	let out = `
<style>
.selector {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	font-size: 13px;
	background-color: rgba(255, 255, 255, 0.7);
	text-align: center;
	z-index: 1001; // reveal's .overlay has a z-index of 1000
}
</style>`;

	let pens = [defaultPen, 'red', 'green', 'erase'];

	let penForm = pens.map(name => {
		let selected = name === defaultPen ? "checked" : "";

		return `<label for="${name}-${selectorCount}">${name}</label> \n` +
			`<input type="radio" name="pen-${selectorCount}" id="${name}-${selectorCount}" value="${name}" ${selected}>`;
	}).join('\n');

	out += `<div class="selector"` + penForm + `</div>`;

	selectorCount += 1;

	return out;
};

let selectorCount = 0;

window.ChalkboardRedux = function() {
	function getBoard(width, height, defaultPen) {
		const container = document.createElement('div');

		container.classList.add('overlay');
		container.style.background = 'none';
		container.style.pointerEvents = 'none';

		let toolbar = document.createElement('div');
		toolbar.style.visibility = 'hidden';
		toolbar.innerHTML = selectorTempl(defaultPen);

		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;

		const graphics = canvas.getContext('2d');

		let draw = false;
		let on = false;
		let pos = {};
		let colour = defaultPen;

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

			if (colour == 'erase') {
				let eraserSize = 40;

				graphics.clearRect(
					next.x-eraserSize/2,
					next.y-eraserSize/2,
					eraserSize,
					eraserSize
				);
			} else {
				graphics.beginPath();
				graphics.lineWidth = 5;
				graphics.lineCap = 'round';
				graphics.strokeStyle = colour;

				graphics.moveTo(pos.x, pos.y);
				graphics.lineTo(next.x, next.y);

				graphics.stroke();
			}

			pos = next;
		});

		toolbar.addEventListener('change', (e) => {
			colour = e.target.value;
		});

		container.appendChild(canvas);
		container.appendChild(toolbar);

		function hide() {
			container.style.visibility = 'hidden';
		}

		function show() {
			container.style.visibility = 'visible';
		}

		return {
			container,
			graphics,
			toolbar,

			hide,
			show,

			isEditable: () => on,

			setEditable: (to) => {
				on = to;

				if (to) {
					container.style.pointerEvents = 'auto';
					toolbar.style.visibility = 'visible';
				} else {
					container.style.pointerEvents = 'none';
					toolbar.style.visibility = 'hidden';
				}
			},

			clear: () => {
				graphics.clearRect(0, 0, width, height);
			}
		};
	}

	return {
		id: 'ChalkboardRedux',
		init: (deck) => {
			let revealElement = deck.getRevealElement();

			let { width, height } = deck.getComputedSlideSize();

			let notesBoard = getBoard(width, height, 'black');
			revealElement.appendChild(notesBoard.container);

			let blackboardBoard = getBoard(width, height, 'white');
			blackboardBoard.container.style.background = 'black';
			blackboardBoard.hide();

			revealElement.appendChild(blackboardBoard.container);

			deck.addKeyBinding(66, () => {
				if (blackboardBoard.isEditable()) {
					return;
				}

				notesBoard.setEditable(!notesBoard.isEditable());
			});

			// toggle chalkboard on pressing 'c'
			deck.addKeyBinding(67, () => {
				let to = !blackboardBoard.isEditable();

				if (to) {
					blackboardBoard.show();
					blackboardBoard.setEditable(true);
				} else {
					blackboardBoard.hide();

					blackboardBoard.setEditable(false);
				}
			});

			// clear image
			deck.addKeyBinding(46, () => {
				if (blackboardBoard.isEditable()) {
					blackboardBoard.clear();

					return;
				}

				notesBoard.clear();
			});
		},
	};
};
