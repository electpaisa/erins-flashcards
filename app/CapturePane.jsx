import React, { useState } from 'react';
import { buildStackOptions } from './stackUtils';
import "./CapturePane.scss";

const CapturePane = ({addCard, stacks, cssClass}) => {
    const [phase, phaseSet] = useState(1);
    const [inputBuffer, inputBufferSet] = useState('');
    const [inputs, inputsSet] = useState([]);
    const [stackForNewCard, stackForNewCardSet] = useState('');

    const stackSelectOnChange = (e) => {
        stackForNewCardSet(e.target.value);
    };

    const inputPaneOnChange = (e) => {
        inputBufferSet(e.target.value);
    };

    const continueButtonOnClick = (e) => {
        let newInputs = inputs.slice(0);
        newInputs.push(inputBuffer);
        if (phase === 1) {
            inputsSet(newInputs);
            inputBufferSet('');
            phaseSet(2);
        } else {
            addCard({question: newInputs[0], answer: newInputs[1], stack: stackForNewCard }, () => {
                stackForNewCardSet('')
                phaseSet(1);
                inputBufferSet('');
                inputsSet([]);
            });
        }
    }

    return (<div id="capture-pane" className={cssClass}>
        <div className="clearfix">
            <h2>Type your {phase === 1 ? "Question" : "Answer"}</h2>
            <div className="small-container">
                <div className="line">
                    <textarea value={inputBuffer} onChange={inputPaneOnChange} id="input-pane" placeholder="..." rows="10" cols="80" autoFocus />
                </div>
                <div className="flex">
                    <div className="inner">
                        <label htmlFor="capture-assign-stack">
                            Assing it to a stack:
                        </label>
                        <select id="capture-assign-stack" value={stackForNewCard} onChange={stackSelectOnChange}>
                            {buildStackOptions(stacks, false)}
                        </select>
                    </div>
                    <a className="btn" id="continue-btn" onClick={continueButtonOnClick}>Continue</a>
                </div>
            </div>
        </div>
    </div>);
    
};

export default CapturePane;