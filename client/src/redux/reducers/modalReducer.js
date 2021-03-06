import { GLOBALTYPES } from "../constants/globalTypes";

const initialState = {
    createPostModalStatus: false,
    createPostModalEdit: {
        status: false,
        data: null
    },
    createStoriesModalStatus: false,
    emotionModalInCreatePost: false,
    emotionModalPosition: {x: 0, y: 0},
    fileModalInCreatePost: false,
    initFileModalType: null,
    mediaShowModal: {
        status: false,
        data: null
    },
    mediaDetailModal: {
        status: false,
        data: null
    }
};

const modalReducer = (state = initialState, action) => {
    const {payload, type} = action; 
    switch (type) {
        case GLOBALTYPES.CREATE_POST_MODAL_STATUS:
            return {...state, createPostModalStatus: payload};
        case GLOBALTYPES.CREATE_POST_MODAL_EDIT:
            return {...state, createPostModalEdit: payload};
        case GLOBALTYPES.CREATE_STORIES_MODAL_STATUS:
            return {...state, createStoriesModalStatus: payload};
        case GLOBALTYPES.EMOTION_MODAL_IN_CREATE_POST:
            return {...state, emotionModalInCreatePost: payload};
        case GLOBALTYPES.EMOTION_MODAL_POSITION:
            return {...state, emotionModalPosition: {x: payload.x, y: payload.y}}
        case GLOBALTYPES.FILE_MODAL_IN_CREATE_POST:
            return {...state, fileModalInCreatePost: payload}
        case GLOBALTYPES.INIT_FILE_MODAL_TYPE:
            return {...state, initFileModalType: payload}
        case GLOBALTYPES.MEDIA_SHOW_MODAL:
            return {...state, mediaShowModal: payload}
        case GLOBALTYPES.MEDIA_DETAIL_MODAL:
            return {...state, mediaDetailModal: payload}
        default:
            return state;
    }
}

export default modalReducer;