// 页面切换功能
(function() {
    // 点击去注册功能
    $('#link_reg').click(function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击 去登录功能
    $('#link_login').click(function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })
    // 表单的验证规则
    let form = layui.form

    form.verify(
        {
            pwd: [
                /^[\S]{6,12}$/
                ,'密码必须6到12位，且不能出现空格'
              ] ,
            same: function(value,item){
                // 判断两次密码的值是够相等
                if(value !== $('#same').val()){
                    return '两次密码不一致'
                }
            }
        }
    )
    // 发起注册请求
    var layer = layui.layer
    $('#reg').on('submit',function(e) {
        //拿到表单注册的值
        let data = {}
        data.username = $('#reg-username').val()
        data.password = $('#same').val()
       
        // 阻止表单的默认提交行为
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: data,
            success: function(res) {
                if(res.status !== 0) return layer.msg(res.message)
                layer.msg('注册成功！请登录！')
                $('#link_login').click()
            }
        })
    })

    // 登录功能
    $('#form-login').submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault()
        let data = $(this).serialize()
       
       
        // 发起get请求
        $.post('/api/login',data,function(res) {
            console.log(res);
            if(res.status !==0 ) return layer.msg(res.message)
             // 把token值存在本地存储中
             localStorage.setItem('token',res.token)
            // 登录成功的代码
            layer.msg(res.message)
           
            setTimeout(function() {
                location.href = './index.html'
            },200)  
           
        })
    })
})();