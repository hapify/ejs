interface HapifyEJSOptions {
    timeout: number;
}
export declare class EjsEvaluationError extends Error {
    code: number;
    name: string;
    lineNumber: number;
    details: string;
}
export declare class HapifyEJS {
    /** Default options */
    private defaultOptions;
    /** Actual options */
    private options;
    /** Constructor */
    constructor(options?: Partial<HapifyEJSOptions>);
    /** Wrap content in ejs compiler */
    private wrapWithEjs;
    /** Escape string from ` and $ */
    private escapeContent;
    /** Execute content */
    run(content: string, context: {
        [key: string]: any;
    }): string | any;
    private transformEjsError;
}
export {};
