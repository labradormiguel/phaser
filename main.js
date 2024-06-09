const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let npc;
let movingTween;
const speed = 200; // Velocidad constante en píxeles por segundo
const jumpHeight = 20; // Altura de cada salto
const jumpDuration = 200; // Duración de cada salto en milisegundos

let currentMode = 'moveToClick'; // Modo inicial

function preload() {
    this.load.image('npc', 'img/cabracho.png');
    this.load.image('background', 'img/fondo.jpeg'); // Carga la imagen de fondo
}

function create() {
    const scene = this; // Guardar la referencia a la escena

    // Agrega la imagen de fondo
    this.add.image(400, 300, 'background').setOrigin(0.5, 0.5).setDisplaySize(800, 600);

    npc = this.physics.add.sprite(100, 500, 'npc'); // Colocamos el NPC cerca de la parte inferior de la pantalla
    npc.setCollideWorldBounds(true);

    // Evento de clic/táctil
    this.input.on('pointerdown', function (pointer) {
        if (currentMode === 'moveToClick') {
            moveToPointer(scene, pointer);
        }
    });

    // Configurar los botones
    document.getElementById('moveToClick').addEventListener('click', function () {
        currentMode = 'moveToClick';
        console.log("Mode changed to: Move to Click");
        if (movingTween) movingTween.stop(); // Detener cualquier movimiento previo
    });

    document.getElementById('bounceLeftRight').addEventListener('click', function () {
        currentMode = 'bounceLeftRight';
        console.log("Mode changed to: Bounce Left-Right");
        startBounceLeftRight(scene);
    });
}

function moveToPointer(scene, pointer) {
    console.log("Moving to pointer at:", pointer.x, pointer.y);
    // Si ya hay una animación en curso, detenerla
    if (movingTween) {
        movingTween.stop();
    }

    // Calcular la distancia a la posición de destino
    const distance = Phaser.Math.Distance.Between(npc.x, npc.y, pointer.x, pointer.y);
    // Calcular la duración basada en la velocidad constante
    const duration = (distance / speed) * 1000; // Convertir a milisegundos

    // Calcular el número de saltos necesarios
    const numJumps = Math.ceil(duration / jumpDuration);

    // Crear una nueva animación para mover el NPC a la posición del clic/táctil
    movingTween = scene.tweens.add({
        targets: npc,
        x: pointer.x,
        y: pointer.y,
        duration: duration,
        ease: 'Linear',
        onUpdate: function (tween, target) {
            const progress = tween.progress;
            const jumpProgress = progress * numJumps % 1;
            if (jumpProgress < 0.5) {
                target.y -= jumpHeight * (0.5 - jumpProgress) * 2;
            } else {
                target.y += jumpHeight * (jumpProgress - 0.5) * 2;
            }
        },
        onComplete: function () {
            npc.y = pointer.y; // Asegurarse de que el NPC termine exactamente en la posición de destino
        }
    });
}

function startBounceLeftRight(scene) {
    if (movingTween) {
        movingTween.stop();
    }

    const bounceDuration = 2000; // Duración de cada rebote (de un lado al otro)

    movingTween = scene.tweens.timeline({
        targets: npc,
        loop: -1,
        tweens: [
            {
                x: 700,
                duration: bounceDuration,
                ease: 'Linear',
                onUpdate: function (tween, target) {
                    const progress = tween.progress;
                    const jumpProgress = progress * (bounceDuration / jumpDuration) % 1;
                    if (jumpProgress < 0.5) {
                        target.y -= jumpHeight * (0.5 - jumpProgress) * 2;
                    } else {
                        target.y += jumpHeight * (jumpProgress - 0.5) * 2;
                    }
                }
            },
            {
                x: 100,
                duration: bounceDuration,
                ease: 'Linear',
                onUpdate: function (tween, target) {
                    const progress = tween.progress;
                    const jumpProgress = progress * (bounceDuration / jumpDuration) % 1;
                    if (jumpProgress < 0.5) {
                        target.y -= jumpHeight * (0.5 - jumpProgress) * 2;
                    } else {
                        target.y += jumpHeight * (jumpProgress - 0.5) * 2;
                    }
                }
            }
        ]
    });
}

function update() {
    // Aquí puedes agregar lógica adicional si lo necesitas.
}
