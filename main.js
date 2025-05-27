/** 
 * Space Stratego Game 
 * A multiplayer strategy game built with p5.js and p5.party
 * Game idea, graphics and code by AI specialist Jens Valdez ;O) 
 * Note: This is just a POC. The game is not finished yet.
 */ 

//===================================================
// CONSTANTS AND GLOBAL VARIABLES
//===================================================
const room = new URLSearchParams(location.search).get("room");

// Party System Global Variables jens3    
let shared;
let me;
//let guests;
let guests;

let spacecrafts = [];
let gameObjects = []; // Initialize as empty array
let dummyObjects = []; // Initialize as empty array for dummy objects

/* Grafical */
let backgroundManager;
let gameImageManager;
let imageIndex8Manager;
let imageIndex10Manager;
let imageIndex11Manager;
let imageIndex13Manager;
let imageIndex16Manager;
/* Grafical */

// Game setup
const IMAGE_RING_X = 300;
const IMAGE_RING_Y = 0;

// Game Dimensions
const SCREEN_WIDTH = 2400;
const SCREEN_HEIGHT = 1200;
const GAME_AREA_X = 300;
const GAME_AREA_Y = 50;
const GAME_AREA_WIDTH = 1200;
const GAME_AREA_HEIGHT = 700;
const GAME_AREA_RIGHT = GAME_AREA_X + GAME_AREA_WIDTH;
const GAME_AREA_BOTTOM = GAME_AREA_Y + GAME_AREA_HEIGHT;

// Background manager Constants ========.
const CIRCLE_RADIUS = 400;
const IMAGE_SIZE = 120;
const ANIMATION_FRAMES = 180; // 3 seconds at 60fps.
const SUPERNOVA_MAX_SIZE = 10001;
const SUPERNOVA_THRESHOLD = 0.7;

// Gameplay Constants  
const TOTAL_NUMBER_OF_PLAYERS = 24
const SPACECRAFT_SIZE = 110; // Was 40
const SPACECRAFT_SPEED = 8;
const MAX_PLAYERS_PER_TEAM = 12;
const GAME_TRANSITION_TIME = 6000; // 5 seconds in milliseconds
const WARP_COOLDOWN_TIME = 10000; // 3 seconds in milliseconds
const BULLET_SPEED = 4;
const BULLET_DIAMETER = 10;
const NUMBER_OF_BULLETS = 2;
const TOWER_SHOOTING_INTERVAL = 2000; // 1000

// Images
let spacecraftBlueImages = [];
let spacecraftGreenImages = [];
let spacecraftPurpleImages = [];
let canonImages = [];
let minimapImg = []; // jenskh
let fixedMinimapImage = [];
let planetBackgroundImages = [];

// ImageIndex8Manager
let warpgateAImages = [];
let warpgateBImages = [];
// ImageIndex10Manager
let backgroundImage = null;
let blackCircleImg = null;
let upperLeftImg = null;
let upperRightImg = null;
let lowerLeftImg = null;
let lowerRightImg = null;
// How to Play Images
let WASDkeyImage = null;
let TFGHkeyImage = null;
let howtoPlaySpacecrafts = null;

// ImageIndex11Manager
let warpgateImages11 = [];
let lightTowerImages = [];
// ImageIndex13Manager
let jellyfishImages = [];
// ImageIndex16Manager
let warpgateImages16 = [];
let warpgateBImages16 = [];
let waterImages = [];

// Planet 0
let warpGateUpImages = [];
let warpGateDownImages = [];

// GameImageManager
let gameImagesSmall = []; // This now fully owns the game images
let gameImages = [];
// Spider
let framesLeft = []; // Array to hold left-facing animation frames
let framesRight = []; // Array to hold right-facing animation frames

// UI Variables
let nameInput;
let chooseTeamBlueButton;
let chooseTeamGreenButton;
let message = "";

// Game Controle Variables
let fixedMinimap
let selectedPlanet
let solarSystem
let planetIndexBlue = 3
let planetIndexGreen = 3
let canonTowersGenerated = false;
let isWarpingUp = false;
let hasWarped = false;
let supernovaStarIndex = -1;
let firstRun = true;
let firstRunAfterImagesLoaded = true;
let howToPlayButtonRect; // For the interactive "How to Play" button

// Image loading state variables
let imagesStillLoading = true;
let imagesLoadedCount = 0;
let totalImagesToLoadForPrepareImages = 0;
let allImagesLoadedSuccessfully = true;

// Variables only for statistics
let totalNumberOfVisualBullets = 0;
let totalNumberOfBullets = 0;

//let backgroundColor = [20, 30, 40]; // Default background color
let backgroundColor = [10, 20, 30]; // Default background color

// to test performance
let showGraphics = true
let showHowToNavigate = true
let showStarSystem = true
let showBlurAndTintEffects = true
let showColorBlindText = false
let dummyObjectsCount = 0; // Number of dummy objects to create for performance testing

// Add a centralized planet color palette
const planetColors = {
    0: { // Blue planet
        center: [20, 50, 160],
        edge: [80, 120, 200],
        name: "Rocky"
    },
    1: { // Green planet
        center: [20, 120, 40],
        edge: [100, 180, 100],
        name: "Organic"
    },
    2: { // Red planet
        center: [120, 20, 20],
        edge: [200, 100, 100],
        name: "Budda"
    },
    3: { // Yellow planet
        center: [120, 120, 20],
        edge: [200, 200, 100],
        name: "Ice cube"
    },
    4: { // Purple planet
        center: [80, 20, 120],
        edge: [150, 80, 200],
        name: "Insect swarm"
    }
};


// Character Definitions 
// Character Definitions 
const CHARACTER_DEFINITIONS = [
    { rank: -1, name: "Core Commander", id: "C", imageId: 0, count: 1, color: 'purple', isCoreCommand: true, canShoot: true },
    { rank: 10, name: "Star Commander", id: "10", imageId: 1, count: 1, color: 'cyan', isStarCommand: true, canShoot: true },
    { rank: 9, name: "Fleet Admiral", id: "9", imageId: 2, count: 1, color: 'magenta', canShoot: true },
    { rank: 8, name: "Ship Captain", id: "8", imageId: 3, count: 2, color: 'lime' },
    { rank: 7, name: "Squadron Leader", id: "7", imageId: 4, count: 3, color: 'teal', canShoot: true },
    { rank: 6, name: "Lt. Commander", id: "6", imageId: 5, count: 4, color: 'lavender', canShoot: true },
    { rank: 5, name: "Chief P. Officer", id: "5", imageId: 6, count: 4, color: 'maroon' },
    { rank: 4, name: "Night Sniper", id: "4", imageId: 7, count: 4, color: 'olive', canShoot: true, canSnipe: true, canCloake: true },
    { rank: 3, name: "Engineer", id: "3", imageId: 8, count: 5, color: 'yellow', isEngineer: true },
    { rank: 2, name: "Power Glider", id: "2", imageId: 9, count: 8, color: 'purple', canMoveFast: true },
    { rank: 1, name: "Stealth Squad", id: "S", imageId: 10, count: 1, color: 'orange', isStealthSquad: true, canCloake: true },
    { rank: 0, name: "Recon Drone", id: "D", imageId: 11, count: 6, color: 'brown', isReconDrone: true },
];

/**
 * Looks up the imageId for a given character ID in the CHARACTER_DEFINITIONS array
 * @param {string} characterId - The ID of the character to lookup 
 * @returns {number|null} - The imageId if found, null otherwise
 */
function getImageId(characterId) {
    const definition = CHARACTER_DEFINITIONS.find(def => def.id === characterId);
    if (definition) {
        return definition.imageId;
    }
    // Return default value if character ID not found
    console.warn(`No image ID found for character ID: ${characterId}`);
    return 0; // Default to first image as fallback
}

// Callback for successful image load
function imageLoadedCallback() {
    imagesLoadedCount++;
    if (imagesLoadedCount >= totalImagesToLoadForPrepareImages) {
        imagesStillLoading = false;
        if (allImagesLoadedSuccessfully) {
            console.log("All images from prepareImages loaded successfully.");
        } else {
            console.log("Finished loading images from prepareImages, but some failed.");
        }
    }
}

// Callback for failed image load
function imageLoadErrorCallback(errorData) {
    imagesLoadedCount++;
    allImagesLoadedSuccessfully = false;
    console.error(`Error loading image: ${errorData.path}`, errorData.event);
    if (imagesLoadedCount >= totalImagesToLoadForPrepareImages) {
        imagesStillLoading = false;
        console.log("Finished loading images from prepareImages, but some failed.");
    }
}

//=================================================== 
// SETUP AND INITIALIZATION
//=================================================== 2 3
function prepareImages() {
    imagesStillLoading = true;
    imagesLoadedCount = 0;
    totalImagesToLoadForPrepareImages = 0;
    allImagesLoadedSuccessfully = true;

    const wrappedErrorCb = (path, event) => imageLoadErrorCallback({ path, event });

    // ImageIndex16Manager
    // Planet 0
    // Load warpgate images
    for (let i = 1; i <= 10; i++) {
        const frameName = `p0warpgateA${i}`;
        const path = `images/startpage/p0warpgateA/${frameName}.png`;
        totalImagesToLoadForPrepareImages++;
        warpgateImages16.push(loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e)));
    }

    // Load water images
    for (let i = 1; i <= 6; i++) {
        const frameName = `p0water${i}`;
        const path = `images/startpage/p0water/${frameName}.png`;
        totalImagesToLoadForPrepareImages++;
        waterImages.push(loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e)));
    }

    // ImageIndex8Manager
    // Load warpgate A images
    for (let i = 1; i <= 6; i++) {
        const frameName = `p3warpgateA${i}`;
        const path = `images/startpage/p3warpgateA/${frameName}.png`;
        totalImagesToLoadForPrepareImages++;
        warpgateAImages.push(loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e)));
    }

    // Load warpgate B images
    for (let i = 1; i <= 13; i++) {
        const frameName = `p3warpgateB${i}`;
        const path = `images/startpage/p3warpgateB/${frameName}.png`;
        totalImagesToLoadForPrepareImages++;
        warpgateBImages.push(loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e)));
    }

    // ImageIndex10Manager
    // Load background image
    let path = "images/startpage/hangerTeamBlueEffect/hangerTeamBlueEmpty1.png";
    totalImagesToLoadForPrepareImages++;
    backgroundImage = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));

    // Load spacecraft images
    path = "images/startpage/hangerTeamBlueEffect/blackCircleDownLeft1.png";
    totalImagesToLoadForPrepareImages++;
    blackCircleImg = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));
    path = "images/startpage/hangerTeamBlueEffect/spaceCraftUpperLeft.png";
    totalImagesToLoadForPrepareImages++;
    upperLeftImg = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));
    path = "images/startpage/hangerTeamBlueEffect/spaceCraftUpperRight.png";
    totalImagesToLoadForPrepareImages++;
    upperRightImg = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));
    path = "images/startpage/hangerTeamBlueEffect/spaceCraftLowerLeft.png";
    totalImagesToLoadForPrepareImages++;
    lowerLeftImg = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));
    path = "images/startpage/hangerTeamBlueEffect/spaceCraftLowerRight.png";
    totalImagesToLoadForPrepareImages++;
    lowerRightImg = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));

    // ImageIndex11Manager 
    // Load left-facing frames
    for (let i = 1; i <= 24; i++) {
        const frameName = `p4spejderL${i}`;
        const path = `images/startpage/p4spider/${frameName}.png`;
        totalImagesToLoadForPrepareImages++;
        framesLeft.push(loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e)));
    }

    // Load right-facing frames
    for (let i = 1; i <= 24; i++) {
        const frameName = `p4spejderR${i}`;
        const path = `images/startpage/p4spider/${frameName}.png`;
        totalImagesToLoadForPrepareImages++;
        framesRight.push(loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e)));
    }

    // Planet 4
    // Load warpgate images
    for (let i = 1; i <= 13; i++) {
        const frameName = `p4warpgateA${i}`;
        const path = `images/startpage/p4warpgateA/${frameName}.png`;
        totalImagesToLoadForPrepareImages++;
        warpgateImages11.push(loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e)));
    }

    // Load lightTower images
    for (let i = 1; i <= 11; i++) {
        const frameName = `p4lightTower${i}`;
        const path = `images/startpage/p4lightTower/${frameName}.png`;
        totalImagesToLoadForPrepareImages++;
        lightTowerImages.push(loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e)));
    }

    // ImageIndex13Manager
    // Load jellyfish images
    const jellyfishPaths = [
        "images/startpage/p4p3jellyfish/p4p3jellyfishLeft.png",
        "images/startpage/p4p3jellyfish/p4p3jellyfishLowerLeft.png",
        "images/startpage/p4p3jellyfish/p4p3jellyfishLowerMiddle.png",
        "images/startpage/p4p3jellyfish/p4p3jellyfishLowerRight.png",
        "images/startpage/p4p3jellyfish/p4p3jellyfishUpperLeft.png",
        "images/startpage/p4p3jellyfish/p4p3jellyfishUpperRight.png"
    ];
    jellyfishPaths.forEach(p => {
        totalImagesToLoadForPrepareImages++;
        jellyfishImages.push(loadImage(p, imageLoadedCallback, (e) => wrappedErrorCb(p, e)));
    });

    // GameImageManager
    const imagePaths = [
        "images/startpage/background/hangerTeamGreen.png", "images/startpage/background/planet1p1.png", "images/startpage/background/planet1p2.png",
        "images/startpage/background/planet1p3.png", "images/startpage/background/planet2p1.png", "images/startpage/background/planet2p2.png",
        "images/startpage/background/planet3p1.png", "images/startpage/background/planet3p2.png", "images/startpage/background/planet3p3.png",
        "images/startpage/background/planet3p4.png", "images/startpage/background/hangerTeamBlue.png", "images/startpage/background/planet4p1.png",
        "images/startpage/background/planet4p2.png", "images/startpage/background/planet4p3cleaned.png", "images/startpage/background/planet4p4.png",
        "images/startpage/background/logo.png", "images/startpage/background/planet0p1.png", "images/startpage/background/planet0p2.png",
        "images/startpage/background/planet0p3.png", "images/startpage/background/planet0p4.png"
    ];
    imagePaths.forEach(p => {
        totalImagesToLoadForPrepareImages++;
        gameImages.push(loadImage(p, imageLoadedCallback, (e) => wrappedErrorCb(p, e)));
    });



    // Load warp gate up images
    for (let indexPlanet = 0; indexPlanet <= 4; indexPlanet++) {

        let numberOfWarpGateUpImagesForTheDifferentPlanets = [8, 14, 14, 14, 14];

        // warpGateUpImages = []; // This was causing the issue by re-initializing in each loop
        warpGateUpImages[indexPlanet] = []; // Initialize the sub-array for the current planet

        for (let indexWarpGate = 0; indexWarpGate < numberOfWarpGateUpImagesForTheDifferentPlanets[indexPlanet]; indexWarpGate++) {
            const path = `images/planet${indexPlanet}/p${indexPlanet}warpGateUp/p${indexPlanet}wUp${indexWarpGate}.png`;
            totalImagesToLoadForPrepareImages++;
            warpGateUpImages[indexPlanet].push(loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e)));
        }
    }

    // Load warp gate down images
    for (let indexPlanet = 0; indexPlanet <= 4; indexPlanet++) {

        let numberOfWarpGateDownImagesForTheDifferentPlanets = [11, 14, 10, 7, 14];

        // warpGateDownImages = []; // This was causing the issue by re-initializing in each loop
        warpGateDownImages[indexPlanet] = []; // Initialize the sub-array for the current planet

        for (let indexWarpGate = 0; indexWarpGate < numberOfWarpGateDownImagesForTheDifferentPlanets[indexPlanet]; indexWarpGate++) {
            const path = `images/planet${indexPlanet}/p${indexPlanet}warpGateDown/p${indexPlanet}wDown${indexWarpGate}.png`; // Note: Path seems to be same as Up, might be a typo in original code.
            totalImagesToLoadForPrepareImages++;
            warpGateDownImages[indexPlanet].push(loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e)));
        }
    }

    // spacecrafts
    path = `images/spacecraft/spacecraftPurple7Cloaked.png`;
    totalImagesToLoadForPrepareImages++;
    cloakedPurpleSpacecraft7Image = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));
    path = `images/spacecraft/spacecraftPurple10Cloaked.png`;
    totalImagesToLoadForPrepareImages++;
    cloakedPurpleSpacecraft10Image = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));
    path = `images/spacecraft/spacecraftGreen7Cloaked.png`;
    totalImagesToLoadForPrepareImages++;
    cloakedGreenSpacecraft7Image = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));
    path = `images/spacecraft/spacecraftGreen10Cloaked.png`;
    totalImagesToLoadForPrepareImages++;
    cloakedGreenSpacecraft10Image = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));

    for (let i = 0; i < 12; i++) {
        const path = `images/spacecraft/spacecraftGreen${i}.png`;
        totalImagesToLoadForPrepareImages++;
        spacecraftGreenImages[i] = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));
    }
    for (let i = 0; i < 12; i++) {
        const path = `images/spacecraft/spacecraftPurple${i}.png`;
        totalImagesToLoadForPrepareImages++;
        spacecraftPurpleImages[i] = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));
    }

    // Canon towers
    for (let i = 0; i < 3; i++) {
        const path = `images/spacecraft/canon${i}.png`;
        totalImagesToLoadForPrepareImages++;
        canonImages[i] = loadImage(path, imageLoadedCallback, (e) => wrappedErrorCb(path, e));
    }

    // Single basic minimap  
    const fixedMinimapPaths = [
        "images/planet0/p0minimap.png",
        "images/planet1/p1minimap.png",
        "images/planet2/p2minimap.png",
        "images/planet3/p3minimap.png",
        "images/planet4/p4minimap.png"
    ];
    fixedMinimapPaths.forEach((p, i) => {
        totalImagesToLoadForPrepareImages++;
        fixedMinimapImage[i] = loadImage(p, imageLoadedCallback, (e) => wrappedErrorCb(p, e));
    });

    // Game background images
    const planetBackgroundPaths = [
        "images/planet0/p0.png",
        "images/planet1/p1.png",
        "images/planet2/p2.png",
        "images/planet3/p3.png",
        "images/planet4/p4.png"
    ];
    planetBackgroundPaths.forEach((p, i) => {
        totalImagesToLoadForPrepareImages++;
        planetBackgroundImages[i] = loadImage(p, imageLoadedCallback, (e) => wrappedErrorCb(p, e));
    });

    if (totalImagesToLoadForPrepareImages === 0) {
        imagesStillLoading = false; // No images to load, so stop loading state
        console.log("No images were queued for loading in prepareImages.");
    }
}

