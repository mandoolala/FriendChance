import React, { useCallback, useState } from 'react';
import { useRouteMatch, useHistory } from 'react-router';
import copy from 'copy-to-clipboard';

import './ShareNote.scss'

const ShareNote: React.FC = () => {
  const history = useHistory()
  const [toastVisible, setToastVisible] = useState(false)

  const noteId = new URLSearchParams(window.location.search).get("contract_id");
  const sharableUrl = `${window.location.origin}/approval?contract_id=${noteId}`;
  
  const handleCopy = useCallback(() => {
    setToastVisible(true)
    setTimeout(() => {
      setToastVisible(false)
    }, 2000)
    copy(sharableUrl);
  }, []);

  return (
    <div className="share-note">
      <div className='title-background'>
        <div className='title-container'>
          <div className='title'>
            약속 전달하기
          </div>
        </div>
      </div>
      <div className='share-note-content-container'>
        <div className='share-note-content'>
          <div className='share-note-description'>
            이제 약속의 링크를 공유하여 상대에게 송금을 요청하세요.
          </div>
          {/* 스텝 도식 */}
          <button 
            className='share-note-button'
            onClick={handleCopy}
          >
            링크 복사하기
          </button>
          <button 
            className='share-note-button to-main'
            onClick={() => history.push('/my-notes')}
          >
            메인으로
          </button>
          {
            toastVisible ? (
              <div className='share-note-toast'>
                <span className='share-note-toast-title'>
                  복사되었습니다!
                </span>
              </div>
            ) : (
              null
            )
          }
        </div>
      </div>
    </div>
  )
};

export default ShareNote;
