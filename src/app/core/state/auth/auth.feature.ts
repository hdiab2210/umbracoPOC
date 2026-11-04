import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { Member } from "../../models/auth.model";
import { AuthActions } from "./auth.actions";

export interface AuthState {
    member: Member | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    member: null,
    loading: false,
    error: null,
};

/** Reducer + auto-generated selectors (selectMember, selectLoading, selectError). */
export const authFeature = createFeature({
    name: 'auth',
    reducer: createReducer(initialState,
        on(AuthActions.currentMemberLoaded, (state, { member }): AuthState => ({ ...state, member })),
        on(AuthActions.register, AuthActions.login, (state): AuthState => ({ ...state, loading: true, error: null })),
        on(AuthActions.registerSuccess, AuthActions.loginSuccess, (state, { member }): AuthState => ({
            ...state,
            member,
            loading: false,
        })),
        on(AuthActions.registerFailure, AuthActions.loginFailure, (state, { error }): AuthState => ({
            ...state,
            error,
            loading: false,
        })),

        on(AuthActions.logoutSuccess, (state): AuthState => ({ ...state, member: null })),
        on(AuthActions.clearError, (state): AuthState => ({ ...state, error: null })),
    ),

    // derived selector. It’s true when there’s a member. The menu uses it to choose between “Login” and “Logout”.
    extraSelectors: ({ selectMember }) => ({
        selectIsLoggedIn: createSelector(selectMember, (member) => member !== null),
    }),
})