let form = layui.form
// 设置表单验证规则
form.verify({
    pass: [
        /^[\S]{6,12}$/
        ,'密码必须6到12位，且不能出现空格'
      ] ,
    same: function(value) {
        if(value !== $('[name=newPwd]').val()){
            return '两次新密码不一致'
        }
    }
})
// 重置密码
$('.layui-form').on('submit',function(e) {
    e.preventDefault()
    // 发起ajax请求
    $.ajax({
        method: 'POST',
        url: '/my/updatepwd',
        data:  $(this).serialize(),
        success: function(res) {
            if(res.status !== 0) {
                $('.layui-input').val('')
                return layer.msg(`${res.message}`)
            }
            layer.msg(`${res.message}`)
        }
    })
})
