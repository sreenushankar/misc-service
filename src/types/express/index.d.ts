import { TokenData } from 'wallet-common-lib';

// to make the file a module and make TypeScript compiled
export { }

declare global {
    namespace Express {
        export interface Request {
            tokenData?: TokenData;
        }
    }
}