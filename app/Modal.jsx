import React, { useState } from 'react';
import "./Modal.scss";

 const Modal = ({updateFn, cardId, show}) => {

    const [input, inputSet] = useState('');

    const onChange = (e) => {
        inputSet(e.target.value);
    };

    const onClick = (e) => {
        updateFn(cardId, input, () => {
            inputSet('');
        });
    }

    return (
        <div id="modal" className={show ? "overlay" : 'hidden'}>
            <div className="dialog">
                <h3 className="center">Whatcha gonna call your stack?</h3>
                <div className="line center">
                    <label>StackName</label>
                    <input type="text" className="input" value={input} onChange={onChange} />
                </div>
                <div className="right">
                    <a className="btn" onClick={onClick}>Make new stack</a>
                </div>
            </div>
        </div>
    );
    
}

export default Modal;