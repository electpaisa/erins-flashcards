/** @jsx jsx */
import React from 'react';
import {jsx, css} from '@emotion/core';
import {hidden} from "./utilityStyles"


export default class Model extends React.Component {
    constructor(props) {
        super(props);
        this.state = {input : ''}
    }

    onChange (e) {
        this.setState({input: e.target.value});
    }

    onClick (e) {
        const { updateFn, cardId } = this.props;
        updateFn(cardId, this.state.input, () => {
            this.setState({input: ''});
        });
    }

    render() {
        const {show} = this.props;

        const overlay = css`
            width: 100vw;
            height: 100vh;
            top: 0;
            left: 0;
            z-index: 2;
            background-color: rgba(0, 0, 0, 0.25);
            position: fixed;
        `;

        const dialog = css`
            z-index: 3;
            width: 25vw;
            height: 15vw;
            position: absolute;
            top: 3vh;
            left: 37.5vw;
            background-color: white;
            border-radius: 5px;
        `;
        const center = css`
            text-align: center;
        `;
        const right = css`
            text-align: right;
            margin:2rem; 
        `;

        const inputStyle = css`
            margin-left: 1.5rem;
        `;
        return (
        <div id="modal" css={show ? overlay : hidden}>
            <div css={dialog}>
                <h3 css={center}>Whatcha gonna call your stack?</h3>
                <div className="line" css={center}>
                    <label>StackName</label>
                    <input type="text" css={inputStyle} value={this.state.input} onChange={this.onChange.bind(this)} />
                </div>
                <div css={right}>
                    <a className="btn" onClick={this.onClick.bind(this)}>Make new stack</a>
                </div>
            </div>
        </div>)
    }
}