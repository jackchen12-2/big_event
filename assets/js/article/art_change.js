$(function () {
    // 获取layer对象
    let layer = layui.layer
    let form = layui.form
    // 渲染文章类别
    function renderCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return console.log('获取文章类别失败！')
                let htmlstr = template('cates', res)
               
                $('[name=cate_id]').html(htmlstr)
                // 重新渲染form表单
                form.render()
            }
        })
    }
    renderCate()
    // 初始化富文本编辑器
    initEditor()
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 点击选择封面功能
    $('#chooseimage').click(function () {
        $('#files').click()

    })
    $('#files').on('change', function () {
        let files = this.files
        if (files.length <= 0) {
            return layer.msg('请选择一张图片！')
        }

        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    // 设置文章发布状态
    let state = '已发布'
    $('#draft').click(function () {
        state = '草稿'
    })
    $('#artile_pub').click(function () {
        state = '已发布'
    })
    // 收集formdata数据
    $('#form_change').on('submit', function (e) {
        e.preventDefault()
        let i = localStorage.getItem('id')
        let fd = new FormData($(this)[0])
        fd.append('state', state)
        fd.append('Id',i)
      
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img',blob)
                artitlePub(fd)
            })
                
    })
    // 发布文章
    function artitlePub(data) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: data,
            contentType: false,
            processData: false,
            success: function(res) {
            
                if(res.status !== 0){
                    return  layer.msg('更新文章失败！')
                }
                layer.msg('更新文章成功！')
               setTimeout(function() {
                location.href = './art_list.html'
               },500)
                // location.herf = './art_list.html'
            }
            
        })   
    }
    renderContent()
    // 获取当前文章的信息
    function renderContent() {
        let i = localStorage.getItem('id')
        $.ajax({
            method: 'GET',
            url: '/my/article/' + i,
            success: function(res) {
                if(res.status !== 0 ){
                    return layer.msg('获取文章内容失败！')
                }
                form.val('art-content',res.data)
                getCatenName(res.data.cate_id)
            }
        })
    }
    // 渲染分类名称
    function getCatenName(id) {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取文章分类名称失败！')
                }
                $('[name=cate_id]').val(res.data.name)
            }
        })
    }
    // 发起修改文章信息的ajax请求
   
})