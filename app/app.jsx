import React from 'react';
import ReactDOM from 'react-dom';
import ViewPane from './ViewPane';
import { CapturePane } from './CapturePane';
import * as CONSTS from "./constants";

class FlashcardsApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: JSON.parse(localStorage.getItem("cards") || "[]"),
            seenCards: [],
            unseenCards: JSON.parse(localStorage.getItem("cards") || "[]"),
            formState: {
                phase: 1,
                inputs: [],
                mode: 1
            },
            currCard: {},
            currStack: '',
            answerVisible: false
        };
    }

    goToCaptureMode() {
        this.setState(() => ({ formState: { phase: 1, inputs: [], mode: 1 } }));
        this.clearCaptureInput();
    }

    goToViewMode() {
        this.setState(() => ({ formState: { phase: 1, inputs: [], mode: 2 } }), () => {
            if (this.state.cards && this.state.cards.length) {
                this.pickACard();
            }
        });
    }

    clearCaptureInput() {
        document.getElementById("input-pane").value = "";
    }

    pickACard() {
        if (this.state.seenCards.length === this.state.cards.length) {
            this.state.unseenCards = this.state.cards.slice(0);
            this.state.seenCards = [];
        }
        var randomCardIndex = Math.floor(Math.random() * this.state.unseenCards.length);
        let unseenCards = this.state.unseenCards.slice(0); //cloning arrays, as the gospel of ReactJS wants it
        let seenCards = this.state.seenCards.slice(0);
        var pickedCard = unseenCards.splice(randomCardIndex, 1);
        seenCards.push(pickedCard[0]);
        this.setState(() => ({ currCard: pickedCard[0], seenCards, unseenCards }));
    }

    showAnswer() {
        if (!this.state.answerVisible) {
            this.setState(() => ({ answerVisible: true }));
        } else {
            this.setState(() => ({ answerVisible: false }), () => {
                this.pickACard();
            });
        }
    }

    captureContinue() {
        let inputs = this.state.formState.inputs.slice(0) || [],
            inputElem = document.getElementById("input-pane");
        inputs.push(inputElem.value);
        this.clearCaptureInput();
        inputElem.focus();
        let phase = this.state.formState.phase + 1;
        if (phase > 2) {
            let newCard = { id: this.state.cards.length + 1, question: inputs[0], answer: inputs[1] };
            let cards = this.state.cards.slice(0) || [];
            let unseenCards = this.state.unseenCards.slice(0) || [];
            cards.push(newCard);
            unseenCards.push(newCard);
            this.setState(() => ({ formState: { phase: 1, inputs: [], mode: 1 }, cards, unseenCards }), () => {
                localStorage.setItem("cards", JSON.stringify(cards));
            });
        } else {
            this.setState(() => ({ formState: { phase, inputs, mode: 1 } }));
        }
    }

    printState() {
        return JSON.stringify(this.state, null, 2);
    }

    modeClass() {
        return this.state.formState.mode == 1 ? 'capture-mode' : (this.state.formState.mode == 2 ? 'view-mode' : 'invalid');
    }

    showClass(booley) {
        if (!!booley) return 'visible';
        return 'hidden';
    }

    hideClass(booley) {
        return this.showClass(!booley);
    }

    moveCardToStackHandler(cardId, stack) {
        console.log(`assigning card ID ${cardId} to stack ${stack}`);
        if (stack === CONSTS.ADD_NEW_STACK_SENTINEL_VALUE) {
            // if we're here, we have to create the new stack, but I dunno how to do that
            return; // TODO: for now do nothing
        }
        // clone the card array
        let newCards = this.state.cards.slice(0) || [];
        // find the card, there's probably a smarter way to do this, but I dunno it
        let indexOfModified = 0;
        for(let i = 0; i < newCards.length; i++) {
            if (newCards[i].id === cardId) {
                indexOfModified = i;
                break;
            }
        }
        // change the stack in the card
        newCards[indexOfModified].stack = stack;
        this.setState((state) => ({...state, cards: newCards}), () => {
            // if the state got changed, save to localstorage
            localStorage.setItem("cards", JSON.stringify(newCards));
        })
    }

    selectStackHandler(stack) {
        console.log("did this happen", stack);
        this.setState({currStack: stack});
    };

    get allStacks() {
        const getAllStacks = (this.state.cards ? this.state.cards
            .map((card) => card.stack || '') : [])
            .concat(['', CONSTS.SEND_TO_TRASH_STACK_SENTINEL_VALUE]);
        const filteredStacks = getAllStacks.filter((v, i, arr) => arr.indexOf(v) === i);
        return filteredStacks;
    }

    render() {
        return (<div>
            <form id="form">
                <div className="line right" id="swap-btns">
                    <a className={this.showClass(this.state.formState.mode == 2) + ' btn'} id="capture-mode-btn" onClick={() => this.goToCaptureMode()}>Add Card</a>
                    <a className={this.showClass(this.state.formState.mode == 1) + ' btn'} id="view-mode-btn" onClick={() => this.goToViewMode()}>View cards</a>
                </div>
                <p>You have {this.state.cards.length} cards</p>
                <CapturePane cssClass={this.showClass(this.state.formState.mode == 1)} phase={this.state.formState.phase } onClick={() => this.captureContinue()} />
                <ViewPane
                    moveCardToStackHandler={this.moveCardToStackHandler.bind(this)}
                    stacks={this.allStacks}
                    cards={this.state.cards}
                    currentCard={this.state.currCard}
                    answerVisible={this.state.answerVisible}
                    viewCardNextContinue={() => this.showAnswer()}
                    hidden={this.state.formState.mode == 1}
                    currentStack={this.state.currStack}
                    stackSelectHandler={this.selectStackHandler.bind(this)}/>
            </form>
            <pre id="result-view">{this.printState()}</pre>
        </div>);
    }
}

const domContainer = document.querySelector('#app-container');
ReactDOM.render(<FlashcardsApp></FlashcardsApp>, domContainer);