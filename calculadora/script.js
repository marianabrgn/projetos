'use strict'

const display = document.getElementById('display');
const numeros = document.querySelectorAll('[id*=tecla]');
const operadores = document.querySelectorAll('[id*=operador]');
const operadorImaginario = document.getElementById('operacaoComNumeroComplexo');

let novoNumero = true;
let operador;
let numeroAnterior;
let calculoNumeroComplexo = false;
let expressaoSalva = false; // Recebe true quando a primeira expressão de uma operação com números Complexos é salva em uma variável
let primeiraExpressao;

const operacaoPendente = () => operador != undefined;

function definirNumeroReal (expressaoNumerica) {
    const numeroReal = parseFloat(expressaoNumerica);
    return numeroReal;
}

function definirNumeroImaginario (expressaoNumerica){
    let numeroImaginario = expressaoNumerica.split('');
    let index = numeroImaginario.indexOf('+');

    if (index === 0) {
        numeroImaginario.shift();
        index = numeroImaginario.indexOf('+');
    } else if (index === -1){
        index = numeroImaginario.indexOf('-');
        if (index === 0) {
            numeroImaginario.shift();
            index = numeroImaginario.indexOf('-');
        }
    }
    let numeroFinal = [];
    for(index; numeroImaginario[index] !== 'i'; index++){
        numeroFinal.push(numeroImaginario[index]);
    }
    numeroFinal = numeroFinal.join('');
    numeroImaginario = parseFloat(numeroFinal);
    return numeroImaginario;
}

const calcular = () => {
    if (calculoNumeroComplexo) {         
        const segundaExpressao = display.textContent.replace(',','.');
        const primeiroNumeroReal = definirNumeroReal(primeiraExpressao);
        const primeiroNumeroImaginario = definirNumeroImaginario(primeiraExpressao);
        const segundoNumeroReal = definirNumeroReal(segundaExpressao);
        const segundoNumeroImaginario = definirNumeroImaginario(segundaExpressao);
        let resultadoParcialParteReal;
        let resultadoParcialParteImaginaria;
        let resultado;
        switch (operador) {
            case "+":
                resultadoParcialParteReal = primeiroNumeroReal + segundoNumeroReal;
                resultadoParcialParteImaginaria = primeiroNumeroImaginario + segundoNumeroImaginario;
                break;
            case "-":
                resultadoParcialParteReal = primeiroNumeroReal - segundoNumeroReal;
                resultadoParcialParteImaginaria = primeiroNumeroImaginario - segundoNumeroImaginario;
                break;
            case "*":
                resultadoParcialParteReal = (primeiroNumeroReal * segundoNumeroReal) - (primeiroNumeroImaginario * segundoNumeroImaginario);
                resultadoParcialParteImaginaria = (primeiroNumeroReal * segundoNumeroImaginario) + (primeiroNumeroImaginario * segundoNumeroReal);
                break;
            case "/":
                const numeradorParteReal = (primeiroNumeroReal * segundoNumeroReal) + (primeiroNumeroImaginario * segundoNumeroImaginario);
                const denominadorAmbasAsPartes = Math.pow(segundoNumeroReal,2) + Math.pow(segundoNumeroImaginario,2);
                console.log(denominadorAmbasAsPartes, "potencia real");
                const numeradorParteImaginaria = ((primeiroNumeroReal * (-1)) * segundoNumeroImaginario) + (primeiroNumeroImaginario * primeiroNumeroReal);

                resultadoParcialParteReal = numeradorParteReal / denominadorAmbasAsPartes;
                resultadoParcialParteImaginaria = numeradorParteImaginaria / denominadorAmbasAsPartes;
                break;               
        }
        if (Math.sign(resultadoParcialParteImaginaria) === 1){      //colocando sinal positivo no número imaginário
            resultadoParcialParteImaginaria = `+${resultadoParcialParteImaginaria}`;
        }
        resultado = `${resultadoParcialParteReal}${resultadoParcialParteImaginaria}i`;
        atualizarDisplay(resultado);
        novoNumero: true;
        

    } else if (operacaoPendente()) {
        const numeroAtual = parseFloat(display.textContent.replace(',','.'));
        novoNumero = true;
        let resultado;
        if (operador === '+'){
            resultado = numeroAnterior + numeroAtual;
        } else if (operador === '-'){
            resultado = numeroAnterior - numeroAtual;
        } else if (operador === '*'){
            resultado = numeroAnterior * numeroAtual;
        } else if (operador === '/'){
            resultado = numeroAnterior / numeroAtual;
        }
        atualizarDisplay(resultado);
    } 
}

