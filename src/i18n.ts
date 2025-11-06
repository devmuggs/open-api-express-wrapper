export const I18nLanguage = {
    English: "en",
    Japanese: "ja",
} as const;
export type I18nLanguage = (typeof I18nLanguage)[keyof typeof I18nLanguage];

// export interface I18n extends Partial<Record<I18nLanguage, string>> {}
export type I18n = {
    toObject: () => Partial<Record<I18nLanguage, string>>;
} & Record<I18nLanguage, (text: string) => I18n>;

export const I18n = (translations: Partial<Record<I18nLanguage, string>> = {}): I18n => {
    const result = {
        toObject: () => translations,
    } as I18n;

    for (const lang of Object.values(I18nLanguage)) {
        result[lang] = (text: string) => {
            translations[lang] = text;
            return result;
        };
    }

    return result;
};
