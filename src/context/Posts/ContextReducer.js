import { GET_POSTS } from "../types";

export default  (state, action) => {
    const {payload, type} = action

    switch(type) {
        case GET_POSTS:
            return {
                ...state,
                posts: payload
            }
    }

}