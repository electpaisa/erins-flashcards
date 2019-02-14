import React from 'react';
import ViewCard from "./ViewCard";

const ViewPane = ({hidden, cards, stacks, currentCard, answerVisible, viewCardNextContinue, stackSelectHandler}) => {
    
    return (<div className={hidden ? 'hidden' : ''}>
        <div className={cards && cards.length ? '' : 'hidden'}>
            <ViewCard stackSelectHandler={stackSelectHandler} stacks={stacks} card={currentCard} answerVisible={answerVisible} onClick={viewCardNextContinue} />
        </div>
        <div className={cards && cards.length ? 'hidden' : ''}>
            <h3>You have to make flashcards first, silly goose :-)</h3>
        </div>
    </div>);
}

export default ViewPane;