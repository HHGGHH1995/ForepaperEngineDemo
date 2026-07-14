let TestArr = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '0', '0', '0', '0', '0', '0'];
function ForepaperEngineGetGameControllerState(playerId) { 
    // return copy of TestArr
    return TestArr.slice();
}

//listen for keyboard
window.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'a':
            TestArr[0] = '1';
            break;
        case 'b':
            TestArr[1] = '1';
            break;
        case 'x':
            TestArr[2] = '1';
            break;
        case 'y':
            TestArr[3] = '1';
            break;
        case 'q':
            TestArr[4] = '1';
            break;
        case 'ArrowDown':
            TestArr[5] = '1';
            break;
        case 'ArrowLeft':
            TestArr[6] = '1';
            break;
        case 'ArrowRight':
            TestArr[7] = '1';
            break;
        case 'ArrowUp':
            TestArr[8] = '1';
            break;
        case 'w':
            TestArr[9] = '1';
            break;
        case 'e':
            TestArr[10] = '1';
            break;
        case 'r':
            TestArr[11] = '1';
            break;
        case 't':
            TestArr[12] = '1';
            break;
        case 'u':
            TestArr[13] = '1';
            break;
    }
});

window.addEventListener('keyup', function(event) {
    switch (event.key) {
        case 'a':
            TestArr[0] = '';
            break;
        case 'b':
            TestArr[1] = '';
            break;
        case 'x':
            TestArr[2] = '';
            break;
        case 'y':
            TestArr[3] = '';
            break;
        case 'q':
            TestArr[4] = '';
            break;
        case 'ArrowDown':
            TestArr[5] = '';
            break;
        case 'ArrowLeft':
            TestArr[6] = '';
            break;
        case 'ArrowRight':
            TestArr[7] = '';
            break;
        case 'ArrowUp':
            TestArr[8] = '';
            break;
        case 'w':
            TestArr[9] = '';
            break;
        case 'e':
            TestArr[10] = '';
            break;
        case 'r':
            TestArr[11] = '';
            break;
        case 't':
            TestArr[12] = '';
            break;
        case 'u':
            TestArr[13] = '';
            break;
    }
});

window.addEventListener('mousemove', function(event) {
    if (event.clientY > 384) { 
        TestArr[14] = (event.clientY - 384) / 384 * 255;
        TestArr[15] = event.clientX / 1366 * 255;
        TestArr[16] = 0;
        TestArr[17] = 0;
        TestArr[18] = 0;
        TestArr[19] = 0;
    }
    else {
        TestArr[14] = 0;
        TestArr[15] = 0;
        if (event.clientX < 683) {
            TestArr[16] = event.clientX / 683 * 65535 - 32767;
            TestArr[17] = event.clientY / 384 * 65535 - 32767;
            TestArr[18] = 0;
            TestArr[19] = 0;
        }
        else {
            TestArr[16] = 0;
            TestArr[17] = 0;
            TestArr[18] = (event.clientX - 683) / 683 * 65535 - 32767;
            TestArr[19] = event.clientY / 384 * 65535 - 32767;
        }
    }
});