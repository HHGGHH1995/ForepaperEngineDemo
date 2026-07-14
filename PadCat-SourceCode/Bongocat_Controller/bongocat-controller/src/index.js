import { Application, Assets, Container, Sprite, MeshSimple, Point } from 'pixi.js';
import { Delaunay } from "d3-delaunay";

(async () =>
{
    //声明管理全局资源的map
    let assetsMap = {
        body: null,
        controller: null,
        leftStickHand: null,
        leftStick: null,
        leftStickPress: null,
        rightStickHand: null,
        rightStick: null,
        rightStickPress: null,
        rightHandUp: null,
        leftHandUp: null,
        rightFootUp: null,
        leftFootUp: null,
        a: null,
        b: null,
        x: null,
        y: null,
        up: null,
        down: null,
        left: null,
        right: null,
        back: null,
        start: null,
        leftShoulder: null,
        rightShoulder: null,
        leftTrigger: null,
        rightTrigger: null,
        leftTriggerPress: null,
        rightTriggerPress: null
    };

    // Create a new application
    const app = new Application();
    globalThis.__PIXI_APP__ = app;

    // Initialize the application with a transparent background
    await app.init(
        {
            backgroundAlpha: 0,
            resizeTo: document.body,
            autoStart: false // 停止自动渲染Loop，使用手动渲染
        });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // Create and add a container to the stage
    const mainContainer = new Container();
    const rightStickContainer = new Container();
    const leftStickContainer = new Container();

    const rightStickRegionX = 328;
    const rightStickRegionY = 510;
    const rightStickRegionWidth = 114;
    const rightStickRegionHeight = 114;

    const leftStickRegionX = 584;
    const leftStickRegionY = 510;
    const leftStickRegionWidth = 114;
    const leftStickRegionHeight = 114;

    const rightStickImgHarfWidth = 38;
    const rightStickImgHarfHeight = 38;

    const leftStickImgHarfWidth = 38;
    const leftStickImgHarfHeight = 38;

    rightStickContainer.x = rightStickRegionX + rightStickRegionWidth / 2 - rightStickImgHarfWidth;
    rightStickContainer.y = rightStickRegionY + rightStickRegionHeight / 2 - rightStickImgHarfHeight;
    leftStickContainer.x = leftStickRegionX + leftStickRegionWidth / 2 - leftStickImgHarfWidth;
    leftStickContainer.y = leftStickRegionY + leftStickRegionHeight / 2 - leftStickImgHarfHeight;

    const leftTriggerOriginY = 775;
    const rightTriggerOriginY = 775;

    app.stage.addChild(mainContainer);

    // Move the container to the center
    mainContainer.x = document.body.clientWidth / 2;
    mainContainer.y = document.body.clientHeight / 2;

    function changeScale() {
        mainContainer.scale.set(ConfigManager.get('scale'));
    }
    changeScale();

    function changeAlpha() {
        mainContainer.alpha = ConfigManager.get('alpha');
    }
    changeAlpha();

    // Center the bunny sprites in local container coordinates
    mainContainer.pivot.x = mainContainer.width / 2;
    mainContainer.pivot.y = mainContainer.height / 2;
    
    function updateSpriteForRender() {
        let leftHandUp = true;
        let rightHandUp = true;
        let leftFootUp = true;
        let rightFootUp = true;
        let leftTrigger = true;
        let rightTrigger = true;
        
        // right
        if (lastControllerStateArr[0]) {
            assetsMap['a'].sprite.visible = true;
            rightHandUp = false;
        }
        else {
            assetsMap['a'].sprite.visible = false;
        }
        
        if (lastControllerStateArr[1]) {
            assetsMap['b'].sprite.visible = true;
            rightHandUp = false;
        }
        else {
            assetsMap['b'].sprite.visible = false;
        }
        
        if (lastControllerStateArr[2]) {
            assetsMap['x'].sprite.visible = true;
            rightHandUp = false;
        }
        else {
            assetsMap['x'].sprite.visible = false;
        }
        
        if (lastControllerStateArr[3]) {
            assetsMap['y'].sprite.visible = true;
            rightHandUp = false;
        }
        else {
            assetsMap['y'].sprite.visible = false;
        }
        
        if (lastControllerStateArr[13]) {
            assetsMap['start'].sprite.visible = true;
            rightHandUp = false;
        }
        else {
            assetsMap['start'].sprite.visible = false;
        }
        
        if (lastControllerStateArr[12]) {
            assetsMap['rightStickPress'].sprite.visible = true;
            assetsMap['rightStickHand'].mesh.visible = true;
            rightHandUp = false;
        }
        else {
            assetsMap['rightStickPress'].sprite.visible = false;
            assetsMap['rightStickHand'].mesh.visible = false;
        }
        
        if (lastControllerStateArr[18] !== 0 || lastControllerStateArr[19] !== 0) {
            assetsMap['rightStickHand'].mesh.visible = true;
            rightHandUp = false;

            let convertedX = (-lastControllerStateArr[18] + 32767) / 65535 * rightStickRegionWidth;
            let convertedY = (lastControllerStateArr[19] + 32767) / 65535 * rightStickRegionHeight;
            rightStickContainer.x = rightStickRegionX + convertedX - rightStickImgHarfWidth;
            rightStickContainer.y = rightStickRegionY + convertedY - rightStickImgHarfHeight;

            assetsMap['rightStickHand'].mesh.vertices[8] = rightStickRegionX + convertedX;
            assetsMap['rightStickHand'].mesh.vertices[9] = rightStickRegionY + convertedY;
        }
        else { 
            if (!lastControllerStateArr[12]) {
                assetsMap['rightStickHand'].mesh.visible = false;
            }

            rightStickContainer.x = rightStickRegionX + rightStickRegionWidth / 2 - rightStickImgHarfWidth;
            rightStickContainer.y = rightStickRegionY + rightStickRegionHeight / 2 - rightStickImgHarfHeight;

            assetsMap['rightStickHand'].mesh.vertices[8] = rightStickRegionX + rightStickRegionWidth / 2;
            assetsMap['rightStickHand'].mesh.vertices[9] = rightStickRegionY + rightStickRegionHeight / 2;
        }

        assetsMap['rightHandUp'].sprite.visible = rightHandUp;
        
        if (lastControllerStateArr[11]) {
            assetsMap['rightShoulder'].sprite.visible = true;
            rightFootUp = false;
        }
        else {
            assetsMap['rightShoulder'].sprite.visible = false;
        }

        if (lastControllerStateArr[15] > 0) {
            assetsMap['rightTriggerPress'].mesh.visible = true;
            rightFootUp = false;
            rightTrigger = false;
            let _newY = rightTriggerOriginY - lastControllerStateArr[15] / 255 * 75;
            assetsMap['rightTriggerPress'].mesh.vertices[9] = _newY;
            assetsMap['rightTriggerPress'].mesh.vertices[11] = _newY;
        }
        else {
            assetsMap['rightTriggerPress'].mesh.visible = false;
        }

        assetsMap['rightFootUp'].sprite.visible = rightFootUp;
        assetsMap['rightTrigger'].sprite.visible = rightTrigger;

        // left
        if (lastControllerStateArr[5]) {
            assetsMap['down'].sprite.visible = true;
            leftHandUp = false;
        }
        else {
            assetsMap['down'].sprite.visible = false;
        }
        
        if (lastControllerStateArr[6]) {
            assetsMap['left'].sprite.visible = true;
            leftHandUp = false;
        }
        else {
            assetsMap['left'].sprite.visible = false;
        }
        
        if (lastControllerStateArr[7]) {
            assetsMap['right'].sprite.visible = true;
            leftHandUp = false;
        }
        else {
            assetsMap['right'].sprite.visible = false;
        }
        
        if (lastControllerStateArr[8]) {
            assetsMap['up'].sprite.visible = true;
            leftHandUp = false;
        }
        else {
            assetsMap['up'].sprite.visible = false;
        }
        
        if (lastControllerStateArr[4]) {
            assetsMap['back'].sprite.visible = true;
            leftHandUp = false;
        }
        else {
            assetsMap['back'].sprite.visible = false;
        }
        
        if (lastControllerStateArr[10]) {
            assetsMap['leftStickPress'].sprite.visible = true;
            assetsMap['leftStickHand'].mesh.visible = true;
            leftHandUp = false;
        }
        else {
            assetsMap['leftStickPress'].sprite.visible = false;
            assetsMap['leftStickHand'].mesh.visible = false;
        }
        
        if (lastControllerStateArr[16] !== 0 || lastControllerStateArr[17] !== 0) {
            assetsMap['leftStickHand'].mesh.visible = true;
            leftHandUp = false;

            let convertedX = (-lastControllerStateArr[16] + 32767) / 65535 * leftStickRegionWidth;
            let convertedY = (lastControllerStateArr[17] + 32767) / 65535 * leftStickRegionHeight;
            leftStickContainer.x = leftStickRegionX + convertedX - leftStickImgHarfWidth;
            leftStickContainer.y = leftStickRegionY + convertedY - leftStickImgHarfHeight;

            assetsMap['leftStickHand'].mesh.vertices[8] = leftStickRegionX + convertedX;
            assetsMap['leftStickHand'].mesh.vertices[9] = leftStickRegionY + convertedY;
        }
        else { 
            if (!lastControllerStateArr[10]) {
                assetsMap['leftStickHand'].mesh.visible = false;
            }

            leftStickContainer.x = leftStickRegionX + leftStickRegionWidth / 2 - leftStickImgHarfWidth;
            leftStickContainer.y = leftStickRegionY + leftStickRegionHeight / 2 - leftStickImgHarfHeight;

            assetsMap['leftStickHand'].mesh.vertices[8] = leftStickRegionX + leftStickRegionWidth / 2;
            assetsMap['leftStickHand'].mesh.vertices[9] = leftStickRegionY + leftStickRegionHeight / 2;
        }

        assetsMap['leftHandUp'].sprite.visible = leftHandUp;
        
        if (lastControllerStateArr[9]) {
            assetsMap['leftShoulder'].sprite.visible = true;
            leftFootUp = false;
        }
        else {
            assetsMap['leftShoulder'].sprite.visible = false;
        }

        if (lastControllerStateArr[14] > 0) {
            assetsMap['leftTriggerPress'].mesh.visible = true;
            leftFootUp = false;
            leftTrigger = false;
            let _newY = leftTriggerOriginY - lastControllerStateArr[14] / 255 * 75;
            assetsMap['leftTriggerPress'].mesh.vertices[9] = _newY;
            assetsMap['leftTriggerPress'].mesh.vertices[11] = _newY;
        }
        else {
            assetsMap['leftTriggerPress'].mesh.visible = false;
        }

        assetsMap['leftFootUp'].sprite.visible = leftFootUp;
        assetsMap['leftTrigger'].sprite.visible = leftTrigger;
    }

    function render() {
        app.renderer.render(app.stage);
    }

    await loadAssets();
    render();

    let lastControllerStateArr;
    function updateControllerState() { 
        const currentControllerStateArr = ForepaperEngineGetGameControllerState('0');
        if (currentControllerStateArr) {
            let leftStickDeadzone = ConfigManager.get('leftStickDeadzone') * 32767;
            let rightStickDeadzone = ConfigManager.get('rightStickDeadzone') * 32767;

            // convert some items to number
            currentControllerStateArr[14] = Number(currentControllerStateArr[14]);
            currentControllerStateArr[15] = Number(currentControllerStateArr[15]);
            currentControllerStateArr[16] = Number(currentControllerStateArr[16]);
            currentControllerStateArr[17] = Number(currentControllerStateArr[17]);
            currentControllerStateArr[18] = Number(currentControllerStateArr[18]);
            currentControllerStateArr[19] = Number(currentControllerStateArr[19]);

            if (currentControllerStateArr[16] < leftStickDeadzone && currentControllerStateArr[16] > -leftStickDeadzone) {
                currentControllerStateArr[16] = 0;
            }
            if (currentControllerStateArr[17] < leftStickDeadzone && currentControllerStateArr[17] > -leftStickDeadzone) {
                currentControllerStateArr[17] = 0;
            }
            if (currentControllerStateArr[18] < rightStickDeadzone && currentControllerStateArr[18] > -rightStickDeadzone) {
                currentControllerStateArr[18] = 0;
            }
            if (currentControllerStateArr[19] < rightStickDeadzone && currentControllerStateArr[19] > -rightStickDeadzone) {
                currentControllerStateArr[19] = 0;
            }

            //check if controller state changed
            if (!lastControllerStateArr) {
                lastControllerStateArr = currentControllerStateArr;
                return true;
            }
            else {
                let isChanged = false;
                for (let i = 0; i < currentControllerStateArr.length; i++) {
                    if (currentControllerStateArr[i] !== lastControllerStateArr[i]) {
                        isChanged = true;
                        break;
                    }
                }
                if (isChanged) {
                    lastControllerStateArr = currentControllerStateArr;
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        else {
            return false;
        }
    }

    let lastTime = 0;
    let interval = 1000 / 30;

    function loop(currentTime) {
        if (ConfigManager.get('isLimitFps') === '1') {
            interval = 1000 / ConfigManager.get('limitFps');
            if (currentTime - lastTime >= interval) {
                lastTime = currentTime;
                if (updateControllerState()) {
                    updateSpriteForRender();
                    render();
                }
            }
        }
        else { 
            if (updateControllerState()) {
                updateSpriteForRender();
                render();
            }
        }

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    
    let currentPressKeyNum = 0;

    function isPointInRect(px, py, rx, ry, rw, rh) {
        return px >= rx && px <= rx + rw &&
                py >= ry && py <= ry + rh;
    }

    let isDragging = false;
    let dragStartPoint = new Point();
    let pointBeforeDrag = new Point();
    window.addEventListener('mousedown', (event) => { 
        let pixiPoint = new Point();
        app.renderer.events.mapPositionToPoint(
            pixiPoint,
            event.clientX,
            event.clientY
        );
        isDragging = isPointInRect(pixiPoint.x, pixiPoint.y, mainContainer.x, mainContainer.y, mainContainer.width, mainContainer.height);
        if (isDragging) {
            dragStartPoint.x = event.clientX;
            dragStartPoint.y = event.clientY;

            pointBeforeDrag.x = mainContainer.x;
            pointBeforeDrag.y = mainContainer.y;
        }
    });

    window.addEventListener('mouseup', (event) => { 
        isDragging = false;
    });

    // 给页面根元素添加鼠标移动事件
    window.addEventListener('mousemove', (event) => { 
        if (isDragging) {
            mainContainer.x = pointBeforeDrag.x + (event.clientX - dragStartPoint.x);
            mainContainer.y = pointBeforeDrag.y + (event.clientY - dragStartPoint.y);
            render();
        }
    });

    async function loadAssets() { 
        const now = Date.now();
        let defPath = 'model/standard/';
        if (ConfigManager.get('modelPath')) {
            let _configModelPath = ConfigManager.get('modelPath');
            defPath = `https://forepaperenginelocalfile/${_configModelPath}/`;
        }
        if (assetsMap['body'] === null) {
            const asyncTasks = Object.entries(assetsMap).map(async ([key, value]) => { 
                const newAlias = `${key}${now}`;
                let src = `${defPath}${key}.png`;
                await Assets.load({ alias: newAlias, src: src });

                if (key === 'rightStickHand') { 
                    const texture = await Assets.get(newAlias);
                    const points = [[0, 0], [1024, 0], [1024, 1024], [0, 1024], [381, 561], [230, 360], [430, 370]];
                    const delaunay = Delaunay.from(points);
                    const indices = delaunay.triangles;

                    assetsMap['rightStickHand'] = {
                        mesh: new MeshSimple({
                                    texture: texture,
                                    vertices: new Float32Array([0, 0, 1024, 0, 1024, 1024, 0, 1024, 381, 561, 230, 360, 430, 370]),
                                    uvs: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1, 381 / 1024, 561 / 1024, 230 / 1024, 360 / 1024, 430 / 1024, 370 / 1024]),
                                    indices: indices,
                                }),
                        alias: newAlias
                    }
                }
                else if (key === 'leftStickHand') { 
                    const texture = await Assets.get(newAlias);
                    const points = [[0, 0], [1024, 0], [1024, 1024], [0, 1024], [1024 - 381, 561], [1024 - 230, 360], [1024 - 430, 370]];
                    const delaunay = Delaunay.from(points);
                    const indices = delaunay.triangles;

                    assetsMap['leftStickHand'] = {
                        mesh: new MeshSimple({
                                    texture: texture,
                                    vertices: new Float32Array([0, 0, 1024, 0, 1024, 1024, 0, 1024, 1024 - 381, 561, 1024 - 230, 360, 1024 - 430, 370]),
                                    uvs: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1, 1 - 381 / 1024, 561 / 1024, 1 - 230 / 1024, 360 / 1024, 1 - 430 / 1024, 370 / 1024]),
                                    indices: indices,
                                }),
                        alias: newAlias
                    }
                }
                else if (key === 'rightTriggerPress') { 
                    const texture = await Assets.get(newAlias);
                    const points = [[0, 0], [1024, 0], [1024, 1024], [0, 1024], [300, 775], [390, 775], [300, 700], [390, 700]];
                    const delaunay = Delaunay.from(points);
                    const indices = delaunay.triangles;

                    assetsMap['rightTriggerPress'] = {
                        mesh: new MeshSimple({
                                    texture: texture,
                                    vertices: new Float32Array([0, 0, 1024, 0, 1024, 1024, 0, 1024, 300, 775, 390, 775, 300, 700, 390, 700]),
                                    uvs: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1, 300 / 1024, 775 / 1024, 390 / 1024, 775 / 1024, 300 / 1024, 700 / 1024, 390 / 1024, 700 / 1024]),
                                    indices: indices,
                                }),
                        alias: newAlias
                    }
                }
                else if (key === 'leftTriggerPress') { 
                    const texture = await Assets.get(newAlias);
                    const points = [[0, 0], [1024, 0], [1024, 1024], [0, 1024], [1024 - 300, 775], [1024 - 390, 775], [1024 - 300, 700], [1024 - 390, 700]];
                    const delaunay = Delaunay.from(points);
                    const indices = delaunay.triangles;

                    assetsMap['leftTriggerPress'] = {
                        mesh: new MeshSimple({
                                    texture: texture,
                                    vertices: new Float32Array([0, 0, 1024, 0, 1024, 1024, 0, 1024, 1024 - 300, 775, 1024 - 390, 775, 1024 - 300, 700, 1024 - 390, 700]),
                                    uvs: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1, 1 - 300 / 1024, 775 / 1024, 1 - 390 / 1024, 775 / 1024, 1 - 300 / 1024, 700 / 1024, 1 - 390 / 1024, 700 / 1024]),
                                    indices: indices,
                                }),
                        alias: newAlias
                    }
                }
                else {
                    assetsMap[key] = {
                        sprite: new Sprite(Assets.get(newAlias)),
                        alias: newAlias
                    }
                }
            })

            await Promise.all(asyncTasks);

            mainContainer.addChild(assetsMap['body'].sprite);
            mainContainer.addChild(assetsMap['controller'].sprite);
            mainContainer.addChild(assetsMap['leftTrigger'].sprite);
            mainContainer.addChild(assetsMap['rightTrigger'].sprite);

            leftStickContainer.addChild(assetsMap['leftStick'].sprite);

            assetsMap['leftStickPress'].sprite.visible = false;
            leftStickContainer.addChild(assetsMap['leftStickPress'].sprite);
            
            rightStickContainer.addChild(assetsMap['rightStick'].sprite);

            assetsMap['rightStickPress'].sprite.visible = false;
            rightStickContainer.addChild(assetsMap['rightStickPress'].sprite);
            
            mainContainer.addChild(leftStickContainer);
            mainContainer.addChild(rightStickContainer);
            mainContainer.addChild(assetsMap['leftHandUp'].sprite);
            mainContainer.addChild(assetsMap['rightHandUp'].sprite);
            mainContainer.addChild(assetsMap['leftFootUp'].sprite);
            mainContainer.addChild(assetsMap['rightFootUp'].sprite);

            assetsMap['a'].sprite.visible = false;
            mainContainer.addChild(assetsMap['a'].sprite);

            assetsMap['b'].sprite.visible = false;
            mainContainer.addChild(assetsMap['b'].sprite);

            assetsMap['x'].sprite.visible = false;
            mainContainer.addChild(assetsMap['x'].sprite);

            assetsMap['y'].sprite.visible = false;
            mainContainer.addChild(assetsMap['y'].sprite);

            assetsMap['down'].sprite.visible = false;
            mainContainer.addChild(assetsMap['down'].sprite);

            assetsMap['right'].sprite.visible = false;
            mainContainer.addChild(assetsMap['right'].sprite);

            assetsMap['left'].sprite.visible = false;
            mainContainer.addChild(assetsMap['left'].sprite);

            assetsMap['up'].sprite.visible = false;
            mainContainer.addChild(assetsMap['up'].sprite);

            assetsMap['back'].sprite.visible = false;
            mainContainer.addChild(assetsMap['back'].sprite);

            assetsMap['start'].sprite.visible = false;
            mainContainer.addChild(assetsMap['start'].sprite);

            assetsMap['leftStickHand'].mesh.visible = false;
            mainContainer.addChild(assetsMap['leftStickHand'].mesh);
            assetsMap['rightStickHand'].mesh.visible = false;
            mainContainer.addChild(assetsMap['rightStickHand'].mesh);
            assetsMap['leftTriggerPress'].mesh.visible = false;
            mainContainer.addChild(assetsMap['leftTriggerPress'].mesh);
            assetsMap['rightTriggerPress'].mesh.visible = false;
            mainContainer.addChild(assetsMap['rightTriggerPress'].mesh);

            assetsMap['leftShoulder'].sprite.visible = false;
            mainContainer.addChild(assetsMap['leftShoulder'].sprite);
            assetsMap['rightShoulder'].sprite.visible = false;
            mainContainer.addChild(assetsMap['rightShoulder'].sprite);
        }
        else {
            Object.entries(assetsMap).forEach(async ([key, value]) => { 
                await Assets.unload(assetsMap[key].alias);
                assetsMap[key].alias = `${key}${now}`;
                if (
                    key === 'leftStickHand'
                    || key === 'rightStickHand'
                    || key === 'leftTriggerPress'
                    || key === 'rightTriggerPress'
                ) {
                    assetsMap[key].mesh.texture = await Assets.load({ alias: assetsMap[key].alias, src: `${defPath}${key}.png` });
                }
                else { 
                    assetsMap[key].sprite.texture = await Assets.load({ alias: assetsMap[key].alias, src: `${defPath}${key}.png` });
                }
            })
        }
    }

    window.MainCanvasManager = {
        changeScale: changeScale,
        changeAlpha: changeAlpha,
        loadAssets: loadAssets,
        render: render,
    }
})();