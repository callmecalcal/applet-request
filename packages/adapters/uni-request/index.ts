import { Adapter } from '@applet-request/core';
import type {
  RequestContext,
  MiddlewareNext,
  RequestConfig,
} from '@applet-request/core';

/**
 * uni.request的其他请求配置
 */
export type UniRequestOtherConfig = Omit<UniApp.RequestOptions, 'url' | 'data' | 'fail' | 'success' | 'complete'>;

/**
 * uni.request的请求配置
 */
export type UniRequestConfig = RequestConfig<UniRequestOtherConfig>;

/**
 * uni.request的请求适配器
 */
export class UniRequestAdapter<Data> extends Adapter<
UniRequestOtherConfig,
Data,
UniApp.RequestSuccessCallbackResult
> {
  async request(context: RequestContext<UniRequestOtherConfig, Data, UniApp.RequestSuccessCallbackResult>, next: MiddlewareNext): Promise<unknown> {
    await next();
    return new Promise((resolve, reject) => {
      uni.request({
        ...context.request.config,
        url: context.request.apiURL,
        data: context.request.data as (string | AnyObject | ArrayBuffer | undefined),
        success(res) {
          context.response.data = res.data as Data;
          context.response.raw = res;
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  }
}
