$(function() {
    let layer = layui.layer
    let form = layui.form
    // 封装一个请求文章类别的ajax请求
    function getData() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if(res.status !==0 ) {
                    return layer.msg('获取文章分类列表失败！')
                }
                
                let htmlStr = template('cates',res)
                $('tbody').html(htmlStr)
            }
        })
    }
 getData() 
//  获取弹出层的index
let index = undefined
    // 点击添加按钮
    $('#add').click(function() {
        
      index = layer.open({
            title: '添加文章分类',
            type: 1,
            content: $('#cate_form').html(),
            area: ['500px','250px']
          });     
           // 点击确认添加后想服务器添加分类
          $('.layui-form').on('submit',function(e) {
            
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                data: $('.layui-form').serialize(),
                success:function(res) {
                    if(res.status !== 0 ) {
                        return layer.msg('添加失败！',); 
                    } 
                 
                    layer.msg('添加分类成功'); 
                    // 关闭提示框
                    // layer.close(index)
                    $('.layui-layer-close1').click()
                    getData() 
                }
            })
        })
    })
    let layerIndex = undefined
//    点击修改按钮的功能
    $('tbody').on('click','#change',function() {
       layerIndex = layer.open({
            title: '添加文章分类',
            type: 1,
            content: $('#cate-change').html(),
            area: ['500px','250px']
          }); 
        let art_id = this.dataset.id
        
        //  根据id请求文章类别数据
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + art_id,
            
            success: function(res) {
                if (res.status !== 0){
                    return console.log('获取当前id信息失败！') 
                }
                
                form.val('form_cateChange',res.data)
            }
        })
    })
    // 点击确定修改文章分类
    $('body').on('submit','#form_cateChange',function(e) {
        e.preventDefault()
        // 发起 ajax请求修改数据
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: form.val('form_cateChange'),
            success: function(res){
                if(res.status !== 0) return layer.msg('更新失败！')
                layer.close(layerIndex)
                layer.msg('更改文章分类信息成功！')
                getData() 
            }
            
        })
    })
    // 利用事件委托完成删除功能
    $('tbody').on('click','#delete',function() {
        // 拿到当前数据的id
        let id = $(this).attr('data-Id')
        layer.confirm('确认删除吗?', {icon: 3, title:'提示'}, function(index){
                // 发起删除的ajax请求
                $.ajax({
                    method: 'GET',
                    url: '/my/article/deletecate/' + id,
                    success: function(res) {
                        if(res.status !==0 ) return layer.msg(res.message)
                        layer.msg(res.message)
                        // 重新渲染数据
                        getData() 

                    }
                })
                
            layer.close(index);
          });
    })
})