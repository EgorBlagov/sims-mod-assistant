import { IIndexResult, TTicketId } from "../../common/types";

export interface ISavedSearchResult {
    ticketId: TTicketId;
    result: IIndexResult;
}
