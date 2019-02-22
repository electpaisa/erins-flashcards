/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import React from 'react';
import * as CONSTS from './constants';
import {buildStackOptions} from "./stackUtils";
import {line} from "./utilityStyles";

export default class ViewCard extends React.Component{
    constructor (props) {
        super(props);
    }

    render() {
        const {stacks, answerVisible, card, onClick, moveCardToStackHandler} = this.props;
        const renderedStacks = buildStackOptions(stacks, true);
        const onChange = (e) => {
            moveCardToStackHandler(this.props.card.id, e.target.value);
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
                <div css={line} id="question-display">Q: {card.question}</div>
                {
                    answerVisible && 
                    <div css={line} id="answer-display">A: {card.answer}</div>
                }
                <div css={nextLinkStyle}>
                    <a href="javascript:void(0);" onClick={onClick}>Next</a>
                </div>
            </div>
            <div css={line} id="stack-choice-container">
                Send to stack:
                <select
                    name="assignStack"
                    value={this.props.card.stack || ''}
                    onChange={onChange}>{renderedStacks}</select>
            </div>
        </div>);
    }
}