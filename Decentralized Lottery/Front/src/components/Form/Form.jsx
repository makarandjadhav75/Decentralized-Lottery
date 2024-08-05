import web3 from "../../utils/web3";
import lottery from "../../utils/lottery";
import { etherToWei } from "../../utils/helpers";
import { useEffect, useState } from "react";
import "./Form.css";

const Form = ({ value, setValue }) => {
    const [message, setMessage] = useState('');
    const [errorAmount, setErrorAmount] = useState('');
    const [errorTransaction, setErrorTransaction] = useState('');
    const [displayErrorAmount, setDisplayErrorAmount] = useState(false);

    useEffect(() => {
        if (value <= 0.01) {
            return setErrorAmount('You have to enter with, at least, 0.01 ether...');
        }
        return setErrorAmount('');
    }, [value])

    const onSubmit = async (event) => {
        event.preventDefault();
        setErrorTransaction('');
        setDisplayErrorAmount(true);
        if (errorAmount?.length) return;
        const accounts = await web3.eth.getAccounts();
        setMessage('Waiting on transaction success...');
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: etherToWei(value)
            });
        } catch (err) {
            setErrorTransaction(err.message);
        }
        setMessage('You have been entered!');
    }

    return (
        <form onSubmit={onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter:</label>
            <input 
              type={'number'}
              value={value} 
              onChange={event => setValue(event.target.value)} 
              />
            {displayErrorAmount && (<div className="ErrAmount">{errorAmount}</div>)}
          </div>
          <button>
            Enter
          </button>
          {message.length || errorTransaction.length ? (
            <>
                <hr />
                <h2>{errorTransaction.length ? errorTransaction : message}</h2>            
            </>
          ) : null}
        </form>
    );
}

export default Form;