import React from 'react';
import ViewCard from "./ViewCard";
import { buildStackOptions } from "./stackUtils";

const ViewPane = (props) => {
    const {
        hidden,
        cards,
        stacks,
        currentCard,
        answerVisible,
        viewCardNextContinue,
        moveCardToStackHandler,
        currentStack,
        stackSelectHandler } = props;
        const filteredCards = cards.filter(c => (c.stack || "") === currentStack);
    return (<div className={hidden ? 'hidden' : ''}>
        <div>
            <label>View stack:</label>
            <select name="selectStack" onChange={(e) => stackSelectHandler(e.target.value)}>{buildStackOptions(stacks, false)}</select>
        </div>
        {
            currentCard && filteredCards && filteredCards.length
            ? <ViewCard moveCardToStackHandler={moveCardToStackHandler} stacks={stacks} card={currentCard} answerVisible={answerVisible} onClick={viewCardNextContinue} />
            : <h3>You have to make flashcards first, silly goose :-)</h3>
        }
    </div>);
}

export default ViewPane;