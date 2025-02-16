import React from 'react';
import {buildStackOptions} from "./stackUtils";
import "./ViewCard.scss";

const ViewCard = ({stacks, answerVisible, card, onClick, moveCardToStackHandler}) => {
    const renderedStacks = buildStackOptions(stacks, true);
    const onChange = (e) => {
        moveCardToStackHandler(card.id, e.target.value);
    };
    return (<div id="view-mode">
        <div className="card">
            <div className="line" id="question-display">Q: {card.question}</div>
            {
                answerVisible && 
                <div className="line" id="answer-display">A: {card.answer}</div>
            }
            <div className="next-link">
                <button onClick={(e) => {
                    e.preventDefault();
                    onClick(e);
                }}>Next</button>
            </div>
        </div>
        <div className="line" id="stack-choice-container">
            Send to stack:
            <select
                name="assignStack"
                value={card.stack || ''}
                onChange={onChange}>{renderedStacks}</select>
        </div>
    </div>);
}

export default ViewCard;