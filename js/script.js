let [from_select, to_select] = document.querySelectorAll('.flag-n-option select');
let flags = document.querySelectorAll('.flag-n-option img');
let btn = document.querySelector('button');
let input = document.querySelector('input');
let exchange = document.querySelector('.conversion-mark');

[from_select, to_select].forEach(dropdowns => {
    dropdowns.addEventListener('change', () => {
        updateFlag();
        printEx(from_select.value, to_select.value, input.value);
    });
    for (const currency in countryList) {
        let option = document.createElement('option');
        option.innerHTML = currency;
        option.setAttribute('value', currency);
        if (option.value === 'USD' && dropdowns === from_select) {
            option.setAttribute('selected', '')
        }
        else if (option.value === 'INR' && dropdowns === to_select) {
            option.setAttribute('selected', '')
        }
        dropdowns.append(option);
    }
});

function updateFlag() {
    flags[0].setAttribute('src', `https://flagsapi.com/${countryList[from_select.value]}//flat/32.png`);
    flags[1].setAttribute('src', `https://flagsapi.com/${countryList[to_select.value]}//flat/32.png`);
}

async function getExchange(from, to) {
    let x = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from}/${to}.json`);
    let data = await x.json();
    return data;
}

async function printEx(from_sym, to_sym, from_val) {
    const convRate = document.querySelector('.conversion-rate');
    from_sym = from_sym.toLowerCase();
    to_sym = to_sym.toLowerCase();
    const data = await getExchange(from_sym, to_sym);
    let to_val = 0
    if (!from_val) {
        from_val = 1;
    } else if (from_val < 0) {
        convRate.innerHTML = 'Invalid Input (Min. value allowed = 1)';
        convRate.style.color = 'red';
        convRate.style.fontWeight = '700';
        btn.addEventListener('click', () => {
            convRate.style.color = '';
            convRate.style.fontWeight = '';
        });
        exchange.addEventListener('click', () => {
            convRate.style.color = '';
            convRate.style.fontWeight = '';
        });
        document.addEventListener('keydown', evnt => {
            if (evnt.key === 'Enter') {
                convRate.style.color = '';
                convRate.style.fontWeight = '';
            }
        });
        return 'error';
    }
    to_val = (from_val * data[to_sym]).toFixed(2);
    from_sym = from_sym.toUpperCase();
    to_sym = to_sym.toUpperCase();
    convRate.innerHTML = `${from_val} ${from_sym} = ${to_val} ${to_sym}`;
}

exchange.addEventListener('click', () => {
    if (exchange.style.rotate === '180deg') {
        exchange.style.rotate = '0deg';
    }
    else {
        exchange.style.rotate = '180deg';
    }
    let temp = from_select.value;
    from_select.value = to_select.value;
    to_select.value = temp;
    updateFlag();
    printEx(from_select.value, to_select.value, input.value);
});

input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        printEx(from_select.value, to_select.value, input.value);
    }
});

btn.addEventListener('click', evnt => {
    evnt.preventDefault();
    printEx(from_select.value, to_select.value, input.value);
});

updateFlag();
printEx(from_select.value, to_select.value, input.value);