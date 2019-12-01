import React, { useEffect, useState, useCallback } from 'react';
import './MyNotes.scss';
import { getNotes } from 'Src/apis/apis';
import { LoanContractContent, User, LoanContractType } from 'Src/types';
import { useSelector, useDispatch } from 'react-redux';
import { reducerType } from 'Src/redux/reducer';
import { setClientId } from 'Src/apis/client';
import actions from 'Src/redux/actions';
import { useHistory } from 'react-router';

interface MyNotesProps {}

const myDebts = (notes: LoanContractContent[], userId: string) => {
  const debts = notes.reduce((acc: number, note: LoanContractContent) => {
    if (note.borrower && note.state !== 'repayed' && note.state !== 'draft' && note.state !== 'requested') {
      if (note.borrower.id === userId) return note.amount + acc
    }
    return acc
  }, 0)
  const earns = notes.reduce((acc : number, note: LoanContractContent) => {
    if (note.lender && note.state !== 'repayed' && note.state !== 'draft' && note.state !== 'requested') {
      if (note.lender.id === userId) return note.amount + acc
    }
    return acc
  }, 0)

  return earns - debts
}

const getTitle = (note: LoanContractContent, isBorrower: boolean): string => {
  const { state, lender, borrower } = note
  if (state === LoanContractType.DRAFT) {
    return '요청 예정'
  } else if (state === LoanContractType.REQUESTED && isBorrower) {
    return `요청 중`
  } else if (state === LoanContractType.REQUESTED && !isBorrower) {
    return `${borrower.name}이 요청한 돈`
  } else if (state === LoanContractType.APPROVED && isBorrower) {
    return `${lender.name}에게 빌릴 돈`
  } else if (state === LoanContractType.APPROVED && !isBorrower) {
    return `${borrower.name}에게 빌려줄 돈`
  } else if (state === LoanContractType.ACTIVATED && isBorrower) {
    return `${lender.name}에게 빌린 돈`
  } else if (state === LoanContractType.ACTIVATED && !isBorrower) {
    return `${borrower.name}에게 돌려받을 돈`
  } else if (state === LoanContractType.REPAYED && isBorrower) {
    return `${lender.name}에게 갚은 돈`
  } else if (state === LoanContractType.REPAYED && !isBorrower) {
    return `${borrower.name}에게 돌려받은 돈`
  } else {
    return '오류'
  }
}

const MyNotes: React.FC<MyNotesProps> = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  // TODO:: Remove assertion using type guards
  const user = useSelector((state: reducerType) => state.user as User);

  const [notes, setNotes] = useState<LoanContractContent[]>([]);

  const updateNotes = () => {
    getNotes().then((result) => {
      const notes = result.data;
      setNotes(notes);
    });
  }

  useEffect(() => {

    dispatch(actions.setUser(user));
    updateNotes();
  }, [])

  useEffect(() => {

    const ws = new WebSocket('ws://localhost:7070');

    ws.onopen = () => {
      console.log('ws', 'connected');
    }

    ws.onmessage = (data) => {
      console.log('ws', data);
      updateNotes();
    };

    return () => ws.close();
  }, [])

  const isBorrower = (note: LoanContractContent) => note.borrower.id === user.id;

  const handleClickNote = (note: LoanContractContent) => {
    const repayable = note.state === LoanContractType.ACTIVATED && isBorrower(note)
    if (!repayable) { return; }

    history.push('/send-money?contract_id=' + note.id);
  }

  const handleClickNewNote = useCallback(() => {
    history.push('/new-note');
  }, []);

  const debts = myDebts(notes, user.id)

  return (
    <div className="my-notes">
      <div className="title-background">
        <div className="title-container">
          <div className="title">
            홈
          </div>
        </div>
      </div>
      <div className="my-notes-content-container">
        <div className='my-note-content-user-tab'>
          <div className='my-note-content-user-info-row'>
            <div className='my-note-avatar' />
            <div className='my-note-user-name'>
              {user.name}님
            </div>
            <div className={`my-note-user-score ${user.grade}`}>
              신용점수 {user.score}점
            </div>
          </div>
          {
            debts >= 0 ? (
              <div className='my-notes-all-debts-container'>
                <img
                  style={{
                    width: 20,
                    height: 20,
                  }}
                  src={require('../../coins-icon-4.png')}
                  alt="fucked"
                />
                <div className='my-notes-all-debts-text'>
                  총 <span className='all-debts-good'>{debts.toLocaleString()}</span> 원
                </div>
                <div className='my-notes-all-debts-title good'>
                  { debts === 0 ? '' : '받아야 할 돈이 있어요.' }
                </div>
              </div>
            ) : (
              <div className='my-notes-all-debts-container'>
                <img
                  style={{
                    width: 20,
                    height: 20,
                  }}
                  src={require('../../installments_portion-of-debts_part-payment_premium-512.png')}
                  alt="fucked"
                />
                <div className='my-notes-all-debts-text'>
                  총 <span className='all-debts-bad'>{debts.toLocaleString()}</span> 원
                </div>
                <div className='my-notes-all-debts-title bad'>
                  이런, 빨리 갚아야 해요.
                </div>
              </div>
            )
          }
        </div>
        <div className="add" onClick={handleClickNewNote}>
          <div className='add-text'>
            새 약속 만들기
          </div>
        </div>
        <div className="list-wrapper">
          {notes.map(note => {
            const title = getTitle(note, isBorrower(note))
            const date = note.state === 'requested' ? (
              <div className='list-item-date-text'>
                {note.createdAt.split('T')[0]} 부터
              </div>
            ) : (
              <div className='list-item-date-text'>
                {note.paybackDate} 까지
              </div>
            )
            return (
              <div
                key={note.id}
                className={`list-item ${note.state} ${isBorrower(note).toString()}`}
                onClick={() => handleClickNote(note)}
              >
                <div className='list-item-text-container'>
                    {date}
                  <div className='list-item-title-text'>
                    {title}
                  </div>
                  <div className='list-item-amount-text'>
                    {note.amount.toLocaleString()} 원
                  </div>
                </div>
                <div className='list-item-image-container'>
                  <div className={`list-item-image vertical ${note.state} ${isBorrower(note).toString()}`} />
                  <div className={`list-item-image horizon ${note.state} ${isBorrower(note).toString()}`} />
                  <div className={`list-item-image vertical ${note.state} ${isBorrower(note).toString()}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MyNotes;
