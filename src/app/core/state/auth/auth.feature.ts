import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { Member } from "../../models/auth.model";
import { AuthActions } from "./auth.actions";
import { ADMIN_ROLE, DELETE_ROLES, MANAGER_ROLES } from "../../constants/roles";

export interface AuthState {
    member: Member | null;
    loading: boolean;
    error: string | null;
    initialized: boolean;
}

const initialState: AuthState = {
    member: null,
    loading: false,
    error: null,
    initialized: false
};
/** Reducer + auto-generated selectors (selectMember, selectLoading, selectError). */
export const authFeature = createFeature({
    name: 'auth',
    reducer: createReducer(initialState,
        // initialized = "we now know who is logged in" (the /me call finished). The manager guard waits for it.
        on(AuthActions.currentMemberLoaded, (state, { member }): AuthState => ({ ...state, member, initialized: true })),
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
        selectCanManage: createSelector(selectMember, (member) => {
            if (!member) return false;                                     // nobody logged in → no
            return (member.roles ?? []).some((role) => MANAGER_ROLES.includes(role)); // has an allowed role → yes
        }),
        // Only admins may delete. The dashboard hides the Delete buttons when this is false.
        selectCanDelete: createSelector(selectMember, (member) => {
            if (!member) return false;
            return (member.roles ?? []).some((role) => DELETE_ROLES.includes(role));
        }),
        // Only admins see the Members tab and can change roles.
        selectIsAdmin: createSelector(selectMember, (member) => (member?.roles ?? []).includes(ADMIN_ROLE)),
    }),
})