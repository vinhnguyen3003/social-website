import React, { useState } from 'react';
import './message.scss';
import MessageLeft from './message-left';
import MessageRight from './message-right';
import SettingGroupModal from './setting-group-modal';
import DetailMediaModal from './detail-media-modal';
import { useParams } from 'react-router';

function Message() {
    const [modalStatus, setModalStatus] = useState(false);
    const [editModalInfo, setEditModalInfo] = useState({onEdit: false, info: null});

    const handleModal = (status) => {
        setModalStatus(status)
    }
    return (
        <div className="main-content">
            <title>Message | Connecto</title>
            <div className="main-container">
                <div className="main-body">
                    <div className="message">
                        <MessageLeft 
                            handleModal={(status) => handleModal(status)}
                        />
                        <MessageRight 
                            handleModal={(status) => handleModal(status)}
                            setEditModalInfo={(info) => setEditModalInfo({onEdit: true, info: info})}
                        />
                        {
                            modalStatus ?
                            <SettingGroupModal 
                                handleModal={(status)=>handleModal(status)}
                                editModalInfo={editModalInfo}
                                resetEditModalInfo={() => setEditModalInfo({onEdit: false, info: null})}
                            /> : null
                        }
                        <DetailMediaModal 
                        
                        />
                    </div> 
                </div>
            </div>
        </div>
    );
}

export default Message;