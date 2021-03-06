import { deleteDataAPI, getDataAPI, patchDataAPI, postDataAPI } from "../../utils/fetch-data-api"
import { GLOBALTYPES } from "../constants/globalTypes"



export const createNotification = ({message, auth, socket}) => async (dispatch) => {
    try {
        const res = await postDataAPI('notification', message);
        socket.emit('createNotification', {
            ...res.data.notifications,
            user: {
                username: auth.user.username,
                avatar: auth.user.avatar
            }
        })
    } catch (err) {
        console.log(err.message);
        // dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const removeNotification = ({message, socket}) => async (dispatch) => {
    try {
        await deleteDataAPI(`notification/${message.id}?url=${message.url}`)
        
        socket.emit('removeNotification', message)
    } catch (err) {
        console.log(err.message)
        // dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const getNotifications = () => async (dispatch) => {
    try {
        const res = await getDataAPI('notification')
        
        dispatch({ type: GLOBALTYPES.GET_NOTIFICATIONS, payload: res.data.notifications })
    } catch (err) {
        console.log(err.message);
        // dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}


export const isReadUpdate = ({notification}) => async (dispatch) => {
    dispatch({type: GLOBALTYPES.UPDATE_NOTIFICATION, payload: {...notification, isRead: true}})
    try {
        await patchDataAPI(`notification/isRead-update/${notification._id}`, null)
    } catch (err) {
        console.log(err.message)
        // dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.message}})
    }
}

export const removeAllNotification = () => async (dispatch) => {
    dispatch({type: GLOBALTYPES.REMOVE_ALL_NOTIFICATION, payload: []})
    try {
        await deleteDataAPI('delete-all');
    } catch (err) {
        console.log(err.message)
        // dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}