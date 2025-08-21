import React, { useState,useEffect } from 'react';
import style from './Post.module.css';
import { useSelector } from 'react-redux';
import { FaHeart } from "react-icons/fa";



const Posts = (props) => {
    const [userDetails, setUserDetails] = useState(false);

    const isAuthenticated = useSelector(state => state.user.isAuthenticated);
    
    useEffect(()=>{
    	setUserDetails(false);
    },[isAuthenticated]);

    const interestedButtonHandler = () => {
        if (!isAuthenticated)
            props.showForm();
        else{
            setUserDetails((prev) => prev = !prev);
            if(!userDetails){
            	fetch('/users/send-mail',{
            		method:"POST",
            		headers:{"content-type":"application/json"},
            		body:JSON.stringify({
            			userInterested:props.myBioData,
            			postOwner:props.userData
            		})
            	});
            	alert("Email sent successfully to owner and rental");
            }
        }
    }

    const toggleLikeHandler = async () => {
        if (!isAuthenticated)
            props.showForm();
        else {
            props.setLoader(true);
            const response=await fetch('/users/posts/toggle-likes', {
                method: "POST",
                body: JSON.stringify({
                    id: props.postData._id,
                    update: props.isLiked?-1:1,
                    email: props.myBioData.email
                }),
                headers: {
                    "content-type": "application/json"
                }
            })

            const result=await response.json();
            await props.updateMyBioData({...result.data});
            props.getFeedPosts();
        }
    }

    return (
        <>
            {!userDetails ?
                <div className={style['posted-property-not-show-details-container']}>
                    <div className={style['image-container-not-show-details']}></div>
                    <div className={style['post-details-container']}>
                        <div className={style['post-likes-container']}>
                            <div className={style['price']}>${props.postData.price}</div>
                            <div className={style['likes']}>
                                <div>{props.postData.likes}</div>
                                <FaHeart
                                    onClick={toggleLikeHandler}
                                    className={`${style['like-icon']} ${props.isLiked && style['is-liked']}`}
                                />
                            </div>
                        </div>

                        <div className={style['property-metadata']}>
                            <div className={style['desc']}>{props.postData.desc}</div>
                            <div>No. of Bedrooms:   {props.postData.bedrooms}</div>
                            <div>No. of Bathrooms:  {props.postData.bathroom}</div>
                            <div>size:   {props.postData.areaSize}</div>
                            <div>Location:   {props.postData.address}</div>
                        </div>

                        {(!isAuthenticated || 
                         (isAuthenticated && props.userData.email!==props.myBioData.email)) && 
                         <div className={style['post-interested-btn-container']}>
                            <button
                                onClick={interestedButtonHandler}
                                className={style['post-interested-btn']}>
                                I am Interested
                            </button>
                        </div>
                        }


                    </div>
                </div>
                :
                <div className={style['posted-property-show-details-container']}>
                    <div className={style['image-container-show-details']}></div>
                    <div className={style['post-details-container']}>
                        <div className={style['post-likes-container']}>
                            <div className={style['price']}>${props.postData.price}</div>
                            <div className={style['likes']}>
                                <div>{props.postData.likes}</div>
                                <FaHeart
                                    onClick={toggleLikeHandler}
                                    className={`${style['like-icon']} ${props.isLiked && style['is-liked']}`}
                                />
                            </div>
                        </div>

                        <div className={style['property-metadata']}>
                            <div className={style['desc']}>{props.postData.desc}</div>
                            <div>No. of Bedrooms:   {props.postData.bedrooms}</div>
                            <div>No. of Bathrooms:  {props.postData.bathroom}</div>
                            <div>size:   {props.postData.areaSize}</div>
                            <div>Location:   {props.postData.address}</div>
                        </div>




                    </div>
                    <div className={style['user-details-container']}>
                        <div className={style['user-details-titles']}>
                            <span>Name</span>
                            <span className={style['user-details-title-email']}>Email</span>
                            <span>phone</span>
                        </div>
                        <div className={style['user-details-values']}>
                            <div>{props.userData.name}  {props.userData.lastName}</div>
                            <div className={style['user-details-value-email']}>{props.userData.email}</div>
                            <div>{props.userData.mobile}</div>
                        </div>

                    </div>
                    <div className={style['post-showless-btn-container']}>
                        <button
                            onClick={interestedButtonHandler}
                            className={style['post-showless-btn']}>
                            show less
                        </button>
                    </div>
                </div>
            }
        </>
    );
};

export default Posts;
