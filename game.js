const screen = document.getElementById("screen");

const dialogue = document.getElementById("dialogue");
const speaker = document.getElementById("speaker");
const dialogueText = document.getElementById("dialogueText");
const nextButton = document.getElementById("nextButton");

const chapter = document.getElementById("chapter");
const memoriesCounter = document.getElementById("memories");
const notification = document.getElementById("notification");


/* =========================================================
   GUARDADO
========================================================= */

const SAVE_KEY = "1205_puzzle_v2";

let state = JSON.parse(
    localStorage.getItem(SAVE_KEY)
) || {

    memories: [],

    photoSeen: false,
    notebookSolved: false,
    computerSolved: false,
    clockSolved: false,

    finished: false
};


/* =========================================================
   GUARDADO
========================================================= */

function saveGame() {

    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(state)
    );

}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    memoriesCounter.textContent =
        `MEMORIAS ${state.memories.length}/4`;

}


function setChapter(text) {

    chapter.textContent = text;

}


/* =========================================================
   NOTIFICACIÓN
========================================================= */

function showNotification(text) {

    notification.textContent = text;

    notification.classList.add("show");

    setTimeout(() => {

        notification.classList.remove("show");

    }, 2500);

}


/* =========================================================
   DIÁLOGOS
========================================================= */

function showDialogue(
    speakerName,
    text,
    callback = null
) {

    speaker.textContent = speakerName;

    dialogueText.textContent = text;

    dialogue.classList.remove("hidden");

    nextButton.onclick = () => {

        dialogue.classList.add("hidden");

        if (callback) {

            callback();

        }

    };

}


/* =========================================================
   TÍTULO
========================================================= */

function titleScreen() {

    setChapter("INICIO");

    updateHUD();

    screen.innerHTML = `

        <div class="titleScreen">

            <h1>12:05</h1>

            <div class="subtitle">
                NUESTRA PARTIDA
            </div>

            <div class="titleButtons">

                <button
                    class="pixelButton"
                    onclick="newGame()">
                    NUEVA PARTIDA
                </button>

                <button
                    class="pixelButton"
                    onclick="continueGame()">
                    CONTINUAR
                </button>

                <button
                    class="pixelButton dangerButton"
                    onclick="deleteSave()">
                    BORRAR PARTIDA
                </button>

            </div>

        </div>

    `;

}


/* =========================================================
   NUEVA PARTIDA
========================================================= */

function newGame() {

    state = {

        memories: [],

        photoSeen: false,
        notebookSolved: false,
        computerSolved: false,
        clockSolved: false,

        finished: false

    };

    saveGame();

    introduction();

}


/* =========================================================
   CONTINUAR
========================================================= */

function continueGame() {

    if (state.finished) {

        finalMessage();

        return;

    }

    introduction(true);

}


/* =========================================================
   BORRAR PARTIDA
========================================================= */

function deleteSave() {

    localStorage.removeItem(SAVE_KEY);

    state = {

        memories: [],

        photoSeen: false,
        notebookSolved: false,
        computerSolved: false,
        clockSolved: false,

        finished: false

    };

    updateHUD();

    showNotification("PARTIDA BORRADA");

    titleScreen();

}


/* =========================================================
   INTRODUCCIÓN
========================================================= */

function introduction(isContinue = false) {

    setChapter("PRÓLOGO");

    updateHUD();

    screen.innerHTML = `

        <div class="center">

            <div class="stars">
                · · ·
            </div>

            <h2>${isContinue ? "CONTINUAR" : "DESPERTAR"}</h2>

            <p>
                ${isContinue
                    ? "La habitación sigue exactamente donde la dejaste."
                    : "Abres los ojos."
                }
            </p>

            <p>
                Todo está oscuro.
            </p>

            <p>
                Hay una habitación que no recuerdas haber visto antes.
            </p>

            <button
                class="pixelButton"
                onclick="room()">

                EXPLORAR

            </button>

        </div>

    `;

}


/* =========================================================
   HABITACIÓN
========================================================= */

