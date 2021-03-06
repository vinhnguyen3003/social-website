import React, { useEffect, useRef, useState } from 'react';
import './create-post-modal.scss';
import { useDispatch, useSelector } from 'react-redux';
import { GLOBALTYPES } from '../../redux/constants/globalTypes';
import CreateFileModal from '../create-file-modal/create-file-modal';
import ToolTip from '../tooltip/tooltip';
import moreRightItems from '../../assets/json-data/more-right-item.json';
import { createPost, updatePost } from '../../redux/actions/postAction';
import LoadingImg from '../../assets/images/loading.gif';

function CreatePostModal() {

    const [postText, setPostText] = useState('');
    const [files, setFiles] = useState([]);
    const [cursorPosition, setCursorPosition] = useState(null);
    const [moreItemActive, setMoreItemActive] = useState(null);
    const [resetFileListStatus, setResetFileListStatus] = useState(false);
    const [moreItemTooltip, setMoreIemTooltip] = useState(null);
    const [fileModalType, setFileModalType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalAlert, setModalAlert] = useState(null);

    const textareaEl = useRef(null);

    const dispatch = useDispatch();

    const fileModalStatus = useSelector(state => state.modalReducer.fileModalInCreatePost);

    const createPostModalEdit = useSelector(state => state.modalReducer.createPostModalEdit);

    const initFileModalType = useSelector(state => state.modalReducer.initFileModalType);

    const authState = useSelector(state => state.authReducer);
    const socketState = useSelector(state => state.socketReducer);

    const {emotionModalStatus, emotionValue, emotionChange} = useSelector(state => state.emotionModalReducer);
    const textareaElReducer = useSelector(state => state.emotionModalReducer.textareaEl);

    const closeModal = () => {
        dispatch({type: GLOBALTYPES.CREATE_POST_MODAL_STATUS, payload: false});
    }
    const toggleFileModal = (status) => {
        dispatch({type: GLOBALTYPES.FILE_MODAL_IN_CREATE_POST, payload: status});
    }
    const autoResizeHeight = () => {
        if(textareaEl.current.value !== ''){
            textareaEl.current.style.height = 'auto';
            textareaEl.current.style.height = (textareaEl.current.scrollHeight - 2) + 'px';
        }else{
            textareaEl.current.style.height = '130px'
        }
    }
    const handleChangeInput = (e) => {
        setPostText(e.target.value);
    }
    const actionInMoreRightItem = (index) => {
        setMoreItemActive(index);
        setResetFileListStatus(true);
        if(index === 0) {
            setFileModalType(0);
            toggleFileModal(true);
        }else if(index === 1){
            setFileModalType(1);
            toggleFileModal(true);
        }else if(index === 2){
            toggleFileModal(false)
        }
    }

    const handleEmotionModal = (toggleIconEl) => {
        dispatch({type: !emotionModalStatus ? GLOBALTYPES.OPEN_EMOTION_MODAL : GLOBALTYPES.CLOSE_EMOTION_MODAL})
        dispatch({type: GLOBALTYPES.SET_TOGGLE_ICON_EL, payload: toggleIconEl})
        dispatch({type: GLOBALTYPES.SET_TEXTAREA_EL, payload: textareaEl})
    }
    const handleFileList = (files) => {
        setFiles(files);
    }
    const handleMouseTooltip = (e,value) => {
        if(moreItemTooltip !== value) setMoreIemTooltip(value)
    }
    const handleSubmit = async () => {
        if(loading) return;

        let images = [];
        let videos = [];
        let audios = [];

        if(files.length >= 0){
            files.forEach((item) => {
                const typeString = item.url ? item.file_type : item.file.type;
                const newFile = item.url ? item : item.file;

                if(typeString.includes('image')) images.push(newFile);
                else if(typeString.includes('video')) videos.push(newFile);
                else if(typeString.includes('audio')) audios.push(newFile);
            })
        }
        setLoading(true);
        let res;
        if(!createPostModalEdit.status){
            res = await dispatch(createPost({
                content: postText,
                images,
                videos,
                audios,
                auth: authState,
                socket: socketState
            }))

        }else{
            res = await dispatch(updatePost({
                content: postText,
                images,
                videos,
                audios,
                id: createPostModalEdit.data._id
            }))
        }
        if(res.data.success){
            setLoading(false);
            dispatch({type: GLOBALTYPES.CREATE_POST_MODAL_STATUS, payload: false});
        }else{
            setLoading(false);
            setModalAlert('Please add your content');
            setTimeout(()=>{
                setModalAlert(null);
            },2000)
        }
    }
    useEffect(()=>{
        if(textareaEl === textareaElReducer){
            const cursorPos = textareaEl.current.value.slice(0, textareaEl.current.selectionStart).length;
            setCursorPosition(cursorPos);
    
            let newPostText = '';
            newPostText = postText.substring(0, cursorPos) + emotionValue + postText.substring(cursorPos, postText.length);
            //Prevent other post set state when state in reducer change
            setPostText(newPostText);
        }
    },[emotionChange])

    useEffect(()=>{
        if(textareaEl.current) autoResizeHeight();
    },[postText])

    useEffect(()=>{
        if(textareaEl.current){
            textareaEl.current.selectionStart = cursorPosition + 2;
            textareaEl.current.selectionEnd = cursorPosition + 2;
        }
    },[cursorPosition])

    useEffect(()=>{
        initFileModalType !== null && setFileModalType(initFileModalType);
    },[initFileModalType])

    useEffect(()=>{
        if(createPostModalEdit.status){
            const {data} = createPostModalEdit;

            setPostText(data.content);
            if(data.images.length > 0 || data.videos.length > 0 || data.audios.length > 0){
                dispatch({type: GLOBALTYPES.FILE_MODAL_IN_CREATE_POST, payload: true})
                dispatch({type: GLOBALTYPES.INIT_FILE_MODAL_TYPE, payload: 0});
                setMoreItemActive(0);
                setResetFileListStatus(false);
            }
            return () => {
                dispatch({type: GLOBALTYPES.CREATE_POST_MODAL_EDIT, payload: {
                    status: false,
                    data: null
                }})
            }
        }
    },[createPostModalEdit, dispatch])
    return (
        <div className="create-modal-wrapper">
            <div className="create-modal">
                <div className="create-modal__top">
                    <span className="modal-top-title">
                        {
                            createPostModalEdit.status ? 'Update Post' : 'Create Post'
                        }
                    </span>
                    <span 
                        className="modal-top-close"
                        onClick={closeModal}
                    >
                        <i className="fas fa-times"></i>
                    </span>
                </div>
                <div className="create-modal__center">
                    <div 
                        className="modal-center-content" 
                    >
                        <div className="modal-center-text">
                            <textarea 
                                id="post-text"
                                value={postText}
                                name="" 
                                placeholder="What do you think?"
                                onChange={handleChangeInput}
                                ref={textareaEl}
                            >

                            </textarea>
                        </div>
                        <div className="modal-center-icon">
                            <span id="emotion-toggle-icon" onClick={(e)=>handleEmotionModal(e.target.parentNode)}>
                                <i className="far fa-grin-alt"></i>
                            </span>
                        </div>
                        {
                            fileModalStatus ?
                                <div className="modal-center-file">
                                    <CreateFileModal 
                                        onClose={()=>toggleFileModal(false)}
                                        fileModalType={fileModalType}
                                        handleFileList={(files)=>handleFileList(files)}
                                        editFiles={createPostModalEdit.status ? [
                                            ...createPostModalEdit.data.images,
                                            ...createPostModalEdit.data.videos,
                                            ...createPostModalEdit.data.audios,
                                        ] : null}
                                        resetFileListStatus={resetFileListStatus}
                                    />
                                </div> : null
                        }
                    </div>
                    <div className="modal-center-more">
                        <span className="modal-center-more__left">
                            Add to post
                        </span>
                        <div className="modal-center-more__right">
                            {
                                moreRightItems.map((moRiIt, index)=>(
                                    <div 
                                        key={index}
                                        className={`more-right-item ${moRiIt.classColor} ${moreItemActive === index ? '--active' : ''}`}
                                        onClick={()=>actionInMoreRightItem(index)}
                                        onMouseOver={()=>handleMouseTooltip(index)}
                                        onMouseOut={()=>handleMouseTooltip(null)}
                                    >
                                        <span>
                                            <i className={moRiIt.icon}></i>
                                        </span>
                                        <ToolTip 
                                            content={moRiIt.tooltipContent}
                                            status={moreItemTooltip === index ? true : false } 
                                            colorClass='--first-color'
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="create-modal__bottom">
                    {
                        modalAlert ?
                        <div className="create-modal-alert">
                            {modalAlert}
                        </div> : null
                    }
                    <button 
                        className="btn btn--primary btn--radius-5px"
                        onClick={handleSubmit}
                    >
                        Done
                    </button>
                </div>
                {
                    loading ?
                    <div className="create-modal__loading">
                        <img src={LoadingImg} alt="" />
                    </div>: null
                }
            </div>
        </div>
    );
}

export default CreatePostModal;