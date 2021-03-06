import React, { useEffect, useState } from 'react';
import MessageBox from './message-box';
import { useDispatch, useSelector } from 'react-redux';
import MessageLeftSearch from './message-left-search';
import { getConversations } from '../../redux/actions/messageAction';
import { useNavigate, useParams } from 'react-router';
import { GLOBALTYPES } from '../../redux/constants/globalTypes';

function MessageLeft({handleModal}) {
    const dispatch = useDispatch();
    const authState = useSelector(state => state.authReducer);
    const messageState = useSelector(state => state.messageReducer);
    const onlineState = useSelector(state => state.onlineReducer);
    const socketState = useSelector(state => state.socketReducer);

    const {id} = useParams();
    const navigate = useNavigate();
    
    useEffect(()=>{
        if(!id && messageState.conversations.length > 0) {
            navigate(`/message/${messageState.conversations[0]._id}`) 
        }
    },[id, messageState.conversations, navigate])

    useEffect(()=>{
        if(messageState.firstLoad) return;
        dispatch(getConversations({auth: authState, page: 1}))
    },[authState, dispatch, messageState.firstLoad])

    // Check User Online - Offline
    useEffect(()=>{
        if(messageState.firstLoad)
        dispatch({type: GLOBALTYPES.CHECK_ONLINE_OFFLINE, payload: onlineState})
    },[dispatch, onlineState, messageState.firstLoad, messageState.conversations.length])
    
    return (
        <div className="message-left">
            <div className="message-left__header">
                <span className="message-title">
                    Chat
                </span>
                <ul className="message-tool-left">
                    <li className="tool-left__item">
                        <span className="tool-left-icon">
                            <i className="fas fa-ellipsis-h"></i>
                        </span>
                        <ul className="tool-left-menu">
                            <li 
                                className="menu-item"
                                onClick={()=>handleModal(true)}
                            >
                                <i className="fas fa-user-friends"></i>
                                <span>Create group chat</span>
                            </li>
                            <li className="menu-item">
                                <i className="fas fa-bell"></i>
                                <span>Turn on notification</span>
                            </li>
                        </ul>
                    </li>
                    <li className="tool-left__item">
                        <span className="tool-left-icon">
                            <i className="fas fa-video"></i>
                        </span>
                    </li>
                </ul>
            </div>
            <MessageLeftSearch 
                auth={authState}
            />
            <div className="message-left-list">
                {
                    messageState.conversations.map((conv, index) => (
                        <MessageBox 
                            key={index}
                            conversation={conv}
                            id={id}
                            auth={authState}
                            dispatch={dispatch}
                            socket={socketState}
                        />
                    ))
                }
            </div>
        </div>
    );
}

export default MessageLeft;