function room() {

    setChapter("HABITACIÓN");

    updateHUD();

    const photoClass =
        state.photoSeen ? "completed" : "";

    const notebookClass =
        state.notebookSolved ? "completed" :
        !state.photoSeen ? "locked" : "";

    const computerClass =
        state.computerSolved ? "completed" :
        !state.notebookSolved ? "locked" : "";

    const clockClass =
        state.clockSolved ? "completed" :
        !state.computerSolved ? "locked" : "";

    const doorClass =
        state.memories.length >= 4 ? "completed" : "locked";


    screen.innerHTML = `

        <div class="room">

            <div class="wall"></div>

            <div class="floor"></div>


            <!-- RELOJ -->

            <div
                id="clock"
                class="object ${clockClass}"
                onclick="inspectClock()">

                <img src="2.jpeg" alt="Reloj" class="objectImage" width="120" height="120">

                <span class="objectLabel">
                    RELOJ
                </span>

            </div>


            <!-- FOTO -->

            <div
                id="photo"
                class="object ${photoClass}"
                onclick="inspectPhoto()">

                <img src="1.jpeg" alt="Fotografía" class="objectImage" width="120" height="120">

                <span class="objectLabel">
                    FOTOGRAFÍA
                </span>

            </div>


            <!-- CUADERNO -->

            <div
                id="notebook"
                class="object ${notebookClass}"
                onclick="inspectNotebook()">

                <img src="3.jpeg" alt="Cuaderno" class="objectImage"width="120" height="120">

                <span class="objectLabel">
                    CUADERNO
                </span>

            </div>


            <!-- COMPUTADORA -->

            <div
                id="computer"
                class="object ${computerClass}"
                onclick="inspectComputer()">

                <img src="5.jpeg" alt="Computadora" class="objectImage" width="120" height="120">

                <span class="objectLabel">
                    COMPUTADORA
                </span>

            </div>


            <!-- PUERTA -->

            <div
                id="door"
                class="object ${doorClass}"
                onclick="inspectDoor()">   

                <img src="4.jpeg" alt="Puerta" class="objectImage" width="120" height="120">

                <span class="objectLabel">
                    PUERTA
                </span>

            </div>


            <div class="roomHint">

                Explora la habitación.<br>
                No todo está listo para ser entendido.

            </div>

        </div>

    `;

}


/* =========================================================
   FOTOGRAFÍA
========================================================= */

function inspectPhoto() {

    if (state.photoSeen) {

        showDialogue(
            "FOTOGRAFÍA",
            "Dos siluetas. Una fecha que todavía no puedes recordar.",
            () => room()
        );

        return;

    }


    state.photoSeen = true;

    addMemory(

        1,

        "Antes de todo lo demás, hubo un primer momento. Uno que parecía pequeño... pero terminó significándolo todo."

    );


    saveGame();

    showNotification("MEMORIA 1/4 ENCONTRADA");


    showDialogue(

        "FOTOGRAFÍA",

        "La imagen está casi completamente dañada.",

        () => {

            showDialogue(

                "FOTOGRAFÍA",

                "Solo puedes distinguir dos personas... y algo escrito detrás.",

                () => {

                    showDialogue(

                        "FOTOGRAFÍA",

                        "«Busca donde las palabras sobreviven cuando nadie habla.»",

                        () => room()

                    );

                }

            );

        }

    );

}


/* =========================================================
   CUADERNO
========================================================= */

function inspectNotebook() {

    if (!state.photoSeen) {

        showDialogue(

            "CUADERNO",

            "No puedes abrirlo. Hay algo que te hace pensar que primero deberías mirar la fotografía.",

            () => room()

        );

        return;

    }


    if (state.notebookSolved) {

        showDialogue(

            "CUADERNO",

            "Ya has leído todas sus páginas. La pista sigue siendo la misma: una máquina, ocho números y una fecha.",

            () => room()

        );

        return;

    }


    state.notebookSolved = true;

    addMemory(

        2,

        "Después llegaron las conversaciones, las bromas y todas esas pequeñas cosas que hicieron que dejaras de ser alguien más."

    );


    saveGame();

    showNotification("MEMORIA 2/4 ENCONTRADA");


    showDialogue(

        "CUADERNO",

        "La primera página dice: «Si encontraste esto, significa que la partida ya comenzó.»",

        () => {

            showDialogue(

                "CUADERNO",

                "En la siguiente página encuentras una frase escrita varias veces:",

                () => {

                    showDialogue(

                        "CUADERNO",

                        "«Una máquina guarda secretos con números.»",

                        () => {

                            showDialogue(

                                "CUADERNO",

                                "«Necesita ocho números. No es cualquier número.»",

                                () => {

                                    showDialogue(

                                        "CUADERNO",

                                        "«Es el día en que nuestra partida comenzó.»",

                                        () => room()

                                    );

                                }

                            );

                        }

                    );

                }

            );

        }

    );

}


/* =========================================================
   COMPUTADORA
========================================================= */