function preload() {
    partyConnect( 
        "wss://p5js-spaceman-server-29f6636dfb6c.herokuapp.com",
        "jkv-SpaceStrategoV1a",
        room
    );

    shared = partyLoadShared("shared", {
        gameState: "GAME-SETUP",
        winningTeam: null,
        resetFlag: false,
        coreCommandDisconnected: false,
        characterList: [],
        blueWins: 0,
        greenWins: 0,
        draws: 0,
        resetTimerStartTime: null,
        resetTimerSeconds: null,
        gameStartTimerStartTime: null,
        gameStartTimerSeconds: null,
        currentTime: null,
        gameObjects: [],  // Start with empty array jens jens2
        canonTowerHits: Array(15).fill(0),
    });

    me = partyLoadMyShared({
        playerName: "observer",
        lastWarpTime: 0 // Track when player last used a warp gate
    });

    guests = partyLoadGuestShareds();

    // GameImageManager - Only load small preview images during preload
    const imagePathsSmallImages = [
        "images/startpage/smallImages/hangerTeamGreenSmall.png", "images/startpage/smallImages/planet1p1Small.png", "images/startpage/smallImages/planet1p2Small.png",
        "images/startpage/smallImages/planet1p3Small.png", "images/startpage/smallImages/planet2p1Small.png", "images/startpage/smallImages/planet2p2Small.png",
        "images/startpage/smallImages/planet3p1Small.png", "images/startpage/smallImages/planet3p2Small.png", "images/startpage/smallImages/planet3p3Small.png",
        "images/startpage/smallImages/planet3p4Small.png", "images/startpage/smallImages/hangerTeamBlueSmall.png", "images/startpage/smallImages/planet4p1Small.png",
        "images/startpage/smallImages/planet4p2Small.png", "images/startpage/smallImages/planet4p3SmallCleaned.png", "images/startpage/smallImages/planet4p4Small.png",
        "images/startpage/smallImages/logoSmall.png", "images/startpage/smallImages/planet0p1Small.png", "images/startpage/smallImages/planet0p2Small.png",
        "images/startpage/smallImages/planet0p3Small.png", "images/startpage/smallImages/planet0p4Small.png"
    ];

    imagePathsSmallImages.forEach(path => gameImagesSmall.push(loadImage(path)));

    for (let i = 0; i < 12; i++) {
        spacecraftBlueImages[i] = loadImage(`images/spacecraft/spacecraftBlue${i}.png`);
    }

    WASDkeyImage = loadImage(`images/howtoPlay/WASDkeys.png`);
    TFGHkeyImage = loadImage(`images/howtoPlay/TFGHkeys.png`);
    howtoPlaySpacecrafts = loadImage(`images/howtoPlay/spacecrafts.png`);

    // startpage
    // Make sure these classes are defined before using them
    // Initialize manager instances first to avoid undefined references
    /* Grafical */ // 2 3
    backgroundManager = new BackgroundManager();

    imageIndex8Manager = new ImageIndex8Manager();
    imageIndex10Manager = new ImageIndex10Manager();
    imageIndex11Manager = new ImageIndex11Manager();
    imageIndex13Manager = new ImageIndex13Manager();
    imageIndex16Manager = new ImageIndex16Manager();
    gameImageManager = new GameImageManager();

    // prepareImages(); // MOVED to setup()

    // Now load images for all managers   2  3 
    /* Grafical */
}

function setup() {
    createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
    frameRate(60);
    noStroke();

    prepareImages(); // Call prepareImages here to start loading images asynchronously

    createSpacecrafts();

    if (me.playerName === "observer") {
        joinGame();
        return;
    }

    console.log("My ID (will populate):", me.playerNumber);
}

//=================================================== jens 2 3
// MAIN DRAW FUNCTION
//===================================================

function draw() {
    background(backgroundColor[0], backgroundColor[1], backgroundColor[2]);

    if (firstRun) {
        backgroundManager.initialize();
        createNameInput();
        initializeCharacterList();
        fixedMinimap = new BasicMinimap(x = 1250, y = 900, diameter = 300, color = 'grey', diameterPlanet = 3000);
        solarSystem = new SolarSystem(xSolarSystemCenter = 1250, ySolarSystemCenter = 900);
        // Initialize the "How to Play" button's rectangle properties
        howToPlayButtonRect = {
            x: GAME_AREA_X + GAME_AREA_WIDTH / 2 - 100,
            y: GAME_AREA_Y, // Positioned a bit lower to avoid overlap
            w: 200,
            h: 40
        };
        updateDummyObjects()
        firstRun = false;
        return;
    }

    if (firstRunAfterImagesLoaded) {
        imageIndex10Manager.loadImagesAndAddSpacecrafts();
        imageIndex13Manager.loadImages();
        firstRunAfterImagesLoaded = false;
    }

    // Only generate new Towers one time when a new host is assigned
    if (!canonTowersGenerated && partyIsHost()) {
        canonTowersGenerated = true;
        updateTowerCount();
    }

    resolvePlayerNumberConflicts()

    stepLocal()

    if (partyIsHost()) {
        me.iAmHost = true;
        handleHostDuties();
    } else {
        me.iAmHost = false;
        receiveNewDataFromHost();
    }

    updateLocalStateFromSharedList();

    if (shared.resetFlag && !me.lastProcessedResetFlag) {
        resetClientState();
        me.lastProcessedResetFlag = true;
    } else if (!shared.resetFlag && me.lastProcessedResetFlag) {
        me.lastProcessedResetFlag = false;
    }

    if (!me.isReady) {
        backgroundManager.drawBackground();
        drawRulesSection();
        gameImageManager.drawGameImages();
        gameImageManager.drawEnlargedImage();
        drawGameSetup();
    } else {
        if (me.planetIndex === -1) return

        switch (shared.gameState) {
            case "GAME-SETUP":
                //console.log("Game setup");
                drawGameStats()
                drawHowToPlay() // This draws the WASD/TFGH key images
                push();
                drawCharacterListAndInfo();
                pop()
                drawCharacterLegend();
                drawGameSetup();
                drawInteractiveHowToPlay(); // Draw the new button and its hover text
                break;
            case "IN-GAME":
                //console.log("In game");
                displayTwoPlayersWithTheSamePlayerNumber()
                selectedPlanet = solarSystem.planets[me.planetIndex];
                if (!selectedPlanet) return

                fixedMinimap.update(selectedPlanet.diameterPlanet, selectedPlanet.xWarpGateUp, selectedPlanet.yWarpGateUp, selectedPlanet.xWarpGateDown, selectedPlanet.yWarpGateDown, selectedPlanet.diameterWarpGate);

                drawGameAreaBackground();
                drawBlackBackground()
                drawMinimap()
                drawSpacecraftOnMinimap();
                push();
                drawCharacterListAndInfo();
                pop() 
                drawCanonTowers();
                //Only for graphocal performance testing
                drawDummyObjects();
                drawSpacecrafts();
                handlePlayerMovement();
                handleBulletMovement();
                checkCollisionsWithWarpGate();
                checkBulletCollisions()
                drawCharacterLegend();
                break;
            case "GAME-FINISHED":
                selectedPlanet = solarSystem.planets[me.planetIndex];
                if (!selectedPlanet) return
                drawGameAreaBackground();
                drawBlackBackground()
                drawMinimap()
                drawGameFinished();
                drawCharacterLegend();
                break;
        }
        drawNavigationInstruction()
    }

    drawGameTimer();
    drawStatusMessages();
    displayHostName();
    drawPerformanceSettings()

}

function drawHowToPlay() {

    push();
    textAlign(LEFT, TOP); // Changed from textAlign(TOP, LEFT)
    textSize(16);
    fill(200);

    const textOffsetX = 5; // Offset for the text above the image
    const textOffsetY = -20; // Offset for the text above the image
    const imageYPosition = GAME_AREA_BOTTOM + 100;
    const imageHeight = 300; // Assuming all images have the same height for simplicity in text placement

    const spacecraftsImageDrawWidth = 1043;
    const wasdImageDrawWidth = 539;
    const tfghImageDrawWidth = 368;

    // Display howtoPlaySpacecrafts image and text
    if (howtoPlaySpacecrafts) {
        const imageX = GAME_AREA_X;
        image(howtoPlaySpacecrafts, imageX, imageYPosition, spacecraftsImageDrawWidth, imageHeight);
        text("Fleed Admiral from team PURPLE chasing Core Commander from team GREEN", imageX + textOffsetX, imageYPosition + textOffsetY);
    }

    // Display WASD keys image and text
    // Ensure howtoPlaySpacecrafts loaded to use its drawn width for positioning
    if (WASDkeyImage && howtoPlaySpacecrafts) {
        const imageX = GAME_AREA_X + spacecraftsImageDrawWidth + 30; // Use the drawn width of the previous image
        image(WASDkeyImage, imageX, imageYPosition, wasdImageDrawWidth, imageHeight);
        text("Use keys WASD to move your spacecraft around on the planet", imageX + textOffsetX, imageYPosition + textOffsetY);
    }

    // Display TFGH keys image and text
    // Ensure previous images loaded for correct positioning using their drawn widths
    if (TFGHkeyImage && howtoPlaySpacecrafts && WASDkeyImage) {
        const imageX = GAME_AREA_X + spacecraftsImageDrawWidth + 30 + wasdImageDrawWidth + 30; // Use drawn widths of previous images
        image(TFGHkeyImage, imageX, imageYPosition, tfghImageDrawWidth, imageHeight);
        text("Use keys TFGH to move around in the visible game area", imageX + textOffsetX, imageYPosition + textOffsetY);
    }

    pop();
}

function drawInteractiveHowToPlay() {
    if (!howToPlayButtonRect) return; // Ensure rect is initialized

    push();
    // Check Hover state first to apply styles accordingly
    let isHoveringButton = mouseX > howToPlayButtonRect.x && mouseX < howToPlayButtonRect.x + howToPlayButtonRect.w &&
        mouseY > howToPlayButtonRect.y && mouseY < howToPlayButtonRect.y + howToPlayButtonRect.h;

    // Draw Button with improved styling
    if (isHoveringButton) {
        fill(130, 130, 230); // Lighter color on hover 2 3
        stroke(255); // Brighter stroke on hover
        strokeWeight(2);
    } else {
        fill(100, 100, 200); // Default button color
        stroke(200);
        strokeWeight(1);
    }
    rect(howToPlayButtonRect.x, howToPlayButtonRect.y, howToPlayButtonRect.w, howToPlayButtonRect.h, 10); // Rounded corners

    // Button Text - properly centered
    fill(255); // Text color
    noStroke();
    textAlign(CENTER, CENTER); // Center text on the button
    textSize(18);
    text("How to Play", howToPlayButtonRect.x + howToPlayButtonRect.w / 2, howToPlayButtonRect.y + howToPlayButtonRect.h / 2);

    // Check Hover and Draw Detailed Text
    if (isHoveringButton) {
        drawHowToPlayInstructions()
    }
    pop();
}

function drawHowToPlayInstructions() {
    push();
    fill(230, 230, 250); // Light background for the text box
    stroke(50);
    strokeWeight(1);
    // Position the text box. Adjust x, y, width, height as needed.
    const textBoxX = GAME_AREA_X - 30;
    const textBoxY = GAME_AREA_Y + 60; // Below the button
    const textBoxWidth = GAME_AREA_WIDTH - 20;
    const textBoxHeight = SCREEN_HEIGHT - 125; // Adjust to fit content
    rect(textBoxX, textBoxY, textBoxWidth, textBoxHeight, 10); // Rounded corners

    fill(0); // Black text color
    noStroke();
    textSize(14); // Adjust for readability
    textAlign(LEFT, TOP);

    const textPadding = 20;
    const textContentX = textBoxX + textPadding;
    const textContentY = textBoxY + textPadding;
    const textContentWidth = textBoxWidth - 2 * textPadding;

    const instructions = `How to play:
Two teams PURPLE and GREEN team are playing against each other. The aim of the game is to have fun and work together to eliminate the opponent teams Core Commander. This will finish a round and the winning team will get one win. The two teams must agree how long time to play for and when time’s up the squad with the most wins takes the dub.

Pro tip: Hop on a voice call with your crew before the match. Go over the rules, plan your moves, and get hyped.

⸻

🚀 Game Start:

Game kicks off when both teams lock in their Core Commander. After that, the rest of the players pick their roles. Each character’s got a name, rank, size, team color, and maybe a special power. You’ll see the details in the right of your screen.

⸻

⚔️ How Battles Work:
	•	When two characters from different teams touch = battle time.
	•	Higher rank usually wins… BUT there are some twists:
	•	Star Commander (10) loses to Stealth Squad (1)
	•	Recon Drone (D) draws with everybody except the Core Commander (C) and Engineer (3)
	•	Engineer (3) beats the Recon Drone (D)
	•	Core Commander (C) loses to everyone
	•	If two Core Commanders clash = draw

Oh, and some characters pack heat—they can shoot. Take 10 hits and you’re out.

⸻

🕹 Controls:
	•	WASD = Move around the planet
	•	TFGH = Move around in the visible game area
	•	Mouse click = Shoot
	•	P = Toggle graphics off if the game’s lagging
    •	C = Toggle cloak for characters that can cloak

⸻

🌌 Warp & Map Tips:
	•	Use Warp Gates to jump to other planets. After use they need a little cooldown.
	•	Watch out for canons on planet Ice Cube — they ain’t friendly.
	•	GREEN team ships leave green exhaust, PURPLE team ships leave purple.
	•	On the minimap, you’ll see a little circle with a green border = GREEN ship. The middle symbol shows the ship’s type.
	•	Cloaked ships = invisible on the minimap 👀

⸻

🪐 Planet and Minimap Stuff:
	•	There are 5 planets of different sizes you can warp between. The ships move a bit slower on the bigger planets.
	•	The planets orbit locations are different for each player, so what you see isn’t what your team mates sees.
	•	From the screenshot of the minimap (to the right): You’re a Star Commander on team PURPLE. An Engineer from team GREEN is on the center of the planet. There’s a down warp gate (pink) bottom-right, and an up warp gate (light blue) top-left.

⸻

💡 Final Tips:
	•	Get to know how each ship looks — split-second decisions can win or lose the game. Hover the characters in the character list to see them in detail.
    •	Technical important stuff: One of the clients (browsers) acts as a HOST. This browser must be an active player (and not minimized). 
	•	Keep it smooth, play smart, and most importantly…

🔥 Have fun & good luck, Commander. 🔥`;

    text(instructions, textContentX, textContentY, textContentWidth);
    pop();
}

