import { useState } from 'react';
import style from './AddProperty.module.css';


const PostProperty = (props) => {
    const [addPropertyForm, setAddPropertyForm] = useState(false);
    const [postInput, updatePostInput] =
        useState({
            price: 0,
            desc: "",
            areaSize: "",
            bedrooms: 0,
            bathroom: 0,
            address: ""
        });

    const postPropertyHandler = async (e) => {
        props.setLoader(true);
        e.preventDefault();
        const response = await fetch('/users/add-post', {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                email: props.myBioData.email,
                userInput: postInput
            })
        })

        const result = await response.json();

        setAddPropertyForm(false);
        props.updateMyBioData({ ...result.data });
        props.getFeedPosts();

    }


    return (
        <div className={style['add-property-container']}>
            {!addPropertyForm ?
                <div className={style['add-property-btn-container']}>
                    <span>Upload Your wasteland and earn</span>
                    <button
                        onClick={() => setAddPropertyForm(true)}
                        className={style['add-property-btn']}>
                        Add Property
                    </button>
                </div>
                :
                <form onSubmit={postPropertyHandler} className={style['add-property-form']}>
                    <div className={style['for-aligning']}>
                        <div className={style['add-property-input']}>
                            <label>price</label>
                            <input type="number" onChange={(e) => updatePostInput((prev) => ({ ...prev, price: e.target.value }))} required />
                        </div>
                        <div className={style['add-property-input']}>
                            <label>bedrooms</label>
                            <input onChange={(e) => updatePostInput((prev) => ({ ...prev, bedrooms: e.target.value }))} required />
                        </div>
                        <div className={style['add-property-input']}>
                            <label>bathrooms</label>
                            <input onChange={(e) => updatePostInput((prev) => ({ ...prev, bathroom: e.target.value }))} required />
                        </div>
                        <div className={style['add-property-input']}>
                            <label>size</label>
                            <input onChange={(e) => updatePostInput((prev) => ({ ...prev, areaSize: e.target.value }))} required placeholder="e.g. 10X10" />
                        </div>
                    </div>

                    <div className={style['add-property-textarea-container']}>
                        <div className={style['add-property-location']}>
                            <label>Location</label>
                            <input onChange={(e) => updatePostInput((prev) => ({ ...prev, address: e.target.value }))} required placeholder="city,street,pincode"/>
                        </div>
                        <div className={style['add-property-textarea']}>
                            <label>description</label>
                            <textarea onChange={(e) => updatePostInput((prev) => ({ ...prev, desc: e.target.value }))} required>
                                Write at least one character. Write about facilities like hospitals or schools nearby you
                            </textarea>
                        </div>
                    </div>
                    {/* <input type="file" name="image" accept="image/*" className={style['custom-file-input']} /> */}
                    <div className={style['post-property-btn-container']}>
                        <button type="submit" className={style['post-property-btn']}>Post</button>
                        <button onClick={() => setAddPropertyForm(false)} className={style['cancel-post-property-btn']}>Cancel</button>
                    </div>
                </form>
            }
        </div>
    );
};

export default PostProperty;