'use strict'

const display = document.getElementById('display');
const numeros = document.querySelectorAll('[id*=tecla]');
const operadores = document.querySelectorAll('[id*=operador]');
const numeroComplexo = document.getElementById('operacaoComNumeroComplexo');

let novoNumero = true;
let operador;
let numeroAnterior;
let calculoNumeroComplexo = false;
let expressaoSalva = false; // Recebe true quando a primeira expressão de uma operação com números Complexos é salva em uma variável
let primeiraExpressao;
let verificaCalculoRealizado = false;

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
    let resultado;
    novoNumero = true;
    if (calculoNumeroComplexo) {         
        const segundaExpressao = display.textContent.replace(',','.');
        const primeiroNumeroReal = definirNumeroReal(primeiraExpressao);
        const primeiroNumeroImaginario = definirNumeroImaginario(primeiraExpressao);
        const segundoNumeroReal = definirNumeroReal(segundaExpressao);
        const segundoNumeroImaginario = definirNumeroImaginario(segundaExpressao);
        let resultadoParcialParteReal;
        let resultadoParcialParteImaginaria;
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
                const numeradorParteImaginaria = ((primeiroNumeroReal * (-1)) * segundoNumeroImaginario) + (primeiroNumeroImaginario * segundoNumeroReal);

                resultadoParcialParteReal = numeradorParteReal / denominadorAmbasAsPartes;
                resultadoParcialParteImaginaria = numeradorParteImaginaria / denominadorAmbasAsPartes;
                break;               
        }
        if (Math.sign(resultadoParcialParteImaginaria) === 1){      //colocando sinal positivo no número imaginário
            resultadoParcialParteImaginaria = `+${resultadoParcialParteImaginaria}i`;
        } else {
            resultadoParcialParteImaginaria = `${resultadoParcialParteImaginaria}i`;
        }
        if (resultadoParcialParteReal === 0) {
            resultadoParcialParteReal = "";
        }
        if (resultadoParcialParteImaginaria === "0i") {
            resultadoParcialParteImaginaria = "";
        }
        resultado = `${resultadoParcialParteReal}${resultadoParcialParteImaginaria}`;
        primeiraExpressao = undefined;
        atualizarDisplay(resultado);
        operador = undefined;
        armazenarPrimeiraExpressaoNumeroComplexo();
        novoNumero = true;
    } else if (operador != undefined) {
        const numeroAtual = parseFloat(display.textContent.replace(',','.'));
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
        verificaCalculoRealizado = true;
    }
}

const verificarNumeroPendente = () => {
    if(!calculoNumeroComplexo && operador === undefined && verificaCalculoRealizado){
        novoNumero = true;
        verificaCalculoRealizado = false;
    }else if(operador === undefined) {
        primeiraExpressao = undefined;
        expressaoSalva = false;
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
const inserirNumero = (evento) => {
    verificarNumeroPendente();
    atualizarDisplay(evento.target.textContent);
}
numeros.forEach(numero => numero.addEventListener("click", inserirNumero));

const selecionarOperador = (evento) => {
    if (!novoNumero && !calculoNumeroComplexo) {
        novoNumero = true;
        operador = evento.target.textContent;
        numeroAnterior = parseFloat(display.textContent.replace(',','.'));
    } else if (calculoNumeroComplexo) {
        if(!expressaoSalva) {
            atualizarDisplay(evento.target.textContent);
        } else {
            operador = evento.target.textContent;
        }
        expressaoSalva = false;
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
    calculoNumeroComplexo = false;
    numeroComplexo.classList.remove("numero-complexo");
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

numeroComplexo.addEventListener("click", function (){
    calculoNumeroComplexo  = true;
    numeroComplexo.classList.add("numero-complexo");
});

