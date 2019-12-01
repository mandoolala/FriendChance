import React, { useCallback, ChangeEventHandler, useState } from 'react';
import './NewNote.scss';
import { postNote } from 'Src/apis/apis';
import { useHistory } from 'react-router';

import 'Pages/NewNote.scss'
import 'Pages/MyNotes.scss'

const NewNote: React.FC = () => {
  const history = useHistory();

  const [amount, setAmount] = useState(0);
  const [size, setSize] = useState(1);
  
  const handleAmountChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ target: { value }}) => {
      // @ts-ignore
      if (!isNaN(value)) {
        if (Number(value) > 0) {
          setSize(value.length * 1.2)
          setAmount(Number(value));
        } else {
          setSize(1)
          setAmount(Number(value));
        }
      }
    },
    [],
  );
  
  const [paybackDate, setPaybackDate] = useState("2019-11-30");
  
  const handleDueChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ target: { value }}) => {
      setPaybackDate(value);
    },
    [],
  );

  const [purpose, setPurpose] = useState("");
  
  const handlePurposeChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ target: { value }}) => {
      setPurpose(value);
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    postNote({ amount, paybackDate, purpose }).then(({ data: { id } }) => {
      history.push('/share-note?contract_id=' + id);
    });
  }, [history, amount, paybackDate, purpose]);

  return (
    <div className="new-note">
      <div className="title-background">
        <div className="title-container">
          <div className="title">
            새로운 약속
          </div>
        </div>
        <div className='title-container-bottom-gradient' />
      </div>
      <div className="new-notes-content-container">
        <div>
          <div className="text-block">
            <input
              pattern="[0-9]*"
              type="text"
              className="amount-input"
              value={amount}
              onChange={handleAmountChange}
              inputMode="numeric"
              size={size}
            />
            <span>원을 빌려줘.</span>
          </div>
          <div className="text-block">
            <input
              type="date"
              value={paybackDate}
              onChange={handleDueChange}
              className='date-input'
              placeholder='언제?'
            />
            <span>까지 갚을게!</span>
          </div>
        </div>

        <div className="submit-container">
          <button className="new-notes-button submit" onClick={handleSubmit}>
            약속 만들기
          </button>
          <button className="new-notes-button cancel" onClick={() => history.push('/my-notes')}>
            취소하기
          </button>
        </div>
      </div>
    </div>
  )
};

export default NewNote;
