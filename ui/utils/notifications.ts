import * as React from "react";

export enum NotificationTypes {
    Error = "error",
    Success = "success",
}

export interface INotificationContext {
    setType: (type: NotificationTypes) => void;
    setMessage: (msg: string) => void;
    setVisible: (visible: boolean) => void;
}

interface INotificationApi {
    showError: (msg: string) => void;
    showSuccess: (msg: string) => void;
}

export const NotificationContext = React.createContext<INotificationContext>(undefined);

export function createNotificationApiFromContext(ctx: INotificationContext): INotificationApi {
    return {
        showSuccess: (msg) => {
            ctx.setType(NotificationTypes.Success);
            ctx.setMessage(msg);
            ctx.setVisible(true);
        },
        showError: (msg) => {
            ctx.setType(NotificationTypes.Error);
            ctx.setMessage(msg);
            ctx.setVisible(true);
        },
    };
}

export function useNotification(): INotificationApi {
    const ctx = React.useContext(NotificationContext);
    return createNotificationApiFromContext(ctx);
}
