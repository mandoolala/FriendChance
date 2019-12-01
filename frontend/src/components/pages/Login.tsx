import React, { useCallback, useState, ChangeEventHandler } from 'react'
import { setClientId } from 'Src/apis/client';
import { getUser } from 'Src/apis/apis';
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import actions from 'Src/redux/actions';
import ReactSVG from 'react-svg'
import loan from '../../loan.svg'
import './Login.scss'
import { reducerType } from 'Src/redux/reducer';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const [id, setId] = useState("");
  const handleIdChange = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    setId(e.target.value);
  }, []);

  const history = useHistory();
  const location = useLocation();

  const { from } = location.state || { from: { pathname: "/my-notes" } };

  const handleSubmit = useCallback(() => {
    setClientId(id);
    getUser().then(user => {
      dispatch(actions.setUser(user.data));
      history.replace(from);
    });
  }, [id, history, from]);

  return (
    <div className='login-background'>
      <div className='login-header'>
        <div className='login-header-flex-mother'>
          <span className='login-header-title'>
            친구
          </span>
          <span className='login-header-title'>
            찬스
          </span>
        </div>
      </div>
      <div className='login-body-content-container'>
        <ReactSVG src={loan} />
      </div>
      <div className='login-field-container'>
        <input
          id="idInput"
          value={id}
          onChange={handleIdChange}
          placeholder='아이디'
        />
        <button
          className='login-field-submit-button'
          onClick={handleSubmit}
        >
          시작하기
        </button>
      </div>
    </div>
  )
}

export default Login;