// Function to draw the game timer at the top of the screen
function drawGameTimer() {
    const elapsedTime = Math.max(0, shared.currentTime);

    // Convert to minutes and seconds
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);

    // Format time string with leading zeros
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Position in the center top of the screen
    const timerX = SCREEN_WIDTH - 100; // Adjust as needed
    const timerY = 30;

    // Draw timer with larger text
    push();
    textAlign(CENTER, CENTER);
    textSize(18);

    // Change color to red if less than 1 minute remains
    fill(200);

    const statsWidth = 300; // Approximate width for the stats box
    const infoX = GAME_AREA_RIGHT + 550; // Position from the right edge of the screen
    const infoY = 20;
    //    const lineHeight = 20;

    textAlign(LEFT, TOP);
    text(`Match Time: ${timeString}`, infoX, infoY);
    pop();
}

function receiveNewDataFromHost() {
    // Ensure client has same number of towers as host
    while (gameObjects.length < shared.gameObjects.length) {
        const i = gameObjects.length;
        gameObjects.push(new Canon({
            objectNumber: i,
            objectName: `canon${i}`,
            xGlobal: shared.gameObjects[i].xGlobal,
            yGlobal: shared.gameObjects[i].yGlobal,
            diamter: 60,
            color: 'grey',
            xSpawnGlobal: shared.gameObjects[i].xSpawnGlobal,
            ySpawnGlobal: shared.gameObjects[i].ySpawnGlobal,
            planetIndex: shared.gameObjects[i].planetIndex,

        }));
    }
    // Remove extra towers if host has fewer
    while (gameObjects.length > shared.gameObjects.length) {
        gameObjects.pop();
    }
    // Update existing towers
    gameObjects.forEach((canon, index) => {
        canon.diameter = shared.gameObjects[index].diameter;
        canon.color = shared.gameObjects[index].color;
        canon.type = shared.gameObjects[index].type;

        canon.xGlobal = shared.gameObjects[index].xGlobal;
        canon.yGlobal = shared.gameObjects[index].yGlobal;
        canon.bullets = shared.gameObjects[index].bullets;
        canon.angle = shared.gameObjects[index].angle;
        canon.lastShotTime = shared.gameObjects[index].lastShotTime; // Sync lastShotTime
        canon.hits = shared.gameObjects[index].hits || Array(15).fill(0);
        canon.planetIndex = shared.gameObjects[index].planetIndex;
    });
}

//=================================================== jens 
// Copy data from guest to local objects
//===================================================

function stepLocal() {
    spacecrafts.forEach(spacecraft => {
        const guest = guests.find((p) => p.playerName === spacecraft.playerName);
        if (guest) {
            spacecraft.syncFromShared(guest);
        } else {
            spacecraft.planetIndex = -1;
        }
    });

}

function createSpacecrafts() {
    for (let i = 0; i < TOTAL_NUMBER_OF_PLAYERS; i++) {

        let teamName;
        if (i <= TOTAL_NUMBER_OF_PLAYERS / 2) {
            teamName = 'blue';
        } else {
            teamName = 'green';
        }
        playerName = "player" + i;
        playerDisplayName = playerName;

        spacecrafts.push(new Spacecraft({
            playerNumber: i,
            playerName: "player" + i,
            playerDisplayName: playerDisplayName,
            team: teamName,
            characterId: null,
            characterRank: null,
            characterName: null,
            characterInstanceId: null,
            iAmHost: null,
            isReady: false,
            hasCharacter: false,
            status: "available",
            lastProcessedResetFlag: false,
            xLocal: GAME_AREA_WIDTH / 2 + 100,
            yLocal: GAME_AREA_HEIGHT / 2,
            xGlobal: 3000 / 2 - GAME_AREA_WIDTH / 2 + 400,
            yGlobal: 3500 / 2 - GAME_AREA_HEIGHT / 2,
            diameter: SPACECRAFT_SIZE,
            size: SPACECRAFT_SIZE,
            xMouse: 0,
            yMouse: 0,
            color: "",
            bullets: [],
            hits: Array(15).fill(0),
            planetIndex: -1,
        }));
    }
}

function joinGame() {
    // don't let current players double join
    if (me.playerName.startsWith("player")) return;

    for (let spacecraft of spacecrafts) {
        console.log("Checking spacecraft:", spacecraft.playerName);
        if (!guests.find((p) => p.playerName === spacecraft.playerName)) {
            spawn(spacecraft);
            return;
        }
    }
}

function spawn(spacecraft) {
    console.log("Spawning spacecraft:", spacecraft.playerName);
    me.playerNumber = spacecraft.playerNumber;
    me.playerName = spacecraft.playerName;
    me.playerDisplayName = spacecraft.playerDisplayName;
    me.team = spacecraft.team;
    me.characterId = spacecraft.characterId;
    me.characterRank = spacecraft.characterRank;
    me.characterName = spacecraft.characterName;
    me.characterInstanceId = spacecraft.characterInstanceId;
    me.size = spacecraft.size;
    me.isReady = spacecraft.isReady;
    me.hasCharacter = spacecraft.hasCharacter;
    me.status = spacecraft.status;
    me.lastProcessedResetFlag = spacecraft.lastProcessedResetFlag;
    me.xLocal = spacecraft.xLocal;
    me.yLocal = spacecraft.yLocal;
    me.xGlobal = spacecraft.xGlobal;
    me.yGlobal = spacecraft.yGlobal;
    me.diameter = spacecraft.diameter;
    me.color = spacecraft.color;
    me.bullets = [];
    me.hits = Array(15).fill(0);
    me.planetIndex = -1;
    me.lastWarpTime = 0; // Reset warp cooldown when spawning
}
//===================================================
// DRAWING FUNCTIONS
//===================================================

function drawMinimap() {
    if (showStarSystem) {
        push();
        angleMode(DEGREES);

        solarSystem.update();
        solarSystem.draw();
        pop()
    } else {
        fixedMinimap.draw();

    }
}
function drawSpacecraftOnMinimap() {
    if (!showStarSystem) {
        fixedMinimap.drawSpacecrafts();
    }
}

function isWarpGateOnLocalScreenArea(xLocal, yLocal, diameter) {
    return xLocal >= - diameter && xLocal <= GAME_AREA_WIDTH + diameter && yLocal >= -diameter && yLocal <= GAME_AREA_HEIGHT + diameter;
}

// Generic function to draw warp gate animations
function drawWarpGateAnimation(warpGateGlobalX, warpGateGlobalY, localOffsetX, localOffsetY, imageFrames, frameWidth, frameHeight, speedDivisor, isPulsating, isCooldown = false) {
    if (!selectedPlanet) {
        return;
    }

    let xLocal = warpGateGlobalX - me.xGlobal + localOffsetX;
    let yLocal = warpGateGlobalY - me.yGlobal + localOffsetY;

    if (isWarpGateOnLocalScreenArea(xLocal, yLocal, 300)) {
        if (imageFrames && imageFrames.length > 0) {
            let frameIndexWarpgate;
            const totalFrames = imageFrames.length;

            if (isCooldown) {
                // Show first frame (index 0) as still image when in cooldown
                if (totalFrames > 0) {
                    frameIndexWarpgate = 0;
                } else {
                    // No frames to show
                    return;
                }
            } else {
                // Animate using frames from index 1 onwards
                if (totalFrames <= 1) {
                    // No animation frames available (frame 0 is for cooldown, need at least one more)
                    return;
                }

                const numAnimationFrames = totalFrames - 1; // Number of frames available for animation (frames 1 to totalFrames-1)

                if (isPulsating) {
                    if (numAnimationFrames === 1) { // Only one frame for animation (e.g., imageFrames = [cooldownImg, animImg1])
                        frameIndexWarpgate = 1; // Show that single animation frame
                    } else { // numAnimationFrames >= 2
                        const currentSpeedDivisor = speedDivisor > 0 ? speedDivisor : 9; // Default to 9 if invalid
                        // Period for 0-indexed animation frames (0 to numAnimationFrames-1)
                        const period = 2 * (numAnimationFrames - 1);
                        const valueInCycle = floor(frameCount / currentSpeedDivisor) % period;

                        let animationFrameIndex; // This will be 0-indexed relative to the animation frames sequence
                        if (valueInCycle < numAnimationFrames) {
                            animationFrameIndex = valueInCycle; // Moving forward
                        } else {
                            animationFrameIndex = period - valueInCycle; // Moving backward
                        }
                        frameIndexWarpgate = animationFrameIndex + 1; // Offset by 1 to map to original imageFrames index
                    }
                } else { // Looping
                    // numAnimationFrames will be at least 1 here because totalFrames > 1
                    const currentSpeedDivisor = speedDivisor > 0 ? speedDivisor : 6; // Default to 6 if invalid
                    let animationFrameIndex = floor(frameCount / currentSpeedDivisor) % numAnimationFrames; // 0-indexed for animation frames
                    frameIndexWarpgate = animationFrameIndex + 1; // Offset by 1 to map to original imageFrames index
                }
            }

            let imgWarpgate = imageFrames[frameIndexWarpgate];
            if (imgWarpgate) {
                push();
                imageMode(CENTER);
                image(imgWarpgate, GAME_AREA_X + xLocal, GAME_AREA_Y + yLocal, frameWidth, frameHeight);
                pop();
            }
        }
    }
}

function drawGameAreaBackground() {
    if (showGraphics && allImagesLoadedSuccessfully) {

        let cropX = me.xGlobal;
        let cropY = me.yGlobal;

        // Use the planet background image that corresponds to the current planet index
        let currentBackgroundImage = planetBackgroundImages[me.planetIndex];

        // Scale the background image to match planet size
        image(currentBackgroundImage,
            GAME_AREA_X,
            GAME_AREA_Y,
            GAME_AREA_WIDTH,
            GAME_AREA_HEIGHT,
            cropX,
            cropY,
            GAME_AREA_WIDTH,
            GAME_AREA_HEIGHT
        );

        // Check if warp gate is in cooldown

        if (showBlurAndTintEffects && !imagesStillLoading) {
            const currentTime = millis();
            const isCooldown = currentTime - me.lastWarpTime < WARP_COOLDOWN_TIME;

            // Draw the animation for planet 0's down warp gate
            if (me.planetIndex === 0) {
                drawWarpGateAnimation(selectedPlanet.xWarpGateUp, selectedPlanet.yWarpGateUp, 0, 0, warpGateUpImages[me.planetIndex], 284, 226, 9, true, isCooldown);
                drawWarpGateAnimation(selectedPlanet.xWarpGateDown, selectedPlanet.yWarpGateDown, 0, 0, warpGateDownImages[me.planetIndex], 170, 150, 6, false, isCooldown);
            }
            if (me.planetIndex === 1) {
                drawWarpGateAnimation(selectedPlanet.xWarpGateUp, selectedPlanet.yWarpGateUp, -13, -40, warpGateUpImages[me.planetIndex], 396, 306, 9, true, isCooldown);
                drawWarpGateAnimation(selectedPlanet.xWarpGateDown, selectedPlanet.yWarpGateDown, -10, -20, warpGateDownImages[me.planetIndex], 479, 433, 9, true, isCooldown);
            }
            if (me.planetIndex === 2) {
                drawWarpGateAnimation(selectedPlanet.xWarpGateUp, selectedPlanet.yWarpGateUp, 0, 0, warpGateUpImages[me.planetIndex], 284, 226, 9, true, isCooldown);
                drawWarpGateAnimation(selectedPlanet.xWarpGateDown, selectedPlanet.yWarpGateDown, 0, 0, warpGateDownImages[me.planetIndex], 200, 180, 3, false, isCooldown);
            }
            // Draw the animation for planet 0's down warp gate
            if (me.planetIndex === 3) {
                drawWarpGateAnimation(selectedPlanet.xWarpGateUp, selectedPlanet.yWarpGateUp, 10, -50, warpGateUpImages[me.planetIndex], 207 * 2, 161 * 2, 9, true, isCooldown);
                drawWarpGateAnimation(selectedPlanet.xWarpGateDown, selectedPlanet.yWarpGateDown, 0, 0, warpGateDownImages[me.planetIndex], 206, 192, 8, false, isCooldown);
            }
            if (me.planetIndex === 4) {
                drawWarpGateAnimation(selectedPlanet.xWarpGateUp, selectedPlanet.yWarpGateUp, 0, 0, warpGateUpImages[me.planetIndex], 192 * 1.6, 150 * 1.6, 9, true, isCooldown);
                drawWarpGateAnimation(selectedPlanet.xWarpGateDown, selectedPlanet.yWarpGateDown, -10, -30, warpGateDownImages[me.planetIndex], 254, 186, 9, true, isCooldown);
            }
        } else {
            // Draw the warp gates on top of the background
            drawWarpGateCountDownOnGameArea();
        }
    } else {
        // Get colors consistent with the planet type
        const colorScheme = planetColors[me.planetIndex];

        // Draw the planet with a radial gradient
        drawRadialGradient(
            GAME_AREA_X - me.xGlobal + selectedPlanet.diameterPlanet / 2,
            GAME_AREA_Y - me.yGlobal + selectedPlanet.diameterPlanet / 2,
            selectedPlanet.diameterPlanet,
            colorScheme.center,
            colorScheme.edge
        );

        // Also draw warp gates in non-image mode
        drawWarpGatesOnGameArea();
    }
    // Draw planet name in the bottom right of the game area

    const colorScheme = planetColors[me.planetIndex];

    push();
    fill('white');
    textAlign(RIGHT, BOTTOM);
    textSize(16);
    text(`${colorScheme.name}`,
        //            GAME_AREA_X + GAME_AREA_WIDTH - 20,
        //            GAME_AREA_Y + GAME_AREA_HEIGHT - 10);
        GAME_AREA_X + GAME_AREA_WIDTH - 20,
        GAME_AREA_Y + GAME_AREA_HEIGHT - 10);
    pop();
}

function drawBlackBackground() {
    // Black out areas outside the game area
    //fill('black');
    fill(backgroundColor[0], backgroundColor[1], backgroundColor[2])
    rect(0, 0, GAME_AREA_X, SCREEN_HEIGHT); // Black out left side
    rect(0, 0, SCREEN_WIDTH, GAME_AREA_Y); // Black out top side
    rect(GAME_AREA_RIGHT, 0, SCREEN_WIDTH, SCREEN_HEIGHT); // Black out right side
    rect(0, GAME_AREA_BOTTOM, SCREEN_WIDTH, SCREEN_HEIGHT); // Black out bottom side
}