function inspectComputer() {

    if (!state.notebookSolved) {

        showDialogue(

            "COMPUTADORA",

            "La pantalla está encendida, pero no responde. Parece que necesitas encontrar una pista antes.",

            () => room()

        );

        return;

    }


    if (state.computerSolved) {

        showDialogue(

            "COMPUTADORA",

            "ACCESO CONCEDIDO.",

            () => room()

        );

        return;

    }


    setChapter("TERMINAL");

    screen.innerHTML = `

        <div class="center">

            <h2>TERMINAL</h2>

            <p>
                EL SISTEMA REQUIERE UNA CONTRASEÑA.
            </p>

            <p>
                PISTA:
            </p>

            <p>
                El día en que comenzó nuestra partida.
            </p>

            <p>
                FORMATO: DDMMYYYY
            </p>

            <div class="passwordBox">

                <input
                    id="passwordInput"
                    type="text"
                    maxlength="8"
                    placeholder="DDMMYYYY"
                    autocomplete="off"
                >

                <button
                    class="pixelButton"
                    onclick="checkPassword()">

                    INTRODUCIR

                </button>

            </div>

            <br>

            <button
                class="pixelButton smallButton"
                onclick="room()">

                VOLVER

            </button>

        </div>

    `;

    document
        .getElementById("passwordInput")
        .focus();

}


/* =========================================================
   CONTRASEÑA
========================================================= */

function checkPassword() {

    const input =
        document
            .getElementById("passwordInput")
            .value
            .trim();


    if (input === "12052024") {

        state.computerSolved = true;


        addMemory(

            3,

            "También hubo días difíciles. Pero una historia no se mide por no tener problemas, sino por decidir seguir escribiéndola."

        );


        saveGame();

        showNotification("MEMORIA 3/4 ENCONTRADA");


        showDialogue(

            "SISTEMA",

            "CONTRASEÑA CORRECTA.",

            () => {

                showDialogue(

                    "SISTEMA",

                    "La fecha ha sido reconocida.",

                    () => {

                        showDialogue(

                            "SISTEMA",

                            "«Ya tienes el día... pero todavía no tienes la hora.»",

                            () => {

                                showDialogue(

                                    "SISTEMA",

                                    "«Busca el objeto que convierte el tiempo en un testigo.»",

                                    () => room()

                                );

                            }

                        );

                    }

                );

            }

        );

    }

    else {

        showNotification("CONTRASEÑA INCORRECTA");

        showDialogue(

            "SISTEMA",

            "No. Esa fecha no pertenece a nuestra partida.",

            () => {

                const input =
                    document.getElementById("passwordInput");

                if (input) {

                    input.focus();

                }

            }

        );

    }

}


/* =========================================================
   RELOJ
========================================================= */

function inspectClock() {

    if (!state.computerSolved) {

        showDialogue(

            "RELOJ",

            "Las manecillas están quietas en 12:05. Todavía no entiendes por qué esa hora parece importante.",

            () => room()

        );

        return;

    }


    if (state.clockSolved) {

        showDialogue(

            "RELOJ",

            "12:05. Ahora sabes lo que significa.",

            () => room()

        );

        return;

    }


    state.clockSolved = true;


    addMemory(

        4,

        "Y entre todo lo que pasó, quedó algo muy sencillo: todavía te elijo. Una y otra vez."

    );


    saveGame();

    showNotification("MEMORIA 4/4 ENCONTRADA");


    showDialogue(

        "RELOJ",

        "12:05.",

        () => {

            showDialogue(

                "RELOJ",

                "Ahora entiendes por qué esta habitación te parecía familiar.",

                () => {

                    showDialogue(

                        "RELOJ",

                        "«Cuatro recuerdos. Una fecha. Una historia.»",

                        () => {

                            showDialogue(

                                "RELOJ",

                                "«La última barrera ya no necesita una llave. Necesita que recuerdes.»",

                                () => room()

                            );

                        }

                    );

                }

            );

        }

    );

}


/* =========================================================
   PUERTA
========================================================= */

function inspectDoor() {

    if (state.memories.length < 4) {

        showDialogue(

            "PUERTA",

            `Está cerrada. La puerta parece esperar cuatro recuerdos. Tienes ${state.memories.length}/4.`,

            () => room()

        );

        return;

    }


    showDialogue(

        "PUERTA",

        "La cerradura desaparece.",

        () => {

            showDialogue(

                "PUERTA",

                "Parece que ahora sí puedes entrar.",

                () => finalRoom()

            );

        }

    );

}


