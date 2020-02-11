# bestbigkk-sso

> bestbigkk-sso

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## Describe
KSSO前端实现。

## TodoList
- 管理员面板，修改用户/新增用户信息时，需要提供短信验证码验证。未实现
- 前端 404/500 页面未配置。
- 管理员面板，点击不同菜单时候，需要在当前激活菜单下，显示标识。
- 监控功能，监控所有在SSO登录用户的用户，展示签发时间，过期时间，用户信息，并为管理员提供强制下线功能。
- 假如一个用户从第三方aaa.com/aaa/bbb/cc访问，需要验证身份，正常跳转到KSSO，在验证成功之后，KSSO将只会跳转到主域名aaa.com下。
