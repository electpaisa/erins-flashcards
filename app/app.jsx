import React from 'react';
import ReactDOM from 'react-dom';
import ViewPane from './ViewPane';
import { CapturePane } from './CapturePane';
import Modal from './Modal';
import * as CONSTS from "./constants";

class FlashcardsApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: JSON.parse(localStorage.getItem("cards") || "[]"),
            seenCards: [],
            unseenCards: JSON.parse(localStorage.getItem("cards") || "[]"),
            formState: {
                mode: 1
            },
            currCard: {},
            currStack: '',
            answerVisible: false,
            showModal: false
        };
    }

    goToCaptureMode() {
        this.setState(() => ({ formState: { phase: 1, inputs: [], mode: 1 } }));
        this.clearCaptureInput();
    }

    goToViewMode() {
        this.setState(() => ({ formState: { phase: 1, inputs: [], mode: 2 } }), () => {
            if (this.currentStackOfCards
         && this.currentStackOfCards
        .length) {
                this.pickACard();
            }
        });
    }

    clearCaptureInput() {
        document.getElementById("input-pane").value = "";
    }

    pickACard() {
        if (this.state.seenCards.length === this.currentStackOfCards.length) {
            this.state.unseenCards = this.currentStackOfCards.slice(0);
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

    addCard(card, callback) {
        const {cards, unseenCards } = this.state;
        card.id = cards.length;
        let newCards = cards.slice(0),
            newUnseenCards = unseenCards.slice(0);
        newCards.push(card);
        newUnseenCards.push(card);

        this.setState({...this.state, cards : newCards, unseenCards: newUnseenCards}, () => {
            localStorage.setItem("cards", JSON.stringify(newCards));
            callback();
        })
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

    moveCardToStackHandler(cardId, stack, modalCallback) {
        console.log(`assigning card ID ${cardId} to stack ${stack}`);
        if (stack === CONSTS.ADD_NEW_STACK_SENTINEL_VALUE) {
            // little low rent, but it'll do for now
            this.setState({...this.state, showModal: true});
            return;
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
        this.setState((state) => ({...state, cards: newCards, currCard: newCards.splice(indexOfModified, 1)[0], showModal: false}), () => {
            // if the state got changed, save to localstorage
            localStorage.setItem("cards", JSON.stringify(newCards));
            if (typeof modalCallback === "function") {
                modalCallback();
            }
        })
    }

    selectStackHandler(stack) {
        console.log("did this happen", stack);
        this.setState(() => ({
            ...this.state,
            currStack: stack,
            seenCards : [],
            unseenCards: this.state.cards.filter(c => (c.stack|| "") === (stack || "")) // we have to duplicate this since the state hasn't been updated
        }), () => {
            this.pickACard();
        });
    };

    get allStacks() {
        const getAllStacks = (this.state.cards ? this.state.cards
            .map((card) => card.stack || '') : [])
            .concat(['', CONSTS.SEND_TO_TRASH_STACK_SENTINEL_VALUE]);
        const filteredStacks = getAllStacks.filter((v, i, arr) => arr.indexOf(v) === i);
        return filteredStacks;
    }

    get currentStackOfCards() {
        return this.state.cards.filter(c => (c.stack|| "") === (this.state.currStack || ""));
    }

    getCurrentButton(formStateMode) {
        switch(formStateMode){
            case 2:
                return (<a className='btn' id="capture-mode-btn" onClick={() => this.goToCaptureMode()}>Add Card</a>);
            case 1:
                return (<a className='btn' id="view-mode-btn" onClick={() => this.goToViewMode()}>View cards</a>);
            default:
                return (<span className='btn alert'>Whoa! what happened here!?</span>);
        }
    }

    render() {
        return (<div>
            <form id="form">
                <div className="line right" id="swap-btns">
                    {this.getCurrentButton(this.state.formState.mode)}
                </div>
                <p>You have {this.currentStackOfCards.length} cards ({this.state.cards.length} total)</p>
                <Modal
                    show={this.state.showModal}
                    updateFn={((cardId, stack) => {this.moveCardToStackHandler(cardId, stack)}).bind(this)}
                    cardId={this.state.currCard && this.state.currCard.id} />
                <CapturePane 
                    stacks={this.allStacks}
                    cssClass={this.showClass(this.state.formState.mode == 1)}
                    addCard={this.addCard.bind(this)} />
                <ViewPane
                    moveCardToStackHandler={this.moveCardToStackHandler.bind(this)}
                    stacks={this.allStacks}
                    cards={this.currentStackOfCards}
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