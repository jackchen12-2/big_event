$.ajaxPrefilter(function(option) {
    option.url = 'http://api-breakingnews-web.itheima.net' + option.url
    // 设置有权限的请求头
    if(option.url.indexOf('/my/') !== -1) {
        option.headers =  {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 每一次都发起这个请求
    option.complete =  function(res) {
          
        if(res.responseJSON.status === 1 && res.responseJSON.message === 
            '身份认证失败！') {
                // 清空token
                localStorage.removeItem('token')
                location.href = './login.html'
            }
    }
})