export const SET_SPINNER_VISIBILITY = 'login/SET_SPINNER_VISIBILITY'

const initialState = {
    showSpinner: false,
}

const reducer = (state = initialState, action: { type: any; visible: any; }) => {
    switch (action.type) {
        case SET_SPINNER_VISIBILITY:
            return {
                ...state,
                showSpinner: action.visible,
            }
    }

    return state;
}

export default reducer
