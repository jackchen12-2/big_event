let form = layui.form

// 昵称的正则
form.verify({
    nickname: function(value) {
        if(value.length > 6) {
            return '用户昵称在1-6位'
        }
    }
})

// 获取用户的基本信息
function getUserMessage() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            if(res.status !== 0) return layer.msg('获取用户信息失败！');
            form.val('formUserInfo',res.data)
            
        },

    })
}
getUserMessage()


// 重置功能
$('.layui-btn-primary').click(function(e) {
    e.preventDefault()
     getUserMessage()
})
// 提交用户更改信息的请求
$('.layui-form').on('submit',function(e) {
    // 阻止默认行为
    e.preventDefault()
    // data1.id = localStorage.getItem('id')
//   let data1 = form.val('formTest')
 
    // 提交
    $.ajax({
        type:'POST',
        url: '/my/userinfo',
        data: $(this).serialize(),
        success: function(res) {
            if (res.status !== 0) {
              return layer.msg('更新用户信息失败！')
            }
            layer.msg('更新用户信息成功！')
            // 调用父页面中的方法，重新渲染用户的头像和用户的信息
            window.parent.getUserMessage()
          }
    })
})
