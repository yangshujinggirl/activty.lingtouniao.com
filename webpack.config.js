const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const Entry = require('./entryConfig');

const htmlArray = []
for(let key in Entry.entry ){
  if(key !=='lib' && key !== 'plugin'){
    htmlArray.push(new HtmlWebpackPlugin({
      template:path.resolve(__dirname,`./src/${key}.html`),
      filename:process.env.NODE_ENV==='development'?`${key}.html`:`html/${key}.html`,
      chunks:['lib','commons',key],
      hash:true,
      showErrors:process.env.NODE_ENV==='development',
      cache:process.env.NODE_ENV==='production',
    }))
  }
}
if(process.env.NODE_ENV === 'production'){
  htmlArray.push(new UglifyJSPlugin({}))
}
const WebpcakUtil = require('./webpack.util');
const SCSSExtractTextPlugin = new ExtractTextPlugin({
  filename:'stylesheets/[name].css'
})
const options = {
  presets: ['env','stage-2']
}
module.exports = {
  devtool: "source-map", // enum
  devServer:{
    host:'127.0.0.1',
    // host:'192.168.1.104',
    proxy:{
      '/api': {
        target: 'http://jsonplaceholder.typicode.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  entry:Entry.entry,
  output:{
    path:path.resolve(__dirname,'./dist'),
    filename:'[name].js',
    publicPath:getPublicPath(process),
    chunkFilename:'[name].js',
    sourceMapFilename: "sourcemaps/[file].map"
  },
  module:{
    rules:[
      // js resolve 使用es6特性 babel
      {
       test: /\.js$/,
       exclude: /(node_modules|bower_components)/,
       use: {
         loader: 'babel-loader',
         options: {
           presets: options
          }
        }
      },
      {
        test: require.resolve('zepto'),
        loader: 'exports-loader?window.$!script-loader'
      },
      // style resolve
      {
        test:/\.s|css$/,
        use:SCSSExtractTextPlugin.extract({
          // fallback: "style-loader",
          use:[
            {
              loader:'css-loader',
              options:{
                minimize:process.env.NODE_ENV !=='development'
              }
            },
            {
              loader:'postcss-loader',
              options:{
              }
            },{
              loader:'sass-loader',
              options:{

              }
            }
          ]
        })
      },
      // html 模版解析
      {
        test:/\.html$/,
        use:[
          {
            loader:'html-loader',
            options:{
              exportAsEs6Default:true
            }
          }
        ]
      },
      // nunjucks resolve
      {
        test: /\.(njk|nunjucks)$/,
        use:[
          {
            loader:'nunjucks-loader'
          }
        ]
      },
      // 图片处理
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: 'images/[name]-[hash:5].[ext]',
              publicPath:getPublicPath(process)
            }
          }
        ]
      }
    ]
  },
  plugins:[
    new CleanWebpackPlugin(['./dist']),
    new webpack.BannerPlugin({
			banner: WebpcakUtil.getBanner(process)
		}),
    new webpack.ProvidePlugin({
      '$':'zepto'
    }),
    SCSSExtractTextPlugin,
    // 抽取公用代码
    new webpack.optimize.CommonsChunkPlugin({
      names: ["commons","lib"],
      filename: "[name].js",
      minChunks: 2
    })
  ].concat(htmlArray)
}


// 工具函数
/**
 * [getPublicPath 获取当前环境，构建不同的输出环境]
 * @param  {[ object ]} process [当前进程]
 * @return {[ string ]}         [ PublicPath ]
 */
function getPublicPath(process){
  switch (process.env.NODE_ENV) {
    case 'development':
      return '/';
      break;
    case 'test':
      return 'test/';
      break;
    case 'test':
      return 'http://www.lingtouniao.com/';
      break;
    default:
      return '/';
  }
}
