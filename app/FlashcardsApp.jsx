import React, { useEffect, useState } from 'react';
import ViewPane from './ViewPane';
import CapturePane from './CapturePane';
import Modal from './Modal';
import * as CONSTS from "./constants";

const FlashcardsApp = () => {
    const [cards, cardsSet] = useState(JSON.parse(localStorage.getItem("cards") || "[]"));
    const [seenCards, seenCardsSet] = useState([]);
    const [unseenCards, unseenCardsSet] = useState(JSON.parse(localStorage.getItem("cards") || "[]"));
    const [formState, formStateSet] = useState({ mode: 1 });
    const [currCard, currCardSet] = useState({});
    const [currStack, currStackSet] = useState('');
    const [answerVisible, answerVisibleSet] = useState(false);
    const [showModal, showModalSet] = useState(false);

    const currentStackOfCards = cards.filter(c => (c.stack|| "") === (currStack || ""));

    const goToCaptureMode = () => {
        formStateSet({ phase: 1, inputs: [], mode: 1 });
        clearCaptureInput();
    };

    const goToViewMode = () => {
        formStateSet({ phase: 1, inputs: [], mode: 2 });
    };

    const clearCaptureInput = () => {
        document.getElementById("input-pane").value = "";
    }

    useEffect(() => {
        if (seenCards.length === currentStackOfCards.length) {
            unseenCardsSet([...currentStackOfCards.slice(0)]);
            seenCardsSet([]);
        }
    }, [seenCards.length, currentStackOfCards.length]);

    useEffect(() => {
        if (formState.mode === 1) {
            showAnswerSet(false);
        }
        if (formState.mode === 2 && currentStackOfCards && currentStackOfCards?.length) {
            pickACard();
        }
        if (formState.mode === 2 && currentStackOfCards && currentStackOfCards?.length) {
            pickACard();
        }
    }, [formState.mode]);

    const pickACard = () => {
        var randomCardIndex = Math.floor(Math.random() * unseenCards.length);
        let newUnseenCards = unseenCards.slice(0);
        let newSeenCards = seenCards.slice(0);
        var pickedCard = newUnseenCards.splice(randomCardIndex, 1);
        if (pickedCard[0]) {
            newSeenCards.push(pickedCard[0]);
            currCardSet(pickedCard[0]);
            seenCardsSet(newSeenCards);
            unseenCardsSet(newUnseenCards);
        } else {
            console.log("randomCardIndex", randomCardIndex);
        }
    }

    const showAnswer = () => {
        if (!answerVisible) {
            answerVisibleSet(true);
        } else {
            answerVisibleSet(false);
            pickACard();
        }
    }

    const addCard = (card, callback) => {
        card.id = cards.length;
        let newCards = cards.slice(0),
            newUnseenCards = unseenCards.slice(0);
        newCards.push(card);
        newUnseenCards.push(card);

        cardsSet(newCards);
        unseenCardsSet(newUnseenCards);        
        localStorage.setItem("cards", JSON.stringify(newCards));
        callback();
    };

    const printState = () => {
        return JSON.stringify({cards, seenCards, unseenCards, formState, currCard, currStack, answerVisible, showModal}, null, 2);
    };

    const modeClass = () => {
        return formState.mode == 1 ? 'capture-mode' : (formState.mode == 2 ? 'view-mode' : 'invalid');
    };

    const showClass = (booley) => {
        if (!!booley) return 'visible';
        return 'hidden';
    };

    const hideClass = (booley) => {
        return showClass(!booley);
    };

    const moveCardToStackHandler = (cardId, stack, modalCallback) => {
        console.log(`assigning card ID ${cardId} to stack ${stack}`);
        if (stack === CONSTS.ADD_NEW_STACK_SENTINEL_VALUE) {
            // little low rent, but it'll do for now
            showModalSet(true);
            return;
        }
        // clone the card array
        let newCards = cards.slice(0) || [];
        // find the card, there's probably a smarter way to do this, but I dunno it
        for(let i = 0; i < newCards.length; i++) {
            if (newCards[i].id === cardId) {
                newCards[i].stack = stack;
                cardsSet(newCards);
                currCardSet(newCards.slice(i, 1)[0]);
                showModalSet(false);                
                // if the state got changed, save to localstorage
                localStorage.setItem("cards", JSON.stringify(newCards));
                if (typeof modalCallback === "function") {
                    modalCallback();
                }
                pickACard();
                break;
            }
        }
    }

    const selectStackHandler = (stack) => {
        console.log("did this happen", stack);
        currStackSet(stack);
        seenCardsSet([]);
        unseenCardsSet(cards.filter(c => (c.stack|| "") === (stack || ""))) // we have to duplicate this since the state hasn't been updated
        pickACard();
    };

    const allStacks = (() => {
        const getAllStacks = (cards ? cards
            .map((card) => card.stack || '') : [])
            .concat(['', CONSTS.SEND_TO_TRASH_STACK_SENTINEL_VALUE]);
        const filteredStacks = getAllStacks.filter((v, i, arr) => arr.indexOf(v) === i);
        return filteredStacks;
    })();

    return (<div>
        <form id="form">
            <div className="line right" id="swap-btns">
                { formState.mode === 2 && <a className='btn' id="capture-mode-btn" onClick={() => goToCaptureMode()}>Add Card</a>}
                { formState.mode === 1 && <a className='btn' id="view-mode-btn" onClick={() => goToViewMode()}>View cards</a>}
                { (formState.mode !== 1 && formState.mode !== 2) && <span className='btn alert'>Whoa! what happened here!?</span>}
            </div>
            <p>You have {currentStackOfCards.length} cards ({cards.length} total)</p>
            <Modal
                show={showModal}
                updateFn={(cardId, stack) => moveCardToStackHandler(cardId, stack)}
                cardId={currCard && currCard.id} />
            <CapturePane 
                stacks={allStacks}
                cssClass={showClass(formState.mode == 1)}
                addCard={addCard} />
            <ViewPane
                moveCardToStackHandler={moveCardToStackHandler}
                stacks={allStacks}
                cards={currentStackOfCards}
                currentCard={currCard}
                answerVisible={answerVisible}
                viewCardNextContinue={() => showAnswer()}
                hidden={formState.mode == 1}
                currentStack={currStack}
                stackSelectHandler={selectStackHandler}/>
        </form>
        <pre id="result-view">{printState()}</pre>
    </div>);
    
}

export default FlashcardsApp;