import React, { useEffect, useState, useCallback } from 'react';
import { LoanContractContent } from 'Src/types';
import { getNote, approveContract, rejectContract } from 'Src/apis/apis';
import { setClientId } from 'Src/apis/client';
import { useHistory } from 'react-router';

import './ApproveLoan.scss'

const ApproveLoan: React.FC = () => {
  const history = useHistory();
  const contractId = new URLSearchParams(window.location.search).get("contract_id");
  const [note, setNote] = useState<LoanContractContent | undefined>(undefined);
  useEffect(() => {
    if (!contractId) { return; }
    getNote(contractId).then((result) => {
      setNote(result.data);
    })
  }, [contractId])


  const handleApprove = useCallback(() => {
    if (!contractId) { return; }
    approveContract(contractId).then(() => {
      history.push('/send-money?contract_id=' + contractId);
    });
  }, [history, contractId]);


  const handleReject = useCallback(() => {
    if (!contractId) { return; }
    rejectContract(contractId).then(() => {

    });
  }, [contractId]);


  if (!note) {
    return (
      <div>
        로딩중
      </div>
    )
  }

  return (
    <div className="approve-note">
      <div className="title-background">
        <div className="title-container">
          <div className="title">
            약속 확인하기
          </div>
        </div>
      </div>
      <div className="approve-note-content-container">
        <div className="approve-note-content-description">
          {note.borrower.name} 님이 보내신 약속이 도착했습니다. 약속 내용을 확인하시고, 동의 버튼을 눌러 친구를 도와주세요!
        </div>
        <div className="approve-note-letter-container">
          <div className='approve-note-content-borrow-letter'>
            <div>
              {`${note.amount}원을 빌려줄 수 있을까?`}
            </div>
            <div>
              {`${note.paybackDate}까지는 갚을게.`}
            </div>
          </div>
        </div>
        <button onClick={handleApprove} className="button approve-approve-button">
          동의하기
        </button>
        <button onClick={handleReject} className="button approve-approve-reject">
          거절하기
        </button>
      </div>
    </div>
  )
};
 
export default ApproveLoan;
