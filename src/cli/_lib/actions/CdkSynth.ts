import { CdkSynthCmd } from '../cmd';
import BaseAction, { BaseExecOpts } from './BaseAction';

export interface CdkSynthExecOpts extends BaseExecOpts {
    app: string;
}

export const cdkSynthExecDefaultOpts: Partial<CdkSynthExecOpts> = {};

export default class CdkSynth extends BaseAction {
    cdkSynthCmd: CdkSynthCmd;

    async exec(opts: CdkSynthExecOpts) {}
}
