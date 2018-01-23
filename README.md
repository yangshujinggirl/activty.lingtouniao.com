## 活动脚手架

改框架适合移动端和pc端活动开发，针对活动页面少，开发效率高，复用性不强等特性进行脚手架构建


#### 使用步骤

1. 从对应等tag获取对应等分支
2. 切换到对应等分支，安装依赖
   ` yarn install `
3. 在 `src`目录下面创建对应的 js,html,scss 文件，例如：hello.js hello.html hello.scss;
4. 在 `entryConfig.js` 文件中配置你的入口文件,如下：

     ```bash
      module.exports = {
        entyr:{
          lib:['zepto'], //
          hello:'xxx/xx/hello.js' // 这个地方配置自己对应的页面，多个页面依次向下
        }
      }
   ```
5. 本地开发启动 `yarn dev`
6. 访问后端接口，由于跨域的限制所以本地需要配置转发，这样主要通过 `webpack-dev-server` 这个插件实现,demo ：

    ```bash
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
      }
    ```
    
[![asciicast](https://asciinema.org/a/qEuqKZ1kYgiOMDuxbBG3QIGUy.png)](https://asciinema.org/a/qEuqKZ1kYgiOMDuxbBG3QIGUy)
