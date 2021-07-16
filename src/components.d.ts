/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface AuthImage {
        "image": string;
    }
    interface SkillwalletAuth {
    }
    interface UsersModal {
        "isVisible": boolean;
    }
}
declare global {
    interface HTMLAuthImageElement extends Components.AuthImage, HTMLStencilElement {
    }
    var HTMLAuthImageElement: {
        prototype: HTMLAuthImageElement;
        new (): HTMLAuthImageElement;
    };
    interface HTMLSkillwalletAuthElement extends Components.SkillwalletAuth, HTMLStencilElement {
    }
    var HTMLSkillwalletAuthElement: {
        prototype: HTMLSkillwalletAuthElement;
        new (): HTMLSkillwalletAuthElement;
    };
    interface HTMLUsersModalElement extends Components.UsersModal, HTMLStencilElement {
    }
    var HTMLUsersModalElement: {
        prototype: HTMLUsersModalElement;
        new (): HTMLUsersModalElement;
    };
    interface HTMLElementTagNameMap {
        "auth-image": HTMLAuthImageElement;
        "skillwallet-auth": HTMLSkillwalletAuthElement;
        "users-modal": HTMLUsersModalElement;
    }
}
declare namespace LocalJSX {
    interface AuthImage {
        "image"?: string;
    }
    interface SkillwalletAuth {
        "onShowQR"?: (event: CustomEvent<Boolean>) => void;
    }
    interface UsersModal {
        "isVisible"?: boolean;
    }
    interface IntrinsicElements {
        "auth-image": AuthImage;
        "skillwallet-auth": SkillwalletAuth;
        "users-modal": UsersModal;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "auth-image": LocalJSX.AuthImage & JSXBase.HTMLAttributes<HTMLAuthImageElement>;
            "skillwallet-auth": LocalJSX.SkillwalletAuth & JSXBase.HTMLAttributes<HTMLSkillwalletAuthElement>;
            "users-modal": LocalJSX.UsersModal & JSXBase.HTMLAttributes<HTMLUsersModalElement>;
        }
    }
}
