import React, { useEffect, useState } from 'react';
import UserAvatarImg from '../../assets/images/user-avatar.png';
import FollowButton from '../../components/follow-button/follow-button';

function ProfileInfo({id, profile, auth, dispatch, handleEditModal}) {
    const [userData, setUserData] = useState([]);

    useEffect(()=>{
        if(auth.user._id === id){
            setUserData([auth.user])
        }else{
            const newData = profile.users.filter(user => user._id === id);
            setUserData(newData);
        }
    },[id, auth.user, profile.users])

    return (
        userData.map((user, index)=>(
            <div className="profile-info" key={index}>
                <div className="profile-info__avatar">
                    <img src={user.avatar || UserAvatarImg} alt="" />
                </div>
                <div className="profile-info__content">
                    <div className="profile-info-name">
                        {user.username}
                    </div>
                    <div className="profile-info-friend">
                        <span>{user.followers.length} Follower</span>
                        <span>{user.following.length} Following</span>
                    </div>
                </div>  
                {
                    user._id === auth.user._id ?
                        <div 
                            className="profile-info__tool"
                            onClick={()=>handleEditModal(true)}
                        >
                            <i className="fas fa-pencil-alt"></i>
                            Edit your avatar
                        </div> :
                        <FollowButton 
                            size="--big-size"
                            user={user}
                        />
                }
            </div>
        ))
    );
}

export default ProfileInfo;