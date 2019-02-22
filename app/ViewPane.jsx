import React from 'react';
import ViewCard from "./ViewCard";
import { buildStackOptions } from "./stackUtils";

export default class ViewPane extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            hidden,
            cards,
            stacks,
            currentCard,
            answerVisible,
            viewCardNextContinue,
            moveCardToStackHandler,
            currentStack,
            stackSelectHandler } = this.props;
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
}