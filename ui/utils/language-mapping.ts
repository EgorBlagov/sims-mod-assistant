import { Translation } from "../../common/l10n";
import { DoubleTypes } from "../../common/types";

export const doubleTypeMap = {
    [DoubleTypes.Exact]: (l10n: Translation) => ({
        tooltip: l10n.exactDescription,
        title: l10n.exact,
    }),
    [DoubleTypes.Catalog]: (l10n: Translation) => ({
        tooltip: l10n.catalogDescription,
        title: l10n.catalog,
    }),
    [DoubleTypes.Skintone]: (l10n: Translation) => ({
        tooltip: l10n.skintoneDescription,
        title: l10n.skintone,
    }),
    [DoubleTypes.Cas]: (l10n: Translation) => ({
        tooltip: l10n.casDescription,
        title: l10n.cas,
    }),
    [DoubleTypes.Slider]: (l10n: Translation) => ({
        tooltip: l10n.sliderDescription,
        title: l10n.slider,
    }),
};
