import React from 'react';
import style from './Post.module.css';
import { FaHeart } from "react-icons/fa";


const MyPosts = (props) => {
    const deletePostHandler = async (e) => {
        props.setLoader(true);
        e.preventDefault();
        const response = await fetch('/users/delete-Post', {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                id: props.postData._id,
            })
        })
    
        const result = await response.json();

        props.updateMyBioData({ ...result.data });
        props.getFeedPosts();
    }

    return (
        <div className={style['posted-property-not-show-details-container']}>
            <div className={style['image-container-not-show-details']}></div>
            <div className={style['post-details-container']}>
                <div className={style['post-likes-container']}>
                <div className={style['price']}>${props.postData.price}</div>
                    <div className={style['likes']}>
                        <div>{props.postData.likes}</div>
                        <FaHeart
                            className={style['myposts-like-icon']}
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

                <div className={style['post-delete-btn-container']}>
                    <button
                        onClick={deletePostHandler}
                        className={style['post-delete-btn']}>
                        Delete
                    </button>
                </div>

            </div>
        </div>
    );
};

export default MyPosts;