// Draw warp gates count down on the game area with cooldown visualization
function drawWarpGateCountDownOnGameArea() {
    // Calculate relative position for up warp gate based on global coordinates
    let xLocalUp = selectedPlanet.xWarpGateUp - me.xGlobal;
    let yLocalUp = selectedPlanet.yWarpGateUp - me.yGlobal;

    // Calculate relative position for down warp gate based on global coordinates  
    let xLocalDown = selectedPlanet.xWarpGateDown - me.xGlobal;
    let yLocalDown = selectedPlanet.yWarpGateDown - me.yGlobal;

    // Check if warp gate is in cooldown
    const currentTime = millis();
    const isCooldown = currentTime - me.lastWarpTime < WARP_COOLDOWN_TIME;
    const cooldownRatio = isCooldown ?
        (currentTime - me.lastWarpTime) / WARP_COOLDOWN_TIME : 1;

    // Draw the "up" warp gate if it's visible on screen
    if (onLocalScreenArea(xLocalUp, yLocalUp)) {
        push();
        if (isCooldown) {

            // Draw cooldown progress arc
            noFill();
            stroke('cyan');
            strokeWeight(10);

            let diameterCountdown = 30
            arc(
                GAME_AREA_X + xLocalUp,
                GAME_AREA_Y + yLocalUp,
                diameterCountdown * 0.8,
                diameterCountdown * 0.8,
                0,
                cooldownRatio * TWO_PI
            );
            pop();
        }
    }

    // Draw the "down" warp gate if it's visible on screen
    if (onLocalScreenArea(xLocalDown, yLocalDown)) {
        push();
        if (isCooldown) {
            // Draw cooldown progress arc
            noFill();
            stroke('magenta');
            strokeWeight(10);

            let diameterCountdown = 30
            arc(
                GAME_AREA_X + xLocalDown,
                GAME_AREA_Y + yLocalDown,
                diameterCountdown * 0.8,
                diameterCountdown * 0.8,
                0,
                cooldownRatio * TWO_PI
            );
        }
        pop();
    }
}

function displayHostName() {
    fill(255, 223, 0);
    textSize(12); // Final one 16 
    textAlign(LEFT, TOP);
    const infoX = 10 // Final one SCREEN_WIDTH - 180; // Position from the right edge of the screen
    const infoY = 5; // Final one 20

    if (partyIsHost()) {
        text("HOST: Me", infoX, infoY);
    } else {
        const hostPlayers = guests.filter(p => p.iAmHost === true); // Ensure we check the boolean property
        if (hostPlayers.length > 0) {
            const hostPlayer = hostPlayers[0]; // Get the first host found
            const hostDisplayName = hostPlayer.playerDisplayName || `Player ${hostPlayer.playerNumber}`; // Fallback
            text(`HOST: ${hostDisplayName}`, infoX, infoY);
        } else {
            text("Host client not identified", infoX, infoY); // Fallback if no host is found in guests
        }
    }
}

function drawStatusMessages() {
    const statusMsgX = GAME_AREA_X + GAME_AREA_WIDTH / 2;
    const statusMsgY = GAME_AREA_Y - 30;

    // Find the player's current character data from shared list
    let myCharacterData = shared.characterList.find(c => c.instanceId === me.characterInstanceId);

    // Battle outcome message
    if (shared.gameState !== 'GAME-FINISHED' &&
        myCharacterData && // myCharacterData.isPermanentlyLost &&
        myCharacterData.battleOutcomeResult) {

        fill(255, 0, 0);
        textAlign(CENTER, CENTER);
        textSize(20);

        let outcomeMsg = "";

        if (myCharacterData.battleInfo) {
            // Include opponent player name in the message
            const opponentPlayerName = myCharacterData.battleInfo?.playerName || 'Unknown Player';
            const opponentCharacterName = myCharacterData.battleInfo?.name || '??';
            const opponentCharacterRank = myCharacterData.battleInfo?.rank || '??';
            const myCharacterName = myCharacterData.battleInfo?.myName || '??';
            const myCharacterRank = myCharacterData.battleInfo?.myRank || '??';
            outcomeMsg = `You were a ${myCharacterName}(${myCharacterRank}) and ${myCharacterData.battleOutcomeResult} a battle vs a ${opponentCharacterName}(${opponentCharacterRank}) - ${opponentPlayerName})`;
        } else {
            outcomeMsg = `${myCharacterData.battleOutcomeResult}`;
        }
        text(outcomeMsg, statusMsgX, statusMsgY);
    }    // General game message (including team full messages) 
    else if (message) {
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(24);
        text(message, statusMsgX, statusMsgY);
        // Clear message after displaying once to avoid persistence
        // Consider a timed clear if needed
        // message = ""; // Optional: Clear immediately
    }
    // Game start countdown
    else if (shared.gameState === 'GAME-SETUP' && shared.gameStartTimerStartTime) {
        fill(200);
        textSize(18);
        textAlign(CENTER, CENTER);
        text(`A new game is starting in ${shared.gameStartTimerSeconds} seconds...`, statusMsgX, statusMsgY);
    }
    // Game reset countdown
    else if (shared.gameState === 'GAME-FINISHED' && shared.resetTimerStartTime) {
        fill(200);
        textSize(18);
        textAlign(CENTER, CENTER);
        text(`A new game will be setup in ${shared.resetTimerSeconds} seconds...`, statusMsgX, statusMsgY);
    }
}

function drawTopLeftInfo() {
    if (me.isReady) {
        fill(255);
        textSize(18);
        textAlign(LEFT, TOP);
        text(`Welcome, ${me.playerDisplayName}! Team: ${me.team === 'blue' ? 'Purple' : 'Green'}.`, 10, 20);
        if (me.hasCharacter) {
            text(`You are a: ${me.characterName}`, 10, 50);
        } else {
            text("Choose your Spacecraft:", 10, 50);
        }
    }
}

function drawNavigationInstruction() {

    // Draw timer with larger text
    push();
    textSize(12);
    // Change color to red if less than 1 minute remains
    fill(200);
    textAlign(LEFT, TOP);
    text(`Global movement Keys: WASD `, GAME_AREA_RIGHT - 180, 10);
    text(`Local movement Keys: TFGH `, GAME_AREA_RIGHT - 180, 30);
    pop();
}
function displayTwoPlayersWithTheSamePlayerNumber() {

    let samePlayerNumber = false
    const playerNumbers = Array(guests.length).fill(0)
    guests.forEach(p => {
        playerNumbers[p.playerNumber]++
    });

    let twoPlayersWithTheSamePlayerNumber = false
    playerNumbers.forEach((count, index) => {
        if (count > 1) {
            twoPlayersWithTheSamePlayerNumber = true

        }
    });
    if (twoPlayersWithTheSamePlayerNumber) {
        samePlayerNumber = true
    }

    if (samePlayerNumber) {
        fill(255, 0, 0); // Red color
        textAlign(LEFT, TOP);
        textSize(12);
        let displayPlayerNumberIssueText = "Two players have the same playerNumber. One must refresh the browser."
        text(displayPlayerNumberIssueText, GAME_AREA_X + 40, 35);
    }
}

function drawGameStats() {
    const statsX = GAME_AREA_X + 50;
    const statsY = GAME_AREA_Y + 70;
    const sectionSpacing = 30;
    const lineHeight = 20;
    const headerSize = 18;
    const textSizeNormal = 14;

    push();
    textAlign(LEFT, TOP);
    fill(255);

    // Section 1: Title
    textSize(headerSize);
    text("Game Statistics", statsX, statsY);

    // Section 2: Team Scores
    const scoresY = statsY + sectionSpacing;
    textSize(textSizeNormal);
    fill(133, 69, 196); // Purple
    text(`Team PURPLE Wins: ${shared.blueWins || 0}`, statsX, scoresY);
    fill(0, 200, 100); // Green
    text(`Team GREEN Wins: ${shared.greenWins || 0}`, statsX, scoresY + lineHeight);
    fill(200); // Gray
    text(`Draws: ${shared.draws || 0}`, statsX, scoresY + lineHeight * 2);

    // Section 3: Players
    const playersY = scoresY + lineHeight * 3 + sectionSpacing;

    // Headers for teams
    textSize(headerSize);
    fill(133, 69, 196); // Purple 2 
    text("Team PURPLE", statsX, playersY);
    fill(0, 200, 100); // Green
    text("Team GREEN", statsX + 300, playersY);
    fill(200); // Gray
    text("No Team", statsX + 600, playersY);

    // List players
    textSize(textSizeNormal);
    const purplePlayers = guests.filter(p => p.isReady && p.team === 'blue');
    const greenPlayers = guests.filter(p => p.isReady && p.team === 'green');
    const noTeamPlayers = guests.filter(p => !p.isReady);

    const maxRows = Math.max(purplePlayers.length, greenPlayers.length, noTeamPlayers.length);

    for (let i = 0; i < maxRows; i++) {
        if (i < purplePlayers.length) {
            fill(133, 69, 196); // Purple
            const p = purplePlayers[i];
            let displayText = `- ${p.playerDisplayName || p.playerName} (#${p.playerNumber})`
            text(`- ${p.playerDisplayName || p.playerName} (#${p.playerNumber})`, statsX + 20, playersY + lineHeight * (i + 1));
            if (playerWithDuplicateNumber(p.playerNumber)) {
                fill(255, 0, 0); // Red
                displayText += " - Refresh Browser"
            }
            text(displayText, statsX + 20, playersY + lineHeight * (i + 1));
        }
        if (i < greenPlayers.length) {
            fill(0, 200, 100); // Green
            const p = greenPlayers[i];
            let displayText = `- ${p.playerDisplayName || p.playerName} (#${p.playerNumber})`
            if (playerWithDuplicateNumber(p.playerNumber)) {
                fill(255, 0, 0); // Red
                displayText += " - Refresh Browser"
            }
            text(displayText, statsX + 320, playersY + lineHeight * (i + 1));
        }
        if (i < noTeamPlayers.length) {
            fill(200); // Gray
            const p = noTeamPlayers[i];
            let displayText = `- ${p.playerDisplayName || p.playerName} (#${p.playerNumber})`
            if (playerWithDuplicateNumber(p.playerNumber)) {
                fill(255, 0, 0); // Red
                displayText += " - Refresh Browser"
            }
            text(displayText, statsX + 620, playersY + lineHeight * (i + 1));
        }
    }

    pop();
}
function playerWithDuplicateNumber(playerNumber) {
    const playerNumbers = guests.map(p => p.playerNumber);
    return playerNumbers.filter(num => num === playerNumber).length > 1;
}

function drawPerformanceSettings() {
    fill(200);
    let x = 20
    let y = SCREEN_HEIGHT - 120
    textSize(14);
    textAlign(LEFT, TOP);
    text(`Change performance settings:`, x, y);
    text(`Show graphics (Key: p): ${showGraphics}`, x, y + 20);
    text(`Show effects (Key: o): ${showBlurAndTintEffects}`, x, y + 40);
    text(`Show star system (Key: i): ${showStarSystem}`, x, y + 60);
    text(`I am color blind (Key: u): ${showColorBlindText}`, x, y + 80);
    text(`Add/remove dummy object on planet2 (key k/l): ${dummyObjectsCount}`, x, y + 100);
}

function drawCharacterLegend() {
    const legendX = GAME_AREA_RIGHT + 50; // Position where stats used to be
    const legendTitleY = 10; // Position at the top of this panel area 

    // Title
    fill(200);
    textSize(16); // Title text size jens 2 3 
    textAlign(LEFT, TOP);
    text("Eliminate the opponents Core Command to win a game!", legendX, legendTitleY);
    text("In general characters looses to higher rank characters", legendX, legendTitleY + 20);

    textSize(20); // Title text size jens
    text("Characters:!", legendX, legendTitleY + 50);
    text("Battle outcomes!", legendX + 300, legendTitleY + 50);
    text("Special Ability", legendX + 500, legendTitleY + 50);

    const circleDiameter = 50; // 96px
    const itemVerticalPadding = 4;
    const itemHeight = circleDiameter + itemVerticalPadding;
    const textOffsetX = circleDiameter + 20;
    const specialRuleTextStartX = legendX + textOffsetX + 230;

    let currentItemContentStartY = legendTitleY + 80; // Y for the top of the first item's content area (after title + some padding) 2 3

    let itemCount = 0;
    CHARACTER_DEFINITIONS.forEach(def => {
        // Draw colored circle
        if (showGraphics && allImagesLoadedSuccessfully) {

            fill(def.color);
            ellipse(legendX + circleDiameter / 2, currentItemContentStartY + circleDiameter / 2, circleDiameter, circleDiameter);

            let imageId = getImageId(def.id); // jens 3 

            image(spacecraftBlueImages[imageId], legendX, currentItemContentStartY, circleDiameter, circleDiameter);

            if (dist(mouseX, mouseY, legendX + circleDiameter / 2, currentItemContentStartY + circleDiameter / 2) < circleDiameter / 2) {

                let imageId = getImageId(def.id); // jens
                fill(255)
                ellipse(legendX + circleDiameter / 2 + 370, legendTitleY + circleDiameter / 2 + 250, circleDiameter * 3.5, circleDiameter * 3.5);

                image(spacecraftBlueImages[imageId], legendX + 320, legendTitleY + 200, circleDiameter * 3, circleDiameter * 3);
            }
        } else {
            fill(def.color);
            noStroke();
            ellipse(legendX + circleDiameter / 2, currentItemContentStartY + circleDiameter / 2, circleDiameter, circleDiameter);
        }

        itemCount++;

        // Text for name and rank 2 3
        fill(220);
        textSize(14);
        textAlign(LEFT, CENTER);

        const textBlockCenterY = currentItemContentStartY + circleDiameter / 2;

        let rankText = def.rank === -1 ? "C" : def.rank;
        text(`(${def.id}) ${def.name} (Rank: ${rankText})`, legendX + textOffsetX, textBlockCenterY);

        // Add special rules descriptions 2 4
        let specialRuleText = "";
        if (def.isEngineer && def.id === "3") {
            specialRuleText = "Wins vs Recon Drone";
        } else if (def.isReconDrone && def.id === "D") {
            specialRuleText = "Draws vs all except Engineer";
        } else if (def.isStealthSquad && def.id === "S") {
            specialRuleText = "Wins vs Star Commander";
        } else if (def.isCoreCommand && def.id === "C") {
            specialRuleText = "Loses to any attacker";
        } else if (def.isStarCommand && def.id === "10") {
            specialRuleText = "Loses to Stealth Squad";
        }

        if (specialRuleText) {
            fill(180);
            //            textSize(11); 
            textAlign(LEFT, CENTER);
            text(specialRuleText, specialRuleTextStartX, textBlockCenterY);
        }

        // Add special rules descriptions 2 4
        specialRuleText = "";
        if (def.canMoveFast) {
            specialRuleText = "Moves fast";
        } else if (def.canCloake && def.canSnipe) {
            specialRuleText = "Can cloak by pressing 'c' and snipe when not cloaked";
        } else if (def.canShoot) {
            specialRuleText = "Can shoot";
        } else if (def.canCloake) {
            specialRuleText = "Can cloak by pressing 'c'";
        }

        if (specialRuleText) {
            fill(180);
            //            textSize(11); 
            textAlign(LEFT, CENTER);
            text(specialRuleText, specialRuleTextStartX + 200, textBlockCenterY);
        }

        currentItemContentStartY += itemHeight;
    });
    textSize(14);
}

function numberOfBullets() {
    gameObjects.forEach(canon => {
        numberOfBullets += canon.bullets.length;
        // Count visible bullets
        canon.bullets.forEach(bullet => {
            let xLocal = bullet.xGlobal - me.xGlobal;
            let yLocal = bullet.yGlobal - me.yGlobal;
            if (onLocalScreenArea(xLocal, yLocal)) {
                totalNumberOfVisualBullets++;
            }
            totalNumberOfBullets++;
        });
    });
}


function drawSpacecraft(playerData, characterData) {
    // Skip drawing if not valid or lost
    if (!playerData || !playerData.hasCharacter ||
        playerData.status === 'lost' ||
        playerData.x < -playerData.size ||
        playerData.y < -playerData.size) {
        return;
    }

    // Use characterData from shared list to check status
    if (!characterData || characterData.status === 'lost') {
        return;
    }

    let drawX = constrain(playerData.x, GAME_AREA_X + playerData.size / 2, GAME_AREA_RIGHT - playerData.size / 2);
    let drawY = constrain(playerData.y, GAME_AREA_Y + playerData.size / 2, GAME_AREA_BOTTOM - playerData.size / 2);

    // Define RGB values directly instead of using color()
    let r, g, b;
    if (playerData.team === 'blue') {
        //        r = 0; g = 150; b = 255;
        r = 133; g = 69; b = 196;

    } else if (playerData.team === 'green') {
        r = 0; g = 200; b = 100;
    } else {
        r = 150; g = 150; b = 150;
    }

    // Apply appropriate stroke style
    if (playerData.playerNumber === me.playerNumber) {
        stroke(255, 255, 0);
        strokeWeight(2);
    } else {
        noStroke();
    }

    fill(r, g, b);
    ellipse(drawX, drawY, playerData.size, playerData.size);
    noStroke();

    // Reveal rank if appropriate
    const shouldRevealRank = true

    if (shouldRevealRank && playerData.characterId) {
        // Calculate brightness directly from RGB values
        let brightness = (r * 299 + g * 587 + b * 114) / 1000;
        fill(brightness > 125 ? 0 : 255);
        textSize(playerData.size * 0.45);
        textAlign(CENTER, CENTER);
        text(playerData.characterId, drawX, drawY + 1);
    }

    fill(200);
    textSize(10);
    textAlign(CENTER, BOTTOM);
    text(playerData.playerDisplayName || '?', drawX, drawY + playerData.size / 2 + 12);
}

