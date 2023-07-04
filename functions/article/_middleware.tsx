import React from 'react'
import vercelOGPagesPlugin from '@cloudflare/pages-plugin-vercel-og'

const constants = {
  images: {
    OGP_BG_URL: 'https://march-am-site-astro.pages.dev/assets/images/OGP_bg.jpg'
  },
  colors: {
    deepGreen: '#4A4740'
  }
}

interface Props {
  ogTitle: string
}

export const onRequest = vercelOGPagesPlugin<Props>({
  component: ({ ogTitle }) => {
    const text = ogTitle.split(' | ')[0] ?? ''

    return (
      <div
        style={{
          backgroundImage: `url(${constants.images.OGP_BG_URL})`,
          backgroundRepeat: 'no-repeat',
          height: '100%',
          width: '100%',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          padding: '108px 76px 76px'
        }}
      >
        <div
          style={{
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px'
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 60,
              fontStyle: 'normal',
              // fontFamily: 'NotoSansJP',
              letterSpacing: '-0.025em',
              color: constants.colors.deepGreen,
              lineHeight: 1.4,
              // ３行以上で省略
              lineClamp: 3
            }}
          >
            {text}
          </div>
        </div>
      </div>
    )
  },
  extractors: {
    on: {
      'meta[property="og:title"]': (props) => ({
        element(element) {
          props.ogTitle = element.getAttribute('content') ?? ''
        }
      })
    }
  },
  imagePathSuffix: '/social-image.png',
  options: {
    width: 1200,
    height: 630
    // FIXME: bufferの渡し方わからん
    // fonts: [
    //   {
    //     name: 'NotoSansJP',
    //     data: fontNotoData,
    //     style: 'normal'
    //   }
    // ]
  },
  autoInject: {
    openGraph: true
  }
})
