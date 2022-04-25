(function() {
    getUserMessage()
    // 实现退出功能
    let layer = layui.layer
    $('#quit').click(function() {
        layer.confirm('确定退出登录？', {icon: 3, title:'提示'}, function(index){
            //do something
            // 清空一下本地 储存中的token
            localStorage.removeItem('token')
            location.href = './login.html'
            layer.close(index);
          });
          //eg2
             
    }) 
    // 点击个人中心去除侧边栏选中状态
    $('.layui-nav-child').on('click','a',function(){
        $('.layui-nav-item').removeClass('layui-this')
    })
})();
    
// 发起用户基本信息的ajax请求
function getUserMessage() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            if(res.status !== 0) return layer.msg('获取用户信息失败！');
            render(res.data)
       
        },

    })
    
}
// 渲染用户的信息
function render(user) {
    // 用户名
    let username = user.nickname || user.username
    $('.welcome').html(`欢迎 ${username}`)
    // 用户头像
    if(user.user_pic){
        //用户上传了头像
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avatar').hide()
    }else {
        // 未上传头像
        $('.layui-nav-img').hide()
        let name = username[0].toUpperCase()
        $('.text-avatar').html(name).show()
    }
}