//===================================================
// GAME STATE FUNCTIONS
//===================================================

function drawGameSetup() {
    if (!me.isReady) {
        const centerX = IMAGE_RING_X + CIRCLE_RADIUS + 90;
        const centerY = IMAGE_RING_Y + CIRCLE_RADIUS + 290;

        if (imagesStillLoading) {

            // Draw progress bar
            const barX = chooseTeamBlueButton.x - 7;
            const barY = chooseTeamBlueButton.x + chooseTeamBlueButton.height + 5;
            const barWidth = chooseTeamBlueButton.width * 2 + 15;
            const barHeight = 2; // Thin rectangle

            let progress = 0;
            if (totalImagesToLoadForPrepareImages > 0) {
                progress = imagesLoadedCount / totalImagesToLoadForPrepareImages;
            } else if (!imagesStillLoading) {
                progress = 1; // If no images to load and loading is marked as finished 2 3
            }
            progress = constrain(progress, 0, 1);

            fill(0, 255, 0);
            rect(barX, barY, barWidth * progress, barHeight);
        }

        // Show name input elements 
        fill(255);
        textSize(20);
        textAlign(CENTER, CENTER);
        text("Enter your player name and choose a team:", centerX, centerY);

        // Calculate team counts
        let blueTeamCount = guests.filter(p => p.isReady && p.team === 'blue').length;
        let greenTeamCount = guests.filter(p => p.isReady && p.team === 'green').length;

        // Conditionally show buttons or full message
        if (blueTeamCount >= MAX_PLAYERS_PER_TEAM && greenTeamCount >= MAX_PLAYERS_PER_TEAM) {
            // Both teams full
            if (nameInput) nameInput.show();
            if (chooseTeamBlueButton) chooseTeamBlueButton.hide();
            if (chooseTeamGreenButton) chooseTeamGreenButton.hide();
            fill(255, 100, 100);
            textSize(18);
            textAlign(CENTER, CENTER);
            text("New players cannot join because both teams are full.", centerX, centerY);
        } else {
            // At least one team has space
            if (nameInput) nameInput.show();
            if (chooseTeamBlueButton) {
                if (blueTeamCount < MAX_PLAYERS_PER_TEAM) chooseTeamBlueButton.show();
                else {
                    chooseTeamBlueButton.hide();
                    fill(150); textSize(14); textAlign(CENTER, CENTER);
                    text("Purple Team Full", chooseTeamBlueButton.x + chooseTeamBlueButton.width / 2,
                        chooseTeamBlueButton.y + chooseTeamBlueButton.height + 10);
                }
            }
            if (chooseTeamGreenButton) {
                if (greenTeamCount < MAX_PLAYERS_PER_TEAM) chooseTeamGreenButton.show();
                else {
                    chooseTeamGreenButton.hide();
                    fill(150); textSize(14); textAlign(CENTER, CENTER);
                    text("Green Team Full", chooseTeamGreenButton.x + chooseTeamGreenButton.width / 2,
                        chooseTeamGreenButton.y + chooseTeamGreenButton.height + 10);
                }
            }
        }
    } else {
        // Hide initial setup UI
        if (nameInput) nameInput.hide();
        if (chooseTeamBlueButton) chooseTeamBlueButton.hide();
        if (chooseTeamGreenButton) chooseTeamGreenButton.hide();

        // Draw welcome text and character list
        drawTopLeftInfo();
        drawCharacterList();

        // Display setup messages if countdown hasn't started
        if (!shared.gameStartTimerStartTime) {
            const statusMsgX = GAME_AREA_X + GAME_AREA_WIDTH / 2;
            const statusMsgY = GAME_AREA_Y - 30;

            let blueFlagSelected = shared.characterList.some(c => c.team === 'blue' && c.id === 'C' && c.takenByPlayerId !== null);
            let greenFlagSelected = shared.characterList.some(c => c.team === 'green' && c.id === 'C' && c.takenByPlayerId !== null);

            fill(255, 100, 100);
            textAlign(CENTER, CENTER);
            textSize(20);

            let statusText = "";

            if (!blueFlagSelected || !greenFlagSelected) {
                if ((me.team === 'blue' && !blueFlagSelected) ||
                    (me.team === 'green' && !greenFlagSelected)) {
                    statusText = "A player from your team must select a Core Command...";
                    //console.log({ guests })
                    //console.log()
                } else {
                    statusText = "Waiting for the other team to choose a Core Command...";
                }
            }

            if (statusText) {
                text(statusText, statusMsgX, statusMsgY);
            }
        }
    }
}

function drawCharacterListAndInfo() {
    //console.log("drawCharacterListAndInfo");
    // Draw welcome text and character list
    if (me.isReady) {
        drawTopLeftInfo();
        drawCharacterList();
    }
}

function drawCanonTowers() {
    if (!gameObjects) return;

    // Draw Canon Towers for all players - only on planet 3
    if (me.planetIndex === 3) {
        gameObjects.forEach(canon => {
            canon.drawCanonTower(); 
            canon.drawBullets();
        });
    }
}
 
function drawDummyObjects() {
    if (!dummyObjects) return;

    if (me.planetIndex === 4) {
        dummyObjects.forEach((dummyObject, index) => {
            if (index < dummyObjectsCount) {
                //console.log("Drawing dummy object:", dummyObject);
                dummyObject.drawCanonTower();
            }
        });
    }
}

function drawSpacecrafts() {
    // Draw all active spacecraft 
    /*
        guests.forEach(p => {
            const characterData = shared.characterList.find(c => c.instanceId === p.characterInstanceId);
            if (p.hasCharacter && characterData && characterData.status !== 'lost') {
                let spacecraft = spacecrafts.find(s => s.playerNumber === p.playerNumber);
                drawSpacecraft(p, characterData);
            }
        }); 
    */
    spacecrafts.forEach((spacecraft) => {
        //        console.log({spacecraft})
        //        console.log(me) 

        if (spacecraft.planetIndex === me.planetIndex) {
            const characterData = shared.characterList.find(c => c.instanceId === spacecraft.characterInstanceId);
            //console.log("CharacterData:", characterData);
            if (spacecraft.hasCharacter && characterData && characterData.status !== 'lost') {
                //console.log("Drawing spacecraft:", spacecraft.playerName);

                spacecraft.drawBullets();
                spacecraft.drawSpacecraft(characterData);
            }
        }
    });
}

function drawGameFinished() {
    // Draw welcome text and character list
    if (me.isReady) {
        drawTopLeftInfo();
        drawCharacterList();
    }

    // Draw all remaining spacecraft (revealed)
    guests.forEach(p => {
        const characterData = shared.characterList.find(c => c.instanceId === p.characterInstanceId);
        if (characterData && !characterData.isPermanentlyLost) {
            let tempData = { ...p };
            drawSpacecraft(tempData, characterData);
        }
    });

    // Display Winner Message
    const winMsgX = GAME_AREA_X + GAME_AREA_WIDTH / 2;
    const winMsgY = GAME_AREA_Y + GAME_AREA_HEIGHT / 2;
    fill(255, 223, 0);
    textSize(36);
    textAlign(CENTER, CENTER);

    let winText = "Game Over!";
    if (shared.coreCommandDisconnected) {
        if (shared.winningTeam === "blue") {
            winText = `PURPLE TEAM WINS! (because Core Command disconnected)`;
        } else {
            winText = `GREEN TEAM WINS! (because Core Command disconnected)`;
        }
    } else if (shared.winningTeam === "draw") {
        winText = `DRAW as the two Core Commanders were in battle! `;
    } else if (shared.winningTeam) {
        if (shared.winningTeam === "blue") {
            winText = `PURPLE TEAM WINS! `;
        } else {
            winText = `GREEN TEAM WINS! `;
        }
        if (shared.winningPlayerName && !shared.winningPlayerName.includes("Time's up")) {
            winText += `\n(Core Command captured by ${shared.winningPlayerName})`;
            textSize(24);
        } else {
            winText += `\n(Core Command was hit too many times)`;
        }
    }
    text(winText, winMsgX, winMsgY - 20);
}


function setPlayerInfo(team) {
    const playerDisplayName = nameInput.value().trim();
    message = ""; // Clear previous messages

    if (playerDisplayName.length > 0) {
        // Check team count before joining
        let blueTeamCount = guests.filter(p => p.isReady && p.team === 'blue').length;
        let greenTeamCount = guests.filter(p => p.isReady && p.team === 'green').length;

        if (team === 'blue' && blueTeamCount >= MAX_PLAYERS_PER_TEAM) {
            // alert("Cannot join Blue Team, it is full (max 3 players).");
            message = "Cannot join Purple Team, it is full.";
            return;
        }

        if (team === 'green' && greenTeamCount >= MAX_PLAYERS_PER_TEAM) {
            // alert("Cannot join Green Team, it is full (max 3 players).");
            message = "Cannot join Green Team, it is full.";
            return;
        }
        setSpawnLocation();

        me.playerDisplayName = playerDisplayName;
        me.team = team;
        me.isReady = true;
        nameInput.hide();
        chooseTeamBlueButton.hide();
        chooseTeamGreenButton.hide();
    } else {
        // alert("Please enter a player name.");
        message = "Please enter a player name.";
    }
}

//===================================================
// Lets have an easy way to turn of performance heavy graphics
//===================================================

function keyPressed() {

    // https://www.toptal.com/developers/keycode
    if (keyCode === 80) { // p 
        showGraphics = !showGraphics;
    }
    if (keyCode === 79) { // o
        showBlurAndTintEffects = !showBlurAndTintEffects;
    }
    if (keyCode === 73) { // i
        showStarSystem = !showStarSystem;
    }
    if (keyCode === 85) { // u
        showColorBlindText = !showColorBlindText;
    }
    if (keyCode === 75) { // k
        if (dummyObjectsCount < 23) {
            dummyObjectsCount++
        }
    }
    if (keyCode === 76) { // l
        if (dummyObjectsCount > 0) {
            dummyObjectsCount--
        }
    }

    const myCharacterData = shared.characterList.find(c => c.instanceId === me.characterInstanceId);
    if (!myCharacterData) return;

    console.log("keyPressed", keyCode, myCharacterData);
    if (myCharacterData.canCloake && keyCode === 67) { // c
        me.isCloaked = !me.isCloaked;
        console.log("Cloaked:", me.isCloaked);
    }

}

//===================================================
// CHARACTER MANAGEMENT
//===================================================

function initializeCharacterList() {
    if (partyIsHost()) {
        shared.characterList = [];
        const teams = ['blue', 'green'];

        teams.forEach(team => {
            CHARACTER_DEFINITIONS.forEach(def => {
                for (let i = 0; i < def.count; i++) {
                    shared.characterList.push({
                        // Core definition properties
                        ...def,
                        // Instance specific properties
                        team: team,
                        instanceId: `${team}_${def.id}_${i}`,
                        takenByPlayerName: null,
                        takenByPlayerId: null,
                        isPermanentlyLost: false,
                        // Battle/Status Fields
                        status: 'available',
                        inBattleWithInstanceId: null,
                        battleOutcomeResult: null,
                        battleInfo: null,
                        color: def.color,
                    });
                }
            });
        });
        console.log("HOST: Initialized shared.characterList with team assignments and status fields.");
    }
}

function drawCharacterList() {
    // console.log("drawCharacterList");
    const listX = 10;
    let listY = 80;
    const itemHeight = 25;
    const itemWidth = 220;

    fill(200);
    textSize(14);
    textAlign(LEFT, TOP);

    // Filter list for player's team only
    const myTeamCharacterList = shared.characterList?.filter(item => item.team === me.team) || [];

    // Determine selection conditions
    let myTeamFlagChosen = guests.some(p => p.team === me.team && p.characterId === 'C' && p.takenByPlayerId !== null);
    let canSelectAnyAvailable = me.isReady && !me.hasCharacter;

    // Find the player's current character data from shared list
    let myCharacterData = shared.characterList.find(c => c.instanceId === me.characterInstanceId);

    // Battle outcome message
    if (shared.gameState !== 'GAME-FINISHED' && me.hasCharacter &&
        myCharacterData && myCharacterData.isPermanentlyLost &&
        myCharacterData.battleOutcomeResult) {
        //console.log('drawCharacterList', myTeamFlagChosen, canSelectAnyAvailable)
        //console.log(me)
    }
    // Filter drawable characters
    const drawableCharacters = myTeamCharacterList.filter(item => !item.isPermanentlyLost);

    drawableCharacters.forEach((item, index) => {
        let displayY = listY + index * itemHeight;
        let isAvailable = !item.takenByPlayerName;
        let canSelectItem = false;

        // Determine selectability
        if (!shared.resetFlag && canSelectAnyAvailable && isAvailable) {
            if (item.isCoreCommand) {
                // Can select flag only if team flag isn't chosen 
                canSelectItem = !myTeamFlagChosen;
            } else {
                // Can select non-flag if team flag IS chosen OR game is already in progress
                canSelectItem = myTeamFlagChosen || shared.gameState !== 'GAME-SETUP';
            }
        }

        // Highlighting logic
        if (mouseX > listX && mouseX < listX + itemWidth &&
            mouseY > displayY && mouseY < displayY + itemHeight) { // Added !imagesStillLoading

            if (canSelectItem) {
                fill(0, 150, 200, 150); // Highlight selectable
                //                fill(133, 69, 196, 150);
                noStroke();
                rect(listX, displayY, itemWidth, itemHeight);
            } else if (isAvailable) {
                fill(100, 100, 100, 100); // Highlight available but not selectable
                noStroke();
                rect(listX, displayY, itemWidth, itemHeight);
            }
        }

        // Text color logic
        if (!isAvailable) fill(100); // Taken
        else if (canSelectItem) fill(255); // Selectable by me
        else fill(150); // Available but not selectable by me

        // Display text
        let displayText = `(${item.id}) ${item.name}`;

        let hitByOthers = numberOfTimesBeingHit(item.takenByPlayerId)

        if (!isAvailable) displayText += ` - ${item.takenByPlayerName} (${hitByOthers}/10)`;

        textAlign(LEFT, CENTER);
        text(displayText, listX + 5, displayY + itemHeight / 2);
    });

    textAlign(LEFT, TOP); // Reset alignment
}

function numberOfTimesBeingHit(takenByPlayerId) {
    let hitByOthers = 0;
    spacecrafts.forEach(spacecraft => {
        hitByOthers += spacecraft.hits[takenByPlayerId];
    })
    hitByOthers += shared.canonTowerHits[takenByPlayerId];

    return hitByOthers;
}

//===================================================
// USER INPUT AND INTERACTION
//===================================================

