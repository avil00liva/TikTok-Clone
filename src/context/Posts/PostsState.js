import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore"
import React, {useReducer} from "react"
import ContextReducer from "./ContextReducer"
import PostsContext from "./PostsContext"
import { db } from "../../firebase"

const PostsState = (props) => {
    const initialState = {
        posts: [],
    }

    const [state, dispatch] = useReducer(ContextReducer, initialState)

    const getPosts = async ()=> { onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(4)),
        (snapshot)=>{
          res(snapshot.docs.map((doc)=> ({ ...doc.data(), id: doc.id})))
        }
        )
        dispatch({
            type:"GET_POSTS",
            payload: res
        })
    }


    return (
        <PostsContext.Provider value={{
            posts: state.posts,
            getPosts,
        }} >
            {props.children}
        </PostsContext.Provider>
    )

}

export default PostsState