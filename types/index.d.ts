import { Unsubscribe } from "firebase/firestore";
import { User } from "firebase/auth";

/**
 * Enum representing the available themes for the application.
 */
export enum Theme {
    Dark = 'dark',
    Light = 'light',
}

/**
 * Interface for the AppContextProps object, which provides various methods and properties for the Sondaj2023 app.
 */
export interface AppContextProps {
    sondajeData: SondajeDataType;
    shuffledSondajeFlat: SondajeDataType;
    castVote: (sondajId: string, userId: string, vote: boolean) => Promise<void>;
    changeCurrentSondaj: (sondajId: string) => void;
    updateCommentsLimit: (sondajId: string, limit?: number) => void;
    addNewComment: (sondajId: string, comment: string, user: User) => Promise<string>;
    updateCommentLikeDislike: (sondajId: string, commentId: string, user: User, like: boolean) => Promise<void>;
    changeCommentsOrder: OrderByProps<void>
    commentsOrderBy: OrderByProps<void>
    modal: (modalProps: ModalProps) => void;
    closeModal: (id: string) => void;
}

/**
 * Props for the AppProvider component.
 */
export interface AppProviderProps {
    children: ReactNode;
}

/**
 * Represents the possible values for the `Sondaj` component's `type` prop.
 * @typedef {'persoana' | 'partid' | 'lege' | 'altele'} SondajTypesProps
 */
export type SondajTypesProps = 'persoana' | 'partid' | 'lege' | 'altele';

/**
 * Represents the properties of a sondaj.
 */
export interface SondajProps {
    /**
     * The unique identifier of the sondaj.
     */
    id?: string;
    /**
     * The details of the sondaj.
     */
    detalii: string;
    /**
     * The source of information for the sondaj.
     */
    sursa?: string;
    /**
     * The name of the sondaj.
     */
    nume: string;
    /**
     * The image URL of the sondaj.
     */
    poza: string;
    /**
     * The timestamp of the sondaj.
     */
    timestamp: number;
    /**
     * The position of the sondaj.
     */
    pozitie: string;
    /**
     * The type of the sondaj.
     */
    tipSondaj: string;
    /**
     * The creation date of the sondaj.
     */
    createdAt?: number;
    /**
     * The last update date of the sondaj.
     */
    updatedAt?: number;
    /**
     * The votes of the sondaj.
     */
    votes?: Votes[];
    /**
     * The comments of the sondaj.
     */
    comments?: CommentProps[];
    /**
     * The number of comments of the sondaj.
     */
    commentsCount?: number;
}

/**
 * Represents an object with a `sondajId` property.
 */
export interface SondajIdProp {
    sondajId: string;
}

/**
 * Represents the props for a sondaj (survey) component.
 * @interface
 */
export interface SondajeProps {
    [key: string]: string;
}

/**
 * An interface representing a grouped collection of sondaj properties.
 * The keys are strings and the values are arrays of SondajProps objects.
 */
export interface SondajeGroupedType {
    [key: string]: SondajProps[];
}

/**
 * Interface representing a flat and grouped sondaj data structure.
 */
export interface SondajeFlatAndGroupedType {
    /**
     * An array of sondaj props.
     */
    flat: SondajProps[];

    /**
     * An object representing sondaj data grouped by a specific key.
     */
    grouped: SondajeGroupedType;

    /**
     * An index signature that allows for additional properties to be added dynamically.
     */
    [key: string]: SondajProps[] | SondajeGroupedType;
}

/**
 * Represents the properties of a vote.
 * @interface
 */
export interface VoteProps {
    uid: string;
    vot: boolean;
}

/**
 * Represents the properties of a vote.
 */
export type VotesProps = SondajIdProp;

/**
 * An interface representing updated votes for a user.
 * The keys are user IDs and the values are VoteProps objects.
 */
export interface UpdatedVotesProps {
    [userId: string]: VoteProps;
}

/**
 * Interface for CommentProps object
 * @interface
 */
