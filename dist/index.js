"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HapifyEJS = exports.EjsEvaluationError = void 0;
const vm_1 = require("@hapify/vm");
const fs_1 = require("fs");
const path_1 = require("path");
const SECOND = 1000;
const EjsLibContent = fs_1.readFileSync(path_1.join(__dirname, 'ejs.js'), { encoding: 'utf8' });
class EjsEvaluationError extends Error {
    constructor() {
        super(...arguments);
        this.code = 7001;
        this.name = 'EjsEvaluationError';
        this.lineNumber = null;
        this.details = null;
    }
}
exports.EjsEvaluationError = EjsEvaluationError;
class HapifyEJS {
    /** Constructor */
    constructor(options = {}) {
        /** Default options */
        this.defaultOptions = {
            timeout: SECOND,
        };
        this.options = Object.assign({}, this.defaultOptions, options);
    }
    /** Wrap content in ejs compiler */
    wrapWithEjs(content) {
        const escapedContent = this.escapeContent(content);
        return `${EjsLibContent}
const content = \`${escapedContent}\`;
return ejs.compile(content)(context);
		`;
    }
    /** Escape string from ` and $ */
    escapeContent(content) {
        return content.replace(/\$/g, '\\$').replace(/`/g, '\\`');
    }
    /** Execute content */
    run(content, context) {
        const wrappedContent = this.wrapWithEjs(content);
        const options = Object.assign({}, this.options, { eval: true });
        const vm = new vm_1.HapifyVM(options);
        let result;
        try {
            result = vm.run(wrappedContent, { context });
        }
        catch (error) {
            throw this.transformEjsError(error);
        }
        return result;
    }
    transformEjsError(error) {
        if (error instanceof vm_1.EvaluationError) {
            if (error.details && error.details.startsWith('Error: ejs:')) {
                const lines = error.details.split('\n');
                const lastLine = lines
                    .pop()
                    .replace(/\. Line: [0-9]+, Column: [0-9]+/, '')
                    .trim();
                const lineNumberMatches = /Error: ejs:([0-9]+)/.exec(lines[0]);
                const lineNumber = lineNumberMatches ? Number(lineNumberMatches[1]) : null;
                const details = lines.join('\n').trim();
                const ejsError = new EjsEvaluationError(lastLine);
                ejsError.details = details;
                ejsError.lineNumber = lineNumber;
                return ejsError;
            }
        }
        return error;
    }
}
exports.HapifyEJS = HapifyEJS;
//# sourceMappingURL=index.js.map