const atualizarDisplay = (texto) => {
    if (novoNumero){
        display.textContent = texto.toLocaleString('pt-BR');
        novoNumero = false;
    } else {
        display.textContent += texto.toLocaleString('pt-BR');
    }
}

function armazenarPrimeiraExpressaoNumeroComplexo(){
    if(!expressaoSalva && primeiraExpressao === undefined) {
        primeiraExpressao = display.textContent.replace(',','.');
        expressaoSalva = true;
    }
}

const mostrarIconeImaginario = (evento) => {
    atualizarDisplay(evento.target.textContent);
    armazenarPrimeiraExpressaoNumeroComplexo();
    novoNumero = true;
}

document.getElementById('iconeImaginario').addEventListener('click', mostrarIconeImaginario);
const inserirNumero = (evento) => atualizarDisplay(evento.target.textContent);
numeros.forEach(numero => numero.addEventListener("click", inserirNumero));

const selecionarOperador = (evento) => {
    if (!novoNumero && !calculoNumeroComplexo) {
        calcular();
        novoNumero = true;
        operador = evento.target.textContent;
        numeroAnterior = parseFloat(display.textContent.replace(',','.'));
    } else if (calculoNumeroComplexo) { //!novoNumero &&
        if(!expressaoSalva) {
            atualizarDisplay(evento.target.textContent);
        }
        expressaoSalva = false;
        operador = evento.target.textContent;
    }
}
operadores.forEach (operador => operador.addEventListener("click", selecionarOperador));

const ativarIgual = () => {
    calcular();
    operador = undefined;
}
document.getElementById('igual').addEventListener('click', ativarIgual);

const limparDisplay = () => display.textContent = '';
document.getElementById('limparDisplay').addEventListener("click", limparDisplay);

const limparCalculo = () => {
    limparDisplay();
    operador = undefined;
    novoNumero = true;
    numeroAnterior = undefined;
}
document.getElementById('limparCalculo').addEventListener('click', limparCalculo);

const removerUltimoNumero = () => {
    display.textContent = display.textContent.slice(0, -1);
}
document.getElementById('backspace').addEventListener('click', removerUltimoNumero);

const inverterSinal = () => {
    if(!calculoNumeroComplexo) {
        novoNumero = true;
        atualizarDisplay(display.textContent * -1);
    }
}
document.getElementById('inverter').addEventListener('click', inverterSinal);

const existeDecimal = () => display.textContent.indexOf(',') !== -1;
const existeValor = () => display.textContent.length > 0;
const inserirDecimal = () => {
    if (!existeDecimal()){
        if (existeValor()) {
            atualizarDisplay(',');
        }else {
            atualizarDisplay('0,');
        }
    }
}
document.getElementById('decimal').addEventListener('click', inserirDecimal);

const mapaTeclado = {
    '1'         :   'tecla1',
    '0'         :   'tecla0',
    '2'         :   'tecla2',
    '3'         :   'tecla3',
    '4'         :   'tecla4',
    '5'         :   'tecla5',
    '6'         :   'tecla6',
    '7'         :   'tecla7',
    '8'         :   'tecla8',
    '9'         :   'tecla9',
    '+'         :   'operadorAdicionar',
    '-'         :   'operadorSubtrair',
    '/'         :   'operadorDividir',
    '*'         :   'operadorMultiplicar',
    '='         :   'igual',
    'Enter'     :   'igual',
    'Backspace' :   'backspace',
    'c'         :   'limparDisplay',
    'Escape'    :   'limparCalculo',
    ','         :   'decimal',
    'i'         :   'iconeImaginario'
}

const mapearTeclado = (evento) => {
    const tecla = evento.key;
    const teclaPermitida = () => Object.keys(mapaTeclado).indexOf(tecla) !== -1;
    if (teclaPermitida()) document.getElementById(mapaTeclado[tecla]).click();
}
document.addEventListener('keydown', mapearTeclado);

operadorImaginario.addEventListener("click", function (){
    calculoNumeroComplexo  = true; 
});