function mousePressed() {
    if (imagesStillLoading) return; // Prevent interaction while loading
    //   console.log("mousePressed", mouseX, mouseY, onLocalScreenArea(mouseX, mouseY));

    if (!me.isReady) {
        gameImageManager.checkImageClicks();
        return;
    }
    // Character Selection Logic
    if (me.isReady && !me.hasCharacter) {
        handleCharacterSelection();
    }

    const myCharacterData = shared.characterList.find(c => c.instanceId === me.characterInstanceId);
    if (!me.hasCharacter ||
        me.status !== 'available' ||
        !myCharacterData ||
        myCharacterData.status !== 'available' ||
        shared.coreCommandLost ||
        !onLocalScreenArea(mouseX - GAME_AREA_X, mouseY - GAME_AREA_Y) ||
        shared.gameState !== 'IN-GAME'
    ) return;

    // Ensure the character has the canShoot flag
    if (!myCharacterData.canShoot || me.isCloaked) return;

    // Determine bullet limit
    let maxBullets = NUMBER_OF_BULLETS;
    if (myCharacterData.canSnipe) {
        maxBullets = 1;
    }

    console.log("before shoot", me.bullets.length, maxBullets)
    if (shared.gameState != "IN-GAME" || me.bullets.length >= maxBullets) return

    let bullet = {
        xLocal: me.xLocal,
        yLocal: me.yLocal,
        xStart: me.xLocal,
        yStart: me.yLocal,
        xMouseStart: me.xMouse,
        yMouseStart: me.yMouse,
        xGlobal: me.xGlobal,
        yGlobal: me.yGlobal,
    };
    me.bullets.push(bullet);
    console.log("After shoot", me.bullets.length, maxBullets)

}


function handleCharacterSelection() {
    const listX = 10;
    let listY = 80;
    const itemHeight = 25;
    const itemWidth = 220;

    // Filter for player's team only
    const myTeamCharacterList = shared.characterList?.filter(item => item.team === me.team) || [];

    // Get team flag status
    let myTeamFlagChosen = guests.some(p => p.team === me.team && p.characterId === 'C' && p.takenByPlayerId !== null);

    const selectableCharacters = myTeamCharacterList.filter(item => !item.isPermanentlyLost);

    for (let index = 0; index < selectableCharacters.length; index++) {
        const item = selectableCharacters[index];
        let displayY = listY + index * itemHeight;
        let isAvailable = !item.takenByPlayerName;
        let canSelectItem = false;

        if (isAvailable) {
            if (item.isCoreCommand) {
                canSelectItem = !myTeamFlagChosen;
            } else {
                canSelectItem = myTeamFlagChosen || shared.gameState !== 'GAME-SETUP';
            }
        }

        if (canSelectItem &&
            mouseX > listX && mouseX < listX + itemWidth &&
            mouseY > displayY && mouseY < displayY + itemHeight) {

            // Assign character details to 'me'
            me.characterId = item.id;
            me.characterRank = item.rank;
            me.characterName = item.name;
            me.characterInstanceId = item.instanceId;
            me.hasCharacter = true;
            me.status = "available";
            me.playerColor = item.color;

            if (item.isCoreCommand) {
                setSpawnLocation();
            } else {
                spawnNextToCoreCommand();
            }

            console.log(`Selected: ${me.characterName} (${me.characterInstanceId}) for team ${me.team}`);
            break; // Exit loop once selection is made
        }
    }
}

function spawnNextToCoreCommand() {
    // Find the Core Command character for the same team that is currently taken
    const coreCommandCharacter = shared.characterList.find(c =>
        c.team === me.team &&
        c.id === 'C' &&
        c.takenByPlayerId !== null
    );

    if (coreCommandCharacter && coreCommandCharacter.takenByPlayerId !== null) {
        // Find the player object (from guests) who is the Core Command
        const coreCommandPlayer = guests.find(p => p.playerNumber === coreCommandCharacter.takenByPlayerId);

        if (coreCommandPlayer) {
            // Spawn 'me' at the exact same location as the Core Command player
            me.planetIndex = coreCommandPlayer.planetIndex;
            me.xGlobal = coreCommandPlayer.xGlobal;
            me.yGlobal = coreCommandPlayer.yGlobal;
            me.xLocal = coreCommandPlayer.xLocal;
            me.yLocal = coreCommandPlayer.yLocal;

            if (me.planetIndex !== -1 && solarSystem && solarSystem.planets[me.planetIndex]) {
                selectedPlanet = solarSystem.planets[me.planetIndex];
            } else {
                console.warn(`SpawnNextToCoreCommand: Core Command player ${coreCommandPlayer.playerName} has invalid planetIndex ${me.planetIndex}. Falling back to default spawn.`);
                setSpawnLocation(); // Fallback if planetIndex is invalid
            }
            console.log(`Player ${me.playerName} spawning at Core Command ${coreCommandPlayer.playerName}'s location on planet ${me.planetIndex}.`);
        } else {
            console.warn(`SpawnNextToCoreCommand: Core Command player (ID: ${coreCommandCharacter.takenByPlayerId}) not found in guests. Falling back to default spawn.`);
            setSpawnLocation(); // Fallback if Core Command player not found
        }
    } else {
        console.warn(`SpawnNextToCoreCommand: Core Command for team ${me.team} not found or not taken. Falling back to default spawn.`);
        setSpawnLocation(); // Fallback if Core Command character not found/taken 
    }
}

function setSpawnLocation() {
    if (me.team === 'blue') {
        me.planetIndex = planetIndexBlue;
    } else {
        me.planetIndex = planetIndexGreen;
    }
    selectedPlanet = solarSystem.planets[me.planetIndex];

    if (!selectedPlanet) {
        console.error("Selected planet is undefined in setSpawnLocation. Defaulting to center.");
        // Default spawn if planet data is missing
        me.xGlobal = SCREEN_WIDTH / 2; // Or some other sensible default 2
        me.yGlobal = SCREEN_HEIGHT / 2;
        me.xLocal = GAME_AREA_WIDTH / 2;
        me.yLocal = GAME_AREA_HEIGHT / 2;
        return;
    }

    if (me.planetIndex === 1) {
        if (me.team === 'blue') {
            // Blue team spawns 100 pixels to the right of the 'up' warp gate
            me.xGlobal = selectedPlanet.xWarpGateDown - 400;
            me.yGlobal = selectedPlanet.yWarpGateDown - 200;
            me.xLocal = GAME_AREA_WIDTH / 2 + 200;
            me.yLocal = GAME_AREA_HEIGHT / 2 + 100;

        } else { // Green team        
            // Preserve existing local coordinate setup for green team
            me.xGlobal = selectedPlanet.xWarpGateUp - GAME_AREA_WIDTH / 2 - 200;
            me.yGlobal = selectedPlanet.yWarpGateUp - GAME_AREA_HEIGHT / 2 - 100;
            me.xLocal = GAME_AREA_WIDTH / 2 - 200;
            me.yLocal = GAME_AREA_HEIGHT / 2 - 100;
        }
    } else if (me.planetIndex === 4) {
        if (me.team === 'blue') {
            // Blue team spawns 100 pixels to the right of the 'up' warp gate
            // Preserve existing local coordinate setup for green team
            me.xGlobal = selectedPlanet.xWarpGateUp - GAME_AREA_WIDTH / 2 - 200;
            me.yGlobal = selectedPlanet.yWarpGateUp - GAME_AREA_HEIGHT / 2 - 100;
            me.xLocal = GAME_AREA_WIDTH / 2 - 200;
            me.yLocal = GAME_AREA_HEIGHT / 2 - 100;

        } else { // Green team        
            // Preserve existing local coordinate setup for green team
            me.xGlobal = selectedPlanet.xWarpGateDown - GAME_AREA_WIDTH / 2 - 200;
            me.yGlobal = selectedPlanet.yWarpGateDown - GAME_AREA_HEIGHT / 2 - 100;
            me.xLocal = GAME_AREA_WIDTH / 2 - 200;
            me.yLocal = GAME_AREA_HEIGHT / 2 - 100;
        }
    } else {
        if (me.team === 'blue') {
            // Blue team spawns 100 pixels to the right of the 'up' warp gate
            me.xGlobal = selectedPlanet.xWarpGateUp - 400;
            me.yGlobal = selectedPlanet.yWarpGateUp - 200;
            me.xLocal = GAME_AREA_WIDTH / 2 + 200;
            me.yLocal = GAME_AREA_HEIGHT / 2 + 100;

        } else { // Green team        
            // Preserve existing local coordinate setup for green team
            me.xGlobal = selectedPlanet.xWarpGateDown - GAME_AREA_WIDTH / 2 - 200;
            me.yGlobal = selectedPlanet.yWarpGateDown - GAME_AREA_HEIGHT / 2 - 100;
            me.xLocal = GAME_AREA_WIDTH / 2 - 200;
            me.yLocal = GAME_AREA_HEIGHT / 2 - 100;
        }
    }
}

function handlePlayerMovement() {
    // Check if player can move
    const myCharacterData = shared.characterList.find(c => c.instanceId === me.characterInstanceId);
    if (!me.hasCharacter ||
        me.status !== 'available' ||
        !myCharacterData ||
        myCharacterData.status !== 'available' ||
        shared.coreCommandLost) return;
    /*
        // Check if player is in post-collision cooldown period
        if (me.lastCollisionTime && (millis() - me.lastCollisionTime < 2000)) {
            // Player touched an opponent less than 2 seconds ago - can't move
            return;
        }
    
        // Check if player is in post-collision cooldown period
        if (me.lastBulletCollisionTime && (millis() - me.lastBulletCollisionTime < 2000)) {
            // Player touched an opponent less than 2 seconds ago - can't move
            return;
        }
    
        // Check for collisions with opponents
        const opponents = spacecrafts.filter(spacecraft =>
            spacecraft.planetIndex === me.planetIndex &&
            spacecraft.hasCharacter &&
            spacecraft.team !== me.team);
    
        for (const opponent of opponents) {
            // Calculate distance between player and opponent
            const d = dist(
                me.xGlobal + me.xLocal,
                me.yGlobal + me.yLocal,
                opponent.xGlobal + opponent.xLocal,
                opponent.yGlobal + opponent.yLocal
            );
    
            // If collision detected
            if (d < (me.diameter / 2 + opponent.diameter / 2)) {
                // Set collision timestamp
                me.lastCollisionTime = millis();
                // Exit function early - can't move after collision
                return;
            }
        }
    */
    // Local movement (game area)
    let localOffX = 0;
    let localOffY = 0;

    let localSpeed = SPACECRAFT_SPEED; // 6 or 3

    if (keyIsDown(70)) { localOffX = -localSpeed } // F
    if (keyIsDown(72)) { localOffX = localSpeed }  // H
    if (keyIsDown(84)) { localOffY = -localSpeed } // T
    if (keyIsDown(71)) { localOffY = localSpeed }  // G

    // Global movement (planet)
    let globalSpeed;
    if (myCharacterData.canMoveFast) {
        globalSpeed = SPACECRAFT_SPEED + 2; // 12 or 6
    } else {
        globalSpeed = SPACECRAFT_SPEED; // 6 or 3
    }
    if (me.planetIndex === 2) {
        globalSpeed--
        globalSpeed--
    }
    if (me.planetIndex === 3) {
        globalSpeed--
    }

    // Reduce speed if cloaked and character can cloak
    if (myCharacterData.canCloake && me.isCloaked) {
        globalSpeed = Math.max(1, globalSpeed * 2 / 3); // Reduce speed to 2/3, ensure it's at least 1
    }

    let gOffX = 0, gOffY = 0;
    if (keyIsDown(65)) { gOffX = -globalSpeed } // A
    if (keyIsDown(68)) { gOffX = globalSpeed }  // D
    if (keyIsDown(87)) { gOffY = -globalSpeed } // W
    if (keyIsDown(83)) { gOffY = globalSpeed }  // S

    let xTemp = me.xLocal + localOffX;
    let yTemp = me.yLocal + localOffY;
    let newxGlobal = me.xGlobal + gOffX;
    let newyGlobal = me.yGlobal + gOffY;

    // Keep local position within screen bounds
    xTemp = constrain(xTemp, 0, GAME_AREA_WIDTH);
    yTemp = constrain(yTemp, 0, GAME_AREA_HEIGHT);

    // Keep global position within planet bounds 
    newxGlobal = constrain(newxGlobal, 0, selectedPlanet.diameterPlanet);
    newyGlobal = constrain(newyGlobal, 0, selectedPlanet.diameterPlanet);

    if (selectedPlanet && selectedPlanet.onPlanet(xTemp + newxGlobal, yTemp + newyGlobal)) {
        me.xGlobal = newxGlobal;
        me.yGlobal = newyGlobal;
        me.xLocal = xTemp;
        me.yLocal = yTemp;
    }

    me.xMouse = mouseX - GAME_AREA_X;
    me.yMouse = mouseY - GAME_AREA_Y;

    //    console.log(me)
    //   console.log("me.xGlobal", me.xGlobal, "me.yGlobal", me.yGlobal);
    ///   console.log("me.xLocal", me.xLocal, "me.yLocal", me.yLocal); 2 4
}

function handleBulletMovement() {
    const myCharacterData = shared.characterList.find(c => c.instanceId === me.characterInstanceId);

    for (let i = me.bullets.length - 1; i >= 0; i--) {
        let bullet = me.bullets[i];
        let bulletVector = createVector(
            int(bullet.xMouseStart) - bullet.xStart,
            int(bullet.yMouseStart) - bullet.yStart,
        ).normalize();

        let currentBulletSpeed = parseInt(BULLET_SPEED);
        if (myCharacterData && myCharacterData.canSnipe) {
            currentBulletSpeed *= 2; // Sniper bullets are twice as fast
        }

        bullet.xLocal += bulletVector.x * currentBulletSpeed;
        bullet.yLocal += bulletVector.y * currentBulletSpeed;

        // Update global coordinates
        bullet.xGlobal += bulletVector.x * currentBulletSpeed;
        bullet.yGlobal += bulletVector.y * currentBulletSpeed;

        let xLocalTemp = bullet.xLocal - (me.xGlobal - bullet.xGlobal);
        let yLocalTemp = bullet.yLocal - (me.yGlobal - bullet.yGlobal);

        // Remove bullet if it's not on the screen seen from the spacecraft shooting it
        if (!selectedPlanet.onPlanet(bullet.xLocal + bullet.xGlobal, bullet.yLocal + bullet.yGlobal)
            || !onLocalScreenArea(xLocalTemp, yLocalTemp)) {
            me.bullets.splice(i, 1);
        }
    }
}

//===================================================
// STATE SYNCHRONIZATION
//===================================================

function updateLocalStateFromSharedList() {
    if (!shared.characterList || shared.characterList.length === 0) return;

    // Find the player's current character data from shared list
    let myCharacterData = shared.characterList.find(c => c.instanceId === me.characterInstanceId);

    // Battle outcome message
    if (shared.gameState !== 'GAME-FINISHED' && me.hasCharacter &&
        myCharacterData && myCharacterData.isPermanentlyLost &&
        myCharacterData.battleOutcomeResult) {
        handlePlayerLoss();
    }
    // --- Reset Hit Counts for Lost Opponents ---
    if (me.hits && me.hits.length > 0) {
        for (let playerId = 0; playerId < me.hits.length; playerId++) {
            // Skip self and skip if already zero
            if (playerId === me.playerNumber || me.hits[playerId] === 0) {
                continue;
            }

            // Only reset hit counts for players that are PERMANENTLY lost
            // This ensures that players in battle or temporarily without characters still maintain their hit count
            const playerIsPermanentlyLost = !shared.characterList.some(character =>
                character.takenByPlayerId === playerId &&
                !character.isPermanentlyLost
            );

            if (playerIsPermanentlyLost) {
                console.log(`Client ${me.playerName}: Resetting hits for player ${playerId} as they are permanently lost.`);
                me.hits[playerId] = 0;
            }
        }
    }
}

function handlePlayerLoss() {
    if (!me.hasCharacter) return;

    console.log(`Player ${me.playerName} processing loss of ${me.characterName} (${me.characterInstanceId}) locally.`);

    // Reset player state
    me.hasCharacter = false;
    me.characterId = null;
    me.characterRank = null;
    me.characterName = null;
    me.planetIndex = -1;
    me.status = 'lost'; // Intermediate status
    if (me.team === 'blue') {
        me.planetIndex = planetIndexBlue;
    } else {
        me.planetIndex = planetIndexGreen;
    }
}

