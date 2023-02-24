export default function reducer(state, action) {

    switch (action.type) {

        case "CURRENT_USER":
            return {
                ...state,
                user: action.payload
            };

        case "UPDATE_CURRET_USER":
            return {
                ...state,
                user: action.payload
            };

        case "GET_ALL_USERS":
            return {
                ...state,
                users: action.payload
            };

        case "GET_ALL_QUOTES":
            return {
                ...state,
                quotes: action.payload
            };

        case "CREATE_ONE_QUOTE":
            return {
                ...state,
                quotes: [...state.quotes, action.payload]
            };

        default:
            return state;

    }
}