import { defineCloudflareConfig } from '@opennextjs/cloudflare';

export default defineCloudflareConfig({
  // Cloudflare Pages 설정
  default: {
    override: {
      wrapper: 'cloudflare-node',
      converter: 'aws-apigw-v2',
      incrementalCache: {
        kind: 's3-lite',
        path: '.open-next/cache',
      },
    },
  },
});
