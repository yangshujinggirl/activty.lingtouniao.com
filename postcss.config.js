module.exports = {
    plugins:{
      'postcss-pxtorem':{
        rootValue:16,
        propList:[
          '*'
          // 'font-size',
          // 'border',
          // 'border-width',
          // 'height',
          // 'min-height',
          // 'max-height',
          // 'line-height',
          // 'width',
          // 'max-width',
          // 'min-width'
        ]
      },
      'postcss-cssnext':{
        browsers:"> 1%,ie >=8",
        features:{
          // 兼容处理，将rem 复制一份 px 出来
          rem:{
            rootValue:'16px',
          }
        }
      }
    }
}
