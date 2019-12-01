import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { LoanContractContent, LoanContractType } from 'Src/types';
import { setClientId } from 'Src/apis/client';
import { getNote, activateContract, repayContract } from 'Src/apis/apis';
import confetti from 'canvas-confetti';
import './SendMoney.scss'

const SendMoney: React.FC = () => {
  const history = useHistory();
  const contractId = new URLSearchParams(window.location.search).get("contract_id");
  const [note, setNote] = useState<LoanContractContent | undefined>(undefined);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const mode = !note ? undefined : (
    note.state === LoanContractType.ACTIVATED
      ? "repay"
      : note.state === LoanContractType.APPROVED
        ? "activate"
        : undefined
  )

  useEffect(() => {
    if (!contractId) { return; }
    getNote(contractId).then((result) => {
      setNote(result.data);
    })
  }, [contractId]);

  const handleSend = () => {
    if (!contractId || !mode) { return; }
    
    (mode === "activate" ? activateContract : repayContract)(contractId).then(() => {
      setHasSucceeded(true);
      if (mode === "repay") {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: {
              y: 0.6
          }
        })
      }
    });
  };

  const handleGoBack = () => {
    history.push('/my-notes');
  }

  if (!mode) {
    return (
      <div>
        <p>잘못된 접근입니다.</p>
      </div>
    )
  }

  const payButtons = (
    <>
      <button
        className='pay-button kakao'
        onClick={handleSend}
      >
        카카오페이로 보내기
        </button>
      <button
        className='pay-button toss'
        onClick={handleSend}
      >
        토스로 보내기
      </button>
    </>
  );

  const backButton = <button onClick={handleGoBack} className='send-money-back-button'>메인으로</button>;

  return (
    <div className="send-money">
      <div className="title-background">
        <div className="title-container">
          <div className="title">
            {
              mode === 'activate' ? (
              '빌려주기'
              ) : (
              '친구에게 갚기'
              )
            }
          </div>
        </div>
      </div>
      <div className="send-money-content-container">
        <div className="send-money-content-description">
          <div className='send-money-content-borrower-name'>
            {note ? (mode === "activate" ? `${note.borrower.name}에게` : `${note.lender.name}에게`) : "로딩중"}
          </div>
          <div className='send-money-content-amount'>
            {note ? `${note.amount.toLocaleString()}원` : "로딩중"}
          </div>
        </div>
        <div style={{ color: 'white ' }}>
          {!hasSucceeded
            ? (
              <>
                <p>{mode === "activate" ? null : "지금 바로 갚아요."}</p>
                {payButtons}
              </>
            ) : (
              <>
                <p>{mode === "activate" ? "친구에게 돈을 빌려줬습니다." : "약속을 지켰습니다!"}</p>
                {backButton}
              </>
            )}
        </div>
      </div>
    </div>
  )
};

export default SendMoney;