export interface CommentProps {
    id?: string;
    uid: string;
    displayName: string;
    photoURL: string;
    comentariu: string;
    timestamp: number;
    votes?: CommentVotesProps;
    vot?: VoteProps;
    upvotesCount?: number;
}

/**
 * Represents the props for comments.
 */
export type CommentsProps = SondajIdProp;

/**
 * Represents a dictionary of user IDs and their corresponding vote properties.
 */
export interface CommentVotesProps {
    [userId: string]: VoteProps;
}

/**
 * Interface for defining the properties used for ordering data.
 */
export interface OrderByProps {
    /**
     * The field to order by. Can be either 'timestamp' or 'upvotesCount'.
     */
    field: 'timestamp' | 'upvotesCount';
    /**
     * The direction to order by. Can be either 'asc' or 'desc'.
     */
    direction: 'asc' | 'desc';
}

/**
 * Props for a modal component.
 */
export interface ModalProps {
    /** The ID of the modal. */
    id: string;
    /** Whether the modal is currently open or not. */
    isOpen: boolean;
    /** Function to call when the modal is closed. */
    onClose?: () => void;
    /** Whether to hide the close button or not. */
    hideCloseButton?: boolean;
    /** The backdrop to use for the modal. */
    backdrop?: 'blur' | 'opaque' | 'transparent';
    /** The size of the modal. */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    /** The scroll behavior of the modal. */
    scrollBehavior?: 'inside' | 'outside';
    /** Whether the modal can be dismissed or not. */
    isDismissable?: boolean;
    /** The header text for the modal. */
    modalHeader: string;
    /** The body content for the modal. */
    modalBody: ReactNode;
    /** Whether the header is disabled or not. */
    headerDisabled?: boolean;
    /** Whether the footer is disabled or not. */
    footerDisabled?: boolean;
    /** Function to call when the footer button is clicked. */
    footerButtonClick?: () => void;
    /** The text to display on the footer button. */
    footerButtonText?: string;
    /** Whether to replace the URL or not. */
    noReplaceURL?: boolean;
    /** Additional class names to apply to the modal. */
    classNames?: {}
}

/**
 * Represents the state of the application.
 * @typedef {Object} State
 * @property {SondajeFlatAndGroupedType} sondajeData - The sondaje data.
 * @property {string} currentSondajId - The ID of the current sondaj.
 * @property {Record<string, number>} commentsLimits - The limits for comments.
 * @property {OrderByProps} commentsOrderBy - The order by properties for comments.
 * @property {string} path - The current path of the application.
 * @property {ModalProps} modalProps - The modal properties.
 */
export type State = {
    sondajeData: SondajeFlatAndGroupedType;
    currentSondajId: string;
    commentsLimits: Record<string, number>;
    commentsOrderBy: OrderByProps;
    path: string;
    modalProps: ModalProps[];
};


/**
 * Action type for Context actions 
 */
