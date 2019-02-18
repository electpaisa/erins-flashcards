/** @jsx jsx */
import React from 'react';
import styled from '@emotion/styled';
import { jsx, css } from '@emotion/core';
import { buildStackOptions } from './stackUtils';

const initialState = {phase: 1, inputBuffer : '', inputs:[]};
export class CapturePane extends React.Component {
    constructor(props) {
        super(props);
        this.state = {...initialState, stackForNewCard : ''};
    }

    stackSelectOnChange(e) {
        this.setState({stackForNewCard : e.target.value});
    }

    inputPaneOnChange(e) {
        this.setState({inputBuffer: e.target.value});
    }

    continueButtonOnClick(e) {
        let newInputs = this.state.inputs.slice(0);
        newInputs.push(this.state.inputBuffer);
        if (this.state.phase === 1) {
            this.setState({inputs: newInputs, inputBuffer: '', phase : 2});
        } else {
            const { addCard } = this.props;
            addCard({question: newInputs[0], answer: newInputs[1], stack: this.state.stackForNewCard }, () => {
                this.setState(initialState)
            });
        }
    }

    render() {
        const {stacks, cssClass} = this.props;
        let { inputBuffer, stackForNewCard, phase } = this.state;
        const Clearfix = styled.div`
            overflow : auto;
            &:: after {content:"", clear:both; display:table;}
        `;

        const floatRightStyle = css`
            float:right;
        `;
        return (<div id="capture-pane" className={cssClass}>
            <Clearfix className="center line">
                <h2>Type your {phase === 1 ? "Question" : "Answer"}</h2>
                <select value={stackForNewCard} css={floatRightStyle} onChange={this.stackSelectOnChange.bind(this)}>
                    {buildStackOptions(stacks, false)}
                </select>
                <textarea value={inputBuffer} onChange={this.inputPaneOnChange.bind(this)} id="input-pane" placeholder="..." rows="10" cols="80" autoFocus value={inputBuffer} />
            </Clearfix>
            <div className="line">
                <a className="btn" id="continue-btn" onClick={this.continueButtonOnClick.bind(this)}>Continue</a>
            </div>
        </div>);
    }
}