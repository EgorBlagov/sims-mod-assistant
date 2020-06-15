import { ISearchResult, TTicketId } from "../../common/types";

export interface ISavedSearchResult {
    ticketId: TTicketId;
    result: ISearchResult;
}
