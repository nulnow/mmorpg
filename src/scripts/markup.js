/** @type HTMLCanvasElement */
const canvas = document.getElementById("canvas");

function clearToolsButtonSelection() {
    document.querySelectorAll('.tools__button').forEach(elem => elem.classList.remove('selected'));
}

function showToast(content) {
    const toast = document.createElement('div');
    toast.classList.add('system-toast');
    toast.innerHTML = content;
    document.body.appendChild(toast);

    toast.addEventListener("animationend", async (event) => {
        const sleep = ms => new Promise(r => setTimeout(r, ms));
        await sleep(500);

        toast.style.animation = 'loadeventReverse ease-in-out .55s';

        toast.addEventListener("animationend", (event) => {
            document.body.removeChild(toast);
        });
    });
}

class EditorState {
    constructor(fsm) {
        this.fsm = fsm;
    }

    onEnter(prevState) {}

    onExit(nextState) {}

    draw(context) {}
}

class EditorPointState extends EditorState {
    mouseupHandler = event => {
        const rect = canvas.getBoundingClientRect();
        const {clientX, clientY} = event;
        const x = clientX - rect.x;
        const y = clientY - rect.y;
        const point = {
            x: x,
            y: y,
        };
        this.fsm.getEditor().addPoint(point);
    };

    onEnter(prevState) {
        document.querySelector('[data-key="KeyA"]').classList.add('selected');
        canvas.addEventListener('mouseup', this.mouseupHandler);
    }

    onExit() {
        document.querySelector('[data-key="KeyA"]').classList.remove('selected');
        canvas.removeEventListener('mouseup', this.mouseupHandler);
    }

    draw(context) {

    }
}

class EditorRectangleState extends EditorState {
    static strokeRectangle(context, point1, point2, strokeStyle = 'rgb(255,255,255)') {
        const topLeftX = Math.min(point1.x, point2.x);
        const topLeftY = Math.min(point1.y, point2.y);

        const width = Math.abs(point1.x - point2.x);
        const height = Math.abs(point1.y - point2.y);

        context.save();
        context.strokeStyle = strokeStyle;
        context.beginPath();
        context.rect(topLeftX, topLeftY, width, height);
        context.closePath();
        context.stroke();
        context.restore();
    }

    mousedownHandler = event => {
        const rect = canvas.getBoundingClientRect();
        const {clientX, clientY} = event;
        const x = clientX - rect.x;
        const y = clientY - rect.y;

        this.point1 = {x, y};
    };

    mousemoveHandler = event => {
        const rect = canvas.getBoundingClientRect();
        const {clientX, clientY} = event;
        const x = clientX - rect.x;
        const y = clientY - rect.y;
        this.point2 = {x, y};
    };

    mouseupHandler = event => {
        const rect = canvas.getBoundingClientRect();
        const {clientX, clientY} = event;
        const x = clientX - rect.x;
        const y = clientY - rect.y;

        this.point2 = {x, y};
        const box = [
            this.point1,
            this.point2,
        ];
        this.fsm.getEditor().addBox(box);
        this.reset();
    };

    point1 = null;
    point2 = null;

    onEnter(prevState) {
        this.reset();
        document.querySelector('[data-key="KeyR"]').classList.add('selected');
        canvas.addEventListener('mousedown', this.mousedownHandler);
        canvas.addEventListener('mousemove', this.mousemoveHandler);
        canvas.addEventListener('mouseup', this.mouseupHandler);
    }

    onExit(prevState) {
        this.reset();
        document.querySelector('[data-key="KeyR"]').classList.remove('selected');
        canvas.removeEventListener('mousedown', this.mousedownHandler);
        canvas.removeEventListener('mousemove', this.mousemoveHandler);
        canvas.removeEventListener('mouseup', this.mouseupHandler);
    }

    draw(context) {
        if (this.point1 && this.point2) {
            EditorRectangleState.strokeRectangle(context, this.point1, this.point2)
        }
    }

    reset() {
        this.point1 = null;
        this.point2 = null;
    }
}

class EditorExportModalState extends EditorState {
    escapeHandler = () => {};
    modal = null;

    onEnter(prevState) {
        document.querySelector('[data-key="KeyE"]').classList.add('selected');

        // OPEN EXPORT MODAL
        disableScroll();
        const modal = document.createElement('div');
        this.modal = modal;
        modal.classList.add('system-modal');

        const buttonClose = document.createElement('button');
        buttonClose.classList.add('system-modal__button-close');
        buttonClose.innerText = 'x';
        modal.appendChild(buttonClose);

        const grid = document.createElement('div');
        modal.appendChild(grid);

        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = '1fr 1fr';
        grid.style.gridTemplateRows = '1fr';

        const left = document.createElement('div');
        grid.appendChild(left);

        const right = document.createElement('div');
        grid.appendChild(right);

        const points = this.fsm.getEditor().getPoints();
        const boxes = this.fsm.getEditor().getBoxes();

        left.innerHTML += `<h1>POINTS:</h1><button class="primary-button" id="copyPointsButton">COPY</button>`;
        left.innerHTML += `<pre>${JSON.stringify(points, null, 4)}</pre>`;

        right.innerHTML += `<h1>BOXES:</h1><button class="primary-button" id="copyBoxesButton">COPY</button>`;
        right.innerHTML += `<pre>${JSON.stringify(boxes, null, 4)}</pre>`;

        modal.style.animation = 'loadevent ease-in-out .55s';
        document.body.appendChild(modal);

        document.getElementById('copyPointsButton').onclick = () => {
            navigator.clipboard.writeText(JSON.stringify(points, null, 4));
            showToast('Done!');
        };
        document.getElementById('copyBoxesButton').onclick = () => {
            navigator.clipboard.writeText(JSON.stringify(boxes, null, 4));
            showToast('Done!');
        };

        this.escapeHandler = (event) => {
            if (event.key === "Escape") {
                modal.style.animation = 'loadeventReverse ease-in-out .55s';
                modal.addEventListener('animationend', () => {
                    this.fsm.setState(this.fsm.editorDefaultState);
                });
            }
        };
        document.addEventListener('keydown', this.escapeHandler);

        buttonClose.onclick = () => {
            modal.style.animation = 'loadeventReverse ease-in-out .55s';
            modal.addEventListener('animationend', () => {
                this.fsm.setState(this.fsm.editorDefaultState);
            });
        };
    }
    onExit(nextState) {
        document.querySelector('[data-key="KeyE"]').classList.remove('selected');
        enableScroll();
        document.body.removeChild(this.modal);
        document.removeEventListener('keydown', this.escapeHandler);
    }
    draw(context) {

    }
}

