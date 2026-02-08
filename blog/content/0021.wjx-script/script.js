const n = document.querySelectorAll('[ans]');
const m = document.getElementById('lxNextBtn');

function randomDelay(min, max) {
    const delay = Math.floor(Math.random() * (max - min)) + min;
    console.log('Delayed for: ' + delay + 'ms');
    return new Promise(resolve => setTimeout(resolve, delay));
}

async function handleWrongAnswers(i) {
    n[i].parentElement.querySelector('div:not([ans])').click();
    console.log('Question ' + (i + 1) + ': Clicked wrong answer\n');
}

async function handleAnswers(i) {
    n[i].children[0].click();
    console.log('Question ' + (i + 1) + ': Clicked ' + n[i].children[1].innerText + ' (correct)\n');
}

async function clickNext() {
    await randomDelay(500, 1000);
    m.click();
    console.log('Clicked SUBMIT');
    await randomDelay(500, 1000);
    m.click();
    console.log('Clicked NEXT');
}

async function main(i, isWrong) {
    await randomDelay(500, 5000);
    if (isWrong) {
        await handleWrongAnswers(i);
    } else {
        await handleAnswers(i);
    }
    await clickNext();
}

async function runAll(wrongCount) {
    document.getElementById('txtPassword').value = '自行修改';
    await randomDelay(500, 1000);
    document.getElementById('btnContinue').click();
    await randomDelay(500, 1000);
    document.querySelector('.lxstartBtn').click();

    const wrongIndices = new Set();
    while (wrongIndices.size < wrongCount) {
        wrongIndices.add(Math.floor(Math.random() * 50));
    }
    for (let i = 0; i < 50; i++) {
        const isWrong = wrongIndices.has(i);
        await main(i, isWrong);
    }
    console.log('-- All done! --');
}

runAll(3);