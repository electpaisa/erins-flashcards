/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import React from 'react';
import * as CONSTS from './constants';
import {buildStackOptions} from "./stackUtils";
import {hidden} from "./utilityStyles";

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
        const cardStyle = css`
            border: 1px solid #ccc;
            padding: 1rem 2rem;
            max-width: 75%;
            min-height: 17vmin;
            margin: 2rem auto;
            box-shadow: 5px 5px 4px 4px rgba(0, 0, 0, 0.25);
            position:relative;
        `;
        const nextLinkStyle = css`
            position:absolute;
            bottom: 2rem;
            right: 2rem;
            display:inline-block;
            width:auto;
        `;
        return (<div id="view-mode">
            <div css={cardStyle}>
                <div className="line" id="question-display">Q: {card.question}</div>
                {
                    answerVisible && 
                    <div className="line" id="answer-display">A: {card.answer}</div>
                }
                <div css={nextLinkStyle}>
                    <a href="javascript:void(0);" onClick={onClick}>Next</a>
                </div>
            </div>
            <div css={!answerVisible && hidden} className="line" id="stack-choice-container">
                Send to stack: <select value={card.stack || ''} onChange={onChange}>{renderedStacks}</select>
            </div>
        </div>);
    }
}