class EditorDefaultState extends EditorState {}

class EditorStateMachine {
    editor = null;
    editorPointState = new EditorPointState(this);
    editorRectangleState = new EditorRectangleState(this);
    editorExportModalState = new EditorExportModalState(this);
    editorDefaultState = new EditorDefaultState(this);

    constructor(editor) {
        this.editor = editor;
        this.setState(this.editorDefaultState);
    }

    getEditor() {
        return this.editor;
    }

    getCurrentState() {
        return this.currentState;
    }

    setState(newState) {
        if (newState === this.currentState) {
            return;
        }

        if (this.currentState) {
            this.currentState.onExit(newState);
        }

        const prevState = this.currentState;
        this.currentState = newState;
        this.currentState.onEnter(prevState);
    }
}

class Editor {
    stateMachine = new EditorStateMachine(this);
    points = [];
    boxes = [];
    history = [];

    init() {
        document.addEventListener('keydown', event => {
            this.sendKeyCode(event.code);

            if ((event.ctrlKey || event.metaKey) && event.code === 'KeyZ') {
                this.historyBack();
            }
        });
    }

    getCurrentState() {
        return this.stateMachine.getCurrentState();
    }

    getPoints() {
        return this.points;
    }

    addPoint(point) {
        this.points.push(point);
        this.history.push({
            type: 'ADD_POINT',
            payload: point,
        });
    }

    removePoint(point) {
        this.points = this.points.filter(p => p !== point);
        this.history.push({
            type: 'REMOVE_POINT',
            payload: point,
        });
    }

    getBoxes() {
        return this.boxes;
    }

    addBox(box) {
        this.boxes.push(box);
        this.history.push({
            type: 'ADD_BOX',
            payload: box,
        });
    }

    removeBox(box) {
        this.boxes = this.boxes.filter(b => b !== box);
        this.history.push({
            type: 'REMOVE_BOX',
            payload: box,
        });
    }

    getHistory() {
        return this.history;
    }

    historyBack() {
        const lastAction = this.history.pop();

        switch (lastAction.type) {
            case 'ADD_POINT': this.points.pop(); break;
            case 'REMOVE_POINT': this.addPoint(lastAction.payload); break;

            case 'ADD_BOX': this.boxes.pop(); break;
            case 'REMOVE_BOX': this.addBox(lastAction.payload); break;
        }
    }

    sendKeyCode(code) {
        if (code === 'KeyA') {
            this.stateMachine.setState(this.stateMachine.editorPointState);
        }

        if (code === 'KeyR') {
            this.stateMachine.setState(this.stateMachine.editorRectangleState);
        }

        if (code === 'KeyT') {
            document.getElementById('tools').classList.toggle('hidden');
        }

        if (code === 'KeyE') {
            this.stateMachine.setState(this.stateMachine.editorExportModalState);
        }
    }
}

const editor = new Editor();
editor.init();

const fileInput = document.getElementById("fileInput");

fileInput.addEventListener("change", (event) => {
    const files = event.target.files; /* now you can work with the file list */

    const file = files[0];
    if (!file.type.startsWith("image/")) {
        return;
    }

    const src = URL.createObjectURL(file);

    const image = new Image();

    image.src = src;
    image.onerror = (error) => {
        console.error(error);
        alert("ERROR");
    };
    image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        console.log(image.width);
        console.log(image.height);

        const context = canvas.getContext('2d');

        function draw() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0, image.width, image.height);

            const points = editor.getPoints();
            for (const point of points) {
                context.save();
                context.beginPath();
                context.fillStyle = 'rgba(255,204,0,0.71)'
                context.arc(point.x - 2, point.y - 2, 4, 0, 2 * Math.PI);
                context.fill();
                context.closePath();
                context.restore();
            }

            const boxes = editor.getBoxes();
            for (const box of boxes) {
                const point1 = box[0];
                const point2 = box[1];

                EditorRectangleState.strokeRectangle(context, point1, point2, 'rgba(255,255,255,0.55)')
            }

            editor.getCurrentState().draw(context);

            setTimeout(() => {
                requestAnimationFrame(draw);
            }, 1000 / 25)
        }

        draw();
    };
});

