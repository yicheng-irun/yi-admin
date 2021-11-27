import { Files } from 'formidable';

export interface ReqData {
   method: string;
    query: {
       [key: string]: any;
    };
    body: {
       [key: string]: any;
    };
    files?: Files;
 }

export interface JsonReturnType<T = any> {
   success: boolean;
   message?: string;
   data?: T;
}