function resetClientState() {
    console.log(`Client Resetting State for ${me.playerName || 'New Player'}...`);

    // Save important state to preserve - jens
    let savedPlayerNumber = me.playerNumber;
    let savedPlayerName = me.playerName;
    let savedPlayerDisplayName = me.playerDisplayName;
    let savedTeam = me.team;
    let savedIsReady = me.isReady;
    let savedPlanetIndex;

    if (me.team === 'blue') {
        savedPlanetIndex = planetIndexBlue;
    } else {
        savedPlanetIndex = planetIndexGreen;
    }

    // Reset player state jens
    Object.assign(me, {
        playerNumber: savedPlayerNumber,
        playerName: savedPlayerName,
        playerDisplayName: savedPlayerDisplayName,
        team: savedTeam,
        isReady: savedIsReady,
        characterId: null,
        characterRank: null,
        characterName: null,
        characterInstanceId: null,
        planetIndex: savedPlanetIndex,
        hasCharacter: false,
        status: "available",
        hits: Array(15).fill(0),
    });

    message = "";

    // Reset UI elements
    if (!nameInput || !nameInput.elt) createNameInput();
    if (!chooseTeamBlueButton || !chooseTeamBlueButton.elt) createNameInput();
    if (!chooseTeamGreenButton || !chooseTeamGreenButton.elt) createNameInput();

    // Show/Hide UI based on player setup state
    if (me.isReady) {
        nameInput.hide();
        chooseTeamBlueButton.hide();
        chooseTeamGreenButton.hide();
    } else {
        nameInput.show();
        chooseTeamBlueButton.show();
        chooseTeamGreenButton.show();
    }

    console.log("Client state reset complete.");
}

//===================================================
// HOST FUNCTIONS
//===================================================

function handleHostDuties() {
    if (!partyIsHost()) return;

    shared.currentTime = millis();

    // Mark characters as permanently lost if their player disconnected
    handleDisconnectedPlayers();

    // Update shared.characterList 'takenBy' info
    updateCharacterAssignments();

    // State machine for game phases
    //console.log("HOST: Current game state:", shared.gameState);
    //    console.log(shared.gameState);
    switch (shared.gameState) {
        case "GAME-SETUP":
            handleGameSetupHost();
            break;
        case "IN-GAME":
            //console.log("HOST: Game is in progress.");

            if (!shared.coreCommandLost) {
                handleGameInProgressHost();
            }
            break;
        case "GAME-FINISHED":
            handleGameFinishedHost();
            break;
    }
}

// Add this function if not present:
function handleDisconnectedPlayers() {
    if (!shared.characterList) return;

    const connectedPlayerIds = new Set(guests.map(p => p.playerNumber));

    shared.characterList.forEach(character => {
        // Only process characters that are assigned and not already lost
        if (character.takenByPlayerId && !character.isPermanentlyLost) {
            if (!connectedPlayerIds.has(character.takenByPlayerId)) {
                character.isPermanentlyLost = true;
                character.takenByPlayerId = null;
                character.takenByPlayerName = null;
                character.status = 'lost';
                character.inBattleWithInstanceId = null;
                character.battleOutcomeResult = null;
                character.battleInfo = null;
            }
        }
    });
}

function updateCharacterAssignments() {
    if (!shared.characterList) return;

    // Build map of current assignments
    let currentAssignments = new Map();
    guests.forEach(p => {
        if (p.hasCharacter && p.characterInstanceId) {
            currentAssignments.set(p.characterInstanceId, {
                name: p.playerDisplayName,
                playerNumber: p.playerNumber
            });
        }
    });

    // Update assignments in shared list
    shared.characterList.forEach(item => {
        if (!item.isPermanentlyLost) {
            const assignment = currentAssignments.get(item.instanceId);
            if (assignment) {
                if (item.takenByPlayerId !== assignment.playerNumber) {
                    item.takenByPlayerName = assignment.name;
                    item.takenByPlayerId = assignment.playerNumber;
                }
            } else if (item.takenByPlayerId !== null) {
                // Clear assignment if no longer owned
                item.takenByPlayerName = null;
                item.takenByPlayerId = null;
            }
        } else {
            // Ensure lost pieces have no owner
            if (item.takenByPlayerId !== null) {
                item.takenByPlayerName = null;
                item.takenByPlayerId = null;
            }
        }
    });
}

function handleGameSetupHost() {
    // Check if flags are selected
    let blueFlagSelected = shared.characterList.some(c => c.team === 'blue' && c.id === 'C' && c.takenByPlayerId !== null);
    let greenFlagSelected = shared.characterList.some(c => c.team === 'green' && c.id === 'C' && c.takenByPlayerId !== null);

    const conditionsMet = blueFlagSelected && greenFlagSelected;

    // Start countdown if conditions met
    if (conditionsMet && shared.gameStartTimerStartTime === null) {
        console.log("HOST: Both flags selected. Starting game start countdown timer.");
        shared.gameStartTimerStartTime = shared.currentTime;
        shared.gameStartTimerSeconds = Math.floor(GAME_TRANSITION_TIME / 1000); // Initialize with full seconds
    }

    // Cancel countdown if conditions no longer met
    if (!conditionsMet && shared.gameStartTimerStartTime !== null) {
        console.log("HOST: Flag selection condition no longer met. Cancelling game start countdown timer.");
        shared.gameStartTimerStartTime = null;
        shared.gameStartTimerSeconds = null; // Clear the seconds as well
    }

    // Update timer only if it's active
    if (shared.gameStartTimerStartTime !== null) {
        const elapsedSeconds = Math.floor((shared.currentTime - shared.gameStartTimerStartTime) / 1000);
        const remainingSeconds = Math.floor(GAME_TRANSITION_TIME / 1000) - elapsedSeconds;

        // Only update if it's a valid positive number and has changed
        if (remainingSeconds >= 0 && shared.gameStartTimerSeconds !== remainingSeconds) {
            shared.gameStartTimerSeconds = remainingSeconds;
        }

        // Start game when countdown finishes
        if (shared.currentTime - shared.gameStartTimerStartTime >= GAME_TRANSITION_TIME) {
            console.log("HOST: Game start timer finished. Starting game.");
            shared.gameState = "IN-GAME";
            shared.gameStartTimerStartTime = null; // Reset timer
            shared.gameStartTimerSeconds = null; // Clear the seconds too
        }
    }
}

function handleGameInProgressHost() {
    // Reset canon tower hits
    resetCanonTowerHitsForPlayersWithoutCharacters();

    // Move canon towers, bullets, check collisions and sync to shared object 
    updateCanonTowers()

    // Check for disconnected Core Command
    checkIfCoreCommandDisconnected()

    // Detect collisions and initiate battles
    detectCollisionsAndInitiateBattles();

    // Check win conditions
    checkWinConditions();
}

function updateCanonTowers() {
    if (!gameObjects || gameObjects.length === 0) return;

    // Only process canon logic if on planet 3

    gameObjects.forEach((canon, index) => {
        canon.move();
        const currentTime = millis();
        if (currentTime - canon.lastShotTime > TOWER_SHOOTING_INTERVAL) {
            if (spacecrafts.length > 0) {
                // Only target spacecrafts that are on planet 3
                const spacecraftsOnPlanet3 = spacecrafts.filter(f => f.planetIndex === canon.planetIndex && f.hasCharacter);
                if (spacecraftsOnPlanet3.length > 0) {
                    const nearestSpacecraft = canon.findNearestSpacecraft(spacecraftsOnPlanet3);

                    if (nearestSpacecraft) {
                        canon.shoot(nearestSpacecraft);
                        canon.lastShotTime = currentTime;
                    }
                }
            }
        }

        canon.moveBullets(); // Move bullets before drawing
        canon.checkCollisionsWithSpacecrafts();  // Add this line

        // Sync to shared state
        shared.gameObjects[index] = {
            ...shared.gameObjects[index],
            xGlobal: canon.xGlobal,
            yGlobal: canon.yGlobal,
            bullets: canon.bullets,
            angle: canon.angle,
            lastShotTime: canon.lastShotTime,
            hits: canon.hits,
        };
    });
    console.log("HOST: Updated canon towers and bullets in shared state.");
    /*
        // Calculate total hits from canon towers for each player
        let totalHits = Array(15).fill(0);
        gameObjects.forEach(canon => {
            for (let i = 0; i < totalHits.length; i++) {
                totalHits[i] += canon.hits[i];
            }
        });
        shared.canonTowerHits = totalHits;
        */
    //jens 
}


function resetCanonTowerHitsForPlayersWithoutCharacters() {
    spacecrafts.forEach((spacecraft, index) => {

        if (!spacecraft.hasCharacter) {
            // Reset hits for players who have characters
            shared.canonTowerHits[spacecraft.playerNumber] = 0;
        }
    })
}

function checkIfCoreCommandDisconnected() {
    let blueFlagSelected = shared.characterList.some(c => c.team === 'blue' && c.id === 'C' && c.takenByPlayerId !== null);
    let greenFlagSelected = shared.characterList.some(c => c.team === 'green' && c.id === 'C' && c.takenByPlayerId !== null);

    if (!blueFlagSelected) {
        console.log(`HOST: GAME OVER! Green team wins as blue teams Core Command disconnected`);
        shared.winningTeam = 'green';
        shared.greenWins = (shared.greenWins || 0) + 1;
        shared.coreCommandDisconnected = true;
        shared.gameState = "GAME-FINISHED";
        return;
    }
    if (!greenFlagSelected) {
        console.log(`HOST: GAME OVER! Purple team wins as blue teams Core Command disconnected`);
        shared.winningTeam = 'blue';
        shared.blueWins = (shared.blueWins || 0) + 1;
        shared.coreCommandDisconnected = true;
        shared.gameState = "GAME-FINISHED";
        return;
    }
}

function detectCollisionsAndInitiateBattles() {
    // Only process available characters
    let activeCharacters = shared.characterList.filter(c =>
        c.takenByPlayerId !== null && c.status === 'available' && !c.isPermanentlyLost);

    // Check each pair of characters
    for (let i = 0; i < activeCharacters.length; i++) {
        let char1 = activeCharacters[i];
        let player1 = guests.find(p => p.playerNumber === char1.takenByPlayerId);
        //        let player1 = spacecrafts.find(p => p.playerNumber === char1.takenByPlayerId); jens

        if (!player1) {
            console.warn(`HOST: Player not found for active character ${char1.instanceId}`);
            continue;
        }

        // Check for loss due to hits ONLY if the character is currently 'available'
        // This prevents resetting the battle timer if already 'inBattle' waiting for resolution.
        if (char1.status === 'available') {
            let numberOfHits = numberOfTimesBeingHit(player1.playerNumber);

            if (numberOfHits >= 10) {
                const char1Def = CHARACTER_DEFINITIONS.find(c => c.id === char1.id);

                if (char1Def.isCoreCommand) {
                    console.log('flag hit too many times');
                    char1.battleOutcomeResult = 'You lost because you got hit by too many bullets!'
                    char1.status = 'noMoreLives';
                    char1.isPermanentlyLost = true;
                    char1.takenByPlayerId = null;
                    char1.takenByPlayerName = null;

                    // Clear battle fields
                    char1.inBattleWithInstanceId = null;
                    char1.battleOutcomeResult = null;
                    char1.battleInfo = null;
                    return;
                }
                let char1Index = shared.characterList.findIndex(c => c.instanceId === char1.instanceId);

                if (char1Index === -1) {
                    console.error("HOST: Could not find character in shared list for hit limit loss!");
                    continue; // Skip this character
                }

                console.log(`HOST: Initiating 'lost by hits' battle state for ${char1.instanceId}`);
                shared.characterList[char1Index].status = 'lost'; // Set status to start resolution timer
                shared.characterList[char1Index].inBattleWithInstanceId = null; // No opponent
                shared.characterList[char1Index].battleOutcomeResult = 'You lost by being hit too many times'; // Set outcome message
                shared.characterList[char1Index].battleInfo = null; // No opponent info
                shared.characterList[char1Index].isPermanentlyLost = true; // Mark as permanently lost

                // Skip regular collision checks for this character this frame as it's now 'inBattle'
                continue; // Move to the next character in the outer loop
            }
        }

        // If the character wasn't lost by hits, proceed with collision checks
        for (let j = i + 1; j < activeCharacters.length; j++) {
            let char2 = activeCharacters[j];
            let player2 = guests.find(p => p.playerNumber === char2.takenByPlayerId);
            //            let player2 = spacecrafts.find(p => p.playerNumber === char2.takenByPlayerId);

            if (!player2) {
                //console.warn(`HOST: Player not found for active character ${char2.instanceId}`);
                continue;
            }

            // Must be different teams and on the same planet
            if (player1.team === player2.team || player1.planetIndex != player2.planetIndex) continue;

            // Check collision distance using player positions
            let d = dist(player1.xGlobal + player1.xLocal, player1.yGlobal + player1.yLocal, player2.xGlobal + player2.xLocal, player2.yGlobal + player2.yLocal);
            if (d < (player1.size / 2 + player2.size / 2)) {
                //     console.log(`HOST: Collision detected between ${char1.instanceId} (${player1.playerName}) and ${char2.instanceId} (${char2.playerName}) at distance ${d.toFixed(2)}`);

                // Calculate battle outcome
                const outcome = calculateBattleOutcome(char1, char2);
                //    console.log(`HOST: Battle Outcome: ${char1.instanceId} (${outcome.char1Result}), ${char2.instanceId} (${outcome.char2Result})`);

                // Handle immediate game win (flag capture)
                if (outcome.gameWonByTeam && !outcome.coreCommandBattleDraw) {
                    //        console.log(`HOST: GAME OVER! Flag captured. Winner: ${outcome.gameWonByTeam} team by ${outcome.winningPlayerName}.`);
                    shared.gameState = "GAME-FINISHED";
                    shared.winningTeam = outcome.gameWonByTeam;
                    shared.winningPlayerName = outcome.winningPlayerName;
                    console.log("HOST: GAME OVER! Flag captured.");
                    // Update statistics
                    if (shared.winningTeam === 'blue') {
                        shared.blueWins = (shared.blueWins || 0) + 1;
                    } else if (shared.winningTeam === 'green') {
                        shared.greenWins = (shared.greenWins || 0) + 1;
                    } else if (shared.winningTeam === 'draw') {
                        shared.draws = (shared.draws || 0) + 1;
                    }
                    return;
                }

                // Find characters in shared list
                let char1Index = shared.characterList.findIndex(c => c.instanceId === char1.instanceId);
                let char2Index = shared.characterList.findIndex(c => c.instanceId === char2.instanceId);

                if (char1Index === -1 || char2Index === -1) {
                    console.error("HOST: Could not find battling characters in shared list!");
                    continue;
                }

                // Check for Core Command loss
                const char1IsFlag = CHARACTER_DEFINITIONS.find(c => c.id === char1.id)?.isCoreCommand;
                const char2IsFlag = CHARACTER_DEFINITIONS.find(c => c.id === char2.id)?.isCoreCommand;

                if (outcome.coreCommandBattleDraw ||
                    (char1IsFlag && outcome.char1Result !== 'won') ||
                    (char2IsFlag && outcome.char2Result !== 'won')) {

                    if (outcome.coreCommandBattleDraw) {
                        console.log("HOST: Core Command vs Core Command battle! Both lost.");
                    } else {
                        console.log("HOST: Core Command lost or drawn in battle!");
                    }
                    shared.coreCommandLost = true;
                }

                // Set up battle in shared list for char1
                if (outcome.char1Result === 'lost' || outcome.char1Result === 'had draw in') {
                    shared.characterList[char1Index].inBattleWithInstanceId = char2.instanceId;
                    shared.characterList[char1Index].battleOutcomeResult = outcome.char1Result;
                    shared.characterList[char1Index].isPermanentlyLost = true; // Mark as permanently lost
                    // Include opponent player name
                    shared.characterList[char1Index].battleInfo = { name: char2.name, rank: char2.rank, playerName: player2.playerDisplayName, myName: char1.name, myRank: char1.rank };
                }

                // Set up battle in shared list for char2
                if (outcome.char2Result === 'lost' || outcome.char2Result === 'had draw in') {
                    shared.characterList[char2Index].inBattleWithInstanceId = char1.instanceId;
                    shared.characterList[char2Index].battleOutcomeResult = outcome.char2Result;
                    shared.characterList[char2Index].isPermanentlyLost = true; // Mark as permanently lost
                    // Include opponent player name
                    shared.characterList[char2Index].battleInfo = { name: char1.name, rank: char1.rank, playerName: player1.playerDisplayName, myName: char2.name, myRank: char2.rank };
                }

                // Set up battle in shared list for char1
                if (outcome.char1Result === 'won') {
                    shared.characterList[char1Index].inBattleWithInstanceId = char2.instanceId;
                    shared.characterList[char1Index].battleOutcomeResult = outcome.char1Result;
                    // Include opponent player name
                    shared.characterList[char1Index].battleInfo = { name: char2.name, rank: char2.rank, playerName: player2.playerDisplayName, myName: char1.name, myRank: char1.rank };
                }

                // Set up battle in shared list for char2
                if (outcome.char2Result === 'won') {
                    shared.characterList[char2Index].inBattleWithInstanceId = char1.instanceId;
                    shared.characterList[char2Index].battleOutcomeResult = outcome.char2Result;
                    // Include opponent player name
                    shared.characterList[char2Index].battleInfo = { name: char1.name, rank: char1.rank, playerName: player1.playerDisplayName, myName: char2.name, myRank: char2.rank };
                }

                // Skip to next character
                break;
            }
        }
    }
}

