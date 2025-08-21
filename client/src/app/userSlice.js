import { createSlice } from "@reduxjs/toolkit";

const userSlice=createSlice({
    name:'user',
    initialState:{
        isRentant:true,
        isAuthenticated:false,
        
    },
    reducers:{
        updateIsAuthenticated:(state,action)=>{
        	if(typeof action.payload !== 'undefined')
        		state.isAuthenticated=action.payload;
        	else
        		state.isAuthenticated=true
        },

        updateIsRentant:(state,action)=>{
        	if(typeof action.payload!=='undefined')
        		state.isRentant=true;
        	else
        		state.isRentant=!state.isRentant
        },

        
    }
});

export const {updateIsAuthenticated,updateIsRentant} = userSlice.actions;
export default userSlice.reducer;

