import { HapifyVM } from '@hapify/vm';
import { readFileSync } from 'fs';
import { join } from 'path';

const SECOND = 1000;
const EjsLibContent = readFileSync(join(__dirname, 'ejs.js'), { encoding: 'utf8' });

interface HapifyEJSOptions {
	timeout?: number;
	allowAnyOutput?: boolean;
}

export class OutputError extends Error {
	code = 6001;
	name = 'VmOutputError';
}
export class EvaluationError extends Error {
	code = 6002;
	name = 'VmEvaluationError';
	lineNumber: number = null;
	columnNumber: number = null;
	details: string = null;
}
export class TimeoutError extends Error {
	code = 6003;
	name = 'VmTimeoutError';
}

export class HapifyEJS {
	/** Default options */
	private defaultOptions: HapifyEJSOptions = {
		timeout: SECOND,
		allowAnyOutput: false,
	};
	/** Actual options */
	private options: HapifyEJSOptions;

	/** Constructor */
	constructor(options: HapifyEJSOptions = {}) {
		this.options = Object.assign({}, this.defaultOptions, options);
	}

	/** Wrap content in ejs compiler */
	private wrap(content: string): string {
		return `(function() {\n${content}\n })()`;
	}

	/** Execute content */
	run(content: string, context: { [key: string]: any }): string | any {
		const result = new HapifyVM(this.options).run(this.wrap(content), { context });
		return result;
	}
}
