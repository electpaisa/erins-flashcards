import React from 'react';
import * as CONSTS from './constants';
import {buildStackOptions} from "./stackUtils";

export default class ViewCard extends React.Component{
    constructor (props) {
        super(props);
        const selectedStack = this.props.card.stack; 
        this.state  = {selectedStack}; 
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.selectedStack !== this.state.selectedStack) {
            console.log(prevProps);
            const { card, moveCardToStackHandler } = prevProps;
            moveCardToStackHandler(card.id, this.state.selectedStack);
        }
    }

    render() {
        const {stacks, answerVisible, card, onClick, moveCardToStackHandler} = this.props;
        const renderedStacks = buildStackOptions(stacks, true);
        const onChange = (e) => {
            this.setState({selectedStack: e.target.value});
        };
        return (<div id="view-mode">
            <div className="line" id="stack-choice-container">
                Select Stack: <select value={this.state.selectedStack} onChange={onChange}>{renderedStacks}</select>
            </div>
            {
                answerVisible
                ? <div className="line" id="answer-display">A: {card.answer}</div>
                : <div className="line" id="question-display">Q: {card.question}</div>
            }
            <div className="line">
                <a href="javascript:void(0);" onClick={onClick}>Next</a>
            </div>
        </div>);
    }
}