/**
 * Defines the Action type, which is a union of objects representing different actions that can be dispatched in the application.
 * Each object has a `type` property that specifies the type of action and a `payload` property that contains the data associated with the action.
 * @typedef {Object} Action
 * @property {'SET_SONDAJE_DATA'} type - The type of action to set sondaje data.
 * @property {SondajeFlatAndGroupedType} payload - The payload containing the sondaje data.
 * @property {'SET_CURRENT_SONDAJ_ID'} type - The type of action to set the current sondaj ID.
 * @property {string} payload - The payload containing the current sondaj ID.
 * @property {'SET_COMMENTS_LIMITS'} type - The type of action to set the comments limits.
 * @property {Record<string, number>} payload - The payload containing the comments limits.
 * @property {'SET_COMMENTS_ORDER_BY'} type - The type of action to set the comments order by.
 * @property {OrderByProps} payload - The payload containing the comments order by properties.
 * @property {'SET_PATH'} type - The type of action to set the path.
 * @property {string} payload - The payload containing the path.
 * @property {'SET_MODAL_PROPS'} type - The type of action to set the modal properties.
 * @property {ModalProps} payload - The payload containing the modal properties.
 * @property {'CAST_VOTE'} type - The type of action to cast a vote.
 * @property {{ sondajId: string; userId: string; vote: boolean }} payload - The payload containing the vote data.
 * @property {'CHANGE_CURRENT_SONDAJ'} type - The type of action to change the current sondaj.
 * @property {{ sondajId: string }} payload - The payload containing the sondaj ID.
 * @property {'UPDATE_VOTES'} type - The type of action to update the votes.
 * @property {{ sondajId: string; votes: VoteProps[] }} payload - The payload containing the updated votes data.
 * @property {'UPDATE_COMMENTS_LIMIT'} type - The type of action to update the comments limit.
 * @property {{ sondajId: string; limit: number }} payload - The payload containing the updated comments limit data.
 * @property {'CHANGE_COMMENTS_ORDER'} type - The type of action to change the comments order.
 * @property {OrderByProps} payload - The payload containing the updated comments order data.
 * @property {'UPDATE_COMMENTS'} type - The type of action to update the comments.
 * @property {{ sondajId: string; comments: CommentProps[]; commentsCount: number }} payload - The payload containing the updated comments data.
 * @property {'UPDATE_COMMENT_VOTE'} type - The type of action to update a comment's vote.
 * @property {{ sondajId: string; commentId: string; updatedVotes: UpdatedVotesProps; upvotesCount: number }} payload - The payload containing the updated comment vote data.
 * @property {'UPDATE_COMMENT_VOTES'} type - The type of action to update a comment's votes.
 * @property {{ sondajId: string; commentId: string; updatedVotes: UpdatedVotesProps; upvotesCount: number }} payload - The payload containing the updated comment votes data.
 * @property {'CLOSE_MODAL'} type - The type of action to close the modal.
 * @property {undefined} [payload] - The optional payload for CLOSE_MODAL.
 * @property {'HANDLE_ERROR'} type - The type of action to handle an error.
 * @property {string} payload - The payload containing the error message.
 * @property {'ADD_MODAL'} type - The type of action to add a modal.
 * @property {ModalProps} payload - The payload containing the modal properties.
 * @property {'CLOSE_MODAL'} type - The type of action to remove a modal.
 * @property {string} payload - The payload containing the modal ID.
 */
export type Action =
    | { type: 'SET_SONDAJE_DATA'; payload: SondajeFlatAndGroupedType }
    | { type: 'SET_CURRENT_SONDAJ_ID'; payload: string }
    | { type: 'SET_COMMENTS_LIMITS'; payload: Record<string, number> }
    | { type: 'SET_COMMENTS_ORDER_BY'; payload: OrderByProps }
    | { type: 'SET_PATH'; payload: string }
    | { type: 'SET_MODAL_PROPS'; payload: ModalProps }
    | { type: 'CAST_VOTE'; payload: { sondajId: string; userId: string; vote: boolean } }
    | { type: 'CHANGE_CURRENT_SONDAJ'; payload: { sondajId: string } }
    | { type: 'UPDATE_VOTES'; payload: { sondajId: string; votes: VoteProps[] } }
    | { type: 'UPDATE_COMMENTS_LIMIT'; payload: { sondajId: string; limit: number } }
    | { type: 'CHANGE_COMMENTS_ORDER'; payload: OrderByProps }
    | { type: 'UPDATE_COMMENTS'; payload: { sondajId: string; comments: CommentProps[]; commentsCount: number } }
    | { type: 'UPDATE_COMMENT_VOTE'; payload: { sondajId: string; commentId: string; updatedVotes: UpdatedVotesProps; upvotesCount: number } }
    | { type: 'UPDATE_COMMENT_VOTES'; payload: { sondajId: string; commentId: string; updatedVotes: UpdatedVotesProps; upvotesCount: number } }
    | { type: 'CLOSE_MODAL', payload?: undefined }  // No payload for CLOSE_MODAL
    | { type: 'HANDLE_ERROR', payload: string }
    | { type: 'ADD_MODAL', payload: ModalProps }
    | { type: 'CLOSE_MODAL', payload: string }

