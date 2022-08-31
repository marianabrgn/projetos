'use strict'

const display = document.getElementById('display');
const numeros = document.querySelectorAll('[id*=tecla]');
const operadores = document.querySelectorAll('[id*=operador]');
const operadorImaginario = document.getElementById('imaginario');


let novoNumero = true;
let operador;
let numeroAnterior;
let calculoComImaginario = false;
let expressaoSalva = false; // Recebe true quando a primeira expressão de uma operação com números imaginários é salva em uma variável
let primeiraExpressao;

const operacaoPendente = () => operador != undefined;

function definindoNumeroReal (expressaoNumerica) {
    const numeroReal = parseFloat(expressaoNumerica);
    return numeroReal;
}

function definindoNumeroImaginario (expressaoNumerica){
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
    if (calculoComImaginario) {          
        const segundaExpressao = display.textContent.replace(',','.');
        const primeiroNumeroReal = definindoNumeroReal(primeiraExpressao);
        const primeiroNumeroImaginario = definindoNumeroImaginario(primeiraExpressao);
        const segundoNumeroReal = definindoNumeroReal(segundaExpressao);
        const segundoNumeroImaginario = definindoNumeroImaginario(segundaExpressao);
        //console.log('primeira expressão', primeiroNumeroReal, primeiroNumeroImaginario);
        //console.log(' segundo', segundoNumeroReal, segundoNumeroImaginario)
        let resultadoParcialParteReal;
        let resultadoParcialParteImaginaria;
        let resultado;
        switch (operador) {
            case "+":
                resultadoParcialParteReal = primeiroNumeroReal + segundoNumeroReal;
                //console.log('i', primeiroNumeroImaginario, segundoNumeroImaginario);
                resultadoParcialParteImaginaria = primeiroNumeroImaginario + segundoNumeroImaginario;
                if (Math.sign(resultadoParcialParteImaginaria) === 1){      //colocando sinal positivo no número imaginário
                    resultadoParcialParteImaginaria = `+${resultadoParcialParteImaginaria}`;
                    //console.log(resultadoParcialParteImaginaria, 'verificando pontuação');
                }
                resultado = `${resultadoParcialParteReal}${resultadoParcialParteImaginaria}i`;
                //console.log(resultado)
                break;
            case "-":
                //console.log("operação -");
                resultadoParcialParteReal = primeiroNumeroReal - segundoNumeroReal;
                //console.log('i', primeiroNumeroImaginario, segundoNumeroImaginario);
                resultadoParcialParteImaginaria = primeiroNumeroImaginario - segundoNumeroImaginario;
                resultado = `${resultadoParcialParteReal} ${resultadoParcialParteImaginaria}i`;
                //console.log(resultado);
                break;
                

        }
        atualizarDisplay(resultado);

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

function armazenaPrimeiraExpressaoComImaginario(){
    if(!expressaoSalva && primeiraExpressao === undefined) {
        primeiraExpressao = display.textContent.replace(',','.');
        expressaoSalva = true;
    }
}

const mostrarIconeImaginario = (evento) => {
    atualizarDisplay(evento.target.textContent);
    armazenaPrimeiraExpressaoComImaginario();
    novoNumero = true;
}

document.getElementById('iconeImaginario').addEventListener('click', mostrarIconeImaginario);
const inserirNumero = (evento) => atualizarDisplay(evento.target.textContent);
numeros.forEach(numero => numero.addEventListener("click", inserirNumero));

const selecionarOperador = (evento) => {
    if (!novoNumero && calculoComImaginario === false) {
        calcular();
        novoNumero = true;
        operador = evento.target.textContent;
        numeroAnterior = parseFloat(display.textContent.replace(',','.'));
    } else if (!novoNumero && calculoComImaginario === true) {
        if(!expressaoSalva) {
            atualizarDisplay(evento.target.textContent);
        }
        expressaoSalva = false;
    } else {
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
    novoNumero = true;
    atualizarDisplay(display.textContent * -1);
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
    calculoComImaginario  = true; 
});

