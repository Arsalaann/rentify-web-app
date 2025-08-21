import React, { useState } from 'react';
import style from './ApplyFilter.module.css';
import { ImCross } from "react-icons/im";

const ApplyFilter = (props) => {
    const [filterForm, setFilterForm] = useState(false);
    const [formData,updateFormData] = useState({price:"",bedrooms:"",bathroom:""});

    const applyFilterHandler=async() => {
    	if(formData.price==="" && formData.bedrooms==="" && formData.bathroom==="")
    		return;
    	props.setLoader(true);
        const response=await fetch('/users/posts/filter',{
        	method:"POST",
        	headers:{
        		"content-type":"application/json"
        	},
        	body:JSON.stringify({filter:formData})
        	
        });
        props.setLoader(false);
        const result=await response.json();
        await props.updateProperties([...result.data]);
        
    }
    
    const clearFilterFormHandler=()=>{
    	setFilterForm(false);
    	updateFormData({price:"",bedrooms:"",bathroom:""});
    	props.setLoader();
    	if(formData.price==="" && formData.bedrooms==="" && formData.bathroom==="")
    		return;
    	props.getFeedPosts();
    	
    }

    return (
        <>
            {!filterForm ?
                <button onClick={() => setFilterForm(true)} className={style['filter-btn']}>Set Budget</button>
                :
                <div className={style['filter-form']}>
                    <div className={style['filter-input-container']}>
                        <span>price</span>
                        <input type="number" onChange={(e)=>updateFormData((prev)=>({...prev,price:e.target.value}))}/>
                    </div>
                    <div className={style['filter-input-container']}>
                        <span>bedrooms</span>
                        <input type="number" onChange={(e)=>updateFormData((prev)=>({...prev,bedrooms:e.target.value}))}/>
                    </div>
                    <div className={style['filter-input-container']}>
                        <span>bathrooms</span>
                        <input type="number" onChange={(e)=>updateFormData((prev)=>({...prev,bathroom:e.target.value}))}/>
                    </div>
                    <div className={style['apply-filter-btn-container']}>
                        <button onClick={applyFilterHandler} className={style['apply-filter-btn']}>Apply Filter</button>
                    </div>
                    <ImCross className={style['cross-icon']} onClick={clearFilterFormHandler}/>
                </div>

            }
        </>
    );
};

export default ApplyFilter;
