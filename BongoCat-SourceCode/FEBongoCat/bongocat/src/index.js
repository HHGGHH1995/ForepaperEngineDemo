import { Application, Assets, Container, Sprite, MeshSimple, Point } from 'pixi.js';
import { Delaunay } from "d3-delaunay";

(async () =>
{
    //声明管理全局资源的map
    let assetsMap = {
        table: null,
        mouse: null,
        mouseLeftDown: null,
        mouseRightDown: null,
        body: null,
        leftHandUp: null,
        Alt: null,
        AltGr: null,
        BackQuote: null,
        Backspace: null,
        CapsLock: null,
        Control: null,
        ControlLeft: null,
        ControlRight: null,
        Delete: null,
        Escape: null,
        Fn: null,
        KeyA: null,
        KeyB: null,
        KeyC: null,
        KeyD: null,
        KeyE: null,
        KeyF: null,
        KeyG: null,
        KeyH: null,
        KeyI: null,
        KeyJ: null,
        KeyK: null,
        KeyL: null,
        KeyM: null,
        KeyN: null,
        KeyO: null,
        KeyP: null,
        KeyQ: null,
        KeyR: null,
        KeyS: null,
        KeyT: null,
        KeyU: null,
        KeyV: null,
        KeyW: null,
        KeyX: null,
        KeyY: null,
        KeyZ: null,
        Meta: null,
        Num0: null,
        Num1: null,
        Num2: null,
        Num3: null,
        Num4: null,
        Num5: null,
        Num6: null,
        Num7: null,
        Num8: null,
        Num9: null,
        Return: null,
        Shift: null,
        ShiftLeft: null,
        ShiftRight: null,
        Slash: null,
        Space: null,
        Tab: null
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
    const mouseContainer = new Container();

    mouseContainer.x = 80;
    mouseContainer.y = 200;

    // Load the bunny texture
    // const texture = await Assets.load(testImg);
    // const texture = await Assets.load('./src/image/test.webp');

    // Create a new Sprite with the texture
    // assetsMap['table'] = new Sprite(await Assets.load(testImg));

    // Center the sprite's anchor point
    // assetsMap['table'].anchor.set(0.5);

    // Move the sprite to the center of the screen
    // assetsMap['table'].x = app.screen.width / 2;
    // assetsMap['table'].y = app.screen.height / 2;

    app.stage.addChild(mainContainer);
    // container.addChild(assetsMap['table']);

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

    // 如果使用自动渲染Loop，则放开本注释
    // Listen for animate update
    // app.ticker.add(() =>
    // {
    //     // Just for fun, let's rotate our bunny over time!
    //     bunny.rotation += 0.1;
    // });

    // 手动触发渲染示例，用事件启动渲染Loop
    // 给页面根元素添加鼠标点击事件
    // window.addEventListener('click', () => { 
    //     // assetsMap['table'].sprite.rotation += 0.1;
    //     // Manually draw the next frame
    //     app.renderer.render(app.stage);
    // });
    
    function render() {
        app.renderer.render(app.stage);
    }

    await loadAssets();
    render();
    
    let currentPressKeyNum = 0;

    function isPointInRect(px, py, rx, ry, rw, rh) {
        return px >= rx && px <= rx + rw &&
                py >= ry && py <= ry + rh;
    }

    let isDragging = false;
    let dragStartPoint = new Point();
    let pointBeforeDrag = new Point();
    window.addEventListener('mousedown', (event) => { 
        if (event.button === 0)
            assetsMap['mouseLeftDown'].sprite.visible = true;
        else if (event.button === 2)
            assetsMap['mouseRightDown'].sprite.visible = true;
        // Manually draw the next frame
        render();
        
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
        if (event.button === 0)
            assetsMap['mouseLeftDown'].sprite.visible = false;
        else if (event.button === 2)
            assetsMap['mouseRightDown'].sprite.visible = false;
        // Manually draw the next frame
        render();
        
        isDragging = false;
    });

    const irregularQuad = [
        { x: 100, y: 250 },  // Top-left
        { x: -50, y: 180 },  // Top-right
        { x: 0, y: 150 },  // Bottom-right
        { x: 160, y: 190 }   // Bottom-left
    ];

    // 给页面根元素添加鼠标移动事件
    window.addEventListener('mousemove', (event) => { 
        const newPoint = mapToIrregular(event.clientX, event.clientY, irregularQuad, document.body.clientWidth, document.body.clientHeight);

        mouseContainer.x = newPoint.x;
        mouseContainer.y = newPoint.y;

        assetsMap['body'].mesh.vertices[8] = 218 - (133 - (newPoint.x + 40)) / 2;
        // assetsMap['body'].mesh.vertices[9] = 179-(227 - newPoint.y)/2;

        assetsMap['body'].mesh.vertices[10] = newPoint.x + 40;
        assetsMap['body'].mesh.vertices[11] = newPoint.y;

        if (isDragging) {
            mainContainer.x = pointBeforeDrag.x + (event.clientX - dragStartPoint.x);
            mainContainer.y = pointBeforeDrag.y + (event.clientY - dragStartPoint.y);
        }

        render();
    });

    function mapToIrregular(x, y, quad, rectWidth, rectHeight) {
        // Normalize (x, y) to [0, 1] range
        const u = x / rectWidth;
        const v = y / rectHeight;

        // Bilinear interpolation
        const xMapped = 
            quad[0].x * (1 - u) * (1 - v) +  // Top-left contribution
            quad[1].x * u * (1 - v) +        // Top-right contribution
            quad[2].x * u * v +              // Bottom-right contribution
            quad[3].x * (1 - u) * v;         // Bottom-left contribution

        const yMapped = 
            quad[0].y * (1 - u) * (1 - v) +  // Top-left contribution
            quad[1].y * u * (1 - v) +        // Top-right contribution
            quad[2].y * u * v +              // Bottom-right contribution
            quad[3].y * (1 - u) * v;         // Bottom-left contribution

        return { x: xMapped, y: yMapped };
    }

    function GetKeyName(key) { 
        let keyName = key;
        switch (key) {
            case 'a': case 'A':
            case 'b': case 'B':
            case 'c': case 'C':
            case 'd': case 'D':
            case 'e': case 'E':
            case 'f': case 'F':
            case 'g': case 'G':
            case 'h': case 'H':
            case 'i': case 'I':
            case 'j': case 'J':
            case 'k': case 'K':
            case 'l': case 'L':
            case 'm': case 'M':
            case 'n': case 'N':
            case 'o': case 'O':
            case 'p': case 'P':
            case 'q': case 'Q':
            case 'r': case 'R':
            case 's': case 'S':
            case 't': case 'T':
            case 'u': case 'U':
            case 'v': case 'V':
            case 'w': case 'W':
            case 'x': case 'X':
            case 'y': case 'Y':
            case 'z': case 'Z': {
                keyName = `Key${event.key.toUpperCase()}`;
                break;
            }
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '0': {
                keyName = `Num${event.key}`;
                break;
            }
            case '/': {
                keyName = 'Slash';
                break;
            }
            case 'Enter': {
                keyName = 'Return';
                break;
            }
            case '`': {
                keyName = 'BackQuote';
                break;
            }
            case ' ': {
                keyName = 'Space';
                break;
            }
        }
        return keyName;
    }

    // 给页面根元素添加键盘按下事件
    window.addEventListener('keydown', async (event) => { 
        // await loadAssets();
        // assetsMap['table'].sprite.rotation += 0.1;
        // Manually draw the next frame
        let needUpdate = false;

        let keyName = GetKeyName(event.key);

        if (!assetsMap[keyName]) {
            return;
        }

        if (assetsMap[keyName].sprite.visible === false) { 
            assetsMap[keyName].sprite.visible = true;
            needUpdate = true;
        }

        if (needUpdate) {
            assetsMap['leftHandUp'].sprite.visible = false;
            currentPressKeyNum += 1;

            // console.log(currentPressKeyNum);

            render();
        }
    });

    window.addEventListener('keyup', (event) => { 
        let keyName = GetKeyName(event.key);

        if (!assetsMap[keyName]) {
            return;
        }

        assetsMap[keyName].sprite.visible = false;
        
        currentPressKeyNum -= 1;
        if (currentPressKeyNum <= 0) {
            assetsMap['leftHandUp'].sprite.visible = true;
            currentPressKeyNum = 0;
        }
        
        // Manually draw the next frame
        render();
    });

    async function loadAssets() { 
        const now = Date.now();
        let defPath = 'model/standard/';
        if (ConfigManager.get('modelPath')) {
            let _configModelPath = ConfigManager.get('modelPath');
            defPath = `https://forepaperenginelocalfile/${_configModelPath}/`;
        }
        if (assetsMap['table'] === null) {
            const asyncTasks = Object.entries(assetsMap).map(async ([key, value]) => { 
                const newAlias = `${key}${now}`;
                let src = `${defPath}left-keys/${key}.png`;
                switch (key) { 
                    case 'table':
                    case 'mouse':
                    case 'mouseLeftDown':
                    case 'mouseRightDown':
                    case 'leftHandUp':
                    case 'body':
                        src = `${defPath}${key}.png`;
                        break;
                }
                await Assets.load({ alias: newAlias, src: src });

                if (key === 'body') { 
                    const texture = await Assets.get(newAlias);
                    const points = [[0, 0], [612, 0], [612, 354], [0, 354], [218, 179], [133, 227]];
                    const delaunay = Delaunay.from(points);
                    const indices = delaunay.triangles;

                    assetsMap['body'] = {
                        mesh: new MeshSimple({
                                    texture: texture,
                                    vertices: new Float32Array([0, 0, 612, 0, 612, 354, 0, 354, 218, 179, 133, 227]),
                                    uvs: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1, 218 / 612, 179 / 354, 133 / 612, 227 / 354]),
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

            mainContainer.addChild(assetsMap['table'].sprite);
            mouseContainer.addChild(assetsMap['mouse'].sprite);

            assetsMap['mouseLeftDown'].sprite.visible = false;
            mouseContainer.addChild(assetsMap['mouseLeftDown'].sprite);

            assetsMap['mouseRightDown'].sprite.visible = false;
            mouseContainer.addChild(assetsMap['mouseRightDown'].sprite);
            
            mainContainer.addChild(mouseContainer);
            mainContainer.addChild(assetsMap['body'].mesh);
            mainContainer.addChild(assetsMap['leftHandUp'].sprite);

            assetsMap['Control'].sprite.visible = false;
            mainContainer.addChild(assetsMap['Control'].sprite);

            assetsMap['ControlLeft'].sprite.visible = false;
            mainContainer.addChild(assetsMap['ControlLeft'].sprite);

            assetsMap['Meta'].sprite.visible = false;
            mainContainer.addChild(assetsMap['Meta'].sprite);

            assetsMap['Alt'].sprite.visible = false;
            mainContainer.addChild(assetsMap['Alt'].sprite);

            assetsMap['Space'].sprite.visible = false;
            mainContainer.addChild(assetsMap['Space'].sprite);

            assetsMap['Shift'].sprite.visible = false;
            mainContainer.addChild(assetsMap['Shift'].sprite);

            assetsMap['ShiftLeft'].sprite.visible = false;
            mainContainer.addChild(assetsMap['ShiftLeft'].sprite);

            assetsMap['ShiftRight'].sprite.visible = false;
            mainContainer.addChild(assetsMap['ShiftRight'].sprite);

            assetsMap['KeyZ'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyZ'].sprite);

            assetsMap['KeyX'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyX'].sprite);

            assetsMap['KeyC'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyC'].sprite);

            assetsMap['KeyV'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyV'].sprite);

            assetsMap['KeyB'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyB'].sprite);

            assetsMap['KeyN'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyN'].sprite);

            assetsMap['KeyM'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyM'].sprite);

            assetsMap['Slash'].sprite.visible = false;
            mainContainer.addChild(assetsMap['Slash'].sprite);

            assetsMap['CapsLock'].sprite.visible = false;
            mainContainer.addChild(assetsMap['CapsLock'].sprite);

            assetsMap['KeyA'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyA'].sprite);

            assetsMap['KeyS'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyS'].sprite);

            assetsMap['KeyD'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyD'].sprite);

            assetsMap['KeyF'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyF'].sprite);

            assetsMap['KeyG'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyG'].sprite);

            assetsMap['KeyH'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyH'].sprite);

            assetsMap['KeyJ'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyJ'].sprite);

            assetsMap['KeyK'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyK'].sprite);

            assetsMap['KeyL'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyL'].sprite);

            assetsMap['Return'].sprite.visible = false;
            mainContainer.addChild(assetsMap['Return'].sprite);

            assetsMap['Tab'].sprite.visible = false;
            mainContainer.addChild(assetsMap['Tab'].sprite);

            assetsMap['KeyQ'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyQ'].sprite);

            assetsMap['KeyW'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyW'].sprite);

            assetsMap['KeyE'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyE'].sprite);

            assetsMap['KeyR'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyR'].sprite);

            assetsMap['KeyT'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyT'].sprite);

            assetsMap['KeyY'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyY'].sprite);

            assetsMap['KeyU'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyU'].sprite);

            assetsMap['KeyI'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyI'].sprite);

            assetsMap['KeyO'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyO'].sprite);

            assetsMap['KeyP'].sprite.visible = false;
            mainContainer.addChild(assetsMap['KeyP'].sprite);

            assetsMap['Delete'].sprite.visible = false;
            mainContainer.addChild(assetsMap['Delete'].sprite);

            assetsMap['BackQuote'].sprite.visible = false;
            mainContainer.addChild(assetsMap['BackQuote'].sprite);

            assetsMap['Num1'].sprite.visible = false;
            mainContainer.addChild(assetsMap['Num1'].sprite);

            assetsMap['Num2'].sprite.visible = false;
            mainContainer.addChild(assetsMap['Num2'].sprite);

            assetsMap['Num3'].sprite.visible = false;
            mainContainer.addChild(assetsMap['Num3'].sprite);

            assetsMap['Num4'].sprite.visible = false;
            mainContainer.addChild(assetsMap['Num4'].sprite);

            assetsMap['Num5'].sprite.visible = false;
            mainContainer.addChild(assetsMap['Num5'].sprite);

            assetsMap['Num6'].sprite.visible = false;
            mainContainer.addChild(assetsMap['Num6'].sprite);

            assetsMap['Num7'].sprite.visible = false;
            mainContainer.addChild(assetsMap['Num7'].sprite);

            assetsMap['Num8'].sprite.visible = false;
            mainContainer.addChild(assetsMap['Num8'].sprite);

            assetsMap['Num9'].sprite.visible = false;
            mainContainer.addChild(assetsMap['Num9'].sprite);

            assetsMap['Num0'].sprite.visible = false;
            mainContainer.addChild(assetsMap['Num0'].sprite);

            assetsMap['Backspace'].sprite.visible = false;
            mainContainer.addChild(assetsMap['Backspace'].sprite);

            assetsMap['Escape'].sprite.visible = false;
            mainContainer.addChild(assetsMap['Escape'].sprite);

            assetsMap['Fn'].sprite.visible = false;
            mainContainer.addChild(assetsMap['Fn'].sprite);
        }
        else {
            Object.entries(assetsMap).forEach(async ([key, value]) => { 
                await Assets.unload(assetsMap[key].alias);
                assetsMap[key].alias = `${key}${now}`;
                if (key === 'body') {
                    assetsMap[key].mesh.texture = await Assets.load({ alias: assetsMap[key].alias, src: `${defPath}${key}.png` });
                }
                else { 
                    switch (key) { 
                        case 'table':
                        case 'mouse':
                        case 'mouseLeftDown':
                        case 'mouseRightDown':
                        case 'leftHandUp':
                            assetsMap[key].sprite.texture = await Assets.load({ alias: assetsMap[key].alias, src: `${defPath}${key}.png` });
                            break;
                        default:
                            assetsMap[key].sprite.texture = await Assets.load({ alias: assetsMap[key].alias, src: `${defPath}left-keys/${key}.png` });
                            break;
                    }
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