/* =========================================================
   AGREGAR MEMORIA
========================================================= */

function addMemory(number, text) {

    if (state.memories.includes(number)) {

        return;

    }


    state.memories.push(number);

    state.memories.sort((a, b) => a - b);

    saveGame();

    updateHUD();

}


/* =========================================================
   HABITACIÓN FINAL
========================================================= */

function finalRoom() {

    setChapter("RECUERDO");

    updateHUD();


    screen.innerHTML = `

        <div class="center">

            <div class="memory">

                <div class="memoryNumber">
                    MEMORIAS COMPLETAS — 4/4
                </div>

                <div class="bigDate">
                    12 : 05
                </div>

                <p class="memoryText">

                    Ahora recuerdas.

                    <br><br>

                    Una fecha.

                    <br>

                    Dos personas.

                    <br>

                    Una partida que todavía continúa.

                </p>

                <div class="heart">
                    ♥
                </div>

                <button
                    class="pixelButton"
                    onclick="ending()">

                    CONTINUAR

                </button>

            </div>

        </div>

    `;

}


/* =========================================================
   FINAL
========================================================= */

function ending() {

    setChapter("FINAL");

    screen.innerHTML = `

        <div class="center">

            <div class="memory">

                <div class="memoryNumber">
                    ÚLTIMA MEMORIA
                </div>

                <h2>
                    ¿Sabes qué pasó a las 12:05?
                </h2>

                <div class="choices">

                    <button
                        class="pixelButton"
                        onclick="revealDate()">

                        DESCUBRIR LA RESPUESTA

                    </button>

                </div>

            </div>

        </div>

    `;

}


/* =========================================================
   REVELAR FECHA
========================================================= */

function revealDate() {

    screen.innerHTML = `

        <div class="center">

            <div class="stars">
                ★ ★ ★
            </div>

            <div class="bigDate">
                12 : 05
            </div>

            <h2>
                Comenzó nuestra partida.
            </h2>

            <p>
                12 de mayo de 2024
            </p>

            <p>
                El día en que todo comenzó.
            </p>

            <button
                class="pixelButton"
                onclick="statistics()">

                CONTINUAR

            </button>

        </div>

    `;

}


/* =========================================================
   ESTADÍSTICAS
========================================================= */

function statistics() {

    const startDate =
        new Date("2024-05-12T00:00:00");

    const today =
        new Date();

    const difference =
        today - startDate;

    const days =
        Math.floor(
            difference / (1000 * 60 * 60 * 24)
        );


    screen.innerHTML = `

        <div class="center">

            <div class="memory">

                <div class="memoryNumber">
                    ESTADÍSTICAS DE LA PARTIDA
                </div>

                <p>
                    JUGADOR 1
                </p>

                <h2>
                    CUYSITO
                </h2>

                <p>
                    JUGADOR 2
                </p>

                <h2>
                    PATITO
                </h2>

                <p>
                    TIEMPO DE PARTIDA
                </p>

                <div class="bigDate">
                    ${days}
                </div>

                <p>
                    DÍAS
                </p>

                <p>
                    MEMORIAS
                </p>

                <p>
                    4 / 4
                </p>

                <p>
                    ESTADO:
                </p>

                <h2>
                    CONTINUANDO...
                </h2>

                <button
                    class="pixelButton"
                    onclick="finalMessage()">

                    CONTINUAR

                </button>

            </div>

        </div>

    `;

}


/* =========================================================
   MENSAJE FINAL
========================================================= */

function finalMessage() {

    state.finished = true;

    saveGame();

    setChapter("FIN... ¿O INICIO?");


    screen.innerHTML = `

        <div class="center">

            <div class="heart">
                ♥
            </div>

            <h2>
                FIN... ¿O INICIO?
            </h2>

            <p>
                Si llegaste hasta aquí,
                encontraste el secreto.
            </p>

            <p>
                La fecha no era una contraseña.
            </p>

            <p>
                Era el comienzo.
            </p>

            <br>

            <p>
                Gracias por seguir jugando conmigo.
            </p>

            <br>

            <p>
                Y si pudiera elegir otra vez...
            </p>

            <h2>
                te elegiría a ti.
            </h2>

            <br>

            <button
                class="pixelButton"
                onclick="newGame()">

                JUGAR DE NUEVO

            </button>

        </div>

    `;

}


/* =========================================================
   INICIO
========================================================= */

updateHUD();

titleScreen();
/* =========================================================
   INICIO
========================================================= */

updateHUD();

titleScreen();
