import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { LoginRequest, Member, RegisterRequest } from "../../models/auth.model";

export const AuthActions = createActionGroup(
    {
        source: 'Auth',
        events: {
            'Load Current Member': emptyProps(),
            'Current Member Loaded': props<{ member: Member | null }>(),
            'Register': props<{ request: RegisterRequest }>(),
            'Register Success': props<{ member: Member }>(),
            'Register Failure': props<{ error: string }>(),

            'Login': props<{ request: LoginRequest }>(),
            'Login Success': props<{ member: Member }>(),
            'Login Failure': props<{ error: string }>(),

            'Logout': emptyProps(),
            'Logout Success': emptyProps(),

            'Clear Error': emptyProps(),
        }
    })