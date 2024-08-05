import { useState, useEffect } from "react";
import lottery from "../../utils/lottery";
import web3 from "../../utils/web3";
import "../Form/Form.css";
import { defaultAddress } from "../../utils/helpers";

const PickAWinner = () => {
    const [message, setMessage] = useState('');
    const [lastWinner, setLastWinner] = useState('');
    const [errorTransaction, setErrorTransaction] = useState('');

    useEffect(() => {
        (async () => setLastWinner(await lottery.methods.lastWinner().call()))();
    }, []);

    const onClick = async () => {
        setErrorTransaction('');
        const accounts = await web3.eth.getAccounts();
        setMessage('Waiting on transaction success...');
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[0]
            });
        } catch (err) {
            setErrorTransaction(err.message);
        }
        setMessage('A winner has been picked!');
    }

    return (
        <>
            <h4>Ready to pick a winner?</h4>
            <button onClick={onClick}>Pick a winner!</button>
            {message.length || errorTransaction.length ? (
            <>
                <hr />
                <h2>{errorTransaction.length ? errorTransaction : message}</h2>            
            </>
          ) : null}
            {lastWinner !== defaultAddress && (<div className="LastWinner">{`${lastWinner} has won!`}</div>)}
        </> 
    );
}

export default PickAWinner;