import React from 'react';
export class CapturePane extends React.Component {
    render() {
        return (<div id="capture-pane" className={this.props.cssClass}>
            <div className="center line">
                <h2>Type your {this.props.phase === 1 ? "Question" : "Answer"}</h2>
                <textarea id="input-pane" placeholder="..." rows="10" cols="80" autoFocus></textarea>
            </div>
            <div className="line">
                <a className="btn" id="continue-btn" onClick={this.props.onClick}>Continue</a>
            </div>
        </div>);
    }
}