function calculateBattleOutcome(char1, char2) {
    // Get character definitions
    const char1Def = CHARACTER_DEFINITIONS.find(c => c.id === char1.id);
    const char2Def = CHARACTER_DEFINITIONS.find(c => c.id === char2.id);

    // Initialize variables
    let gameWonByTeam = null;
    let winningPlayerName = null;
    let coreCommandBattleDraw = false;

    if (!char1Def || !char2Def) {
        console.error("HOST: Missing character definition during battle calculation!", char1.id, char2.id);
        return {
            char1Result: 'had draw in',
            char2Result: 'had draw in',
            gameWonByTeam,
            winningPlayerName,
            coreCommandBattleDraw
        };
    }

    let char1Result = 'pending';
    let char2Result = 'pending';

    // Handle Flag vs Flag specially
    if (char1Def.isCoreCommand && char2Def.isCoreCommand) {
        char1Result = 'had draw in';
        char2Result = 'had draw in';
        coreCommandBattleDraw = true;
    }
    // Handle Flag vs non-Flag
    else if (char1Def.isCoreCommand) {
        char1Result = 'lost';
        char2Result = 'won';
        gameWonByTeam = char2.team;
        winningPlayerName = char2.takenByPlayerName;
    }
    else if (char2Def.isCoreCommand) {
        char1Result = 'won';
        char2Result = 'lost';
        gameWonByTeam = char1.team;
        winningPlayerName = char1.takenByPlayerName;
    }
    // Handle special cases
    else if (char1Def.isEngineer && char2Def.isReconDrone) {
        char1Result = 'won';
        char2Result = 'lost';
    }
    else if (char1Def.isReconDrone && char2Def.isEngineer) {
        char1Result = 'lost';
        char2Result = 'won';
    }
    else if (char1Def.isReconDrone || char2Def.isReconDrone) {
        char1Result = 'had draw in';
        char2Result = 'had draw in';
    }
    else if (char1Def.isStealthSquad && char2Def.isStarCommand) {
        char1Result = 'won';
        char2Result = 'lost';
    }
    else if (char1Def.isStarCommand && char2Def.isStealthSquad) {
        char1Result = 'lost';
        char2Result = 'won';
    }
    // Standard rank comparison
    else if (char1.rank === char2.rank) {
        char1Result = 'had draw in';
        char2Result = 'had draw in';
    }
    else if (char1.rank > char2.rank) {
        char1Result = 'won';
        char2Result = 'lost';
    }
    else {
        char1Result = 'lost';
        char2Result = 'won';
    }

    return {
        char1Result,
        char2Result,
        gameWonByTeam,
        winningPlayerName,
        coreCommandBattleDraw
    };
}


function resetCanonTowerHits(playerNumber) {
    // Reset hit counters for each individual tower
    if (gameObjects && gameObjects.length > 0) {
        gameObjects.forEach(tower => {
            tower.hits[playerNumber] = 0;
        });
    }

    // Also reset hit counters in shared gameObjects for clients
    if (shared.gameObjects && shared.gameObjects.length > 0) {
        shared.gameObjects.forEach(tower => {
            tower.hits[playerNumber] = 0;
        });
    }
}

function checkWinConditions() {
    if (shared.gameState !== "GAME-FINISHED") {
        let blueFlagExists = false;
        let greenFlagExists = false;

        // Check flags based on shared list status
        shared.characterList.forEach(c => {
            if (c.id === 'C' && !c.isPermanentlyLost && c.status !== 'lost') {
                if (c.team === 'blue') blueFlagExists = true;
                if (c.team === 'green') greenFlagExists = true;
            }
        });

        let newGameState = null;
        let newWinningTeam = null;
        shared.winningPlayerName = null;

        // Check win conditions
        if (!shared.coreCommandLost) { // Only check elimination if Core Command wasn't lost in battle
            if (!blueFlagExists && !greenFlagExists) {
                newGameState = "GAME-FINISHED";
                newWinningTeam = "draw";
                console.log("HOST: Both flags eliminated. Draw.");
            } else if (!blueFlagExists) {
                newGameState = "GAME-FINISHED";
                newWinningTeam = "green";
                console.log("HOST: Purple flag eliminated. Green wins.");
            } else if (!greenFlagExists) {
                newGameState = "GAME-FINISHED";
                newWinningTeam = "blue";
                console.log("HOST: Green flag eliminated. Purple wins.");
            }
        } else if (shared.coreCommandLost) {
            newGameState = "GAME-FINISHED";
            newWinningTeam = "draw";
            shared.winningPlayerName = "Both Core Commands Lost";
            console.log("HOST: Game ended due to Core Command loss/draw.");
        }

        // Update game state if changed
        if (newGameState && shared.gameState !== newGameState) {
            console.log(`HOST: Setting game state to ${newGameState}, Winning Team: ${newWinningTeam}, Winning Player: ${shared.winningPlayerName || 'N/A'}`);
            shared.gameState = newGameState;
            shared.winningTeam = newWinningTeam;

            // Update statistics
            if (newWinningTeam === 'blue') {
                shared.blueWins = (shared.blueWins || 0) + 1;
            } else if (newWinningTeam === 'green') {
                shared.greenWins = (shared.greenWins || 0) + 1;
            } else if (newWinningTeam === 'draw') {
                shared.draws = (shared.draws || 0) + 1;
            }
        }
    }
}

function handleGameFinishedHost() {
    // Start reset countdown if not started and reset isn't flagged
    if (shared.resetTimerStartTime === null && !shared.resetFlag) {
        console.log("HOST: Starting reset countdown timer.");
        shared.resetTimerStartTime = shared.currentTime;
        shared.resetTimerSeconds = Math.floor(GAME_TRANSITION_TIME / 1000); // Initialize with full seconds
    }

    // Update timer only if it's active
    if (shared.resetTimerStartTime !== null && !shared.resetFlag) {
        const elapsedSeconds = Math.floor((shared.currentTime - shared.resetTimerStartTime) / 1000);
        const remainingSeconds = Math.floor(GAME_TRANSITION_TIME / 1000) - elapsedSeconds;

        // Only update if it's a valid positive number and has changed
        if (remainingSeconds >= 0 && shared.resetTimerSeconds !== remainingSeconds) {
            shared.resetTimerSeconds = remainingSeconds;
        }

        // Trigger reset when countdown finishes
        if (shared.currentTime - shared.resetTimerStartTime >= GAME_TRANSITION_TIME && !shared.resetFlag) {
            console.log("HOST: Reset timer finished. Setting reset flag.");
            shared.resetFlag = true;
            shared.resetTimerStartTime = null;
            shared.resetTimerSeconds = null; // Clear the seconds too
        }
    }

    shared.resetTimerSeconds = Math.floor(GAME_TRANSITION_TIME / 1000) - Math.floor((shared.currentTime - shared.resetTimerStartTime) / 1000)

    // Process reset
    if (shared.resetFlag) {
        console.log("HOST: Processing reset flag...");
        shared.gameState = "GAME-SETUP";
        shared.winningTeam = null;
        shared.winningPlayerName = null;
        shared.coreCommandLost = false;
        shared.resetTimerStartTime = null;
        shared.canonTowerHits = Array(15).fill(0);

        // Reset hit counters for each individual tower
        if (gameObjects && gameObjects.length > 0) {
            gameObjects.forEach(tower => {
                tower.hits = Array(15).fill(0);
            });
        }

        // Also reset hit counters in shared gameObjects for clients
        if (shared.gameObjects && shared.gameObjects.length > 0) {
            shared.gameObjects.forEach(tower => {
                tower.hits = Array(15).fill(0);
            });
        }

        initializeCharacterList();

        // Clear reset flag after delay
        setTimeout(() => {
            if (partyIsHost()) {
                shared.resetFlag = false;
                console.log("HOST: Reset flag set back to false.");
            }
        }, 3000);
    }
}

// Helper function to draw a radial gradient with array colors instead of color() objects
function drawRadialGradient(x, y, diameter, colorCenterArray, colorEdgeArray) {
    if (showBlurAndTintEffects) {
        push();
        noStroke();
        const radius = diameter / 2;
        const numSteps = 50; // More steps = smoother gradient

        for (let i = numSteps; i > 0; i--) {
            const step = i / numSteps;
            const currentRadius = radius * step;

            // Interpolate between the two colors using arrays instead of color objects
            const r = lerp(colorCenterArray[0], colorEdgeArray[0], 1 - step);
            const g = lerp(colorCenterArray[1], colorEdgeArray[1], 1 - step);
            const b = lerp(colorCenterArray[2], colorEdgeArray[2], 1 - step);

            fill(r, g, b);
            circle(x, y, currentRadius * 2);
        }
        pop();
    } else {
        // Fallback to a solid color if the effect is disabled
        fill(colorCenterArray[0], colorCenterArray[1], colorCenterArray[2]);
        circle(x, y, diameter);
    }
}
function checkBulletCollisions() {
    const opponents = spacecrafts.filter(spacecraft =>
        spacecraft.planetIndex === me.planetIndex &&
        spacecraft.hasCharacter &&
        spacecraft.team !== me.team);

    for (const opponent of opponents) {
        checkBulletCollision(opponent);
    }
}

function checkBulletCollision(spacecraft) {
    for (let i = me.bullets.length - 1; i >= 0; i--) {
        let bullet = me.bullets[i];

        // Calculate bullet's position relative to the spacecraft
        let bulletPosX = bullet.xLocal - (me.xGlobal - bullet.xGlobal);
        let bulletPosY = bullet.yLocal - (me.yGlobal - bullet.yGlobal);

        // Calculate spacecraft's position relative to the bullet
        let spacecraftPosX = spacecraft.xLocal - (me.xGlobal - spacecraft.xGlobal);
        let spacecraftPosY = spacecraft.yLocal - (me.yGlobal - spacecraft.yGlobal);

        let d = dist(spacecraftPosX, spacecraftPosY, bulletPosX, bulletPosY);

        if (d < (spacecraft.diameter / 2 + BULLET_DIAMETER / 2)) { // Adjusted to use spacecraft.diameter / 2
            me.hits[spacecraft.playerNumber]++;
            me.bullets.splice(i, 1);
        }
    } 
}
 
function updateTowerCount() {
    gameObjects = generateTowers();
    // Set planetIndex to 3 for all towers
    shared.gameObjects = gameObjects.map(tower => ({
        xGlobal: tower.xGlobal,
        yGlobal: tower.yGlobal,
        diameter: tower.diameter,
        color: tower.color,
        type: tower.type,
        bullets: [],
        angle: 0,
        hits: Array(15).fill(0),
        planetIndex: 3, // Set to planet 3 specifically
        lastShotTime: 0,
        xSpawnGlobal: tower.xSpawnGlobal,
        ySpawnGlobal: tower.ySpawnGlobal,
    }));
}

function generateTowers() {
    const towers = [];

    // Table of predefined tower locations
    const towerTable = [
        { x: 2000, y: 1000, color: 'red', type: 0 },
        { x: 1750, y: 1200, color: 'blue', type: 1 },
        { x: 1500, y: 1500, color: 'green', type: 2 },
    ];

    for (let i = 0; i < towerTable.length; i++) {
        const tower = towerTable[i];

        towers.push(new Canon({
            objectNumber: i,
            objectName: `canon${i}`,
            xGlobal: tower.x,
            yGlobal: tower.y,
            diameter: 60,
            xSpawnGlobal: tower.x,
            ySpawnGlobal: tower.y,
            color: tower.color,
            type: tower.type,
            planetIndex: 3,
        }));
    }

    return towers;
}

function updateDummyObjects() {
    dummyObjects = generateBonusTowersToTestPerformance();
}

function generateBonusTowersToTestPerformance() {
    const towersToTestPerformance = [];

    // Table of predefined tower locations
    const towerTable = [

        { x: 1000, y: 1200, color: 'red', type: 0 },
        { x: 1200, y: 1200, color: 'blue', type: 1 },
        { x: 1400, y: 1200, color: 'green', type: 2 },
        { x: 1600, y: 1200, color: 'orange', type: 0 },
        { x: 1800, y: 1200, color: 'purple', type: 1 },
        { x: 2000, y: 1200, color: 'yellow', type: 2 },

        { x: 1000, y: 1400, color: 'red', type: 0 },
        { x: 1200, y: 1400, color: 'blue', type: 1 },
        { x: 1400, y: 1400, color: 'green', type: 2 },
        { x: 1600, y: 1400, color: 'orange', type: 0 },
        { x: 1800, y: 1400, color: 'purple', type: 1 },
        { x: 2000, y: 1400, color: 'yellow', type: 2 },

        { x: 1000, y: 1600, color: 'red', type: 0 },
        { x: 1200, y: 1600, color: 'blue', type: 1 },
        { x: 1400, y: 1600, color: 'green', type: 2 },
        { x: 1600, y: 1600, color: 'orange', type: 0 },
        { x: 1800, y: 1600, color: 'purple', type: 1 },
        { x: 2000, y: 1600, color: 'yellow', type: 2 },

        { x: 1000, y: 1800, color: 'red', type: 0 },
        { x: 1200, y: 1800, color: 'blue', type: 1 },
        { x: 1400, y: 1800, color: 'green', type: 2 },
        { x: 1600, y: 1800, color: 'orange', type: 0 },
        { x: 1800, y: 1800, color: 'purple', type: 1 },
        { x: 2000, y: 1800, color: 'yellow', type: 2 },
    ];

    for (let i = 0; i < towerTable.length; i++) {
        const tower = towerTable[i]; 

        towersToTestPerformance.push(new Canon({ 
            objectNumber: i,
            objectName: `canon${i}`,
            xGlobal: tower.x,
            yGlobal: tower.y,
            diameter: 60,
            xSpawnGlobal: tower.x,
            ySpawnGlobal: tower.y,
            color: tower.color,
            type: tower.type,
            planetIndex: 4,
        }));
    }

    return towersToTestPerformance;
}

function resolvePlayerNumberConflicts() {
    const conflictMessage = "Another player has the same playerNumber. Please refresh the browser window";

    if (playerWithTheSamePlayerNumberAsMeExist()) {
        // Only set the message if it's not already set to avoid flickering
        if (message !== conflictMessage) {
            message = conflictMessage;
        }
    } else {
        // Clear the message ONLY if it's the specific conflict message
        if (message === conflictMessage) {
            message = ""; // Clear the message
        }
    }
}
function playerWithTheSamePlayerNumberAsMeExist() {
    const playerNumbers = Array(guests.length).fill(0)
    guests.forEach(p => {
        playerNumbers[p.playerNumber]++
    });

    if (playerNumbers[me.playerNumber] > 1) {
        return true
    }
    return false
}
function twoPlayersWithTheSamePlayerNumberExist() {
    const playerNumbers = Array(guests.length).fill(0)
    guests.forEach(p => {
        playerNumbers[p.playerNumber]++
    });

    let twoPlayersWithTheSamePlayerNumber = false
    playerNumbers.forEach((count, index) => {
        if (count > 1) {
            twoPlayersWithTheSamePlayerNumber = true

        }
    });
    if (twoPlayersWithTheSamePlayerNumber) {
        return true
    }
    return false
}

// --------------------
// Game State Drawing Functions
// --------------------