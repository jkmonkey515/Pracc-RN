export const UPDATE_REQUESTS = 'requests/UPDATE_REQUESTS'
export const UPDATE_REQUESTS_FOR_DATE = 'requests/UPDATE_REQUESTS_FOR_DATE'

const initialState = {
    requestsByDate: {}
}

const reducer = (state = initialState, action: any) => {
    switch (action.type) {
        case UPDATE_REQUESTS:
            return {
                ...state,
                requestsByDate: action.requestsByDate,
            }

        case UPDATE_REQUESTS_FOR_DATE:
            const newRequests: { [key: string]: string } = {
                ...state.requestsByDate,
            }

            if (action.requests.length <= 0) {
                delete newRequests[action.dateStr]
            } else {
                newRequests[action.dateStr] = action.requests
            }

            return {
                ...state,
                requestsByDate: newRequests,
            }
    }

    return state
}

export default reducer
