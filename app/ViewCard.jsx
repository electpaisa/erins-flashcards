import React from 'react';
import * as CONSTS from './constants';

export default class ViewCard extends React.Component{
    constructor (props) {
        super(props);
        const selectedStack = this.props.card.stack; 
        this.state  = {selectedStack}; 
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.selectedStack !== this.state.selectedStack) {
            console.log(prevProps);
            const { card, stackSelectHandler } = prevProps;
            stackSelectHandler(card.id, this.state.selectedStack);
        }
    }

    render() {
        const {stacks, answerVisible, card, onClick, stackSelectHandler} = this.props;
        const renderedStacks = stacks.map(s => {
            let { stack } = card;
            let label = "";
            switch(s.trim()) {
                case '':
                    label = "None";
                    break;
                case CONSTS.ADD_NEW_STACK_SENTINEL_VALUE:
                    label = "Add New Stack";
                    break;
                case CONSTS.SEND_TO_TRASH_STACK_SENTINEL_VALUE:
                    label = "Trash";
                    break;
                default :
                    label = s.trim();
                    break;
            }
            return <option key={s} value={s}>{`${label}`}</option>
        });
        const onChange = (e) => {
            this.setState({selectedStack: e.target.value});
        };
        return (<div id="view-mode">
            <div className="line" id="stack-choice-container">
                Select Stack: <select value={this.state.selectedStack} onChange={onChange}>{renderedStacks}</select>
            </div>
            <div className="line" id="question-display" className={answerVisible ? 'hidden' : ''}>Q: {card.question}</div>
            <div className="line" id="answer-display" className={answerVisible ? '' : 'hidden'}>A: {card.answer}</div>
            <div className="line">
                <a onClick={onClick}>Next</a>
            </div>
        </div>);
    }
}